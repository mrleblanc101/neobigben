<template>
    <div class="sticky top-16 z-20 -mt-3 flex w-full min-w-0 justify-between gap-2 bg-stone-50 py-3 dark:bg-slate-900">
        <button
            type="button"
            class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary-500 font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus-visible:ring active:bg-primary-600 dark:text-slate-800 dark:ring-slate-600"
            @click="changeDay('prev')"
        >
            <IArrowLeft class="h-3" />
        </button>
        <label
            class="relative min-w-0 shrink cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded border px-5 text-center font-medium leading-10 ring-primary-200 transition hover:bg-white focus:outline-none focus-visible:ring dark:border-slate-800 dark:ring-slate-600 dark:hover:bg-slate-800"
            tabindex="0"
        >
            <span class="capitalize">{{ $moment(selectedDay).format('dddd') }}, </span>
            <span :key="$i18n.locale">{{ $moment(selectedDay).format('LL') }}</span>
            <input
                v-model="selectedDay"
                class="sr-only bottom-0 left-0"
                type="date"
                tabindex="-1"
                onfocus="this.showPicker()"
            />
        </label>
        <button
            type="button"
            class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary-500 font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus-visible:ring active:bg-primary-600 dark:text-slate-800 dark:ring-slate-600"
            @click="changeDay('next')"
        >
            <IArrowRight class="h-3" />
        </button>
    </div>
</template>

<script lang="ts" setup>
import IArrowLeft from '@/assets/svg/arrow-left.svg?component';
import IArrowRight from '@/assets/svg/arrow-right.svg?component';

import { useIndexStore } from '@/stores/index';
import { storeToRefs } from 'pinia';

const store = useIndexStore();
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
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement!.tagName)) return;
    if (e.key === 'ArrowLeft') changeDay('prev');
    if (e.key === 'ArrowRight') changeDay('next');
});
</script>
