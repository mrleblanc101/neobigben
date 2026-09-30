<script setup lang="ts">
import { Plus, Search } from "@lucide/vue";
import { insertNodeAt, removeNode, useSortable } from "@vueuse/integrations/useSortable";
import type { SortableEvent } from "sortablejs";

const { projects, addProject, reorderProjects } = useTimeTracker();

const query = ref("");

const trimmed = computed(() => query.value.trim());
const canCreate = computed(() => !!trimmed.value && !projects.value.some(p => p.name.toLowerCase() === trimmed.value.toLowerCase()));

const visible = computed(() => {
    const q = searchKey(trimmed.value);
    return projects.value.filter(p => searchKey(p.name).includes(q)).sort((a, b) => a.position - b.position);
});
const favorites = computed(() => visible.value.filter(p => p.fav));
const others = computed(() => visible.value.filter(p => !p.fav));

// Projects are reordered by dragging their row, within their section; not while a search hides some of them
const draggable = computed(() => !trimmed.value);
const favoritesList = ref<HTMLElement>();
const othersList = ref<HTMLElement>();

function sortable(list: Ref<HTMLElement | undefined>, section: Ref<Project[]>) {
    useSortable(list, [], {
        watchElement: true,
        // Rows only take part while they can be dragged; their buttons still click instead of starting a drag
        draggable: "[data-draggable]",
        filter: "button",
        preventOnFilter: false,
        animation: 150,
        // On touch screens a drag starts after a press and hold, so swiping over the list still scrolls it
        delay: 250,
        delayOnTouchOnly: true,
        // A finger moving a few pixels while held doesn't cancel the drag
        touchStartThreshold: 5,
        onUpdate(event: SortableEvent) {
            // Put the row back where Vue rendered it, then let the new order re-render the list
            removeNode(event.item);
            insertNodeAt(event.from, event.item, event.oldIndex!);
            const ids = section.value.map(p => p.id);
            ids.splice(event.newIndex!, 0, ...ids.splice(event.oldIndex!, 1));
            reorderProjects(ids);
        },
    });
}
sortable(favoritesList, favorites);
sortable(othersList, others);

async function create() {
    if (canCreate.value && (await addProject(trimmed.value))) query.value = "";
}
</script>

<template>
    <div class="relative">
        <Search class="pointer-events-none absolute top-2.5 left-2.5 size-3.5 text-muted-foreground/70" />
        <Input
            v-model="query"
            autocomplete="off"
            placeholder="Rechercher ou créer un projet…"
            class="h-[34px] pl-8 text-base"
            @keydown.enter="create"
        />
    </div>

    <button
        v-if="canCreate"
        type="button"
        class="flex h-9 items-center gap-2 rounded-md border border-dashed border-muted-foreground/40 px-3 text-left text-[13px] hover:bg-accent"
        @click="create"
    >
        <Plus class="size-3.5" />
        <span>Créer « {{ trimmed }} »</span>
    </button>

    <div v-if="favorites.length" class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between gap-2 text-xs">
            <span class="font-medium text-muted-foreground">Favoris</span>
            <Badge variant="secondary" class="h-4 px-1.5 py-0 font-mono text-[10px] leading-none text-muted-foreground">{{ favorites.length }}</Badge>
        </div>
        <div ref="favoritesList" class="flex flex-col overflow-hidden rounded-lg border">
            <TrackerProjectRow
                v-for="project in favorites"
                :key="project.id"
                :project="project"
                :draggable="draggable"
            />
        </div>
    </div>

    <div v-if="others.length || !visible.length" class="flex flex-col gap-1.5">
        <div v-if="others.length" class="flex items-center justify-between gap-2 text-xs">
            <span class="font-medium text-muted-foreground">Projets</span>
            <Badge variant="secondary" class="h-4 px-1.5 py-0 font-mono text-[10px] leading-none text-muted-foreground">{{ others.length }}</Badge>
        </div>
        <div ref="othersList" class="flex flex-col overflow-hidden rounded-lg border">
            <TrackerProjectRow
                v-for="project in others"
                :key="project.id"
                :project="project"
                :draggable="draggable"
            />
            <div v-if="!visible.length" class="px-3.5 py-6 text-center text-[13px] text-muted-foreground">
                Aucun projet trouvé
            </div>
        </div>
    </div>
</template>
