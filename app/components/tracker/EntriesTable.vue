<script setup lang="ts">
import { ArrowUpRight, Pause, Pencil, Trash2 } from "@lucide/vue";

type Row =
    | { type: "gap"; key: string; start: string; end: string; project: string }
    | { type: "entry"; key: string; entry: Entry };

const { entries, weekLoaded, colorOf, openEditor, removeEntry, setCopiedToNetsuite } = useTimeTracker();
const { confirm } = useConfirm();

async function remove(entry: Entry) {
    const confirmed = await confirm({
        title: "Supprimer l’entrée ?",
        description: `${entry.project} · ${entry.start} – ${entry.end} sera supprimée définitivement.`,
        confirmLabel: "Supprimer",
        destructive: true,
    });
    if (confirmed) removeEntry(entry.id);
}

// Entries in chronological order, with a pause row wherever there is a hole between two entries
const rows = computed(() => {
    const result: Row[] = [];
    entries.value.forEach((entry, i) => {
        const previous = entries.value[i - 1];
        if (previous && toMinutes(entry.start) > toMinutes(previous.end)) {
            result.push({ type: "gap", key: `gap-${entry.id}`, start: previous.end, end: entry.start, project: entry.project });
        }
        result.push({ type: "entry", key: `entry-${entry.id}`, entry });
    });
    return result;
});
</script>

<template>
    <div class="overflow-x-auto rounded-lg border">
        <div class="min-w-160">
            <div :class="ENTRY_GRID" class="h-10 border-b text-[13px] font-medium text-muted-foreground">
                <span>Projet</span>
                <span>Description</span>
                <span>Plage</span>
                <span class="text-center">Durée</span>
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
                <div
                    v-if="row.type === 'gap'"
                    class="flex h-9 items-center gap-3 border-b bg-[repeating-linear-gradient(135deg,transparent_0_6px,color-mix(in_oklab,var(--foreground)_3%,transparent)_6px_12px)] px-4"
                >
                    <span class="inline-flex h-5.5 items-center gap-1.5 rounded-md border border-dashed border-muted-foreground/40 px-2 text-xs text-muted-foreground">
                        <Pause class="size-3" />
                        Pause · <span class="font-mono">{{ formatMinutes(toMinutes(row.end) - toMinutes(row.start)) }}</span>
                    </span>
                    <span class="font-mono text-xs text-muted-foreground/70">{{ row.start }} – {{ row.end }}</span>
                    <Button
                        variant="ghost"
                        size="xs"
                        class="ml-auto font-normal text-muted-foreground"
                        @click="openEditor({ project: row.project, start: row.start, end: row.end })"
                    >
                        Combler
                    </Button>
                </div>

                <!-- Once copied to NetSuite, everything but the actions fades back -->
                <div
                    v-else
                    :class="ENTRY_GRID"
                    :data-copied="row.entry.copiedToNetsuite || undefined"
                    class="min-h-14 border-b text-sm not-data-copied:hover:bg-muted/50 data-copied:*:not-last:opacity-45"
                >
                    <div class="flex min-w-0 items-center gap-2">
                        <span class="size-2 shrink-0 rounded-[2px]" :style="{ background: colorOf(row.entry.project) }" />
                        <span class="truncate font-medium">{{ row.entry.project }}</span>
                    </div>
                    <div class="flex min-w-0 items-center gap-2 overflow-hidden text-muted-foreground">
                        <span v-if="row.entry.note" class="min-w-0 truncate text-foreground">{{ row.entry.note }}</span>
                        <a
                            v-if="row.entry.url"
                            :href="row.entry.url"
                            target="_blank"
                            rel="noopener"
                            class="inline-flex h-5.5 shrink-0 items-center gap-1 rounded-md border px-2 font-mono text-xs font-medium whitespace-nowrap text-foreground hover:bg-accent"
                        >
                            {{ linkLabel(row.entry.url) }}
                            <ArrowUpRight class="size-3" />
                        </a>
                        <span v-if="!row.entry.note && !row.entry.url" class="text-muted-foreground/50">—</span>
                    </div>
                    <div class="-ml-1 flex items-center gap-0.5 font-mono text-[13px]">
                        <span class="flex-1 text-center">{{ row.entry.start }}</span>
                        <span class="text-muted-foreground">–</span>
                        <span class="flex-1 text-center">{{ displayClock(row.entry.end) }}</span>
                    </div>
                    <span class="text-center font-mono text-[13px] font-medium">{{ formatMinutes(entryMinutes(row.entry)) }}</span>
                    <div class="flex justify-end gap-0.5">
                        <label
                            class="flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-accent dark:hover:bg-accent/50"
                            :title="row.entry.copiedToNetsuite ? 'Copiée dans NetSuite' : 'Pas encore copiée dans NetSuite'"
                        >
                            <Checkbox
                                :model-value="row.entry.copiedToNetsuite"
                                aria-label="Copiée dans NetSuite"
                                @update:model-value="setCopiedToNetsuite(row.entry.id, $event === true)"
                            />
                        </label>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Modifier"
                            class="text-muted-foreground hover:bg-blue-500/12 hover:text-blue-600 dark:hover:bg-blue-500/12 dark:hover:text-blue-400"
                            @click="openEditor(row.entry)"
                        >
                            <Pencil class="size-3.75" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Supprimer"
                            class="text-muted-foreground hover:bg-red-500/12 hover:text-red-500 dark:hover:bg-red-500/12 dark:hover:text-red-400"
                            @click="remove(row.entry)"
                        >
                            <Trash2 class="size-3.75" />
                        </Button>
                    </div>
                </div>
            </template>

            <TrackerQuickAddRow />
        </div>
    </div>
</template>
