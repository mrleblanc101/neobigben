<script setup lang="ts">
import type { DateValue } from "@internationalized/date";
import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
import { CalendarDays } from "@lucide/vue";
import { CalendarRoot } from "reka-ui";

/**
 * Calendar button to jump to any day. The month shown marks today with an outline, the displayed day filled,
 * and every day with entries with a gold dot, the displayed day included.
 */
const { date, goTo, daysWithEntries } = useTimeTracker();

const open = ref(false);
const toCalendarDate = (day: Date) => new CalendarDate(day.getFullYear(), day.getMonth() + 1, day.getDate());
const selected = computed(() => toCalendarDate(date.value));
// The month on screen, which the arrows change without changing the displayed day
const placeholder = ref<DateValue>(selected.value);
watch(open, value => value && (placeholder.value = selected.value));

function pick(value: DateValue | undefined) {
    if (!value) return;
    goTo(value.toDate(getLocalTimeZone()));
    open.value = false;
}

// Days with entries in the month on screen and the days around it that the grid shows
const marked = ref(new Set<string>());
watch([open, () => `${placeholder.value.year}-${placeholder.value.month}`], async () => {
    if (!open.value) return;
    const first = placeholder.value.set({ day: 1 }).subtract({ days: 7 });
    const last = placeholder.value.set({ day: 1 }).add({ months: 1, days: 7 });
    marked.value = await daysWithEntries(first.toString(), last.toString());
}, { immediate: true });
</script>

<template>
    <Popover v-model:open="open">
        <PopoverTrigger as-child>
            <button
                type="button"
                title="Choisir une date"
                aria-label="Choisir une date"
                class="flex size-9 items-center justify-center rounded-md border hover:bg-accent data-[state=open]:bg-accent"
            >
                <CalendarDays class="size-4" />
            </button>
        </PopoverTrigger>
        <PopoverContent align="start" :side-offset="8" class="w-auto bg-background p-0">
            <!-- Weeks start on Sunday, so the weekend is the first and last column -->
            <CalendarRoot
                v-slot="{ grid, weekDays }"
                v-model:placeholder="placeholder"
                :model-value="selected"
                locale="fr"
                :week-starts-on="0"
                fixed-weeks
                initial-focus
                class="p-3 [&_td:is(:first-child,:last-child)_[data-slot=calendar-cell-trigger]:not([data-selected])]:text-red-500 dark:[&_td:is(:first-child,:last-child)_[data-slot=calendar-cell-trigger]:not([data-selected])]:text-red-400 [&_td:is(:first-child,:last-child)_[data-slot=calendar-cell-trigger][data-outside-view]:not([data-selected])]:text-red-500/50 dark:[&_td:is(:first-child,:last-child)_[data-slot=calendar-cell-trigger][data-outside-view]:not([data-selected])]:text-red-400/50"
                @update:model-value="pick"
            >
                <CalendarHeader class="pt-0">
                    <CalendarHeading class="first-letter:uppercase" />
                    <nav class="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-1">
                        <CalendarPrevButton />
                        <CalendarNextButton />
                    </nav>
                </CalendarHeader>
                <CalendarGrid v-for="month in grid" :key="month.value.toString()" class="mt-4">
                    <CalendarGridHead>
                        <CalendarGridRow>
                            <CalendarHeadCell v-for="day in weekDays" :key="day">
                                {{ day }}
                            </CalendarHeadCell>
                        </CalendarGridRow>
                    </CalendarGridHead>
                    <CalendarGridBody>
                        <CalendarGridRow v-for="(week, index) in month.rows" :key="index" class="mt-1 w-full">
                            <CalendarCell v-for="day in week" :key="day.toString()" :date="day">
                                <CalendarCellTrigger
                                    :day="day"
                                    :month="month.value"
                                    class="relative data-today:font-semibold [&[data-today]:not([data-selected])]:bg-transparent [&[data-today]:not([data-selected])]:ring-1 [&[data-today]:not([data-selected])]:ring-border [&[data-today]:not([data-selected])]:ring-inset"
                                >
                                    {{ day.day }}
                                    <span
                                        v-if="marked.has(day.toString())"
                                        class="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-blue-500"
                                    />
                                </CalendarCellTrigger>
                            </CalendarCell>
                        </CalendarGridRow>
                    </CalendarGridBody>
                </CalendarGrid>
            </CalendarRoot>
        </PopoverContent>
    </Popover>
</template>
