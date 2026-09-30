import { useLocalStorage } from "@vueuse/core";
import type { Database } from "~/types/database.types";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type EntryRow = Database["public"]["Tables"]["entries"]["Row"];
type SettingsRow = Database["public"]["Tables"]["user_settings"]["Row"];

/** Whether the summary leaves out entries copied to NetSuite; a display preference kept in this browser */
const excludeCopied = useLocalStorage("tracker:exclude-copied", true);

/** An entry as loaded, pointing at its project by id so renames don't touch entries */
interface StoredEntry extends Omit<Entry, "project"> {
    projectId: string;
}

export interface EntryEditor {
    id: string | "new";
    form: EntryDraft;
    /** Day of the entry being edited, as YYYY-MM-DD; new entries go to the selected day */
    day?: string;
}

// Weeks being fetched, so concurrent callers share one request
const pendingWeeks = new Map<string, Promise<void>>();
// Changes made elsewhere (another tab or device), pushed by Supabase Realtime while signed in
let changes: ReturnType<ReturnType<typeof useSupabaseClient>["channel"]> | null = null;

const toProject = (row: ProjectRow): Project => ({
    id: row.id,
    name: row.name,
    color: row.color,
    fav: row.favorite,
    created: Date.parse(row.created_at),
    position: row.position,
});

// Postgres returns times as "HH:MM:SS"
const toStoredEntry = (row: EntryRow): StoredEntry => ({
    id: row.id,
    projectId: row.project_id,
    start: row.start_time.slice(0, 5),
    end: row.end_time.slice(0, 5),
    note: row.note,
    copiedToNetsuite: row.copied_to_netsuite,
});

// With `excludeCopied`, entries already copied to NetSuite are left out: the totals show what remains to copy
function totalsByProject(entries: Entry[], excludeCopied: boolean) {
    const totals: Record<string, number> = {};
    for (const entry of entries) {
        if (excludeCopied && entry.copiedToNetsuite) continue;
        totals[entry.project] = (totals[entry.project] ?? 0) + entryMinutes(entry);
    }
    return totals;
}

export function useTimeTracker() {
    const supabase = useSupabaseClient<Database>();
    const user = useSupabaseUser();

    const date = useState("tracker:date", () => startOfDay(new Date()));
    const byDate = useState<Record<string, StoredEntry[]>>("tracker:entries", () => ({}));
    const loadedWeeks = useState<string[]>("tracker:loaded-weeks", () => []);
    const projects = useState<Project[]>("tracker:projects", () => []);
    const weeklyGoalHours = useState("tracker:goal", () => 40);
    /** Default start of a new entry on a day with no entries yet, as HH:MM */
    const dayStart = useState("tracker:day-start", () => "09:30");
    const ready = useState("tracker:ready", () => false);
    const editor = useState<EntryEditor | null>("tracker:editor", () => null);
    const error = useState<string | null>("tracker:error", () => null);

    function fail(message: string, cause: { message: string }) {
        console.error(message, cause);
        error.value = `${message} : ${cause.message}`;
        return false;
    }

    const findProject = (name: string) => projects.value.find(p => p.name.toLowerCase() === name.toLowerCase());
    const colorOf = (name: string) => projects.value.find(p => p.name === name)?.color ?? "#71717a";

    const entriesOn = (day: Date): Entry[] =>
        (byDate.value[dateKey(day)] ?? [])
            .map(({ projectId, ...entry }) => ({ ...entry, project: projects.value.find(p => p.id === projectId)?.name ?? "" }))
            .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
    const minutesOn = (day: Date) => entriesOn(day).reduce((sum, entry) => sum + entryMinutes(entry), 0);

    const entries = computed(() => entriesOn(date.value));
    const isToday = computed(() => dateKey(date.value) === dateKey(new Date()));
    const weekDates = computed(() => {
        const sunday = startOfWeek(date.value);
        return Array.from({ length: 7 }, (_, i) => addDays(sunday, i));
    });
    const weekLoaded = computed(() => loadedWeeks.value.includes(dateKey(startOfWeek(date.value))));
    const weekGoal = computed(() => weeklyGoalHours.value * 60);
    // A workday is a fifth of the weekly goal
    const dayGoal = computed(() => weekGoal.value / 5);
    const dayTotals = computed(() => totalsByProject(entries.value, excludeCopied.value));
    const weekTotals = computed(() => totalsByProject(weekDates.value.flatMap(entriesOn), excludeCopied.value));

    /** Loads projects, settings and the selected week, once per session */
    async function init() {
        if (ready.value) return;
        const [projectsResult, settingsResult] = await Promise.all([
            supabase.from("projects").select("*").order("position").order("created_at", { ascending: false }),
            supabase.from("user_settings").select("weekly_goal_hours, day_start").maybeSingle(),
        ]);
        if (projectsResult.error) return fail("Impossible de charger les projets", projectsResult.error);
        if (settingsResult.error) return fail("Impossible de charger les préférences", settingsResult.error);
        projects.value = projectsResult.data.map(toProject);
        if (settingsResult.data) {
            weeklyGoalHours.value = settingsResult.data.weekly_goal_hours;
            // Postgres returns times as "HH:MM:SS"
            dayStart.value = settingsResult.data.day_start.slice(0, 5);
        }
        ready.value = true;
        subscribe();
        await loadWeek(date.value);
    }

    /**
     * Applies the changes made to the user's data from elsewhere as they happen. Row level security limits them to
     * the user's own rows. This tab's own changes come back too: applying them is harmless, rows are matched by id.
     */
    function subscribe() {
        if (changes) return;
        changes = supabase
            .channel("tracker")
            // A deleted row only carries its id (the default replica identity)
            .on<ProjectRow>("postgres_changes", { event: "*", schema: "public", table: "projects" }, (payload) => {
                if (payload.eventType === "DELETE") dropProject(payload.old.id!);
                else storeProject(payload.new);
            })
            .on<EntryRow>("postgres_changes", { event: "*", schema: "public", table: "entries" }, (payload) => {
                if (payload.eventType === "DELETE") dropEntry(payload.old.id!);
                else storeEntries([payload.new]);
            })
            .on<SettingsRow>("postgres_changes", { event: "*", schema: "public", table: "user_settings" }, (payload) => {
                if (payload.eventType === "DELETE") return;
                weeklyGoalHours.value = payload.new.weekly_goal_hours;
                dayStart.value = payload.new.day_start.slice(0, 5);
            })
            .subscribe();
    }

    /** Removes a project and its entries from what's loaded */
    function dropProject(id: string) {
        projects.value = projects.value.filter(p => p.id !== id);
        for (const [day, list] of Object.entries(byDate.value)) {
            if (list.some(e => e.projectId === id)) byDate.value[day] = list.filter(e => e.projectId !== id);
        }
    }

    /** Adds a project, or replaces it if it's already there, keeping the list in its stored order */
    function storeProject(row: ProjectRow) {
        const others = projects.value.filter(p => p.id !== row.id);
        projects.value = [...others, toProject(row)].sort((a, b) => a.position - b.position || b.created - a.created);
    }

    async function fetchWeek(sunday: Date) {
        const days = Array.from({ length: 7 }, (_, i) => dateKey(addDays(sunday, i)));
        const { data, error: cause } = await supabase.from("entries").select("*").gte("day", days[0]!).lte("day", days[6]!);
        if (cause) return void fail("Impossible de charger les entrées", cause);
        const week: Record<string, StoredEntry[]> = Object.fromEntries(days.map(day => [day, []]));
        for (const row of data) week[row.day]?.push(toStoredEntry(row));
        Object.assign(byDate.value, week);
        loadedWeeks.value.push(days[0]!);
    }

    /**
     * The days from `first` to `last` (YYYY-MM-DD) that have entries, for the calendar. Days of loaded weeks are read
     * from what's loaded, which is up to date; the others come from the database.
     */
    async function daysWithEntries(first: string, last: string) {
        const { data, error: cause } = await supabase.from("entries").select("day").gte("day", first).lte("day", last);
        const days = new Set(cause ? [] : data.map(row => row.day));
        for (const [day, list] of Object.entries(byDate.value)) {
            if (day < first || day > last) continue;
            if (list.length) days.add(day);
            else days.delete(day);
        }
        return days;
    }

    /** Fetches the entries of the day's week, unless they're already loaded */
    function loadWeek(day: Date) {
        const sunday = startOfWeek(day);
        const key = dateKey(sunday);
        if (loadedWeeks.value.includes(key)) return Promise.resolve();
        if (!pendingWeeks.has(key)) pendingWeeks.set(key, fetchWeek(sunday).finally(() => pendingWeeks.delete(key)));
        return pendingWeeks.get(key)!;
    }

    async function addProject(name: string) {
        if (!name || findProject(name)) return false;
        // The first palette color no project uses yet, else the least used one
        const uses = (color: string) => projects.value.filter(p => p.color === color).length;
        const color = PROJECT_PALETTE.reduce((best, color) => (uses(color) < uses(best) ? color : best));
        // New projects go to the top of the list
        const position = Math.min(0, ...projects.value.map(p => p.position)) - 1;
        const { data, error: cause } = await supabase.from("projects").insert({ name, color, position }).select().single();
        if (cause) return fail("Impossible de créer le projet", cause);
        storeProject(data);
        return true;
    }

    async function renameProject(from: string, to: string) {
        const project = projects.value.find(p => p.name === from);
        const clash = findProject(to);
        if (!project || !to || to === from || (clash && clash !== project)) return false;
        const { error: cause } = await supabase.from("projects").update({ name: to }).eq("id", project.id);
        if (cause) return fail("Impossible de renommer le projet", cause);
        project.name = to;
        return true;
    }

    async function setProjectColor(name: string, color: string) {
        const project = projects.value.find(p => p.name === name);
        if (!project || project.color === color) return;
        const { error: cause } = await supabase.from("projects").update({ color }).eq("id", project.id);
        if (cause) return void fail("Impossible de changer la couleur du projet", cause);
        project.color = color;
    }

    async function toggleFavorite(name: string) {
        const project = projects.value.find(p => p.name === name);
        if (!project) return;
        const { error: cause } = await supabase.from("projects").update({ favorite: !project.fav }).eq("id", project.id);
        if (cause) return void fail("Impossible de modifier les favoris", cause);
        project.fav = !project.fav;
    }

    /**
     * Puts the given projects in the given order, e.g. the favorites after one was dragged.
     * They keep the places they already hold in the list, the other projects don't move.
     */
    async function reorderProjects(ids: string[]) {
        const sorted = [...projects.value].sort((a, b) => a.position - b.position);
        const moved = ids.map(id => sorted.find(p => p.id === id)!);
        const reordered = sorted.map(p => (ids.includes(p.id) ? moved.shift()! : p));
        const changed = reordered.filter((p, index) => p.position !== index);
        if (!changed.length) return;
        const previous = new Map(projects.value.map(p => [p.id, p.position]));
        reordered.forEach((p, index) => (p.position = index));
        projects.value = reordered;
        const results = await Promise.all(changed.map(p => supabase.from("projects").update({ position: p.position }).eq("id", p.id)));
        const failed = results.find(result => result.error);
        if (!failed?.error) return;
        for (const p of projects.value) p.position = previous.get(p.id)!;
        projects.value = [...projects.value].sort((a, b) => a.position - b.position);
        fail("Impossible de réordonner les projets", failed.error);
    }

    /** Number of entries logged on a project across all weeks, or null if it can't be counted */
    async function countProjectEntries(name: string) {
        const project = projects.value.find(p => p.name === name);
        if (!project) return null;
        const { count, error: cause } = await supabase.from("entries").select("id", { count: "exact", head: true }).eq("project_id", project.id);
        return cause ? null : count;
    }

    /** Deletes a project; the database deletes its entries along with it */
    async function deleteProject(name: string) {
        const project = projects.value.find(p => p.name === name);
        if (!project) return;
        const { error: cause } = await supabase.from("projects").delete().eq("id", project.id);
        if (cause) return void fail("Impossible de supprimer le projet", cause);
        dropProject(project.id);
    }

    async function saveSettings(settings: { weeklyGoalHours: number; dayStart: string }) {
        if (!user.value) return false;
        const { error: cause } = await supabase
            .from("user_settings")
            .upsert({ user_id: user.value.sub, weekly_goal_hours: settings.weeklyGoalHours, day_start: settings.dayStart });
        if (cause) return fail("Impossible d’enregistrer les paramètres", cause);
        weeklyGoalHours.value = settings.weeklyGoalHours;
        dayStart.value = settings.dayStart;
        return true;
    }

    function entryColumns(draft: EntryDraft) {
        return { start_time: draft.start, end_time: draft.end, note: draft.note };
    }

    /** Takes an entry out of whichever day holds it */
    function dropEntry(id: string) {
        for (const [day, list] of Object.entries(byDate.value)) {
            if (list.some(e => e.id === id)) byDate.value[day] = list.filter(e => e.id !== id);
        }
    }

    /**
     * Files entries under their day, replacing them if they're already there, e.g. one moved to another day.
     * Entries of weeks not loaded yet are left for the week's fetch.
     */
    function storeEntries(rows: EntryRow[]) {
        for (const row of rows) {
            dropEntry(row.id);
            if (byDate.value[row.day]) byDate.value[row.day] = [...byDate.value[row.day]!, toStoredEntry(row)];
        }
    }

    /** Adds an entry to the selected day; one ending past midnight is saved as two entries, one per day */
    async function addEntry(draft: EntryDraft) {
        const project = findProject(draft.project);
        if (!project) return false;
        const { sameDay, nextDay } = splitAtMidnight(draft.start, draft.end);
        const rows = [{ ...entryColumns({ ...draft, ...sameDay }), project_id: project.id, day: dateKey(date.value) }];
        if (nextDay) rows.push({ ...entryColumns({ ...draft, ...nextDay }), project_id: project.id, day: dateKey(addDays(date.value, 1)) });
        const { data, error: cause } = await supabase.from("entries").insert(rows).select();
        if (cause) return fail("Impossible d’ajouter l’entrée", cause);
        storeEntries(data);
        return true;
    }

    /** Updates an entry, moving it to `day` when given; an end past midnight adds the part after it on the next day */
    async function updateEntry(id: string, draft: EntryDraft, day?: string) {
        const project = findProject(draft.project);
        if (!project) return false;
        const { sameDay, nextDay } = splitAtMidnight(draft.start, draft.end);
        const { data, error: cause } = await supabase
            .from("entries")
            .update({ ...entryColumns({ ...draft, ...sameDay }), project_id: project.id, ...(day && { day }) })
            .eq("id", id)
            .select()
            .single();
        if (cause) return fail("Impossible de modifier l’entrée", cause);
        storeEntries([data]);
        if (!nextDay) return true;

        const followingDay = dateKey(addDays(parseDateKey(data.day), 1));
        const { data: added, error: addCause } = await supabase
            .from("entries")
            .insert({ ...entryColumns({ ...draft, ...nextDay }), project_id: project.id, day: followingDay })
            .select();
        if (addCause) return fail("L’entrée a été modifiée, mais pas sa partie après minuit", addCause);
        storeEntries(added);
        return true;
    }

    async function setCopiedToNetsuite(id: string, copied: boolean) {
        const { error: cause } = await supabase.from("entries").update({ copied_to_netsuite: copied }).eq("id", id);
        if (cause) return void fail("Impossible de modifier l’entrée", cause);
        for (const list of Object.values(byDate.value)) {
            const entry = list.find(e => e.id === id);
            if (entry) entry.copiedToNetsuite = copied;
        }
    }

    async function removeEntry(id: string) {
        const { error: cause } = await supabase.from("entries").delete().eq("id", id);
        if (cause) return void fail("Impossible de supprimer l’entrée", cause);
        dropEntry(id);
    }

    function openEditor(entry?: Entry | Partial<EntryDraft>) {
        // A new entry picks up where the day's last entry ends, or at the day start from the settings on an empty day.
        // The rest starts blank, apart from what the caller knows (a gap's range, a project row's project).
        const lastEnd = entries.value.reduce<string | null>((latest, e) => (!latest || toMinutes(e.end) > toMinutes(latest) ? e.end : latest), null);
        // After an entry ending at midnight (24:00) there's nothing left of the day to start from
        const defaults: EntryDraft = { project: "", start: lastEnd === "24:00" ? "" : lastEnd ?? dayStart.value, end: "", note: "" };
        editor.value = entry && "id" in entry
            ? { id: entry.id, form: { project: entry.project, start: entry.start, end: entry.end, note: entry.note }, day: dateKey(date.value) }
            : { id: "new", form: { ...defaults, ...entry } };
    }

    /** Saves the entry being edited; `day` (YYYY-MM-DD) moves an existing entry to another day */
    async function saveEditor(form: EntryDraft, day?: string) {
        const current = editor.value;
        if (!current) return;
        const saved = current.id === "new" ? await addEntry(form) : await updateEntry(current.id, form, day);
        if (saved) editor.value = null;
    }

    /** Forgets everything loaded for the signed-in user */
    function reset() {
        if (changes) void supabase.removeChannel(changes);
        changes = null;
        pendingWeeks.clear();
        date.value = startOfDay(new Date());
        byDate.value = {};
        loadedWeeks.value = [];
        projects.value = [];
        weeklyGoalHours.value = 40;
        dayStart.value = "09:30";
        ready.value = false;
        editor.value = null;
        error.value = null;
    }

    return {
        date,
        isToday,
        entries,
        projects,
        weeklyGoalHours,
        dayStart,
        ready,
        weekGoal,
        dayGoal,
        weekDates,
        weekLoaded,
        dayTotals,
        weekTotals,
        excludeCopied,
        editor,
        error,
        minutesOn,
        colorOf,
        init,
        loadWeek,
        daysWithEntries,
        reset,
        addEntry,
        removeEntry,
        setCopiedToNetsuite,
        addProject,
        renameProject,
        setProjectColor,
        toggleFavorite,
        reorderProjects,
        countProjectEntries,
        deleteProject,
        saveSettings,
        goTo: (day: Date) => (date.value = startOfDay(day)),
        goToday: () => (date.value = startOfDay(new Date())),
        shiftDay: (days: number) => (date.value = addDays(date.value, days)),
        openEditor,
        closeEditor: () => (editor.value = null),
        saveEditor,
    };
}
