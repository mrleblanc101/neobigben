<script setup lang="ts">
import { ChevronLeft, ChevronRight, Plus } from "@lucide/vue";

const { date, shiftDay, goToday, openEditor } = useTimeTracker();

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
            <div class="flex overflow-hidden rounded-md border">
                <button type="button" aria-label="Jour précédent" class="flex size-9 items-center justify-center border-r hover:bg-accent" @click="shiftDay(-1)">
                    <ChevronLeft class="size-4" />
                </button>
                <button type="button" class="h-9 px-3.5 text-sm font-medium hover:bg-accent" @click="goToday">
                    Aujourd’hui
                </button>
                <button type="button" aria-label="Jour suivant" class="flex size-9 items-center justify-center border-l hover:bg-accent" @click="shiftDay(1)">
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
