<template>
    <Transition
        enter-from-class="translate-x-full"
        leave-to-class="translate-x-full"
        enter-active-class="transition duration-300"
        leave-active-class="transition duration-300"
    >
        <div
            v-if="weekSummaryByProjects && weekSummaryByProjects.length"
            v-show="menuOpened"
            class="p-4 py-6 w-full sm:w-96 border-l dark:border-gray-800 shrink-0 absolute lg:static top-16 right-0 bottom-0 bg-white dark:bg-gray-900 z-10 flex lg:!flex flex-col gap-2 shadow-lg lg:shadow-none"
            v-click-away="menuOpened ? onClickAway : () => {}"
            @click.stop
            @touchstart.stop
        >
            <div
                v-for="[project, duration] in weekSummaryByProjects"
                class="p-4 bg-gray-100 dark:bg-gray-800 rounded gap-4 w-full font-bold flex justify-between"
            >
                <span>{{ project }}</span>
                <span>{{ duration }}</span>
            </div>
        </div>
    </Transition>
</template>

<script lang="ts" setup>
import { useStore } from '@/stores/index';
import { storeToRefs } from 'pinia';

const store = useStore();
const { weekSummaryByProjects, menuOpened } = storeToRefs(store);

function onClickAway() {
    menuOpened.value = false;
}
</script>
