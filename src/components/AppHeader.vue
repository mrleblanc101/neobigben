<template>
    <header class="fixed top-0 z-40 w-full border-b dark:border-gray-800 bg-white dark:bg-gray-900">
        <div class="flex items-center justify-between h-16 px-4 lg:px-8">
            <button
                type="button"
                class="flex rounded p-2 -m-2 text-2xl font-black focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring"
                @click="selectedDay = $moment().format('YYYY-MM-DD')"
            >
                <Logo />
            </button>
            <div class="flex items-center gap-1 sm:gap-2 relative">
                <button
                    type="button"
                    class="flex gap-2 items-center px-2 sm:px-3 h-10 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800 dark:hover:bg-gray-800 focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring"
                    @click="is_summary_open = true"
                >
                    <IClock class="h-5" />
                    <span class="font-bold text-xl">{{ weekRemaining }}</span>
                </button>
                <WeekSummary v-model:is_open="is_summary_open" />

                <LanguageSwitcher />
                <ColorSwitcher />
                <button
                    v-if="weekSummaryByProjects && weekSummaryByProjects.length"
                    type="button"
                    class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-800 items-center justify-center font-bold h-10 w-10 text-sm inline-flex lg:hidden"
                    @click="menuOpened = !menuOpened"
                >
                    <IHamburger v-if="!menuOpened" class="w-4 h-4" />
                    <IClose v-else class="w-6 h-6" />
                </button>
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>
import IHamburger from '@/assets/svg/hamburger.svg?component';
import IClose from '@/assets/svg/close.svg?component';
import IClock from '@/assets/svg/clock.svg?component';

import { useStore } from '@/stores/index';
import { storeToRefs } from 'pinia';

const store = useStore();

const { weekRemaining, selectedDay, menuOpened, weekSummaryByProjects } = storeToRefs(store);

const is_summary_open = ref(false);
</script>
