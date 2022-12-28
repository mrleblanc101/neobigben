<template>
    <header class="sticky top-0 z-40 w-full border-b dark:border-gray-800 bg-white dark:bg-gray-900">
        <div class="flex items-center justify-between h-16 px-4 lg:px-8">
            <button type="button" class="text-2xl font-black" @click="viewedDay = $moment().format('YYYY-MM-DD')">
                NeoBigben
            </button>
            <div class="flex items-center gap-4">
                <div class="relative">
                    <button
                        type="button"
                        class="flex gap-2 items-center px-4 h-10 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800 dark:hover:bg-gray-800"
                        @click="is_open = !is_open"
                    >
                        <IClock class="h-5" />
                        <span class="font-bold text-xl">{{ remainingTime }}</span>
                    </button>
                    <div
                        v-if="is_open"
                        class="absolute rounded top-full right-0 p-4 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 border min-w-full flex flex-col gap-4 translate-y-2"
                    >
                        <div class="flex flex-col gap-2">
                            <div
                                v-for="(day, index) in weeklySummary"
                                :key="index"
                                class="flex items-end justify-between gap-8"
                            >
                                <div class="font-medium text-xs opacity-60 uppercase">
                                    {{ $moment().day(index).format('dddd') }}
                                </div>
                                <div class="font-bold tabular-nums">{{ day }}</div>
                            </div>
                        </div>
                        <button
                            class="shadow bg-primary-500 hover:bg-primary-400 text-white dark:text-gray-900 cursor-pointer rounded text-sm font-bold focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 inline-flex items-center justify-center py-2 px-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none gap-2 whitespace-nowrap h-9"
                            type="button"
                        >
                            <!-- TODO: Download and reset -->
                            Télécharger & réinitialiser
                            <IDownload class="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <ColorSwitcher />
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>
import IDownload from '@/assets/svg/download.svg?component';
import IClock from '@/assets/svg/clock.svg?component';
import { storeToRefs } from 'pinia';
import { useStore } from '@/stores/index';

const store = useStore();

const { remainingTime, weeklySummary, viewedDay } = storeToRefs(store);

const is_open = ref(false);
</script>
