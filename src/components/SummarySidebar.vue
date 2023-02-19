<template>
    <Transition
        enter-from-class="translate-x-full"
        leave-to-class="translate-x-full"
        enter-active-class="transition duration-300"
        leave-active-class="transition duration-300"
    >
        <Tabs
            v-if="isXlOrGreater || menuOpened"
            class="w-full sm:w-[28rem] border-l dark:border-gray-800 shrink-0 fixed top-16 right-0 bottom-0 bg-white dark:bg-gray-900 z-10 shadow-lg xl:shadow-none flex flex-col"
            v-on-click-outside.bubble="onClickOutside"
        >
            <Tab :title="$t('Résumé')">
                <div class="flex justify-end items-center mb-2 gap-2">
                    <span class="font-bold uppercase text-xs opacity-60 tracking-wide">Filtrer</span>
                    <select v-model="filter" class="form-control form-select form-select-bordered pr-12">
                        <option value="daily">{{ $t('Par jour') }}</option>
                        <option value="weekly">{{ $t('Par semaine') }}</option>
                    </select>
                </div>
                <div
                    v-if="summary && summary.length"
                    v-for="[project, duration] in summary"
                    class="px-4 py-5 bg-gray-100 dark:bg-gray-800 rounded gap-4 w-full font-bold flex items-center justify-between leading-none"
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
                <!-- TODO: Add sort by A to Z and by Entries -->
                <div
                    v-if="projects && projects.length"
                    v-for="project in projects"
                    :key="project.id"
                    class="px-4 py-5 bg-gray-100 dark:bg-gray-800 rounded gap-4 w-full flex items-center justify-between relative pr-16 leading-none"
                >
                    <span class="font-bold">{{ project.name }}</span>
                    <span class="text-xs font-bold opacity-60 shrink-0">
                        <!-- TODO: Waiting for vue-i18n-next fix -->
                        {{ $t('Aucune entrée | {n} entrée | {n} entrées', projectEntriesTotal(project)) }}
                    </span>
                    <button
                        type="button"
                        class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-red-500 hover:bg-red-400 active:bg-red-600 text-white dark:text-gray-800 inline-flex items-center justify-center font-bold h-10 w-10 text-sm transition absolute right-2 top-1/2 -translate-y-1/2"
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
                <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-60 w-full leading-tight"
                >
                    {{ $t("Aucune donnée pour l'instant") }}
                </div>
            </Tab>
        </Tabs>
    </Transition>
</template>

<script lang="ts" setup>
import IDelete from '@/assets/svg/delete.svg?component';

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { useStore } from '@/stores/index';
import { storeToRefs } from 'pinia';

const breakpoints = useBreakpoints(breakpointsTailwind);
const store = useStore();
const { weeklySummaryByProjects, dailySummaryByProjects, menuOpened, filter, projects, projectEntriesTotal } =
    storeToRefs(store);
const { deleteProject } = store;
const isXlOrGreater = breakpoints.greater('xl');

const summary = computed((): [string, string][] => {
    return filter.value === 'daily' ? dailySummaryByProjects.value : weeklySummaryByProjects.value;
});

function onClickOutside() {
    menuOpened.value = false;
}
</script>
