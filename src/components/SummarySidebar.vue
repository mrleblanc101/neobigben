<template>
    <Transition
        enter-from-class="translate-x-full"
        leave-to-class="translate-x-full"
        enter-active-class="transition duration-300"
        leave-active-class="transition duration-300"
    >
        <Tabs
            v-if="isXlOrGreater || menuOpened"
            class="w-full sm:w-[28rem] border-l dark:border-gray-800 shrink-0 fixed top-16 right-0 bottom-0 bg-white dark:bg-gray-900 z-30 shadow-lg xl:shadow-none flex flex-col"
            v-on-click-outside.bubble="onClickOutside"
        >
            <Tab :title="$t('Résumé')">
                <div class="flex justify-end items-center mb-2 gap-2">
                    <span class="font-bold uppercase text-xs opacity-60 tracking-wide">{{ $t('Filtrer') }}</span>
                    <select v-model="filter" class="form-control form-select form-select-bordered pr-12">
                        <option value="daily">{{ $t('Journée courante') }}</option>
                        <option value="weekly">{{ $t('Semaine courante') }}</option>
                    </select>
                </div>
                <div
                    v-if="summary && summary.length"
                    v-for="[project, duration] in summary"
                    class="p-4 bg-gray-100 dark:bg-gray-800 rounded gap-4 w-full font-bold flex items-center justify-between"
                >
                    <span>{{ project }}</span>
                    <span>{{ duration }}</span>
                </div>
                <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-60 w-full leading-tight"
                    v-else
                >
                    {{ $t("Aucune donnée pour l'instant") }}
                </div>
            </Tab>
            <Tab :title="$t('Projets')">
                <div class="flex justify-end items-center mb-2 gap-2">
                    <span class="font-bold uppercase text-xs opacity-60 tracking-wide">{{ $t('Tri') }}</span>
                    <select v-model="sort" class="form-control form-select form-select-bordered pr-12">
                        <option value="entries">{{ $t("Nb. d'entrées") }}</option>
                        <option value="name">{{ $t('Alphabétique') }}</option>
                        <option value="creation">{{ $t('Date de création') }}</option>
                    </select>
                </div>

                <div
                    v-if="sortedProjects && sortedProjects.length"
                    v-for="[project, entries] in sortedProjects"
                    :key="project.id"
                    class="p-4 bg-gray-100 dark:bg-gray-800 rounded gap-4 w-full flex items-center justify-between relative pr-16"
                >
                    <span class="font-bold">{{ project.name }}</span>
                    <span class="text-xs font-bold opacity-60 shrink-0">
                        {{ $t('Aucune entrée | {n} entrée | {n} entrées', entries) }}
                    </span>
                    <button
                        type="button"
                        class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-red-500 hover:bg-red-400 active:bg-red-600 text-white dark:text-gray-800 inline-flex items-center justify-center font-bold h-10 w-10 transition absolute right-2 top-1/2 -translate-y-1/2"
                        @click="deleteProject(project)"
                    >
                        <IDelete class="h-5" />
                    </button>
                </div>
                <div
                    v-else
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-60 w-full leading-tight"
                >
                    {{ $t("Aucune donnée pour l'instant") }}
                </div>
            </Tab>
            <Tab :title="$t('Priorités')">
                <div class="flex justify-end items-center mb-2 gap-2">
                    <button
                        type="button"
                        class="shadow bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-900 cursor-pointer rounded text-sm font-bold focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 inline-flex items-center justify-center h-9 px-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none gap-2 transition"
                        @click="deleteCompletedPriorities"
                    >
                        {{ $t('Cleanup') }}
                        <IClear class="h-6 w-6" />
                    </button>
                </div>
                <draggable item-key="name" v-model="priorities" handle=".handle" class="flex flex-col gap-2">
                    <div v-for="(priority, index) in priorities" class="flex gap-2 items-center">
                        <label class="flex gap-2 items-center w-full relative">
                            <input
                                type="checkbox"
                                v-model="priority.completed"
                                class="form-control form-input form-input-bordered p-0 w-6 h-6 text-primary-500 dark:text-primary-500 dark:checked:bg-primary-500 rounded-full disabled:opacity-30"
                            />
                            <div
                                class="p-4 bg-gray-100 dark:bg-gray-800 rounded gap-4 w-full flex items-center justify-between relative pr-16"
                            >
                                <span class="font-bold">{{ index + 1 }}. {{ priority.name }}</span>
                            </div>
                            <button
                                type="button"
                                class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-red-500 hover:bg-red-400 active:bg-red-600 text-white dark:text-gray-800 inline-flex items-center justify-center font-bold h-10 w-10 transition absolute right-2 top-1/2 -translate-y-1/2"
                                @click="deletePriority(priority)"
                            >
                                <IDelete class="h-5" />
                            </button>
                        </label>
                        <div
                            class="flex-shrink-0 rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring inline-flex items-center justify-center font-bold h-10 w-10 transition text-gray-400 hover:text-primary-400 active:text-primary-400"
                        >
                            <IHandle class="w-5 h-5 cursor-move shrink-0 handle" />
                        </div>
                    </div>
                </draggable>
                <form @submit.prevent="onAddPriority" class="flex gap-2">
                    <div class="flex gap-2 items-center w-full">
                        <input
                            type="checkbox"
                            disabled
                            class="form-control form-input form-input-bordered p-0 w-6 h-6 dark:bg-gray-800 text-primary-500 dark:text-primary-500 dark:checked:bg-primary-500 rounded-full border-gray-400 disabled:opacity-30 focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600"
                        />
                        <label class="flex gap-2 items-center w-full">
                            <span class="sr-only">{{ $t('Priorité') }}</span>
                            <input
                                v-model="priority"
                                type="text"
                                placeholder="Ajouter une priorité"
                                class="form-control form-input form-input-bordered h-10 w-full"
                            />
                            <div
                                class="flex-shrink-0 rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring inline-flex items-center justify-center font-bold h-10 w-10 transition text-gray-400 opacity-50"
                            >
                                <IHandle class="w-5 h-5 shrink-0 handle" />
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
import { useStore } from '@/stores/index';
import { storeToRefs } from 'pinia';

const breakpoints = useBreakpoints(breakpointsTailwind);
const store = useStore();

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
