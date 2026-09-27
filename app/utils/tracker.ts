/** What the quick-add row and the entry dialog edit */
export interface EntryDraft {
    project: string;
    start: string;
    end: string;
    note: string;
    url: string;
}

export interface Entry extends EntryDraft {
    id: string;
    copiedToNetsuite: boolean;
}

export interface Project {
    id: string;
    name: string;
    created: number;
    color: string;
    fav: boolean;
    /** Place in the project list, set by dragging; lower comes first */
    position: number;
}

/**
 * Project colors, as the color picker shows them and in the order new projects get them: ten well-spaced hues
 * (a grey among them) in a bright shade (Tailwind 500), then the same hues in a deep shade (900)
 */
export const PROJECT_PALETTE = [
    "#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e",
    "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#64748b",
    "#7f1d1d", "#7c2d12", "#713f12", "#365314", "#14532d",
    "#164e63", "#1e3a8a", "#4c1d95", "#831843", "#0f172a",
];

/** Whether a "#rrggbb" color is light enough to need a dark mark on top rather than a white one */
export function isLightColor(color: string) {
    const [r = 0, g = 0, b = 0] = [1, 3, 5].map(i => Number.parseInt(color.slice(i, i + 2), 16) / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55;
}

export const DAY_NAMES = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
export const MONTH_NAMES = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

// Column layout shared by the entries table header, rows and quick-add row
export const ENTRY_GRID = "grid grid-cols-[116px_56px_minmax(130px,1fr)_minmax(160px,2fr)_104px] items-center gap-4 px-4";

export const MINUTES_PER_DAY = 24 * 60;
const CLOCK = /^([01]?\d|2[0-3]):[0-5]\d$/;
const DURATION = /^(\d{1,2})(?::(\d{0,2}))?$/;

/** "HH:MM" → minutes since midnight */
export function toMinutes(value: string) {
    const [hours = 0, minutes = 0] = value.split(":").map(Number);
    return hours * 60 + minutes;
}

/** Minutes → "HH:MM" */
export function formatMinutes(total: number) {
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** A stored time for display: an entry stopping at midnight is stored as ending at 24:00, shown as 00:00 */
export function displayClock(time: string) {
    return time === "24:00" ? "00:00" : time;
}

/** "+HH:MM" or "−HH:MM" */
export function formatSignedMinutes(diff: number) {
    return diff >= 0 ? `+${formatMinutes(diff)}` : `−${formatMinutes(-diff)}`;
}

/** Adds minutes to a time of day, wrapping past midnight */
export function addToClock(start: number, minutes: number) {
    return formatMinutes((start + minutes) % MINUTES_PER_DAY);
}

/** Minutes from a start to an end time of day, an end at or before the start being on the next day */
export function spanMinutes(start: number, end: number) {
    return (end - start + MINUTES_PER_DAY) % MINUTES_PER_DAY;
}

/**
 * Splits a range crossing midnight into the part on its own day, ending at 24:00, and the part on the next day.
 * An end at 00:00 just means the entry ends at midnight, with nothing on the next day.
 */
export function splitAtMidnight(start: string, end: string) {
    if (toMinutes(end) > toMinutes(start)) return { sameDay: { start, end }, nextDay: null };
    return { sameDay: { start, end: "24:00" }, nextDay: end === "00:00" ? null : { start: "00:00", end } };
}

/** A masked time field's value, or "" while it only shows its HH:MM placeholder */
export function maskedValue(value: string) {
    return /\d/.test(value) ? value : "";
}

/** A typed time of day ("9:30", "09:30") in minutes, or null */
export function parseClock(value: string) {
    return CLOCK.test(value) ? toMinutes(value) : null;
}

/** A typed duration ("1", "1:30", "01:30") in minutes, or null */
export function parseDuration(value: string) {
    const match = value.match(DURATION);
    return match ? Number(match[1]) * 60 + Number(match[2] || 0) : null;
}

export function entryMinutes(entry: Pick<Entry, "start" | "end">) {
    return toMinutes(entry.end) - toMinutes(entry.start);
}

/** Splits a typed description into its text and the first link pasted in it */
export function splitNoteLink(text: string) {
    const url = text.match(/https?:\/\/\S+/)?.[0] ?? "";
    const note = url ? text.replace(url, "").replace(/[:\s]+$/, "") : text;
    return { note: note.trim(), url };
}

/** Short label for a link: the issue key of a Jira link ("…/browse/CDL-88" → "CDL-88"), else the site's host name ("docs.google.com") */
export function linkLabel(url: string) {
    let parsed: URL;
    try {
        parsed = new URL(url);
    }
    catch {
        return "Lien";
    }
    const issue = parsed.pathname.match(/\/browse\/([A-Z][A-Z0-9]*-\d+)/)?.[1];
    return issue ?? (parsed.hostname.replace(/^www\./, "") || "Lien");
}

export function dateKey(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/** The date of a "YYYY-MM-DD" key */
export function parseDateKey(key: string) {
    const [year = 0, month = 1, day = 1] = key.split("-").map(Number);
    return new Date(year, month - 1, day);
}

export function startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/** Sunday of the date's week */
export function startOfWeek(date: Date) {
    return addDays(date, -date.getDay());
}

/** Week of the year, with weeks starting on Sunday and week 1 holding January 1st */
export function weekNumber(date: Date) {
    const jan1 = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = Math.round((startOfDay(date).getTime() - jan1.getTime()) / 864e5);
    return Math.floor((dayOfYear + jan1.getDay()) / 7) + 1;
}

/** "Semaine 39" */
export function weekTitle(date: Date) {
    return `Semaine ${weekNumber(date)}`;
}

/** Sunday to Saturday of the week holding the date, like "21 – 27 septembre" or "28 septembre – 4 octobre" */
export function weekRange(date: Date) {
    const first = startOfWeek(date);
    const last = addDays(first, 6);
    const firstMonth = first.getMonth() !== last.getMonth() ? ` ${MONTH_NAMES[first.getMonth()]}` : "";
    return `${first.getDate()}${firstMonth} – ${last.getDate()} ${MONTH_NAMES[last.getMonth()]}`;
}
