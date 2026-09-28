<script setup lang="ts">
import { Clock } from "@lucide/vue";

const { date, weekDates, weekGoal, dayGoal, minutesOn, goTo } = useTimeTracker();

const open = ref(false);

/** How a day's time compares with the day's goal: none, short of it, within 30 minutes, reached, or beyond it */
function dayStatus(minutes: number) {
    if (minutes === 0) return "none";
    if (minutes > dayGoal.value) return "over";
    if (minutes === dayGoal.value) return "goal";
    return minutes >= dayGoal.value - 30 ? "close" : "short";
}

const days = computed(() =>
    weekDates.value.map((day) => {
        const minutes = minutesOn(day);
        const weekend = day.getDay() === 0 || day.getDay() === 6;
        return {
            day,
            label: DAY_NAMES[day.getDay()],
            minutes,
            weekend,
            status: dayStatus(minutes),
            selected: dateKey(day) === dateKey(date.value),
            pct: `${Math.min(100, (minutes / dayGoal.value) * 100)}%`,
        };
    }),
);
const weekTotal = computed(() => days.value.reduce((sum, d) => sum + d.minutes, 0));
const weekPct = computed(() => `${Math.min(100, (weekTotal.value / weekGoal.value) * 100)}%`);
const weekLeft = computed(() => (weekTotal.value >= weekGoal.value ? "Objectif atteint" : formatMinutes(weekGoal.value - weekTotal.value)));
const weekPercent = computed(() => Math.round((weekTotal.value / weekGoal.value) * 100));

function selectDay(day: Date) {
    goTo(day);
    open.value = false;
}

// Weekend days have no goal: their time stays neutral
const BAR_CLASSES = {
    none: "",
    short: "bg-red-500",
    close: "bg-yellow-500",
    goal: "bg-green-500",
    over: "bg-lime-500",
};
const VALUE_CLASSES = {
    none: "text-muted-foreground/50",
    short: "text-red-500 dark:text-red-400",
    close: "text-yellow-600 dark:text-yellow-400",
    goal: "text-green-600 dark:text-green-400",
    over: "text-lime-600 dark:text-lime-400",
};

function barClass(d: (typeof days.value)[number]) {
    return d.weekend ? "bg-muted-foreground/70" : BAR_CLASSES[d.status];
}

function valueClass(d: (typeof days.value)[number]) {
    if (d.status === "none") return VALUE_CLASSES.none;
    return d.weekend ? "text-muted-foreground" : VALUE_CLASSES[d.status];
}
</script>

<template>
    <Popover v-model:open="open">
        <PopoverTrigger as-child>
            <button type="button" class="relative flex h-9 items-center gap-2.5 overflow-hidden rounded-md border px-3 text-[13px] transition-colors hover:bg-accent data-[state=open]:bg-accent pb-0.5">
                <Clock class="size-3.5 text-muted-foreground" />
                <!-- On small screens, only what's left to do this week -->
                <span class="font-medium sm:hidden" :class="{ 'font-mono': weekTotal < weekGoal }">{{ weekLeft }}</span>
                <span class="hidden font-mono font-medium sm:inline">{{ formatMinutes(weekTotal) }}</span>
                <span class="hidden font-mono text-muted-foreground/70 sm:inline">/ {{ formatMinutes(weekGoal) }}</span>
                <span class="absolute inset-x-0 bottom-0 flex h-0.75 bg-foreground/10">
                    <span class="bg-primary" :style="{ width: weekPct }" />
                </span>
            </button>
        </PopoverTrigger>
        <PopoverContent align="end" :side-offset="8" class="flex w-[300px] flex-col bg-background p-0">
            <div class="flex flex-col gap-3 border-b p-4">
                <div class="flex items-baseline justify-between gap-3">
                    <span class="text-sm font-semibold">{{ weekTitle(date) }}</span>
                    <span class="text-xs text-muted-foreground">{{ weekRange(date) }}</span>
                </div>
                <div class="flex items-baseline justify-between gap-3 font-mono">
                    <div class="flex items-baseline gap-1.5">
                        <span class="text-[26px] leading-none font-semibold tracking-tight">{{ formatMinutes(weekTotal) }}</span>
                        <span class="text-[13px] text-muted-foreground/70">/ {{ formatMinutes(weekGoal) }}</span>
                    </div>
                    <span class="text-[13px] text-muted-foreground">{{ weekPercent }} %</span>
                </div>
            </div>
            <div class="flex flex-col gap-0.5 p-2">
                <button v-for="d in days" :key="d.label" type="button" class="grid h-8 grid-cols-[72px_minmax(0,1fr)_48px] items-center gap-2.5 rounded-md px-2 text-left hover:bg-muted/60" :class="{ 'bg-muted': d.selected }" @click="selectDay(d.day)">
                    <span class="text-[13px]" :class="d.selected ? 'font-semibold text-foreground' : d.weekend ? 'text-muted-foreground/70' : 'text-foreground/80'">
                        {{ d.label }}
                    </span>
                    <span class="flex h-1.5 overflow-hidden rounded-full bg-foreground/10">
                        <span class="rounded-full" :class="barClass(d)" :style="{ width: d.pct }" />
                    </span>
                    <span class="text-right font-mono text-[13px]" :class="valueClass(d)">{{ formatMinutes(d.minutes) }}</span>
                </button>
            </div>
            <div class="flex justify-between border-t px-4 py-3 text-[13px]">
                <span class="text-muted-foreground">Reste à faire</span>
                <span class="font-mono font-medium">{{ weekLeft }}</span>
            </div>
        </PopoverContent>
    </Popover>
</template>
