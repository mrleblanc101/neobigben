<template>
    <Transition
        enter-from-class="translate-x-full"
        leave-to-class="translate-x-full"
        enter-active-class="transition duration-300"
        leave-active-class="transition duration-300"
    >
        <Tabs
            v-if="isXlOrGreater || menuOpened"
            class="w-full sm:max-w-[28rem] border-l dark:border-gray-800 shrink-0 fixed xl:static top-16 right-0 bottom-0 bg-white dark:bg-gray-900 z-10 shadow-lg xl:shadow-none"
            v-on-click-outside.bubble="onClickOutside"
        >
            <Tab title="Résumé">
                <div class="flex justify-end items-center mb-4">
                    <!-- TODO: Icon filtre -->
                    <select class="w-1/2 form-control form-select form-select-bordered">
                        <option>Journalier</option>
                        <option>Hebdomadaire</option>
                    </select>
                </div>
                <div
                    v-for="[project, duration] in weekSummaryByProjects"
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
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { useStore } from '@/stores/index';
import { storeToRefs } from 'pinia';

const breakpoints = useBreakpoints(breakpointsTailwind);
const store = useStore();
const { weekSummaryByProjects, menuOpened } = storeToRefs(store);
const isXlOrGreater = breakpoints.greater('xl');

function onClickOutside() {
    menuOpened.value = false;
}
</script>
