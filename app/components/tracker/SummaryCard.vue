<script setup lang="ts">
const props = defineProps<{
    title: string;
    subtitle: string;
    /** Minutes per project */
    totals: Record<string, number>;
    /** Minutes */
    goal: number;
}>();

const { colorOf } = useTimeTracker();

const total = computed(() => Object.values(props.totals).reduce((sum, v) => sum + v, 0));
const rows = computed(() =>
    Object.entries(props.totals)
        .sort((a, b) => b[1] - a[1])
        .map(([name, minutes]) => ({ name, minutes, color: colorOf(name), share: (minutes / total.value) * 100 })),
);

const hovered = ref<string | null>(null);
</script>

<template>
    <div class="flex flex-col rounded-lg border">
        <div class="flex flex-col gap-3 px-5 py-4">
            <div class="flex items-end justify-between gap-3">
                <div class="flex min-w-0 flex-col gap-0.5">
                    <span class="text-[13px] text-muted-foreground">{{ title }}</span>
                    <span class="font-mono text-2xl font-semibold tracking-tight">{{ formatMinutes(total) }}</span>
                </div>
                <span class="pb-1 text-xs whitespace-nowrap text-muted-foreground/70">{{ subtitle }}</span>
            </div>
            <div class="flex h-2 gap-0.5 overflow-hidden rounded-full bg-muted">
                <span
                    v-for="row in rows"
                    :key="row.name"
                    class="transition-opacity"
                    :class="{ 'opacity-30': hovered && hovered !== row.name }"
                    :style="{ width: `${row.share}%`, background: row.color }"
                    @mouseenter="hovered = row.name"
                    @mouseleave="hovered = null"
                />
            </div>
        </div>
        <div class="flex flex-col border-t">
            <div
                v-for="row in rows"
                :key="row.name"
                class="flex items-center gap-2.5 border-b px-5 py-2.5 text-sm transition-colors"
                :class="{ 'bg-muted/50': hovered === row.name }"
                @mouseenter="hovered = row.name"
                @mouseleave="hovered = null"
            >
                <span class="size-2.5 rounded-[2px]" :style="{ background: row.color }" />
                <span class="min-w-0 flex-1 truncate font-medium">{{ row.name }}</span>
                <span class="text-xs text-muted-foreground/70">{{ Math.round(row.share) }} %</span>
                <span class="min-w-11 text-right font-mono text-[13px]">{{ formatMinutes(row.minutes) }}</span>
            </div>
            <div class="flex justify-between px-5 py-2.5 text-[13px] text-muted-foreground">
                <span>Objectif {{ formatMinutes(goal) }}</span>
                <span class="font-mono">{{ formatSignedMinutes(total - goal) }}</span>
            </div>
        </div>
    </div>
</template>
