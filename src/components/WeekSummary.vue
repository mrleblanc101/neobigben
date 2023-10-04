<template>
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
            class="absolute right-0 top-full flex w-64 min-w-full translate-y-2 flex-col gap-6 rounded border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            v-on-click-outside.bubble="onClickOutside"
        >
            <div class="flex flex-col gap-2">
                <div class="flex items-end justify-between border-b pb-2 dark:border-gray-800">
                    <div>
                        <div class="text-xs font-bold uppercase opacity-80">{{ $t('Mon objectif') }}</div>
                        <div v-if="!is_editing" class="mt-1 block text-3xl font-bold tabular-nums">
                            {{ weekObjective }}
                        </div>
                        <TimeInput v-else class="mt-1" v-model="objective" mask="99:99" />
                    </div>
                    <button
                        v-if="!is_editing"
                        type="button"
                        class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary-500 font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus:ring active:bg-primary-600 dark:text-gray-800 dark:ring-gray-600"
                        @click="is_editing = true"
                    >
                        <IEdit class="h-5" />
                    </button>
                    <button
                        v-else
                        type="button"
                        class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary-500 font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus:ring active:bg-primary-600 dark:text-gray-800 dark:ring-gray-600"
                        @click="onSave"
                    >
                        <ISave class="h-5" />
                    </button>
                </div>
                <div class="flex flex-col gap-2">
                    <div
                        v-for="(day, index) in Object.values(weekSummary)"
                        :key="index"
                        class="group flex items-end justify-between gap-8"
                    >
                        <div
                            class="text-xs font-bold uppercase group-first:opacity-70 group-last:opacity-70 group-first:dark:opacity-30 group-last:dark:opacity-30"
                        >
                            {{ $moment().day(index).format('dddd') }}
                        </div>
                        <div class="font-bold tabular-nums" :class="weekSummaryColors(day)">
                            {{ day }}
                        </div>
                    </div>
                </div>
                <div class="mt-2 flex items-end justify-between gap-8 border-t pt-2 dark:border-gray-800">
                    <div class="font-bold uppercase">{{ $t('Total') }}</div>
                    <div class="font-bold tabular-nums">
                        {{ weekTotal }}
                    </div>
                </div>
            </div>
            <button
                class="inline-flex h-9 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded bg-primary-500 px-3 py-2 text-sm font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus:ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-900 dark:ring-gray-600"
                type="button"
                @click="onDownload"
            >
                {{ $t('Télécharger') }}
                <IDownload class="w-5 shrink-0" />
            </button>
        </div>
    </Transition>
</template>

<script lang="ts" setup>
import ISave from '@/assets/svg/save.svg?component';
import IEdit from '@/assets/svg/edit.svg?component';
import IDownload from '@/assets/svg/download.svg?component';
import ISignOut from '@/assets/svg/signout.svg?component';

import { useStore } from '@/stores/index';
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore();
const { logout } = auth;
const user = useCurrentUser();

const store = useStore();
const route = useRoute();

const { weekSummaryColors, downloadAndReset } = store;
const { weekSummary, weekObjective, weekTotal } = storeToRefs(store);

const is_editing = ref(false);
const objective = ref(weekObjective.value);

const props = withDefaults(
    defineProps<{
        is_open: boolean;
    }>(),
    {
        is_open: false,
    },
);
const emit = defineEmits(['update:is_open']);

watch(
    () => route.name,
    () => {
        emit('update:is_open', false);
    },
);
function onSave() {
    is_editing.value = false;
    weekObjective.value = objective.value;
}
function onDownload() {
    emit('update:is_open', false);
    downloadAndReset();
}
function onClickOutside() {
    emit('update:is_open', false);
}
</script>
