<template>
    <form
        v-if="model.is_creating || model.is_editing"
        class="relative flex w-full flex-col gap-2 rounded border bg-stone-100 p-4 dark:border-slate-700 dark:bg-slate-800"
        :class="[
            has_overlap_previous || has_overlap_next ? 'border-red-500' : '',
            {
                'has-gap mt-10': has_gap,
            },
        ]"
        :data-gap-duration="has_gap"
        @submit.prevent="onSave"
    >
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div>
                <label>{{ $t('Début') }}<span class="text-red-500">*</span></label>
                <TimeInput v-model="model.start_time" :class="{ 'border !border-red-500': start_time_error }" />
            </div>
            <div>
                <label>{{ $t('Fin') }}<span class="text-red-500">*</span></label>
                <TimeInput v-model="model.end_time" :class="{ 'border !border-red-500': end_time_error }" />
            </div>
            <div>
                <label>{{ $t('Durée') }}<span class="text-red-500">*</span></label>
                <TimeInput
                    v-model="computedDuration"
                    class="read-only:pointer-events-none"
                    :class="{ 'border !border-red-500': duration_error }"
                    format="HH:MM"
                    :placeholder="model.is_live_clocking ? placeholder : undefined"
                    :readonly="model.is_live_clocking"
                />
            </div>
            <div>
                <label>{{ $t('Date') }}</label>
                <input
                    v-model="model.date"
                    :class="{ 'has-value': model.date }"
                    type="date"
                    class="form-control form-input-bordered form-input w-full"
                />
            </div>
        </div>
        <div>
            <label>{{ $t('Projet') }}<span class="text-red-500">*</span></label>
            <Multiselect
                v-model="model.project"
                :options="projects"
                track-by="name"
                label="name"
                value-prop="id"
                :object="true"
                :placeholder="$t('Choisir ou créer...')"
                :classes="classes"
                :append-new-option="false"
                searchable
                create-option
                @create="addProject"
            />
        </div>
        <div>
            <label>{{ $t('Description') }}</label>
            <textarea
                v-model="model.description"
                class="form-control form-input-bordered form-input block h-auto w-full py-3 [field-sizing:content]"
                rows="2"
                :placeholder="`${$t('Courte description du travail')}...`"
            ></textarea>
        </div>
        <div class="flex justify-end gap-2">
            <button
                v-if="isToday && !model.is_live_clocking && !model.end_time"
                type="button"
                class="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded bg-green-500 px-3 text-sm font-bold text-white shadow ring-primary-200 transition hover:bg-green-400 focus:outline-none focus-visible:ring active:bg-green-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-900 dark:ring-slate-600"
                @click="start"
            >
                {{ $t('Démarrer') }}
                <IPlay class="h-3 w-4" />
            </button>
            <button
                v-else-if="isToday && model.is_live_clocking"
                type="button"
                class="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded bg-rose-500 px-3 text-sm font-bold text-white shadow ring-primary-200 transition hover:bg-rose-400 focus:outline-none focus-visible:ring active:bg-rose-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-900 dark:ring-slate-600"
                @click="stop"
            >
                {{ $t('Arrêter') }}
                <IStop class="h-3 w-4" />
            </button>
            <button
                v-else-if="model.id && model.is_creating"
                type="button"
                class="appearance-none bg-transparent px-2 text-sm font-bold text-slate-400 transition hover:text-slate-300 active:text-slate-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-400 dark:active:text-slate-600"
                @click="deleteEntry(entry)"
            >
                {{ $t('Annuler') }}
            </button>
            <button
                v-if="model.is_editing"
                type="button"
                class="appearance-none bg-transparent px-2 text-sm font-bold text-slate-400 transition hover:text-slate-300 active:text-slate-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-400 dark:active:text-slate-600"
                @click="cancel"
            >
                {{ $t('Annuler') }}
            </button>
            <button
                type="submit"
                class="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded bg-primary-500 px-3 text-sm font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus-visible:ring active:bg-primary-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-900 dark:ring-slate-600"
                :disabled="!(model.start_time && model.end_time && model.duration && model.project)"
            >
                {{ model.is_creating ? $t('Ajouter') : $t('Sauvegarder') }}
            </button>
        </div>
    </form>
    <div
        v-else
        class="relative flex w-full flex-col gap-2 rounded border bg-stone-100 p-4 dark:border-slate-700 dark:bg-slate-800"
        :class="[
            has_overlap_previous || has_overlap_next ? 'border-red-500' : '',
            {
                'has-gap mt-10': has_gap,
                'opacity-50': entry.is_synced,
            },
        ]"
        :data-gap-duration="has_gap"
    >
        <div class="flex items-start justify-between gap-2">
            <div>
                <label>{{ $t('Projet') }}</label>
                <strong class="block">{{ entry.project?.name }}</strong>
            </div>
            <div class="flex gap-2">
                <button
                    type="button"
                    class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary-500 font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus-visible:ring active:bg-primary-600 dark:text-slate-800 dark:ring-slate-600"
                    @click="toggleEntrySynced(entry)"
                >
                    <INetsuite class="h-4" />
                </button>
                <button
                    type="button"
                    class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary-500 font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus-visible:ring active:bg-primary-600 dark:text-slate-800 dark:ring-slate-600"
                    @click="toggleEditing"
                >
                    <IEdit class="h-5" />
                </button>
                <button
                    type="button"
                    class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-red-500 font-bold text-white shadow ring-primary-200 transition hover:bg-red-400 focus:outline-none focus-visible:ring active:bg-red-600 dark:text-slate-800 dark:ring-slate-600"
                    @click="deleteEntry(entry)"
                >
                    <IDelete class="h-5" />
                </button>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div>
                <label>{{ $t('Début') }}</label>
                <strong class="block" :class="{ 'text-red-500': start_time_error }">{{ entry.start_time }}</strong>
            </div>
            <div>
                <label>{{ $t('Fin') }}</label>
                <strong class="block" :class="{ 'text-red-500': end_time_error }">{{ entry.end_time }}</strong>
            </div>
            <div>
                <label>{{ $t('Durée') }}</label>
                <strong class="block" :class="{ 'text-red-500': duration_error }">{{ entry.duration }}</strong>
            </div>
            <div>
                <label>{{ $t('Date') }}</label>
                <strong class="block">{{ $moment(entry.date).format('L') }}</strong>
            </div>
        </div>
        <div v-if="entry.description">
            <label>{{ $t('Description') }}</label>
            <strong
                class="v-html block"
                v-html="
                    linkify(entry.description, {
                        defaultProtocol: 'https',
                        target: '_blank',
                        nl2br: true,
                        rel: 'noopener noreferrer',
                    })
                "
            ></strong>
        </div>
    </div>
</template>

<script lang="ts" setup>
import IPlay from '@/assets/svg/play.svg?component';
import IStop from '@/assets/svg/stop.svg?component';
import IEdit from '@/assets/svg/edit.svg?component';
import IDelete from '@/assets/svg/delete.svg?component';
import INetsuite from '@/assets/svg/netsuite.svg?component';

import linkify from 'linkify-string';
import classes from '@/utils/MultiselectClasses';
import Multiselect from '@vueform/multiselect';
import { storeToRefs } from 'pinia';
import { useIndexStore } from '@/stores/index';

const props = withDefaults(defineProps<{ entry?: Entry }>(), {
    entry: () => ({
        is_creating: true,
        is_editing: false,
        is_synced: false,
        is_live_clocking: false,
        start_time: '',
        end_time: '',
        duration: '',
        date: '',
        description: '',
        project: null,
    }),
});

const emit = defineEmits<{
    (e: 'add'): void;
}>();

const { $moment } = useNuxtApp();

const store = useIndexStore();
const { addProject, addEntry, updateEntry, deleteEntry, toggleEntrySynced } = store;
const { projects, selectedDay, todaysEntries } = storeToRefs(store);

const model = ref();

watch(
    () => props.entry,
    () => {
        model.value = Object.create(null, Object.getOwnPropertyDescriptors(props.entry));
    },
    { immediate: true },
);

const placeholder = ref('00:00:00');

const computedDate = computed(() => {
    return model.value.date || selectedDay.value;
});

const computedDuration = computed({
    get() {
        const date = !model.value.is_live_clocking ? computedDate.value : $moment().format('YYYY-MM-DD');
        const start = $moment(computedDate.value + ' ' + model.value.start_time, 'YYYY-M-D HH:mm');
        const end = (model.value.end_time !== '00:00' ? $moment(date) : $moment(date).add(1, 'day')).set({
            hours: parseInt(model.value.end_time.split(':')[0]),
            minutes: parseInt(model.value.end_time.split(':')[1]),
        });

        if (
            $moment(model.value.start_time, 'HH:mm', true).isValid() &&
            $moment(model.value.end_time, 'HH:mm', true).isValid()
        ) {
            const duration = $moment.duration(end.diff(start));
            if (duration.asMilliseconds() > 0) {
                return duration.format('HH:mm', {
                    trim: false,
                });
            }
        }
    },
    set(newValue) {
        const start = $moment(computedDate.value + ' ' + model.value.start_time, 'YYYY-M-D HH:mm');
        const end = start.add($moment.duration(newValue)).format('HH:mm');

        if ($moment(newValue, 'HH:mm', true).isValid() && $moment(model.value.start_time, 'HH:mm', true).isValid()) {
            model.value.end_time = end;
        }
    },
});

const isToday = computed(() => {
    return $moment(selectedDay.value).isSame($moment(), 'day');
});

const previousEntry = computed((): Entry | undefined => {
    if (!model.value.id) return;
    const index = todaysEntries.value.findIndex((e: Entry) => e.id === model.value.id);
    if (index === 0) return;
    return todaysEntries.value[index - 1];
});

const nextEntry = computed((): Entry | undefined => {
    if (!model.value.id) return;
    const index = todaysEntries.value.findIndex((e: Entry) => e.id === model.value.id);
    if (index === todaysEntries.value.length) return;
    return todaysEntries.value[index + 1];
});

const has_overlap_previous = computed(() => {
    if (previousEntry && previousEntry.value) {
        const { $moment } = useNuxtApp();

        return (
            $moment.duration(previousEntry.value.end_time).asMinutes() >
            $moment.duration(model.value.start_time).asMinutes()
        );
    }
    return false;
});

const has_overlap_next = computed(() => {
    if (nextEntry && nextEntry.value) {
        const { $moment } = useNuxtApp();

        return (
            $moment.duration(model.value.end_time).asMinutes() >
            $moment.duration(nextEntry.value.start_time).asMinutes()
        );
    }
    return false;
});

const has_gap = computed(() => {
    const { $moment } = useNuxtApp();

    if (previousEntry.value && !has_overlap_previous.value) {
        const hasGap = previousEntry.value.end_time !== model.value.start_time;
        const gapDuration = $moment
            .duration($moment(model.value.start_time, 'HH:mm').diff($moment(previousEntry.value.end_time, 'HH:mm')))
            .format('HH:mm', { trim: false });
        return hasGap ? gapDuration : false;
    }
    return false;
});

const start_time_error = computed(() => {
    return has_overlap_previous.value;
});

const end_time_error = computed(() => {
    return has_overlap_next.value;
});

const duration_error = computed(() => {
    const date = !model.value.is_live_clocking ? computedDate.value : $moment().format('YYYY-MM-DD');
    const start = $moment(computedDate.value + ' ' + model.value.start_time, 'YYYY-M-D HH:mm');
    const end = (model.value.end_time !== '00:00' ? $moment(date) : $moment(date).add(1, 'day')).set({
        hours: parseInt(model.value.end_time.split(':')[0]),
        minutes: parseInt(model.value.end_time.split(':')[1]),
    });

    if (
        $moment(model.value.start_time, 'HH:mm', true).isValid() &&
        $moment(model.value.end_time, 'HH:mm', true).isValid()
    ) {
        const duration = $moment.duration(end.diff(start));
        return duration.asMilliseconds() <= 0;
    }
    return false;
});

onMounted(() => {
    if (model.value.is_creating) {
        startTimer();
    }
});

watch(computedDuration, (value) => {
    model.value.duration = value || '';
});

function onSave() {
    (document.activeElement as HTMLElement)?.blur();
    if (!model.value.id) {
        add();
    } else {
        edit();
    }
}

async function start() {
    if (!model.value.start_time) {
        model.value.start_time = $moment().format('HH:mm');
    }
    model.value.is_live_clocking = true;
    startTimer();
    await commitEntry(model.value);
}

async function stop() {
    model.value.end_time = model.value.end_time || $moment().format('HH:mm');
    model.value.is_live_clocking = false;
    model.value.duration = computedDuration;

    if (model.value.project) {
        edit();
    } else {
        await updateEntry(model.value);
    }
}

async function add() {
    model.value.is_creating = false;
    model.value.is_live_clocking = false;
    await commitEntry(model.value);
    emit('add');
}

async function edit() {
    model.value.is_creating = false;
    model.value.is_editing = false;
    model.value.is_live_clocking = false;
    await updateEntry(model.value);
}

function cancel() {
    model.value.is_editing = false;
    model.value = JSON.parse(JSON.stringify(props.entry));
}

function startTimer() {
    setInterval(() => {
        const start = $moment(computedDate.value + ' ' + model.value.start_time, 'YYYY-M-D HH:mm');
        const end = $moment();

        const duration = $moment.duration(end.diff(start)).format('HH:mm:ss', {
            trim: false,
        });
        placeholder.value = duration;
    }, 100);
}

function commitEntry(entry: Entry) {
    addEntry({
        ...entry,
        date: computedDate.value,
    });
}

function toggleEditing() {
    model.value = Object.create(null, Object.getOwnPropertyDescriptors(props.entry));
    model.value.is_editing = true;
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style lang="postcss" scoped>
label {
    @apply text-xs font-medium uppercase tracking-wider opacity-60;
}
.has-gap::before {
    content: attr(data-gap-duration);
    @apply absolute -top-6 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded bg-white px-2 font-bold dark:bg-slate-800;
}
.has-gap::after {
    content: '';
    @apply absolute -top-6 left-0 right-0 z-0 block border-b dark:border-slate-800;
}
.v-html {
    :deep(a) {
        @apply text-primary-500 hover:text-primary-400;
        overflow-wrap: break-word;
    }
}
</style>
