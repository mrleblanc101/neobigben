<template>
    <Transition
        enter-from-class="translate-x-full"
        leave-to-class="translate-x-full"
        enter-active-class="transition duration-300"
        leave-active-class="transition duration-300"
    >
        <Tabs
            v-if="isXlOrGreater || menuOpened"
            class="fixed bottom-0 right-0 top-16 z-30 flex w-full shrink-0 flex-col border-l bg-stone-50 shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:w-[28rem] xl:shadow-none"
            v-on-click-outside.bubble="onClickOutside"
        >
            <Tab :title="$t('Résumé')">
                <div class="mb-2 flex items-center justify-end gap-2">
                    <span class="text-xs font-bold uppercase tracking-wide opacity-60">{{ $t('Filtrer') }}</span>
                    <select v-model="filter" class="form-control form-select-bordered form-select pr-12">
                        <option value="daily">{{ $t('Journée courante') }}</option>
                        <option value="weekly">{{ $t('Semaine courante') }}</option>
                    </select>
                </div>
                <template v-if="summary && summary.length">
                    <div
                        v-for="[project, duration] in summary"
                        class="flex w-full items-center justify-between gap-4 rounded bg-stone-100 p-4 font-bold dark:bg-gray-800"
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
                <div class="mb-2 flex items-center justify-end gap-2">
                    <span class="text-xs font-bold uppercase tracking-wide opacity-60">{{ $t('Tri') }}</span>
                    <select v-model="sort" class="form-control form-select-bordered form-select pr-12">
                        <option value="name">{{ $t('Alphabétique') }}</option>
                        <option value="creation">{{ $t('Date de création') }}</option>
                    </select>
                </div>
                <template v-if="sortedProjects && sortedProjects.length">
                    <div
                        v-for="[project] in sortedProjects"
                        :key="project.id"
                        class="relative flex w-full items-center justify-between gap-4 rounded bg-stone-100 p-4 pr-16 dark:bg-gray-800"
                    >
                        <span class="font-bold">{{ project.name }}</span>
                        <button
                            type="button"
                            class="absolute right-2 top-1/2 inline-flex h-10 w-10 flex-shrink-0 -translate-y-1/2 items-center justify-center rounded bg-red-500 font-bold text-white shadow ring-primary-200 transition hover:bg-red-400 focus:outline-none focus:ring active:bg-red-600 dark:text-gray-800 dark:ring-gray-600"
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
            <Tab :title="$t('Priorités')">
                <div class="mb-2 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        class="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded bg-primary-500 px-3 text-sm font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus:ring active:bg-primary-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-900 dark:ring-gray-600"
                        @click="deleteCompletedPriorities"
                    >
                        {{ $t('Cleanup') }}
                        <IClear class="h-6 w-6" />
                    </button>
                </div>
                <draggable item-key="name" v-model="priorities" handle=".handle" class="flex flex-col gap-2">
                    <div v-for="(priority, index) in priorities" class="flex items-center gap-2">
                        <label class="relative flex w-full items-center gap-2">
                            <input
                                type="checkbox"
                                v-model="priority.completed"
                                class="form-control form-input-bordered form-input h-6 w-6 rounded-full p-0 text-primary-500 disabled:opacity-30 dark:text-primary-500 dark:checked:bg-primary-500"
                            />
                            <div
                                class="relative flex w-full items-center justify-between gap-4 rounded bg-stone-100 p-4 pr-16 dark:bg-gray-800"
                            >
                                <span class="font-bold">{{ index + 1 }}. {{ priority.name }}</span>
                            </div>
                            <button
                                type="button"
                                class="absolute right-2 top-1/2 inline-flex h-10 w-10 flex-shrink-0 -translate-y-1/2 items-center justify-center rounded bg-red-500 font-bold text-white shadow ring-primary-200 transition hover:bg-red-400 focus:outline-none focus:ring active:bg-red-600 dark:text-gray-800 dark:ring-gray-600"
                                @click="deletePriority(priority)"
                            >
                                <IDelete class="h-5" />
                            </button>
                        </label>
                        <div
                            class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded font-bold text-gray-400 ring-primary-200 transition hover:text-primary-400 focus:outline-none focus:ring active:text-primary-400 dark:ring-gray-600"
                        >
                            <IHandle class="handle h-5 w-5 shrink-0 cursor-move" />
                        </div>
                    </div>
                </draggable>
                <form @submit.prevent="onAddPriority" class="flex gap-2">
                    <div class="flex w-full items-center gap-2">
                        <input
                            type="checkbox"
                            disabled
                            class="form-control form-input-bordered form-input h-6 w-6 rounded-full border-gray-400 p-0 text-primary-500 ring-primary-200 focus:outline-none focus:ring disabled:opacity-30 dark:bg-gray-800 dark:text-primary-500 dark:ring-gray-600 dark:checked:bg-primary-500"
                        />
                        <label class="flex w-full items-center gap-2">
                            <span class="sr-only">{{ $t('Priorité') }}</span>
                            <input
                                v-model="priority"
                                type="text"
                                placeholder="Ajouter une priorité"
                                class="form-control form-input-bordered form-input h-10 w-full"
                            />
                            <div
                                class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded font-bold text-gray-400 opacity-50 ring-primary-200 transition focus:outline-none focus:ring dark:ring-gray-600"
                            >
                                <IHandle class="handle h-5 w-5 shrink-0" />
                            </div>
                        </label>
                    </div>
                </form>
            </Tab>
        </Tabs>
    </Transition>
</template>

<script lang="ts" setup>
import IDelete from '@/assets/svg/delete.svg?component';
import IHandle from '@/assets/svg/hamburger.svg?component';
import IClear from '@/assets/svg/clear.svg?component';
import { VueDraggableNext as draggable } from 'vue-draggable-next';

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { useIndexStore } from '@/stores/index';
import { storeToRefs } from 'pinia';

const breakpoints = useBreakpoints(breakpointsTailwind);
const store = useIndexStore();

const { weeklySummaryByProjects, dailySummaryByProjects, menuOpened, filter, sort, sortedProjects, priorities } =
    storeToRefs(store);
const { deleteProject, deletePriority, deleteCompletedPriorities, addPriority } = store;
const isXlOrGreater = breakpoints.greaterOrEqual('xl');

const priority = ref('');

const summary = computed((): [string, string][] => {
    return filter.value === 'daily' ? dailySummaryByProjects.value : weeklySummaryByProjects.value;
});

function onAddPriority() {
    addPriority(priority.value);
    priority.value = '';
}

function onClickOutside() {
    menuOpened.value = false;
}
</script>
