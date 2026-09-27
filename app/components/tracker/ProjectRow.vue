<script setup lang="ts">
import { Check, GripVertical, Pencil, Plus, Star, Trash2, X } from "@lucide/vue";

const props = defineProps<{
    project: Project;
    /** Time logged on the selected day */
    minutes: number;
    /** Whether the row can be dragged to reorder the list, from anywhere but its buttons */
    draggable?: boolean;
}>();

const { renameProject, setProjectColor, toggleFavorite, openEditor, countProjectEntries, deleteProject } = useTimeTracker();
const { confirm } = useConfirm();

const renaming = ref(false);
const draft = ref("");
const draftColor = ref("");
const picking = ref(false);
const input = ref<HTMLInputElement>();
const palette = ref<HTMLElement>();
const customColor = computed(() => !PROJECT_PALETTE.includes(draftColor.value));

async function startRename() {
    draft.value = props.project.name;
    draftColor.value = props.project.color;
    renaming.value = true;
    await nextTick();
    input.value?.focus();
    input.value?.select();
}

// Focus moving between the name field and the palette (the custom color's picker) keeps the edit open
function onBlur(event: FocusEvent) {
    const next = event.relatedTarget as Node | null;
    if (next && (next === input.value || palette.value?.contains(next))) return;
    commit();
}

function pickCustom() {
    picking.value = false;
    input.value?.focus();
}

// Also runs on blur, so it must be a no-op once Enter or Escape already ended the rename
function commit() {
    if (!renaming.value) return;
    renaming.value = false;
    picking.value = false;
    // The color first: it finds the project by its current name
    setProjectColor(props.project.name, draftColor.value);
    renameProject(props.project.name, draft.value.trim());
}

async function remove() {
    const { name } = props.project;
    const count = await countProjectEntries(name);
    const entries = count === null
        ? "Ses entrées seront aussi supprimées."
        : count === 0
            ? "Aucune entrée n’y est associée."
            : `${count} entrée${count > 1 ? "s" : ""} associée${count > 1 ? "s" : ""} ${count > 1 ? "seront" : "sera"} aussi supprimée${count > 1 ? "s" : ""}.`;
    const confirmed = await confirm({
        title: `Supprimer « ${name} » ?`,
        description: `${entries} Cette action est irréversible.`,
        confirmLabel: "Supprimer",
        destructive: true,
    });
    if (confirmed) deleteProject(name);
}
</script>

<template>
    <div
        :data-draggable="draggable && !renaming ? '' : undefined"
        class="group flex h-11 items-center gap-2.5 border-b pr-2 pl-3.5 text-sm last:border-b-0 hover:bg-muted/50 data-draggable:cursor-grab data-draggable:active:cursor-grabbing"
    >
        <!-- The color chip turns into a grip while a draggable row is hovered; its three variants take the same 10px in the row -->
        <span v-if="draggable && !renaming" class="-mx-[3px] grid size-4 shrink-0 place-items-center text-muted-foreground">
            <span class="size-2.5 rounded-[2px] group-hover:hidden" :style="{ background: project.color }" />
            <GripVertical class="hidden size-4 group-hover:block" />
        </span>
        <!-- While editing, the chip opens the palette; the name field keeps the focus so the edit stays open -->
        <Popover v-else-if="renaming" v-model:open="picking">
            <PopoverTrigger as-child>
                <button
                    type="button"
                    title="Changer la couleur"
                    aria-label="Changer la couleur"
                    class="-mx-[5px] grid size-5 shrink-0 place-items-center rounded-sm hover:bg-muted data-[state=open]:bg-muted"
                    @mousedown.prevent
                >
                    <span class="size-2.5 rounded-[2px] ring-2 ring-background" :style="{ background: draftColor }" />
                </button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                :side-offset="6"
                class="w-auto bg-background p-2"
                @open-auto-focus.prevent
                @close-auto-focus.prevent
            >
                <div ref="palette" class="flex flex-col gap-2">
                    <div class="grid grid-cols-5 gap-1">
                        <button
                            v-for="color in PROJECT_PALETTE"
                            :key="color"
                            type="button"
                            :aria-label="color"
                            :aria-pressed="color === draftColor"
                            class="grid size-6 place-items-center rounded-sm hover:scale-110"
                            :style="{ background: color }"
                            @mousedown.prevent
                            @click="draftColor = color; picking = false"
                        >
                            <Check
                                v-if="color === draftColor"
                                class="size-3.5"
                                :class="isLightColor(color) ? 'text-black/70' : 'text-white'"
                                :stroke-width="3"
                            />
                        </button>
                    </div>
                    <!-- Any other color, from the browser's color picker -->
                    <label class="relative flex h-7 cursor-pointer items-center justify-center gap-2 rounded-md border px-2 text-xs font-medium shadow-xs hover:bg-accent has-focus-visible:ring-3 has-focus-visible:ring-ring/50">
                        <span v-if="customColor" class="grid size-4 place-items-center rounded-sm" :style="{ background: draftColor }">
                            <Check class="size-3" :class="isLightColor(draftColor) ? 'text-black/70' : 'text-white'" :stroke-width="3" />
                        </span>
                        Personnalisée
                        <input
                            type="color"
                            :value="draftColor"
                            aria-label="Couleur personnalisée"
                            class="absolute inset-0 size-full cursor-pointer opacity-0"
                            @input="draftColor = ($event.target as HTMLInputElement).value"
                            @change="pickCustom"
                            @blur="onBlur"
                        >
                    </label>
                </div>
            </PopoverContent>
        </Popover>
        <span v-else class="size-2.5 shrink-0 rounded-[2px]" :style="{ background: project.color }" />
        <template v-if="renaming">
            <input
                ref="input"
                v-model="draft"
                autocomplete="off"
                aria-label="Nom du projet"
                class="-ml-0.5 h-7 min-w-0 flex-1 rounded-md border border-muted-foreground/50 bg-background px-2 font-medium outline-none ring-3 ring-ring/30"
                @keydown.enter="commit"
                @keydown.esc="picking ? (picking = false) : (renaming = false)"
                @blur="onBlur"
            >
            <Button variant="ghost" size="icon-xs" title="Annuler" class="size-7 text-muted-foreground" @mousedown.prevent="renaming = false">
                <X class="size-3.5" />
            </Button>
        </template>
        <template v-else>
            <span class="min-w-0 flex-1 truncate font-medium" :class="{ 'cursor-text': !draggable }" title="Double-cliquer pour renommer" @dblclick="startRename">
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
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        title="Supprimer le projet"
                        class="size-7 text-muted-foreground/70 hover:bg-red-500/12 hover:text-red-500 dark:hover:bg-red-500/12 dark:hover:text-red-400"
                        @click="remove"
                    >
                        <Trash2 class="size-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        title="Renommer"
                        class="size-7 text-muted-foreground/70 hover:bg-blue-500/12 hover:text-blue-600 dark:hover:bg-blue-500/12 dark:hover:text-blue-400"
                        @click="startRename"
                    >
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
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        title="Nouvelle entrée"
                        class="size-7 text-muted-foreground/70 hover:bg-emerald-500/12 hover:text-emerald-600 dark:hover:bg-emerald-500/12 dark:hover:text-emerald-400"
                        @click="openEditor({ project: project.name })"
                    >
                        <Plus class="size-3.5" />
                    </Button>
                </div>
            </div>
        </template>
    </div>
</template>
