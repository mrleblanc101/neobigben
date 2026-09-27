<script setup lang="ts">
import { Pencil, Plus, Star, X } from "@lucide/vue";

const props = defineProps<{
    project: Project;
    /** Time logged on the selected day */
    minutes: number;
}>();

const { renameProject, toggleFavorite, openEditor } = useTimeTracker();

const renaming = ref(false);
const draft = ref("");
const input = ref<HTMLInputElement>();

async function startRename() {
    draft.value = props.project.name;
    renaming.value = true;
    await nextTick();
    input.value?.focus();
    input.value?.select();
}

// Also runs on blur, so it must be a no-op once Enter or Escape already ended the rename
function commit() {
    if (!renaming.value) return;
    renaming.value = false;
    renameProject(props.project.name, draft.value.trim());
}
</script>

<template>
    <div class="group flex h-11 items-center gap-2.5 border-b pr-2 pl-3.5 text-sm last:border-b-0 hover:bg-muted/50">
        <span class="size-2 shrink-0 rounded-[2px]" :style="{ background: project.color }" />
        <template v-if="renaming">
            <input
                ref="input"
                v-model="draft"
                aria-label="Nom du projet"
                class="-ml-2 h-7 min-w-0 flex-1 rounded-md border border-muted-foreground/50 bg-background px-2 font-medium outline-none ring-3 ring-ring/30"
                @keydown.enter="commit"
                @keydown.esc="renaming = false"
                @blur="commit"
            >
            <Button variant="ghost" size="icon-xs" title="Annuler" class="size-7 text-muted-foreground" @mousedown.prevent="renaming = false">
                <X class="size-3.5" />
            </Button>
        </template>
        <template v-else>
            <span class="min-w-0 flex-1 cursor-text truncate font-medium" title="Double-cliquer pour renommer" @dblclick="startRename">
                {{ project.name }}
            </span>
            <!-- The time badge and the row actions share a slot: actions show on hover or keyboard focus -->
            <div class="grid items-center justify-items-end">
                <span
                    v-if="minutes"
                    class="inline-flex h-5 items-center rounded-sm bg-muted px-1.5 font-mono text-[11px] text-foreground/80 [grid-area:1/1] group-focus-within:invisible group-hover:invisible"
                >
                    {{ formatMinutes(minutes) }}
                </span>
                <div class="flex opacity-0 [grid-area:1/1] group-focus-within:opacity-100 group-hover:opacity-100">
                    <Button variant="ghost" size="icon-xs" title="Renommer" class="size-7 text-muted-foreground/70" @click="startRename">
                        <Pencil class="size-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        :title="project.fav ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                        class="size-7 hover:text-amber-400 dark:hover:text-amber-400"
                        :class="project.fav ? 'text-amber-400' : 'text-muted-foreground/70'"
                        @click="toggleFavorite(project.name)"
                    >
                        <Star class="size-3.5" :fill="project.fav ? 'currentColor' : 'none'" />
                    </Button>
                    <Button variant="ghost" size="icon-xs" title="Nouvelle entrée" class="size-7 text-muted-foreground/70" @click="openEditor({ project: project.name })">
                        <Plus class="size-3.5" />
                    </Button>
                </div>
            </div>
        </template>
    </div>
</template>
