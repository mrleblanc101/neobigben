<script setup lang="ts">
import { Check, ChevronDown, Plus, X } from "@lucide/vue";
import { ComboboxAnchor, ComboboxInput, ComboboxRoot, ComboboxTrigger } from "reka-ui";

const props = withDefaults(defineProps<{
    /** Borderless for table rows, bordered like `<Input>` for forms */
    variant?: "inline" | "field";
    id?: string;
}>(), {
    variant: "field",
    id: undefined,
});

const project = defineModel<string>({ required: true });

const { projects, colorOf, addProject } = useTimeTracker();

const root = ref<InstanceType<typeof ComboboxRoot>>();
const query = ref("");

const trimmed = computed(() => query.value.trim());
// Until the user types something else, the input shows the selected project: list everything
const typing = computed(() => trimmed.value.toLowerCase() !== project.value.toLowerCase());
const matches = computed(() => {
    if (!typing.value) return projects.value;
    const q = trimmed.value.toLowerCase();
    return projects.value
        .filter(p => p.name.toLowerCase().includes(q))
        .sort((a, b) => Number(b.name.toLowerCase().startsWith(q)) - Number(a.name.toLowerCase().startsWith(q)));
});
const canCreate = computed(() => !!trimmed.value && !projects.value.some(p => p.name.toLowerCase() === trimmed.value.toLowerCase()));

// Drop the selection when its project is deleted
watch(projects, () => {
    if (project.value && !projects.value.some(p => p.name === project.value)) project.value = "";
}, { deep: true });

// Keep Enter on the best match as the list changes
watch(matches, () => nextTick(() => root.value?.highlightFirstItem?.()));

function clear() {
    project.value = "";
    query.value = "";
}

// Backspace or Delete on the selected project's name unselects it in one go, rather than editing the name
function onKeydown(event: KeyboardEvent) {
    if ((event.key === "Backspace" || event.key === "Delete") && project.value && !typing.value) {
        event.preventDefault();
        clear();
    }
}

// Erasing the name and leaving the field unselects the project instead of restoring it
function onBlur() {
    if (project.value && !query.value.trim()) nextTick(clear);
}

async function select(value: unknown) {
    const name = String(value ?? "");
    if (!projects.value.some(p => p.name === name) && !(await addProject(name))) return;
    project.value = name;
}
</script>

<template>
    <ComboboxRoot
        ref="root"
        :model-value="project"
        ignore-filter
        open-on-click
        @update:model-value="select"
    >
        <!-- Inline: like the description field, the hover highlight starts left of the column so the chip lines up with the rows -->
        <ComboboxAnchor
            class="relative flex min-w-0 items-center"
            :class="variant === 'field'
                ? 'h-9 rounded-md border bg-transparent shadow-xs focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30'
                : '-ml-2.5'"
        >
            <span
                v-if="project"
                class="pointer-events-none absolute size-2.5 rounded-[2px]"
                :class="variant === 'field' ? 'left-3' : 'left-2.5'"
                :style="{ background: colorOf(project) }"
            />
            <ComboboxInput
                :id="props.id"
                v-model="query"
                autocomplete="off"
                :display-value="value => String(value ?? '')"
                placeholder="Projet…"
                aria-label="Projet"
                class="h-8 w-full min-w-0 truncate bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                :class="[
                    variant === 'inline' && 'rounded-md font-medium hover:bg-muted focus:bg-muted',
                    // Room for the color chip on the left and the clear button on the right only once a project is picked
                    project ? (variant === 'field' ? 'pr-13 pl-7.5' : 'pr-12 pl-7') : (variant === 'field' ? 'pr-8 pl-3' : 'pr-7 pl-2.5'),
                ]"
                @blur="onBlur"
                @keydown="onKeydown"
            />
            <button
                v-if="project"
                type="button"
                aria-label="Retirer le projet"
                title="Retirer le projet"
                class="absolute flex size-5 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                :class="variant === 'field' ? 'right-7' : 'right-6'"
                @click="clear"
            >
                <X class="size-3" />
            </button>
            <ComboboxTrigger
                aria-label="Afficher les projets"
                class="absolute flex items-center text-muted-foreground"
                :class="variant === 'field' ? 'right-2.5' : 'right-2'"
            >
                <ChevronDown class="size-3" />
            </ComboboxTrigger>
        </ComboboxAnchor>

        <ComboboxList align="start" class="w-(--reka-combobox-trigger-width) min-w-56 p-1">
            <ComboboxViewport>
                <ComboboxItem v-for="p in matches" :key="p.name" :value="p.name">
                    <span class="size-2.5 shrink-0 rounded-[2px]" :style="{ background: colorOf(p.name) }" />
                    <span class="truncate">{{ p.name }}</span>
                    <ComboboxItemIndicator>
                        <Check />
                    </ComboboxItemIndicator>
                </ComboboxItem>
                <ComboboxItem v-if="canCreate" :value="trimmed">
                    <Plus />
                    <span class="truncate">Créer « {{ trimmed }} »</span>
                </ComboboxItem>
                <div v-if="!matches.length && !canCreate" class="px-2 py-6 text-center text-[13px] text-muted-foreground">
                    Tapez un nom pour créer un projet
                </div>
            </ComboboxViewport>
        </ComboboxList>
    </ComboboxRoot>
</template>
