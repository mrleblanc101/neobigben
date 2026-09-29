<script setup lang="ts">
import { Pause } from "@lucide/vue";
import { useElementSize } from "@vueuse/core";

type Row =
    | { type: "gap"; key: string; start: string; end: string; project: string }
    | { type: "entry"; key: string; entry: Entry };

const { entries, weekLoaded, colorOf, openEditor } = useTimeTracker();

// The table needs 640px (its min-w-160); in less room, whatever the screen size, entries are shown as cards.
// Cards have no quick-add row: the toolbar's button opens the entry dialog instead.
const root = ref<HTMLElement>();
const { width } = useElementSize(root);
const asTable = computed(() => width.value >= 768);

// Entries in chronological order, with a pause row wherever there is a hole between two entries
const rows = computed(() => {
    const result: Row[] = [];
    // The latest end so far: an entry inside a longer one above it leaves no hole after it
    let latestEnd: string | null = null;
    for (const entry of entries.value) {
        if (latestEnd && toMinutes(entry.start) > toMinutes(latestEnd)) {
            result.push({ type: "gap", key: `gap-${entry.id}`, start: latestEnd, end: entry.start, project: entry.project });
        }
        result.push({ type: "entry", key: `entry-${entry.id}`, entry });
        if (!latestEnd || toMinutes(entry.end) > toMinutes(latestEnd)) latestEnd = entry.end;
    }
    return result;
});

// Entries whose time range crosses another entry's on the same day
const overlapping = computed(() => new Set(entries.value
    .filter(entry => entries.value.some(other => other !== entry
        && toMinutes(entry.start) < toMinutes(other.end) && toMinutes(other.start) < toMinutes(entry.end)))
    .map(entry => entry.id)));

const PAUSE_STRIPES = "bg-[repeating-linear-gradient(135deg,transparent_0_6px,color-mix(in_oklab,var(--foreground)_3%,transparent)_6px_12px)]";
const OVERLAP_STRIPES = "data-overlap:bg-[repeating-linear-gradient(135deg,transparent_0_6px,color-mix(in_oklab,var(--color-red-500)_12%,transparent)_6px_12px)]";
</script>

<template>
    <div ref="root">
        <div v-if="asTable" class="overflow-x-auto rounded-lg border">
            <div class="min-w-160">
                <div :class="ENTRY_GRID" class="h-10 border-b text-[13px] font-medium text-muted-foreground">
                    <span>Plage</span>
                    <span class="text-center">Durée</span>
                    <span>Projet</span>
                    <span>Description</span>
                    <span />
                </div>

                <div v-if="!weekLoaded" class="px-4 py-12 text-center text-[13px] text-muted-foreground">
                    Chargement…
                </div>
                <div v-else-if="!entries.length" class="flex flex-col items-center gap-2 px-4 py-12 text-center">
                    <span class="text-sm font-medium">Aucune entrée pour cette journée</span>
                    <span class="text-[13px] text-muted-foreground">Ajoutez une entrée pour commencer à suivre votre temps.</span>
                </div>

                <template v-for="row in rows" :key="row.key">
                    <div v-if="row.type === 'gap'" :class="PAUSE_STRIPES" class="flex h-9 items-center gap-3 border-b px-4">
                        <span class="inline-flex h-5.5 items-center gap-1.5 rounded-md border border-dashed border-muted-foreground/40 px-2 text-xs text-muted-foreground">
                            <Pause class="size-3" />
                            Pause · <span class="font-mono">{{ formatMinutes(toMinutes(row.end) - toMinutes(row.start)) }}</span>
                        </span>
                        <span class="font-mono text-xs text-muted-foreground/70">{{ row.start }} – {{ row.end }}</span>
                        <Button variant="ghost" size="xs" class="ml-auto font-normal text-muted-foreground" @click="openEditor({ project: row.project, start: row.start, end: row.end })">
                            Combler
                        </Button>
                    </div>

                    <!-- Once copied to NetSuite, everything but the actions fades back; overlapping entries get red stripes -->
                    <div v-else :class="[ENTRY_GRID, OVERLAP_STRIPES]" :data-copied="row.entry.copiedToNetsuite || undefined" :data-overlap="overlapping.has(row.entry.id) || undefined" :title="overlapping.has(row.entry.id) ? 'Chevauche une autre entrée' : undefined" class="min-h-14 border-b text-sm not-data-copied:hover:bg-muted/50 data-copied:*:not-last:opacity-45">
                        <div class="-ml-1 flex items-center gap-0.5 font-mono text-[13px]">
                            <span class="flex-1 text-center">{{ row.entry.start }}</span>
                            <span class="text-muted-foreground">–</span>
                            <span class="flex-1 text-center">{{ displayClock(row.entry.end) }}</span>
                        </div>
                        <span class="text-center font-mono text-[13px] font-medium">{{ formatMinutes(entryMinutes(row.entry)) }}</span>
                        <div class="flex min-w-0 items-center gap-2">
                            <span class="size-2.5 shrink-0 rounded-[2px]" :style="{ background: colorOf(row.entry.project) }" />
                            <span class="truncate font-medium">{{ row.entry.project }}</span>
                        </div>
                        <TrackerEntryNote :note="row.entry.note" class="py-2" />
                        <TrackerEntryActions :entry="row.entry" />
                    </div>
                </template>

                <TrackerQuickAddRow />
            </div>
        </div>

        <div v-else class="flex flex-col gap-2">
            <div v-if="!weekLoaded" class="rounded-lg border px-4 py-12 text-center text-[13px] text-muted-foreground">
                Chargement…
            </div>
            <div v-else-if="!entries.length" class="flex flex-col items-center gap-2 rounded-lg border px-4 py-12 text-center">
                <span class="text-sm font-medium">Aucune entrée pour cette journée</span>
                <span class="text-[13px] text-muted-foreground">Ajoutez une entrée avec le bouton +.</span>
            </div>

            <template v-for="row in rows" :key="row.key">
                <div v-if="row.type === 'gap'" :class="PAUSE_STRIPES" class="flex h-9 items-center gap-3 rounded-lg border border-dashed border-muted-foreground/30 pr-1.5 pl-3">
                    <span class="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Pause class="size-3" />
                        Pause · <span class="font-mono">{{ formatMinutes(toMinutes(row.end) - toMinutes(row.start)) }}</span>
                    </span>
                    <span class="font-mono text-xs text-muted-foreground/70">{{ row.start }} – {{ row.end }}</span>
                    <Button variant="ghost" size="xs" class="ml-auto font-normal text-muted-foreground" @click="openEditor({ project: row.project, start: row.start, end: row.end })">
                        Combler
                    </Button>
                </div>

                <!-- Project and actions, then the range and duration, then the note; copied and overlapping as in the table -->
                <div v-else :class="OVERLAP_STRIPES" :data-copied="row.entry.copiedToNetsuite || undefined" :data-overlap="overlapping.has(row.entry.id) || undefined" :title="overlapping.has(row.entry.id) ? 'Chevauche une autre entrée' : undefined" class="group flex flex-col gap-1.5 rounded-lg border py-2 pr-1.5 pl-3 text-sm">
                    <div class="flex items-center gap-2">
                        <div class="flex min-w-0 flex-1 items-center gap-2 group-data-copied:opacity-45">
                            <span class="size-2.5 shrink-0 rounded-[2px]" :style="{ background: colorOf(row.entry.project) }" />
                            <span class="truncate font-medium">{{ row.entry.project }}</span>
                        </div>
                        <TrackerEntryActions :entry="row.entry" />
                    </div>
                    <div class="flex items-center gap-2 pr-1.5 font-mono text-[13px] group-data-copied:opacity-45">
                        <span class="text-muted-foreground">{{ row.entry.start }} – {{ displayClock(row.entry.end) }}</span>
                        <span class="ml-auto font-medium">{{ formatMinutes(entryMinutes(row.entry)) }}</span>
                    </div>
                    <TrackerEntryNote v-if="row.entry.note" :note="row.entry.note" class="pr-1.5 group-data-copied:opacity-45" />
                </div>
            </template>
        </div>
    </div>
</template>
