/**
 * Start, end and duration of an entry being typed, kept consistent the same way in quick-add and in the dialog.
 *
 * The start is only ever changed by the user. Between end and duration, the one the user set last (`anchor`)
 * stays as entered and the other one follows it: typing or picking a duration places the end, typing the end
 * (or picking "Maintenant") recomputes the duration. Clearing a field clears whichever value was derived from it.
 * Values stay partial ("0H:MM") while being typed; a masked field that only shows HH:MM is stored as "".
 * An end before the start is on the next day (22:00 → 02:00 is 4 hours); entries are split at midnight when saved.
 */
export function useTimeRange() {
    const start = ref("");
    const end = ref("");
    const duration = ref("");
    const anchor = ref<"end" | "duration" | null>(null);

    const startMinutes = computed(() => parseClock(start.value));
    const endMinutes = computed(() => parseClock(end.value));
    const durationMinutes = computed(() => parseDuration(duration.value));

    const spanned = computed(() => (startMinutes.value !== null && endMinutes.value !== null
        ? spanMinutes(startMinutes.value, endMinutes.value)
        : null));

    /** A complete start and end at least a minute apart, and no half-typed duration or one of a day or more */
    const valid = computed(() =>
        !!spanned.value
        && (!duration.value || (durationMinutes.value !== null && durationMinutes.value < MINUTES_PER_DAY)));

    /** Whether the entry carries on past midnight, so saving splits it into two days */
    const endsNextDay = computed(() =>
        startMinutes.value !== null && endMinutes.value !== null && endMinutes.value > 0 && endMinutes.value < startMinutes.value);

    const span = () => (spanned.value === null ? "" : formatMinutes(spanned.value));

    function reset(initialStart = "", initialEnd = "") {
        start.value = initialStart;
        end.value = initialEnd;
        anchor.value = initialEnd ? "end" : null;
        duration.value = span();
    }

    function setStart(value: string) {
        start.value = maskedValue(value);
        if (anchor.value === "duration") {
            end.value = startMinutes.value !== null && durationMinutes.value !== null
                ? addToClock(startMinutes.value, durationMinutes.value)
                : "";
        }
        else {
            duration.value = span();
        }
    }

    function setEnd(value: string) {
        end.value = maskedValue(value);
        // Clearing the end keeps a duration the user set
        if (!end.value && anchor.value === "duration") return;
        anchor.value = end.value ? "end" : null;
        duration.value = span();
    }

    function setDuration(value: string) {
        duration.value = maskedValue(value);
        if (!duration.value) {
            anchor.value = end.value ? "end" : null;
            return;
        }
        anchor.value = "duration";
        if (startMinutes.value !== null && durationMinutes.value !== null) {
            end.value = addToClock(startMinutes.value, durationMinutes.value);
        }
    }

    return {
        start,
        end,
        duration,
        startMinutes,
        durationMinutes,
        valid,
        endsNextDay,
        reset,
        setStart,
        setEnd,
        setDuration,
    };
}
