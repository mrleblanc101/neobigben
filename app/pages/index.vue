<script setup lang="ts">
import { X } from "@lucide/vue";
import { useMediaQuery } from "@vueuse/core";

const { date, error, init, loadWeek } = useTimeTracker();

// "Mercredi 30 septembre · NeoBigBen", following the selected day
useHead({ title: () => `${DAY_NAMES[date.value.getDay()]} ${date.value.getDate()} ${MONTH_NAMES[date.value.getMonth()]}` });

// The side panel sits beside the entries from lg up; below that it's an off-canvas opened from the header
const isDesktop = useMediaQuery("(min-width: 1024px)");
const panelOpen = useState("tracker:panel-open", () => false);
watch(isDesktop, (desktop) => {
    if (desktop) panelOpen.value = false;
});

onMounted(init);
// Moving to another week fetches its entries
watch(() => dateKey(startOfWeek(date.value)), () => loadWeek(date.value));
</script>

<template>
    <div class="flex min-h-svh flex-col">
        <TrackerAppHeader />
        <div class="grid flex-1 items-start lg:grid-cols-[minmax(0,1fr)_390px]">
            <main class="flex min-w-0 flex-col gap-4 p-6">
                <Alert v-if="error" variant="destructive" class="pr-10">
                    <AlertDescription>{{ error }}</AlertDescription>
                    <button type="button" aria-label="Fermer" class="absolute top-3 right-3 opacity-70 hover:opacity-100" @click="error = null">
                        <X class="size-4" />
                    </button>
                </Alert>
                <TrackerDayToolbar />
                <TrackerEntriesTable />
            </main>
            <TrackerSidePanel v-if="isDesktop" class="sticky top-14 min-h-[calc(100svh-3.5rem)] border-l" />
        </div>
        <Sheet v-if="!isDesktop" v-model:open="panelOpen">
            <SheetContent class="w-[390px] max-w-[calc(100vw-3rem)] gap-0 overflow-y-auto sm:max-w-none">
                <SheetHeader class="h-14 shrink-0 justify-center border-b px-5 py-0">
                    <SheetTitle class="text-sm">Résumé et projets</SheetTitle>
                    <SheetDescription class="sr-only">Temps par projet et liste des projets</SheetDescription>
                </SheetHeader>
                <TrackerSidePanel />
            </SheetContent>
        </Sheet>
        <TrackerEntryDialog />
        <ConfirmDialog />
    </div>
</template>
