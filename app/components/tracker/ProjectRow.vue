<script setup lang="ts">
import { Check, Ellipsis, GripVertical, Palette, Pencil, Plus, Star, Trash2, X } from "@lucide/vue";

const props = defineProps<{
    project: Project;
    /** Whether the row can be dragged to reorder the list, from anywhere but its buttons */
    draggable?: boolean;
}>();

const { renameProject, setProjectColor, toggleFavorite, openEditor, countProjectEntries, deleteProject } = useTimeTracker();
const { confirm } = useConfirm();

const renaming = ref(false);
const draft = ref("");
const input = ref<HTMLInputElement>();
const menuOpen = ref(false);
const colorInput = ref<HTMLInputElement>();
const customColor = computed(() => !PROJECT_PALETTE.includes(props.project.color));

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

// Opens the browser's color picker; the menu stays open until a color is picked
function pickCustomColor(event: Event) {
    event.preventDefault();
    colorInput.value?.click();
}

function setCustomColor(event: Event) {
    setProjectColor(props.project.name, (event.target as HTMLInputElement).value);
    menuOpen.value = false;
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
        class="group flex h-11 items-center gap-2 border-b pr-2 pl-3 text-base last:border-b-0 hover:bg-muted/50 data-draggable:cursor-grab data-draggable:select-none data-draggable:active:cursor-grabbing"
    >
        <!-- Kept while it can't be used, so the chips stay aligned with the other rows -->
        <GripVertical class="-mr-1 -ml-1.5 size-4 shrink-0 text-muted-foreground/70" :class="{ invisible: !draggable || renaming }" />
        <span class="size-3 shrink-0 rounded-xs" :style="{ background: project.color }" />
        <template v-if="renaming">
            <input
                ref="input"
                v-model="draft"
                autocomplete="off"
                aria-label="Nom du projet"
                class="-ml-0.5 h-7 min-w-0 flex-1 rounded-md border border-muted-foreground/50 bg-background px-2 text-base font-medium outline-none ring-3 ring-ring/30"
                @keydown.enter="commit"
                @keydown.esc="renaming = false"
                @blur="commit"
            >
            <Button variant="ghost" size="icon-xs" title="Annuler" class="size-7 text-muted-foreground" @mousedown.prevent="renaming = false">
                <X class="size-4" />
            </Button>
        </template>
        <template v-else>
            <span class="min-w-0 flex-1 truncate font-medium" :class="{ 'cursor-text': !draggable }" title="Double-cliquer pour renommer" @dblclick="startRename">
                {{ project.name }}
            </span>
            <div class="flex">
                <DropdownMenu v-model:open="menuOpen">
                    <DropdownMenuTrigger as-child>
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            title="Plus d’actions"
                            aria-label="Plus d’actions"
                            class="size-7 text-muted-foreground/70 data-[state=open]:bg-accent"
                        >
                            <Ellipsis class="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <!-- No focus back on the trigger when closing: Renommer moves it to the name field -->
                    <DropdownMenuContent align="end" @close-auto-focus.prevent>
                        <DropdownMenuItem @select="toggleFavorite(project.name)">
                            <Star :class="project.fav && 'text-amber-400'" :fill="project.fav ? 'currentColor' : 'none'" />
                            {{ project.fav ? "Retirer des favoris" : "Ajouter aux favoris" }}
                        </DropdownMenuItem>
                        <DropdownMenuItem @select="startRename">
                            <Pencil />
                            Renommer
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <Palette class="size-4 text-muted-foreground" />
                                Couleur
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent class="flex flex-col gap-1 p-2">
                                <div class="grid grid-cols-5 gap-1">
                                    <DropdownMenuItem
                                        v-for="color in PROJECT_PALETTE"
                                        :key="color"
                                        :aria-label="color"
                                        class="grid size-6 place-items-center rounded-sm p-0 hover:scale-110 focus:ring-2 focus:ring-ring"
                                        :style="{ background: color }"
                                        @select="setProjectColor(project.name, color)"
                                    >
                                        <Check
                                            v-if="color === project.color"
                                            class="size-4"
                                            :class="isLightColor(color) ? 'text-black/70' : 'text-white'"
                                            :stroke-width="3"
                                        />
                                    </DropdownMenuItem>
                                </div>
                                <!-- Any other color, from the browser's color picker -->
                                <DropdownMenuItem class="justify-center" @select="pickCustomColor">
                                    <span v-if="customColor" class="grid size-4 place-items-center rounded-xs" :style="{ background: project.color }">
                                        <Check class="size-3" :class="isLightColor(project.color) ? 'text-black/70' : 'text-white'" :stroke-width="3" />
                                    </span>
                                    Personnalisée
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" @select="remove">
                            <Trash2 />
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <!-- Outside the menu so it outlives it while the browser's picker is open -->
                <input
                    ref="colorInput"
                    type="color"
                    tabindex="-1"
                    aria-hidden="true"
                    :value="project.color"
                    class="sr-only"
                    @change="setCustomColor"
                >
                <Button
                    variant="ghost"
                    size="icon-xs"
                    title="Nouvelle entrée"
                    class="size-7 text-muted-foreground/70 hover:bg-emerald-500/12 hover:text-emerald-600 dark:hover:bg-emerald-500/12 dark:hover:text-emerald-400"
                    @click="openEditor({ project: project.name })"
                >
                    <Plus class="size-4" />
                </Button>
            </div>
        </template>
    </div>
</template>
