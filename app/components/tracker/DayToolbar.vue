<script setup lang="ts">
import { ChevronLeft, ChevronRight, Plus } from "@lucide/vue";
import { useEventListener } from "@vueuse/core";

const { date, shiftDay, goToday, openEditor } = useTimeTracker();

// ← and → move to the previous and next day, unless the keys belong to something else: a field being typed in,
// or an open dialog, popover or list. Modifier combinations are left to the browser (Alt+← goes back).
useEventListener(window, "keydown", (event: KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const active = document.activeElement as HTMLElement | null;
    if (active?.closest("input, textarea, select, [contenteditable=true]")) return;
    if (document.querySelector("[role=dialog], [role=alertdialog], [data-slot=popover-content], [role=listbox]")) return;
    event.preventDefault();
    shiftDay(event.key === "ArrowLeft" ? -1 : 1);
});

const title = computed(() => `${DAY_NAMES[date.value.getDay()]} ${date.value.getDate()} ${MONTH_NAMES[date.value.getMonth()]}`);
const subtitle = computed(() => `Semaine ${weekNumber(date.value)}`);
</script>

<template>
    <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-col gap-0.5">
            <h1 class="text-2xl font-semibold tracking-tight">
                {{ title }}
            </h1>
            <p class="text-sm text-muted-foreground">
                {{ subtitle }}
            </p>
        </div>
        <div class="flex items-center gap-2">
            <TrackerDayPicker />
            <!-- Dividers are their own elements: a translucent border on a button would tint with its hover background -->
            <div class="flex overflow-hidden rounded-md border">
                <button type="button" aria-label="Jour précédent" class="flex size-9 items-center justify-center hover:bg-accent" @click="shiftDay(-1)">
                    <ChevronLeft class="size-4" />
                </button>
                <span class="w-px bg-border" aria-hidden="true" />
                <button type="button" class="h-9 px-3.5 text-sm font-medium hover:bg-accent" @click="goToday">
                    Aujourd’hui
                </button>
                <span class="w-px bg-border" aria-hidden="true" />
                <button type="button" aria-label="Jour suivant" class="flex size-9 items-center justify-center hover:bg-accent" @click="shiftDay(1)">
                    <ChevronRight class="size-4" />
                </button>
            </div>
            <Button class="px-3.5" @click="openEditor()">
                <Plus />
                Nouvelle entrée
            </Button>
        </div>
    </div>
</template>
