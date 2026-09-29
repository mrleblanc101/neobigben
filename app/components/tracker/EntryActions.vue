<script setup lang="ts">
import { Pencil, Trash2 } from "@lucide/vue";

const props = defineProps<{ entry: Entry }>();

const { openEditor, removeEntry, setCopiedToNetsuite } = useTimeTracker();
const { confirm } = useConfirm();

async function remove() {
    const { entry } = props;
    const confirmed = await confirm({
        title: "Supprimer l’entrée ?",
        description: `${entry.project} · ${entry.start} – ${entry.end} sera supprimée définitivement.`,
        confirmLabel: "Supprimer",
        destructive: true,
    });
    if (confirmed) removeEntry(entry.id);
}
</script>

<template>
    <div class="flex justify-end gap-0.5">
        <label
            class="flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-accent dark:hover:bg-accent/50"
            :title="entry.copiedToNetsuite ? 'Copiée dans NetSuite' : 'Pas encore copiée dans NetSuite'"
        >
            <Checkbox
                :model-value="entry.copiedToNetsuite"
                aria-label="Copiée dans NetSuite"
                @update:model-value="setCopiedToNetsuite(entry.id, $event === true)"
            />
        </label>
        <Button
            variant="ghost"
            size="icon-sm"
            title="Modifier"
            class="text-muted-foreground hover:bg-blue-500/12 hover:text-blue-600 dark:hover:bg-blue-500/12 dark:hover:text-blue-400"
            @click="openEditor(entry)"
        >
            <Pencil class="size-3.75" />
        </Button>
        <Button
            variant="ghost"
            size="icon-sm"
            title="Supprimer"
            class="text-muted-foreground hover:bg-red-500/12 hover:text-red-500 dark:hover:bg-red-500/12 dark:hover:text-red-400"
            @click="remove"
        >
            <Trash2 class="size-3.75" />
        </Button>
    </div>
</template>
