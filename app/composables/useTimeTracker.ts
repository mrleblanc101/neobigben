import type { Database } from "~/types/database.types";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type EntryRow = Database["public"]["Tables"]["entries"]["Row"];

/** An entry as loaded, pointing at its project by id so renames don't touch entries */
interface StoredEntry extends Omit<Entry, "project"> {
    projectId: string;
}

export interface EntryEditor {
    id: string | "new";
    form: EntryDraft;
}

// Weeks being fetched, so concurrent callers share one request
const pendingWeeks = new Map<string, Promise<void>>();

const toProject = (row: ProjectRow): Project => ({
    id: row.id,
    name: row.name,
    color: row.color,
    fav: row.favorite,
    created: Date.parse(row.created_at),
});

// Postgres returns times as "HH:MM:SS"
const toStoredEntry = (row: EntryRow): StoredEntry => ({
    id: row.id,
    projectId: row.project_id,
    start: row.start_time.slice(0, 5),
    end: row.end_time.slice(0, 5),
    note: row.note,
    url: row.url,
    copiedToNetsuite: row.copied_to_netsuite,
});

function totalsByProject(entries: Entry[]) {
    const totals: Record<string, number> = {};
    for (const entry of entries) {
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
    const dayTotals = computed(() => totalsByProject(entries.value));
    const weekTotals = computed(() => totalsByProject(weekDates.value.flatMap(entriesOn)));

    /** Loads projects, settings and the selected week, once per session */
    async function init() {
        if (ready.value) return;
        const [projectsResult, settingsResult] = await Promise.all([
            supabase.from("projects").select("*").order("created_at"),
            supabase.from("user_settings").select("weekly_goal_hours").maybeSingle(),
        ]);
        if (projectsResult.error) return fail("Impossible de charger les projets", projectsResult.error);
        if (settingsResult.error) return fail("Impossible de charger les préférences", settingsResult.error);
        projects.value = projectsResult.data.map(toProject);
        if (settingsResult.data) weeklyGoalHours.value = settingsResult.data.weekly_goal_hours;
        ready.value = true;
        await loadWeek(date.value);
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
        const color = PROJECT_PALETTE[projects.value.length % PROJECT_PALETTE.length]!;
        const { data, error: cause } = await supabase.from("projects").insert({ name, color }).select().single();
        if (cause) return fail("Impossible de créer le projet", cause);
        projects.value.push(toProject(data));
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

    async function toggleFavorite(name: string) {
        const project = projects.value.find(p => p.name === name);
        if (!project) return;
        const { error: cause } = await supabase.from("projects").update({ favorite: !project.fav }).eq("id", project.id);
        if (cause) return void fail("Impossible de modifier les favoris", cause);
        project.fav = !project.fav;
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
        projects.value = projects.value.filter(p => p.id !== project.id);
        for (const [day, list] of Object.entries(byDate.value)) {
            if (list.some(e => e.projectId === project.id)) byDate.value[day] = list.filter(e => e.projectId !== project.id);
        }
    }

    async function setWeeklyGoal(hours: number) {
        if (!user.value) return;
        const { error: cause } = await supabase.from("user_settings").upsert({ user_id: user.value.sub, weekly_goal_hours: hours });
        if (cause) return void fail("Impossible d’enregistrer l’objectif", cause);
        weeklyGoalHours.value = hours;
    }

    function entryColumns(draft: EntryDraft) {
        return { start_time: draft.start, end_time: draft.end, note: draft.note, url: draft.url };
    }

    /** Adds an entry to the selected day */
    async function addEntry(draft: EntryDraft) {
        const project = findProject(draft.project);
        if (!project) return false;
        const day = dateKey(date.value);
        const { data, error: cause } = await supabase
            .from("entries")
            .insert({ ...entryColumns(draft), project_id: project.id, day })
            .select()
            .single();
        if (cause) return fail("Impossible d’ajouter l’entrée", cause);
        byDate.value[day] = [...(byDate.value[day] ?? []), toStoredEntry(data)];
        return true;
    }

    async function updateEntry(id: string, draft: EntryDraft) {
        const project = findProject(draft.project);
        if (!project) return false;
        const { data, error: cause } = await supabase
            .from("entries")
            .update({ ...entryColumns(draft), project_id: project.id })
            .eq("id", id)
            .select()
            .single();
        if (cause) return fail("Impossible de modifier l’entrée", cause);
        byDate.value[data.day] = (byDate.value[data.day] ?? []).map(e => (e.id === id ? toStoredEntry(data) : e));
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
        for (const [day, list] of Object.entries(byDate.value)) {
            if (list.some(e => e.id === id)) byDate.value[day] = list.filter(e => e.id !== id);
        }
    }

    function openEditor(entry?: Entry | Partial<EntryDraft>) {
        // A new entry picks up where the day's last entry ends, or at 09:30 on an empty day.
        // The rest starts blank, apart from what the caller knows (a gap's range, a project row's project).
        const lastEnd = entries.value.reduce<string | null>((latest, e) => (!latest || toMinutes(e.end) > toMinutes(latest) ? e.end : latest), null);
        const defaults: EntryDraft = { project: "", start: lastEnd ?? "09:30", end: "", note: "", url: "" };
        editor.value = entry && "id" in entry
            ? { id: entry.id, form: { project: entry.project, start: entry.start, end: entry.end, note: entry.note, url: entry.url } }
            : { id: "new", form: { ...defaults, ...entry } };
    }

    async function saveEditor(form: EntryDraft) {
        const current = editor.value;
        if (!current) return;
        const saved = current.id === "new" ? await addEntry(form) : await updateEntry(current.id, form);
        if (saved) editor.value = null;
    }

    /** Forgets everything loaded for the signed-in user */
    function reset() {
        pendingWeeks.clear();
        date.value = startOfDay(new Date());
        byDate.value = {};
        loadedWeeks.value = [];
        projects.value = [];
        weeklyGoalHours.value = 40;
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
        weekGoal,
        dayGoal,
        weekDates,
        weekLoaded,
        dayTotals,
        weekTotals,
        editor,
        error,
        minutesOn,
        colorOf,
        init,
        loadWeek,
        reset,
        addEntry,
        removeEntry,
        setCopiedToNetsuite,
        addProject,
        renameProject,
        toggleFavorite,
        countProjectEntries,
        deleteProject,
        setWeeklyGoal,
        goTo: (day: Date) => (date.value = startOfDay(day)),
        goToday: () => (date.value = startOfDay(new Date())),
        shiftDay: (days: number) => (date.value = addDays(date.value, days)),
        openEditor,
        closeEditor: () => (editor.value = null),
        saveEditor,
    };
}
