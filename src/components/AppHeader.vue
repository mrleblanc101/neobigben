<template>
    <header class="fixed top-0 z-40 w-full border-b dark:border-gray-800 bg-white dark:bg-gray-900">
        <div class="flex items-center justify-between h-16 px-4 lg:px-8">
            <button type="button" class="text-2xl font-black" @click="selectedDay = $moment().format('YYYY-MM-DD')">
                NeoBigben
            </button>
            <div class="flex items-center gap-2 relative">
                <button
                    type="button"
                    class="flex gap-2 items-center px-3 h-10 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800 dark:hover:bg-gray-800"
                    @click="is_open = true"
                >
                    <IClock class="h-5" />
                    <span class="font-bold text-xl">{{ weekRemaining }}</span>
                </button>
                <Transition
                    enter-active-class="transition transform origin-top-right ease-out duration-200"
                    enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition transform origin-top-right ease-in duration-200"
                    leave-from-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-95"
                >
                    <div
                        v-if="is_open"
                        class="absolute rounded top-full right-0 p-4 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 border min-w-full flex flex-col gap-6 translate-y-2 w-64"
                        v-click-away="onClickAway"
                    >
                        <div class="flex flex-col gap-2">
                            <div class="border-b dark:border-gray-800 pb-2 flex justify-between items-end">
                                <div>
                                    <div class="text-xs font-bold uppercase opacity-80">Mon objectif</div>
                                    <div v-if="!is_editing" class="text-3xl mt-1 font-bold tabular-nums block">
                                        {{ weekObjective }}
                                    </div>
                                    <TimeInput v-else class="mt-1" v-model="objective" mask="99:99" />
                                </div>
                                <button
                                    v-if="!is_editing"
                                    type="button"
                                    class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-800 inline-flex items-center justify-center font-bold h-10 w-10 text-sm"
                                    @click="is_editing = true"
                                >
                                    <IEdit class="h-5" />
                                </button>
                                <button
                                    v-else
                                    type="button"
                                    class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-800 inline-flex items-center justify-center font-bold h-10 w-10 text-sm"
                                    @click="onSave"
                                >
                                    <ISave class="h-5" />
                                </button>
                            </div>
                            <div
                                v-for="(day, index) in Object.values(weekSummary)"
                                :key="index"
                                class="flex items-end justify-between gap-8"
                            >
                                <div
                                    class="text-xs font-bold uppercase"
                                    :class="{
                                        'opacity-70 dark:opacity-30': index === 0 || index === 6,
                                    }"
                                >
                                    {{ $moment().day(index).format('dddd') }}
                                </div>
                                <div class="font-bold tabular-nums" :class="weekSummaryColors(day)">
                                    {{ day }}
                                </div>
                            </div>
                            <div class="flex border-t dark:border-gray-800 items-end justify-between gap-8 pt-2 mt-2">
                                <div class="font-bold uppercase">Total</div>
                                <div class="font-bold tabular-nums">
                                    {{ weekTotal }}
                                </div>
                            </div>
                        </div>
                        <button
                            class="shadow bg-primary-500 hover:bg-primary-400 text-white dark:text-gray-900 cursor-pointer rounded text-sm font-bold focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 inline-flex items-center justify-center py-2 px-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none gap-2 whitespace-nowrap h-9"
                            type="button"
                            @click="onDownload"
                        >
                            Télécharger & réinitialiser
                            <IDownload class="h-5 w-5" />
                        </button>
                    </div>
                </Transition>

                <ColorSwitcher />
                <button
                    v-if="weekSummaryByProjects && weekSummaryByProjects.length"
                    type="button"
                    class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-800 items-center justify-center font-bold h-10 w-10 text-sm inline-flex lg:hidden"
                    @click="menuOpened = !menuOpened"
                >
                    <IHamburger class="w-4 h-4" />
                </button>
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>
import ISave from '@/assets/svg/save.svg?component';
import IEdit from '@/assets/svg/edit.svg?component';
import IHamburger from '@/assets/svg/hamburger.svg?component';
import IDownload from '@/assets/svg/download.svg?component';
import IClock from '@/assets/svg/clock.svg?component';
import { storeToRefs } from 'pinia';
import { useStore } from '@/stores/index';

const store = useStore();

const { weekSummaryColors, downloadAndReset } = store;
let { weekRemaining, weekSummary, selectedDay, weekObjective, weekTotal, menuOpened, weekSummaryByProjects } =
    storeToRefs(store);

const is_open = ref(false);
const is_editing = ref(false);
let objective = ref(weekObjective.value);

function onSave() {
    is_editing.value = false;
    weekObjective.value = objective.value;
}
function onDownload() {
    is_open.value = false;
    downloadAndReset();
}
function onClickAway() {
    console.log('on-click-away-2');

    is_open.value = false;
}
</script>
