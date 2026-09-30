<script setup lang="ts">
const { date, isToday, dayTotals, weekTotals, dayGoal, weekGoal, excludeCopied } = useTimeTracker();

const tabs = ["Résumé", "Projets"] as const;
// Shared state, so the tab survives the off-canvas closing
const tab = useState<(typeof tabs)[number]>("tracker:panel-tab", () => "Résumé");
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
            <label class="flex cursor-pointer items-center gap-2.5 text-[13px] text-muted-foreground">
                <Switch v-model="excludeCopied" />
                Exclure les entrées copiées dans NetSuite
            </label>
            <TrackerSummaryCard
                :title="isToday ? 'Aujourd’hui' : DAY_NAMES[date.getDay()]!"
                :subtitle="isToday ? `${DAY_NAMES[date.getDay()]} ${date.getDate()}` : `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`"
                :totals="dayTotals"
                :goal="dayGoal"
            />
            <TrackerSummaryCard :title="weekTitle(date)" :subtitle="weekRange(date)" :totals="weekTotals" :goal="weekGoal" />
        </template>
        <TrackerProjectList v-else />
    </aside>
</template>
