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
                    v-if="user"
                    type="button"
                    class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-800 inline-flex items-center justify-center font-bold h-10 px-2 md:px-3 gap-1 transition"
                    @click.stop="is_summary_open = !is_summary_open"
                >
                    <IClock class="h-5" />
                    <span class="font-bold text-xl">{{ weekRemaining }}</span>
                </button>
                <WeekSummary v-model:is_open="is_summary_open" />

                <button
                    v-if="user"
                    type="button"
                    class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-800 inline-flex items-center justify-center font-bold h-10 w-10 transition bg-cover"
                    :style="{ backgroundImage: `url('${user.photoURL}')` }"
                    @click.stop="is_user_menu_open = !is_user_menu_open"
                >
                    <IUser v-if="!user.photoURL" class="h-6" />
                </button>
                <UserMenu v-model:is_open="is_user_menu_open" />

                <button
                    type="button"
                    class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-800 items-center justify-center font-bold h-10 w-10 inline-flex xl:hidden transition"
                    @click.stop="menuOpened = !menuOpened"
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
import IUser from '@/assets/svg/user.svg?component';

import { useStore } from '@/stores/index';
import { storeToRefs } from 'pinia';

const store = useStore();

const user = useCurrentUser();
const { weekRemaining, selectedDay, menuOpened } = storeToRefs(store);

const is_summary_open = ref(false);
const is_user_menu_open = ref(false);
</script>
