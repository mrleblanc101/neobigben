<script setup lang="ts">
const { date, isToday, weekDates, dayTotals, weekTotals, dayGoal, weekGoal } = useTimeTracker();

// The week card follows the week of the selected day
const weekTitle = computed(() =>
    dateKey(weekDates.value[0]!) === dateKey(startOfWeek(new Date())) ? "Cette semaine" : `Semaine ${weekNumber(date.value)}`);
const weekSubtitle = computed(() => {
    const first = weekDates.value[0]!;
    const last = weekDates.value[6]!;
    const firstMonth = first.getMonth() !== last.getMonth() ? ` ${MONTH_NAMES[first.getMonth()]}` : "";
    return `${first.getDate()}${firstMonth} – ${last.getDate()} ${MONTH_NAMES[last.getMonth()]}`;
});

const tabs = ["Résumé", "Projets"] as const;
const tab = ref<(typeof tabs)[number]>("Résumé");
</script>

<template>
    <aside class="flex min-w-0 flex-col gap-4 p-5">
        <div class="grid grid-cols-2 gap-0.5 rounded-lg bg-muted p-1">
            <button
                v-for="label in tabs"
                :key="label"
                type="button"
                class="h-[30px] truncate rounded-md px-1 text-xs font-medium"
                :class="tab === label ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'"
                @click="tab = label"
            >
                {{ label }}
            </button>
        </div>

        <template v-if="tab === 'Résumé'">
            <TrackerSummaryCard
                :title="isToday ? 'Aujourd’hui' : 'Journée'"
                :subtitle="`${DAY_NAMES[date.getDay()]} ${date.getDate()}`"
                :totals="dayTotals"
                :goal="dayGoal"
            />
            <TrackerSummaryCard :title="weekTitle" :subtitle="weekSubtitle" :totals="weekTotals" :goal="weekGoal" />
        </template>
        <TrackerProjectList v-else />
    </aside>
</template>
