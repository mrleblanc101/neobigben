<script setup lang="ts">
const { date, isToday, dayTotals, weekTotals, dayGoal, weekGoal } = useTimeTracker();

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
            <TrackerSummaryCard title="Cette semaine" subtitle="Dim – Sam" :totals="weekTotals" :goal="weekGoal" />
        </template>
        <TrackerProjectList v-else />
    </aside>
</template>
