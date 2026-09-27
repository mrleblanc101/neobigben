<script setup lang="ts">
import { Check, ChevronDown, Plus } from "@lucide/vue";
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

// Keep Enter on the best match as the list changes
watch(matches, () => nextTick(() => root.value?.highlightFirstItem?.()));

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
                class="pointer-events-none absolute size-2 rounded-[2px]"
                :class="variant === 'field' ? 'left-3' : 'left-2.5'"
                :style="{ background: project ? colorOf(project) : 'transparent' }"
            />
            <ComboboxInput
                :id="props.id"
                v-model="query"
                :display-value="value => String(value ?? '')"
                placeholder="Projet…"
                aria-label="Projet"
                class="h-8 w-full min-w-0 truncate bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                :class="variant === 'field' ? 'pr-8 pl-7' : 'rounded-md pr-7 pl-6.5 font-medium hover:bg-muted focus:bg-muted'"
            />
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
                    <span class="size-2 shrink-0 rounded-[2px]" :style="{ background: p.color }" />
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
