<script setup lang="ts">
import { Clock } from "@lucide/vue";

const { date, weekDates, weekGoal, dayGoal, minutesOn, goTo } = useTimeTracker();

const open = ref(false);

const days = computed(() =>
    weekDates.value.map((day) => {
        const minutes = minutesOn(day);
        const weekend = day.getDay() === 0 || day.getDay() === 6;
        const reached = minutes >= dayGoal.value;
        return {
            day,
            label: DAY_NAMES[day.getDay()],
            minutes,
            weekend,
            reached,
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

function barClass(d: (typeof days.value)[number]) {
    if (d.weekend) return "bg-muted-foreground/70";
    return d.reached ? "bg-emerald-500" : "bg-red-400";
}

function valueClass(d: (typeof days.value)[number]) {
    if (d.minutes === 0) return "text-muted-foreground/50";
    if (d.weekend) return "text-muted-foreground";
    return d.reached ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400";
}
</script>

<template>
    <Popover v-model:open="open">
        <PopoverTrigger as-child>
            <button
                type="button"
                class="relative flex h-10 items-center gap-2.5 overflow-hidden rounded-md border px-3 text-[13px] transition-colors hover:bg-accent data-[state=open]:bg-accent"
            >
                <Clock class="size-3.5 text-muted-foreground" />
                <span class="font-mono font-medium">{{ formatMinutes(weekTotal) }}</span>
                <span class="font-mono text-muted-foreground/70">/ {{ formatMinutes(weekGoal) }}</span>
                <!-- Progress along the bottom edge, like a border; the track is a tint of the text color, which stays visible on any hover or selected background -->
                <span class="absolute inset-x-0 bottom-0 flex h-1 bg-foreground/10">
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
                <button
                    v-for="d in days"
                    :key="d.label"
                    type="button"
                    class="grid h-8 grid-cols-[72px_minmax(0,1fr)_48px] items-center gap-2.5 rounded-md px-2 text-left hover:bg-muted/60"
                    :class="{ 'bg-muted': d.selected }"
                    @click="selectDay(d.day)"
                >
                    <span
                        class="text-[13px]"
                        :class="d.selected ? 'font-semibold text-foreground' : d.weekend ? 'text-muted-foreground/70' : 'text-foreground/80'"
                    >
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
