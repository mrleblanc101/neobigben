<template>
    <NuxtLayout>
        <div class="flex flex-col items-center max-w-5xl gap-4 mx-auto">
            <div class="flex justify-between w-full">
                <button
                    type="button"
                    class="flex-shrink-0 rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 inline-flex items-center justify-center h-10 w-10"
                    @click="changeDay('prev')"
                >
                    <IArrowLeft class="h-3" />
                </button>
                <label
                    class="relative flex-shrink-0 rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 inline-flex items-center justify-center h-10 px-5 cursor-pointer font-medium"
                >
                    {{ dateLabel }}
                    <input
                        class="sr-only form-input bottom-0 left-0"
                        type="date"
                        v-model="selectedDay"
                        onfocus="this.showPicker()"
                    />
                </label>
                <button
                    type="button"
                    class="flex-shrink-0 rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 inline-flex items-center justify-center h-10 w-10"
                    @click="changeDay('next')"
                >
                    <IArrowRight class="h-3" />
                </button>
            </div>
            <div class="w-full flex flex-col items-center max-w-5xl gap-4 mx-auto">
                <TimeEntry v-for="(entry, index) in todaysEntries" :key="entry.id" :entry="entry" />
            </div>
            <TimeEntry :key="key" />
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
const { todaysEntries, selectedDay } = storeToRefs(store);

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

const dateLabel = computed(() => {
    const { $moment } = useNuxtApp();
    const string = $moment(selectedDay.value).format('dddd, LL');
    return string[0].toUpperCase() + string.slice(1);
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
</script>
