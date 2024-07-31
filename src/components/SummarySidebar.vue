<template>
    <Transition
        enter-from-class="translate-x-full"
        leave-to-class="translate-x-full"
        enter-active-class="transition duration-300"
        leave-active-class="transition duration-300"
    >
        <Tabs
            v-if="isXlOrGreater || menuOpened"
            class="fixed bottom-0 right-0 top-16 z-30 flex w-full shrink-0 flex-col border-l bg-stone-50 shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:w-[28rem] xl:shadow-none"
            v-on-click-outside.bubble="onClickOutside"
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
                        class="flex w-full items-center justify-between gap-4 rounded border bg-stone-100 p-4 font-bold dark:border-slate-700 dark:bg-slate-800"
                    >
                        <span>{{ project }}</span>
                        <span>{{ duration }}</span>
                    </div>
                </template>
                <div
                    class="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center leading-tight opacity-60"
                    v-else
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
                        <button
                            type="button"
                            class="absolute right-2 top-1/2 inline-flex h-10 w-10 flex-shrink-0 -translate-y-1/2 items-center justify-center rounded bg-red-500 font-bold text-white shadow ring-primary-200 transition hover:bg-red-400 focus:outline-none focus:ring active:bg-red-600 dark:text-slate-800 dark:ring-slate-600"
                            @click="deleteProject(project)"
                        >
                            <IDelete class="h-5" />
                        </button>
                    </div>
                </template>
                <div
                    v-else
                    class="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center leading-tight opacity-60"
                >
                    {{ $t("Aucune donnée pour l'instant") }}
                </div>
            </Tab>
            <Tab :title="$t('Raccourcis')">
                <div v-if="!isCreating" class="mb-2 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        class="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded bg-primary-500 px-3 text-sm font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus:ring active:bg-primary-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-900 dark:ring-slate-600"
                        @click="isCreating = !isCreating"
                    >
                        {{ $t('Ajouter') }}
                    </button>
                </div>
                <draggable
                    v-if="bookmarks && bookmarks.length && !isCreating"
                    item-key="name"
                    v-model="bookmarks"
                    handle=".handle"
                    class="flex flex-col gap-2"
                >
                    <div v-for="bookmark in bookmarks" class="flex items-center gap-2">
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
                            <button
                                type="button"
                                class="absolute right-2 top-1/2 inline-flex h-10 w-10 flex-shrink-0 -translate-y-1/2 items-center justify-center rounded bg-red-500 font-bold text-white shadow ring-primary-200 transition hover:bg-red-400 focus:outline-none focus:ring active:bg-red-600 dark:text-slate-800 dark:ring-slate-600"
                                @click="deleteBookmark(bookmark)"
                            >
                                <IDelete class="h-5" />
                            </button>
                        </div>
                        <div
                            class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded font-bold text-slate-400 ring-primary-200 transition hover:text-primary-400 focus:outline-none focus:ring active:text-primary-400 dark:ring-slate-600"
                        >
                            <IHandle class="handle h-5 w-5 shrink-0 cursor-move" />
                        </div>
                    </div>
                </draggable>
                <div
                    class="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center leading-tight opacity-60"
                    v-else-if="!isCreating"
                >
                    {{ $t("Aucune donnée pour l'instant") }}
                </div>
                <form
                    v-if="isCreating"
                    @submit.prevent="onAddBookmark"
                    class="flex flex-col gap-2 rounded border bg-stone-100 p-4 dark:border-slate-700 dark:bg-slate-800"
                >
                    <div>
                        <label class="text-xs font-medium uppercase opacity-60">{{ $t('Nom') }}</label>
                        <input
                            v-model="bookmark.name"
                            type="text"
                            :placeholder="$t('EOS (TownHall, pause-café, etc.)')"
                            class="form-control form-input-bordered form-input h-10 w-full"
                        />
                    </div>
                    <div>
                        <label class="text-xs font-medium uppercase opacity-60">{{ $t('Url') }}</label>
                        <input
                            v-model="bookmark.url"
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
                            class="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded bg-primary-500 px-3 text-sm font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus:ring active:bg-primary-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-900 dark:ring-slate-600"
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
import IDelete from '@/assets/svg/delete.svg?component';
import IHandle from '@/assets/svg/hamburger.svg?component';
import { VueDraggableNext as draggable } from 'vue-draggable-next';

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { useIndexStore } from '@/stores/index';
import { storeToRefs } from 'pinia';

const breakpoints = useBreakpoints(breakpointsTailwind);
const store = useIndexStore();

const { weeklySummaryByProjects, dailySummaryByProjects, menuOpened, filter, sort, sortedProjects, bookmarks } =
    storeToRefs(store);
const { deleteProject, deleteBookmark, addBookmark } = store;
const isXlOrGreater = breakpoints.greaterOrEqual('xl');

const bookmark = ref({
    name: '',
    url: '',
});
const isCreating = ref(false);

const summary = computed((): [string, string][] => {
    return filter.value === 'daily' ? dailySummaryByProjects.value : weeklySummaryByProjects.value;
});

function onAddBookmark() {
    addBookmark(bookmark.value);
    bookmark.value.name = '';
    bookmark.value.url = '';
    isCreating.value = false;
}

function cancel() {
    bookmark.value.name = '';
    bookmark.value.url = '';
    isCreating.value = false;
}

function onClickOutside() {
    menuOpened.value = false;
}
</script>
