// Demo data from the design. Everything lives in memory until entries are stored in Supabase.
const SEED_PROJECTS = ["CDL", "Lobbyisme Québec", "Naval Québec", "Interne", "Standup", "Pause-Café", "Libeo.com", "documentation.lbo.qa", "EEQ", "Coop Zone", "RTC", "Boukili", "Matelas Dauphin", "SAAQ", "status.libeo.com", "VPMO", "Férié"];
const SEED_FAVORITES = ["CDL", "Lobbyisme Québec"];
const JIRA = "https://libeocom.atlassian.net/";

type SeedRow = [project: string, start: string, end: string, note?: string, url?: string];

const SEED_TODAY: SeedRow[] = [
    ["Standup", "09:30", "09:45"],
    ["Naval Québec", "09:45", "10:10", "Rencontre", `${JIRA}browse/NAVAL-2`],
    ["Lobbyisme Québec", "10:10", "11:10", "", `${JIRA}jira/for-you?tab=assigned`],
    ["Lobbyisme Québec", "11:10", "12:30", "", `${JIRA}browse/LOBBY1-354`],
    ["Lobbyisme Québec", "13:00", "13:30", "Corrections", `${JIRA}browse/LOBBY1-354`],
    ["CDL", "13:30", "17:30", "", `${JIRA}browse/CDL-88`],
    ["CDL", "17:30", "18:30", "Revue PR"],
];

const SEED_PAST_DAYS: SeedRow[][] = [
    [["Standup", "09:30", "09:45"], ["CDL", "09:45", "12:00"], ["Naval Québec", "13:00", "15:00"], ["Lobbyisme Québec", "15:00", "16:30"]],
    [["Standup", "09:30", "09:45"], ["Lobbyisme Québec", "09:45", "12:00"], ["CDL", "13:00", "16:00"]],
    [["Standup", "09:30", "09:45"], ["CDL", "09:45", "12:00"]],
];

let nextId = 1;

function seedEntries(rows: SeedRow[]): Entry[] {
    return rows.map(([project, start, end, note = "", url = ""]) => ({ id: nextId++, project, start, end, note, url }));
}

function seedByDate() {
    const today = startOfDay(new Date());
    const byDate: Record<string, Entry[]> = { [dateKey(today)]: seedEntries(SEED_TODAY) };
    for (let day = startOfWeek(today), i = 0; day < today; day = addDays(day, 1), i++) {
        byDate[dateKey(day)] = seedEntries(SEED_PAST_DAYS[i % SEED_PAST_DAYS.length]!);
    }
    return byDate;
}

function seedProjects(): Project[] {
    return SEED_PROJECTS.map((name, i) => ({
        name,
        created: SEED_PROJECTS.length - i,
        color: PROJECT_PALETTE[i % PROJECT_PALETTE.length]!,
        fav: SEED_FAVORITES.includes(name),
    }));
}

function totalsByProject(entries: Entry[]) {
    const totals: Record<string, number> = {};
    for (const entry of entries) {
        totals[entry.project] = (totals[entry.project] ?? 0) + entryMinutes(entry);
    }
    return totals;
}

export interface EntryEditor {
    id: number | "new";
    form: EntryDraft;
}

export function useTimeTracker() {
    const date = useState("tracker:date", () => startOfDay(new Date()));
    const byDate = useState("tracker:entries", seedByDate);
    const projects = useState("tracker:projects", seedProjects);
    const weeklyGoalHours = useState("tracker:goal", () => 40);
    const editor = useState<EntryEditor | null>("tracker:editor", () => null);

    const entriesOn = (day: Date) =>
        [...(byDate.value[dateKey(day)] ?? [])].sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
    const minutesOn = (day: Date) => entriesOn(day).reduce((sum, entry) => sum + entryMinutes(entry), 0);

    const entries = computed(() => entriesOn(date.value));
    const isToday = computed(() => dateKey(date.value) === dateKey(new Date()));
    const weekDates = computed(() => {
        const monday = startOfWeek(date.value);
        return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
    });
    const weekGoal = computed(() => weeklyGoalHours.value * 60);
    // A workday is a fifth of the weekly goal
    const dayGoal = computed(() => weekGoal.value / 5);
    const dayTotals = computed(() => totalsByProject(entries.value));
    const weekTotals = computed(() => totalsByProject(weekDates.value.flatMap(entriesOn)));

    function updateDay(update: (list: Entry[]) => Entry[]) {
        const key = dateKey(date.value);
        byDate.value[key] = update(byDate.value[key] ?? []);
    }

    const colorOf = (name: string) => projects.value.find(p => p.name === name)?.color ?? "#71717a";
    const findProject = (name: string) => projects.value.find(p => p.name.toLowerCase() === name.toLowerCase());

    function addProject(name: string) {
        if (!name || findProject(name)) return false;
        projects.value.push({ name, created: Date.now(), color: PROJECT_PALETTE[projects.value.length % PROJECT_PALETTE.length]!, fav: false });
        return true;
    }

    function renameProject(from: string, to: string) {
        const clash = findProject(to);
        if (!to || to === from || (clash && clash.name !== from)) return false;
        projects.value = projects.value.map(p => (p.name === from ? { ...p, name: to } : p));
        for (const list of Object.values(byDate.value)) {
            for (const entry of list) {
                if (entry.project === from) entry.project = to;
            }
        }
        return true;
    }

    function toggleFavorite(name: string) {
        const project = projects.value.find(p => p.name === name);
        if (project) project.fav = !project.fav;
    }

    function openEditor(entry?: Entry | Partial<EntryDraft>) {
        const defaults: EntryDraft = { project: projects.value[0]?.name ?? "", start: "09:00", end: "10:00", note: "", url: "" };
        editor.value = entry && "id" in entry
            ? { id: entry.id, form: { project: entry.project, start: entry.start, end: entry.end, note: entry.note, url: entry.url } }
            : { id: "new", form: { ...defaults, ...entry } };
    }

    function saveEditor(form: EntryDraft) {
        const current = editor.value;
        if (!current) return;
        if (current.id === "new") updateDay(list => [...list, { ...form, id: nextId++ }]);
        else updateDay(list => list.map(e => (e.id === current.id ? { ...form, id: e.id } : e)));
        editor.value = null;
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
        dayTotals,
        weekTotals,
        editor,
        minutesOn,
        colorOf,
        addEntry: (draft: EntryDraft) => updateDay(list => [...list, { ...draft, id: nextId++ }]),
        removeEntry: (id: number) => updateDay(list => list.filter(e => e.id !== id)),
        addProject,
        renameProject,
        toggleFavorite,
        goTo: (day: Date) => (date.value = startOfDay(day)),
        goToday: () => (date.value = startOfDay(new Date())),
        shiftDay: (days: number) => (date.value = addDays(date.value, days)),
        openEditor,
        closeEditor: () => (editor.value = null),
        saveEditor,
    };
}
