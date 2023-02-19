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
            <Tab title="Résumé">
                <div class="flex justify-end items-center mb-2 gap-2">
                    <span class="font-bold uppercase text-sm opacity-60 tracking-wide">Filtrer</span>
                    <select v-model="filter" class="form-control form-select form-select-bordered pr-12">
                        <option value="daily">Par jour</option>
                        <option value="weekly">Par semaine</option>
                    </select>
                </div>
                <div
                    v-for="[project, duration] in summary"
                    class="p-4 bg-gray-100 dark:bg-gray-800 rounded gap-4 w-full font-bold flex justify-between"
                >
                    <span>{{ project }}</span>
                    <span>{{ duration }}</span>
                </div>
            </Tab>
            <Tab title="Projets"></Tab>
            <Tab title="Priorités"></Tab>
        </Tabs>
    </Transition>
</template>

<script lang="ts" setup>
import IFilter from '@/assets/svg/filter.svg?component';

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { useStore } from '@/stores/index';
import { storeToRefs } from 'pinia';

const breakpoints = useBreakpoints(breakpointsTailwind);
const store = useStore();
const { weeklySummaryByProjects, dailySummaryByProjects, menuOpened, filter } = storeToRefs(store);
const isXlOrGreater = breakpoints.greater('xl');

const summary = computed((): [string, string][] => {
    return filter.value === 'daily' ? dailySummaryByProjects.value : weeklySummaryByProjects.value;
});

function onClickOutside() {
    menuOpened.value = false;
}
</script>
