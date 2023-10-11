<template>
    <header class="fixed top-0 z-40 w-full border-b bg-white dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-16 items-center justify-between px-4 lg:px-8">
            <button
                type="button"
                class="-m-2 flex rounded p-2 text-2xl font-black ring-primary-200 focus:outline-none focus:ring dark:ring-gray-600"
                @click="selectedDay = $moment().format('YYYY-MM-DD')"
            >
                <Logo />
            </button>
            <div class="relative flex items-center gap-1 sm:gap-2">
                <button
                    type="button"
                    class="inline-flex h-10 flex-shrink-0 items-center justify-center gap-1 rounded bg-primary-500 px-2 font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus:ring active:bg-primary-600 dark:text-gray-800 dark:ring-gray-600 md:px-3"
                    @click.stop="is_summary_open = !is_summary_open"
                >
                    <IClock class="h-5" />
                    <span class="text-xl font-bold">{{ weekRemaining }}</span>
                </button>
                <WeekSummary v-model:is_open="is_summary_open" />

                <button
                    type="button"
                    class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary-500 bg-cover font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus:ring active:bg-primary-600 dark:text-gray-800 dark:ring-gray-600"
                    :style="{ backgroundImage: `url('${user?.photoURL}')` }"
                    @click.stop="is_user_menu_open = !is_user_menu_open"
                >
                    <IUser v-if="!user?.photoURL" class="h-6" />
                </button>
                <UserMenu v-model:is_open="is_user_menu_open" />

                <button
                    type="button"
                    class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary-500 font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus:ring active:bg-primary-600 dark:text-gray-800 dark:ring-gray-600 xl:hidden"
                    @click.stop="menuOpened = !menuOpened"
                >
                    <IHamburger v-if="!menuOpened" class="h-4 w-4" />
                    <IClose v-else class="h-6 w-6" />
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

import { useIndexStore } from '@/stores/index';
import { storeToRefs } from 'pinia';

const user = useCurrentUser();
const store = useIndexStore();
const { weekRemaining, selectedDay, menuOpened } = storeToRefs(store);

const is_summary_open = ref(false);
const is_user_menu_open = ref(false);
</script>
