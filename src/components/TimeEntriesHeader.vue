<template>
    <div class="flex gap-2 justify-between w-full min-w-0 mb-4">
        <button
            type="button"
            class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-800 inline-flex items-center justify-center font-bold h-10 w-10 text-sm transition"
            @click="changeDay('prev')"
        >
            <IArrowLeft class="h-3" />
        </button>
        <label
            class="relative rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 leading-10 px-5 cursor-pointer font-medium text-ellipsis overflow-hidden whitespace-nowrap shrink text-center min-w-0 transition"
            tabindex="0"
        >
            <span class="capitalize">{{ $moment(selectedDay).format('dddd') }}, </span>
            <span>{{ $moment(selectedDay).format('LL') }}</span>
            <input
                class="sr-only bottom-0 left-0"
                type="date"
                v-model="selectedDay"
                tabindex="-1"
                onfocus="this.showPicker()"
            />
        </label>
        <button
            type="button"
            class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-800 inline-flex items-center justify-center font-bold h-10 w-10 text-sm transition"
            @click="changeDay('next')"
        >
            <IArrowRight class="h-3" />
        </button>
    </div>
</template>

<script lang="ts" setup>
import IArrowLeft from '@/assets/svg/arrow-left.svg?component';
import IArrowRight from '@/assets/svg/arrow-right.svg?component';

import { useStore } from '@/stores/index';
import { storeToRefs } from 'pinia';

const store = useStore();
const { selectedDay } = storeToRefs(store);

function changeDay(operation: 'next' | 'prev') {
    const { $moment } = useNuxtApp();

    if (operation === 'prev') {
        selectedDay.value = $moment(selectedDay.value).subtract(1, 'day').format('YYYY-MM-DD');
    }
    if (operation === 'next') {
        selectedDay.value = $moment(selectedDay.value).add(1, 'day').format('YYYY-MM-DD');
    }
}

onKeyStroke(['ArrowLeft', 'ArrowRight'], (e) => {
  if(document?.activeElement?.tagName !== 'BODY') return;
  if(e.key === "ArrowLeft") changeDay('prev');
  if(e.key === "ArrowRight") changeDay('next');
}, { target: document })
</script>
