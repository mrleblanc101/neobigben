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
            v-on-click-outside.bubble="onClickOutside"
            class="absolute right-0 top-full flex w-64 min-w-full translate-y-2 flex-col gap-6 rounded border bg-stone-50 p-4 dark:border-slate-800 dark:bg-slate-900"
        >
            <div class="flex flex-col gap-2">
                <component
                    :is="!is_editing ? 'div' : 'form'"
                    class="flex items-end justify-between gap-2 border-b pb-2 dark:border-slate-800"
                    @submit.prevent="onSave"
                >
                    <div>
                        <div class="text-xs font-bold uppercase opacity-80">{{ $t('Mon objectif') }}</div>
                        <div v-if="!is_editing" class="mt-1 block text-3xl font-bold tabular-nums">
                            {{ user?.weekly_target }}
                        </div>
                        <TimeInput v-else v-model="target" class="mt-1" mask="99:99" />
                    </div>
                    <button
                        v-if="!is_editing"
                        type="button"
                        class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary-500 font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus-visible:ring active:bg-primary-600 dark:text-slate-800 dark:ring-slate-600"
                        @click="onEdit"
                    >
                        <IEdit class="h-5" />
                    </button>
                    <button
                        v-else
                        type="submit"
                        class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary-500 font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus-visible:ring active:bg-primary-600 dark:text-slate-800 dark:ring-slate-600"
                    >
                        <ISave class="h-5" />
                    </button>
                </component>
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
                <div class="mt-2 flex items-end justify-between gap-8 border-t pt-2 dark:border-slate-800">
                    <div class="font-bold uppercase">{{ $t('Total') }}</div>
                    <div class="font-bold tabular-nums">
                        {{ weekTotal }}
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script lang="ts" setup>
import ISave from '@/assets/svg/save.svg?component';
import IEdit from '@/assets/svg/edit.svg?component';

import { useIndexStore } from '@/stores/index';
import { storeToRefs } from 'pinia';

withDefaults(
    defineProps<{
        is_open: boolean;
    }>(),
    {
        is_open: false,
    },
);
const emit = defineEmits(['update:is_open']);
const store = useIndexStore();
const route = useRoute();

const { weekSummaryColors, updateWeekTarget } = store;
const { weekSummary, user, weekTotal } = storeToRefs(store);

const is_editing = ref(false);
const target = ref('');

watch(
    () => route.name,
    () => {
        emit('update:is_open', false);
    },
);
function onEdit() {
    (document.activeElement as HTMLElement)?.blur();
    is_editing.value = true;
    target.value = user.value?.weekly_target || '';
}
async function onSave() {
    await updateWeekTarget(target.value);
    is_editing.value = false;
}
function onClickOutside() {
    emit('update:is_open', false);
}
</script>
