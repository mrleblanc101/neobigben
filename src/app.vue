<template>
    <NuxtLayout>
        <div class="flex justify-center min-h-full grow">
            <div class="px-4 lg:px-8 py-6 flex mx-auto flex-col items-center max-w-5xl w-full">
                <div class="flex gap-2 justify-between w-full min-w-0 mb-4">
                    <button
                        type="button"
                        class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-800 inline-flex items-center justify-center font-bold h-10 w-10 text-sm"
                        @click="changeDay('prev')"
                    >
                        <IArrowLeft class="h-3" />
                    </button>
                    <label
                        class="relative rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 leading-10 px-5 cursor-pointer font-medium text-ellipsis overflow-hidden whitespace-nowrap shrink text-center min-w-0"
                    >
                        <span class="capitalize">{{ $moment(selectedDay).format('dddd') }}, </span>
                        <span>{{ $moment(selectedDay).format('LL') }}</span>
                        <input
                            class="sr-only bottom-0 left-0"
                            type="date"
                            v-model="selectedDay"
                            onfocus="this.showPicker()"
                        />
                    </label>
                    <button
                        type="button"
                        class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-800 inline-flex items-center justify-center font-bold h-10 w-10 text-sm"
                        @click="changeDay('next')"
                    >
                        <IArrowRight class="h-3" />
                    </button>
                </div>
                <div class="flex flex-col items-center w-full gap-2 mx-auto">
                    <TimeEntry v-for="(entry, index) in todaysEntries" :key="entry.id" :entry="entry" />
                    <TimeEntry :key="key" />
                </div>
            </div>
            <Transition
                enter-from-class="translate-x-full"
                leave-to-class="translate-x-full"
                enter-active-class="transition duration-300"
                leave-active-class="transition duration-300"
            >
                <div
                    v-if="weekSummaryByProjects && weekSummaryByProjects.length"
                    v-show="menuOpened"
                    class="p-4 py-6 w-96 border-l dark:border-gray-800 shrink-0 absolute lg:static top-16 right-0 bottom-0 bg-white dark:bg-gray-900 z-10 flex lg:!flex flex-col gap-2 shadow-lg lg:shadow-none"
                    v-click-away="menuOpened ? onClickAway : () => {}"
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
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '@/stores/index';
import { storeToRefs } from 'pinia';

import IArrowLeft from '@/assets/svg/arrow-left.svg?component';
import IArrowRight from '@/assets/svg/arrow-right.svg?component';

const store = useStore();
const { todaysEntries, selectedDay, weekSummaryByProjects, menuOpened } = storeToRefs(store);

useHead({
    title: 'NeoBigben',
    link: [
        {
            rel: 'icon',
            href: '/favicon.svg',
            type: 'image/svg+xml',
        },
    ],
});

const key = ref(uuidv4());

watch(todaysEntries, () => {
    key.value = uuidv4();
});

function changeDay(operation: 'next' | 'prev') {
    const { $moment } = useNuxtApp();

    if (operation === 'prev') {
        selectedDay.value = $moment(selectedDay.value).subtract(1, 'day').format('YYYY-MM-DD');
    }
    if (operation === 'next') {
        selectedDay.value = $moment(selectedDay.value).add(1, 'day').format('YYYY-MM-DD');
    }
}

function onClickAway() {
    menuOpened.value = false;
}
</script>
