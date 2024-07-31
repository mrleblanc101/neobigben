<template>
    <Transition
        enter-from-class="translate-x-full"
        leave-to-class="translate-x-full"
        enter-active-class="transition duration-300"
        leave-active-class="transition duration-300"
    >
        <Tabs
            v-if="isXlOrGreater || menuOpened"
            v-on-click-outside.bubble="onClickOutside"
            class="fixed bottom-0 right-0 top-16 z-30 flex w-full shrink-0 flex-col border-l bg-stone-50 shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:w-[32rem] xl:shadow-none"
        >
            <Tab :title="$t('Résumé')">
                <div class="mb-2 flex items-center gap-2">
                    <span class="text-xs font-medium uppercase tracking-wider opacity-60">{{ $t('Filtrer') }}</span>
                    <select v-model="filter" class="form-control form-select-bordered form-select pr-12">
                        <option value="daily">{{ $t('Journée courante') }}</option>
                        <option value="weekly">{{ $t('Semaine courante') }}</option>
                    </select>
                </div>
                <template v-if="summary && summary.length">
                    <div
                        v-for="[project, duration] in summary"
                        :key="project"
                        class="flex w-full items-center justify-between gap-4 rounded border bg-stone-100 p-4 font-bold dark:border-slate-700 dark:bg-slate-800"
                    >
                        <span>{{ project }}</span>
                        <span>{{ duration }}</span>
                    </div>
                </template>
                <div
                    v-else
                    class="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center leading-tight opacity-60"
                >
                    {{ $t("Aucune donnée pour l'instant") }}
                </div>
            </Tab>
            <Tab :title="$t('Projets')">
                <div class="mb-2 flex items-center gap-2">
                    <span class="text-xs font-medium uppercase tracking-wider opacity-60">{{ $t('Tri') }}</span>
                    <select v-model="sort" class="form-control form-select-bordered form-select pr-12">
                        <option value="creation">{{ $t('Date de création') }}</option>
                        <option value="name">{{ $t('Alphabétique') }}</option>
                    </select>
                </div>
                <template v-if="sortedProjects && sortedProjects.length">
                    <div
                        v-for="[project] in sortedProjects"
                        :key="project.id"
                        class="relative flex w-full items-center justify-between gap-4 rounded border bg-stone-100 p-4 pr-16 dark:border-slate-700 dark:bg-slate-800"
                    >
                        <span class="font-bold">{{ project.name }}</span>
                        <!-- TODO: Only display on hover -->
                        <div class="absolute right-2 top-1/2 flex -translate-y-1/2 gap-2">
                            <!-- TODO: Edit -->
                            <button
                                type="button"
                                class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary-500 font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus:ring active:bg-primary-600 dark:text-slate-800 dark:ring-slate-600"
                            >
                                <IEdit class="h-5" />
                            </button>
                            <button
                                type="button"
                                class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-red-500 font-bold text-white shadow ring-primary-200 transition hover:bg-red-400 focus:outline-none focus:ring active:bg-red-600 dark:text-slate-800 dark:ring-slate-600"
                                @click="deleteProject(project)"
                            >
                                <IDelete class="h-5" />
                            </button>
                        </div>
                    </div>
                </template>
                <div
                    v-else
                    class="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center leading-tight opacity-60"
                >
                    {{ $t("Aucune donnée pour l'instant") }}
                </div>
            </Tab>
            <Tab :title="$t('Priorités')">
                <div class="mb-2 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        class="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded bg-primary-500 px-3 text-sm font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus-visible:ring active:bg-primary-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-900 dark:ring-slate-600"
                        @click="deleteCompletedPriorities"
                    >
                        {{ $t('Cleanup') }}
                        <IClear class="h-6 w-6" />
                    </button>
                </div>
                <draggable
                    v-model="priorities"
                    :animation="300"
                    item-key="id"
                    handle=".handle"
                    class="flex flex-col gap-2"
                >
                    <template #item="{ element: priority }">
                        <div class="flex items-center gap-2">
                            <label class="relative flex w-full items-center gap-2">
                                <input
                                    type="checkbox"
                                    :checked="priority.completed"
                                    class="form-control form-input-bordered form-input h-6 w-6 rounded-full p-0 text-primary-500 disabled:opacity-30 dark:text-primary-500 dark:checked:bg-primary-500"
                                    @change="updatePriority(priority)"
                                />
                                <div
                                    class="relative flex w-full items-center justify-between gap-4 rounded border bg-stone-100 p-4 pr-16 dark:border-slate-700 dark:bg-slate-800"
                                >
                                    <span class="font-bold">{{ priority.name }}</span>
                                </div>
                                <button
                                    type="button"
                                    class="absolute right-2 top-1/2 inline-flex h-10 w-10 flex-shrink-0 -translate-y-1/2 items-center justify-center rounded bg-red-500 font-bold text-white shadow ring-primary-200 transition hover:bg-red-400 focus:outline-none focus-visible:ring active:bg-red-600 dark:text-slate-800 dark:ring-slate-600"
                                    @click="deletePriority(priority)"
                                >
                                    <IDelete class="h-5" />
                                </button>
                            </label>
                            <div
                                class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded font-bold text-slate-400 ring-primary-200 transition hover:text-primary-400 focus:outline-none focus-visible:ring active:text-primary-400 dark:ring-slate-600"
                            >
                                <IHandle class="handle h-5 w-5 shrink-0 cursor-move" />
                            </div>
                        </div>
                    </template>
                </draggable>
                <form class="flex gap-2" @submit.prevent="onAddPriority">
                    <div class="flex w-full items-center gap-2">
                        <input
                            type="checkbox"
                            class="form-control form-input-bordered form-input h-6 w-6 rounded-full border-slate-400 p-0 text-primary-500 ring-primary-200 focus:outline-none focus-visible:ring disabled:opacity-30 dark:bg-slate-800 dark:text-primary-500 dark:ring-slate-600 dark:checked:bg-primary-500"
                            disabled
                        />
                        <label class="flex w-full items-center gap-2">
                            <span class="sr-only">{{ $t('Priorité') }}</span>
                            <input
                                v-model="priorityModel"
                                type="text"
                                placeholder="Ajouter une priorité"
                                class="form-control form-input-bordered form-input h-10 w-full"
                            />
                            <div
                                class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded font-bold text-slate-400 opacity-50 ring-primary-200 transition focus:outline-none focus-visible:ring dark:ring-slate-600"
                            >
                                <IHandle class="handle h-5 w-5 shrink-0" />
                            </div>
                        </label>
                    </div>
                </form>
            </Tab>
            <Tab :title="$t('Raccourcis')">
                <div v-if="!isCreating" class="mb-2 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        class="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded bg-primary-500 px-3 text-sm font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus-visible:ring active:bg-primary-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-900 dark:ring-slate-600"
                        @click="isCreating = !isCreating"
                    >
                        {{ $t('Ajouter') }}
                    </button>
                </div>
                <draggable
                    v-if="bookmarks && bookmarks.length && !isCreating"
                    v-model="bookmarks"
                    :animation="300"
                    item-key="id"
                    handle=".handle"
                    class="flex flex-col gap-2"
                >
                    <template #item="{ element: bookmark }">
                        <div class="flex items-center gap-2">
                            <div class="relative w-full">
                                <div
                                    class="relative flex w-full items-center justify-between gap-4 rounded border bg-stone-100 pr-14 dark:border-slate-700 dark:bg-slate-800"
                                >
                                    <a
                                        :href="bookmark.url || '#'"
                                        target="_blank"
                                        class="w-full p-4 pr-0 font-bold text-primary-500 hover:text-primary-400"
                                    >
                                        {{ bookmark.name }}
                                    </a>
                                </div>
                                <!-- TODO: Only display on hover -->
                                <div class="absolute right-2 top-1/2 flex -translate-y-1/2 gap-2">
                                    <!-- TODO: Edit -->
                                    <button
                                        type="button"
                                        class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary-500 font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus:ring active:bg-primary-600 dark:text-slate-800 dark:ring-slate-600"
                                    >
                                        <IEdit class="h-5" />
                                    </button>
                                    <button
                                        type="button"
                                        class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-red-500 font-bold text-white shadow ring-primary-200 transition hover:bg-red-400 focus:outline-none focus:ring active:bg-red-600 dark:text-slate-800 dark:ring-slate-600"
                                        @click="deleteBookmark(bookmark)"
                                    >
                                        <IDelete class="h-5" />
                                    </button>
                                </div>
                            </div>
                            <div
                                class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded font-bold text-slate-400 ring-primary-200 transition hover:text-primary-400 focus:outline-none focus-visible:ring active:text-primary-400 dark:ring-slate-600"
                            >
                                <IHandle class="handle h-5 w-5 shrink-0 cursor-move" />
                            </div>
                        </div>
                    </template>
                </draggable>
                <div
                    v-else-if="!isCreating"
                    class="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center leading-tight opacity-60"
                >
                    {{ $t("Aucune donnée pour l'instant") }}
                </div>
                <form
                    v-if="isCreating"
                    class="flex flex-col gap-2 rounded border bg-stone-100 p-4 dark:border-slate-700 dark:bg-slate-800"
                    @submit.prevent="onAddBookmark"
                >
                    <div>
                        <label class="text-xs font-medium uppercase opacity-60">{{ $t('Nom') }}</label>
                        <input
                            v-model="bookmarkModel.name"
                            type="text"
                            :placeholder="$t('EOS (TownHall, pause-café, etc.)')"
                            class="form-control form-input-bordered form-input h-10 w-full"
                        />
                    </div>
                    <div>
                        <label class="text-xs font-medium uppercase opacity-60">{{ $t('Url') }}</label>
                        <input
                            v-model="bookmarkModel.url"
                            type="text"
                            :placeholder="$t('https://...')"
                            class="form-control form-input-bordered form-input h-10 w-full"
                        />
                    </div>
                    <div class="flex justify-end gap-2">
                        <button
                            type="button"
                            class="appearance-none bg-transparent px-2 text-sm font-bold text-slate-400 transition hover:text-slate-300 active:text-slate-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-400 dark:active:text-slate-600"
                            @click="cancel"
                        >
                            {{ $t('Annuler') }}
                        </button>
                        <button
                            type="submit"
                            class="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded bg-primary-500 px-3 text-sm font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus-visible:ring active:bg-primary-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-900 dark:ring-slate-600"
                        >
                            {{ $t('Ajouter') }}
                        </button>
                    </div>
                </form>
            </Tab>
        </Tabs>
    </Transition>
</template>

<script lang="ts" setup>
import IEdit from '@/assets/svg/edit.svg?component';
import IDelete from '@/assets/svg/delete.svg?component';
import IHandle from '@/assets/svg/hamburger.svg?component';
import IClear from '@/assets/svg/clear.svg?component';
import draggable from 'vuedraggable';

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { useIndexStore } from '@/stores/index';
import { storeToRefs } from 'pinia';

const breakpoints = useBreakpoints(breakpointsTailwind);
const store = useIndexStore();

const { weeklySummaryByProjects, dailySummaryByProjects, menuOpened, filter, sort, sortedProjects } =
    storeToRefs(store);
const {
    deleteProject,
    deletePriority,
    deleteCompletedPriorities,
    addPriority,
    updatePriority,
    deleteBookmark,
    addBookmark,
} = store;
const isXlOrGreater = breakpoints.greaterOrEqual('xl');

const priorityModel = ref('');

const bookmarkModel = ref({
    name: '',
    url: '',
});
const isCreating = ref(false);

const priorities = computed({
    get() {
        return store.user?.priorities as Priority[];
    },
    async set(value: Priority[]) {
        await store.reorderPriorities(value);
    },
});
const bookmarks = computed({
    get() {
        return store.user?.bookmarks as Bookmark[];
    },
    async set(value: Bookmark[]) {
        await store.reorderBookmarks(value);
    },
});

const summary = computed((): [string, string][] => {
    return filter.value === 'daily' ? dailySummaryByProjects.value : weeklySummaryByProjects.value;
});

function onAddPriority() {
    addPriority(priorityModel.value);
    priorityModel.value = '';
}

function onAddBookmark() {
    addBookmark(bookmarkModel.value);
    bookmarkModel.value.name = '';
    bookmarkModel.value.url = '';
    isCreating.value = false;
}

function cancel() {
    bookmarkModel.value.name = '';
    bookmarkModel.value.url = '';
    isCreating.value = false;
}

function onClickOutside() {
    menuOpened.value = false;
}
</script>

<style lang="postcss" scoped>
.sortable-ghost {
    opacity: 0;
}
</style>
