<script setup lang="ts">
import { ChevronDown, Plus, Search } from "@lucide/vue";

const { projects, dayTotals, addProject } = useTimeTracker();

const query = ref("");
const sort = ref<"created" | "name" | "time">("created");

const trimmed = computed(() => query.value.trim());
const canCreate = computed(() => !!trimmed.value && !projects.value.some(p => p.name.toLowerCase() === trimmed.value.toLowerCase()));

const visible = computed(() => {
    const q = trimmed.value.toLowerCase();
    const minutes = (name: string) => dayTotals.value[name] ?? 0;
    const compare = {
        created: (a: Project, b: Project) => b.created - a.created,
        name: (a: Project, b: Project) => a.name.localeCompare(b.name, "fr"),
        time: (a: Project, b: Project) => minutes(b.name) - minutes(a.name),
    }[sort.value];
    return projects.value.filter(p => p.name.toLowerCase().includes(q)).sort(compare);
});
const favorites = computed(() => visible.value.filter(p => p.fav));
const others = computed(() => visible.value.filter(p => !p.fav));

async function create() {
    if (canCreate.value && (await addProject(trimmed.value))) query.value = "";
}
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="relative">
            <Search class="pointer-events-none absolute top-2.5 left-2.5 size-3.5 text-muted-foreground/70" />
            <Input
                v-model="query"
                placeholder="Rechercher ou créer un projet…"
                class="h-[34px] pl-8 text-[13px] md:text-[13px]"
                @keydown.enter="create"
            />
        </div>
        <div class="flex items-center justify-between gap-2">
            <span class="text-xs text-muted-foreground">{{ visible.length }} projet{{ visible.length > 1 ? "s" : "" }}</span>
            <div class="relative flex">
                <select
                    v-model="sort"
                    aria-label="Trier les projets"
                    class="h-7 cursor-pointer appearance-none rounded-md border bg-background pr-6.5 pl-2 text-xs dark:bg-input/30"
                >
                    <option value="created">
                        Date de création
                    </option>
                    <option value="name">
                        Nom (A–Z)
                    </option>
                    <option value="time">
                        Temps aujourd’hui
                    </option>
                </select>
                <ChevronDown class="pointer-events-none absolute top-2 right-2 size-3 text-muted-foreground" />
            </div>
        </div>
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
        <span class="text-xs font-medium text-muted-foreground">Favoris</span>
        <div class="flex flex-col overflow-hidden rounded-lg border">
            <TrackerProjectRow v-for="project in favorites" :key="project.id" :project="project" :minutes="dayTotals[project.name] ?? 0" />
        </div>
    </div>

    <div v-if="others.length || !favorites.length" class="flex flex-col gap-1.5">
        <span v-if="favorites.length" class="text-xs font-medium text-muted-foreground">Tous les projets</span>
        <div class="flex flex-col overflow-hidden rounded-lg border">
            <TrackerProjectRow v-for="project in others" :key="project.id" :project="project" :minutes="dayTotals[project.name] ?? 0" />
            <div v-if="!visible.length" class="px-3.5 py-6 text-center text-[13px] text-muted-foreground">
                Aucun projet trouvé
            </div>
        </div>
    </div>
</template>
