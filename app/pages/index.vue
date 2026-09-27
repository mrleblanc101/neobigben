<script setup lang="ts">
import { X } from "@lucide/vue";

const { date, error, init, loadWeek } = useTimeTracker();

onMounted(init);
// Moving to another week fetches its entries
watch(() => dateKey(startOfWeek(date.value)), () => loadWeek(date.value));
</script>

<template>
    <div class="flex min-h-svh flex-col">
        <TrackerAppHeader />
        <div class="grid flex-1 items-start lg:grid-cols-[minmax(0,1fr)_clamp(300px,30vw,360px)]">
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
            <TrackerSidePanel class="border-t lg:sticky lg:top-14 lg:min-h-[calc(100svh-3.5rem)] lg:border-t-0 lg:border-l" />
        </div>
        <TrackerEntryDialog />
    </div>
</template>
