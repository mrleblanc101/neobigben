<template>
    <form
        v-if="model.is_creating || model.is_editing"
        class="relative p-4 bg-gray-100 dark:bg-gray-800 rounded flex flex-col gap-2 w-full border"
        :class="[
            has_overlap_previous || has_overlap_next ? 'border-red-500' : 'border-transparent',
            {
                'has-gap mt-10': has_gap,
            },
        ]"
        :data-gap-duration="has_gap"
        @submit.prevent="onSave"
    >
        <div class="grid gap-2 grid-cols-2 sm:grid-cols-4">
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
                    class="form-control form-input form-input-bordered w-full"
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
                :appendNewOption="false"
                searchable
                createOption
                @create="addProject"
            />
        </div>
        <div>
            <label>{{ $t('Description') }}</label>
            <textarea
                v-model="model.description"
                class="block w-full form-control form-input form-input-bordered py-3 h-auto"
                rows="2"
                :placeholder="`${$t('Description')}...`"
            ></textarea>
        </div>
        <div class="flex gap-2 justify-end">
            <button
                v-if="isToday && !model.is_live_clocking && !model.end_time"
                type="submit"
                class="shadow bg-green-500 hover:bg-green-400 active:bg-green-600 text-white dark:text-gray-900 cursor-pointer rounded text-sm font-bold focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 inline-flex items-center justify-center h-9 px-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none gap-2 transition"
            >
                {{ $t('Démarrer') }}
                <IPlay class="h-3 w-4" />
            </button>
            <button
                v-else-if="isToday && model.is_live_clocking"
                type="submit"
                class="shadow bg-rose-500 hover:bg-rose-400 active:bg-rose-600 text-white dark:text-gray-900 cursor-pointer rounded text-sm font-bold focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 inline-flex items-center justify-center h-9 px-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none gap-2 transition"
            >
                {{ $t('Arrêter') }}
                <IStop class="h-3 w-4" />
            </button>
            <button
                v-else-if="model.id && model.is_creating"
                type="button"
                class="appearance-none bg-transparent font-bold text-gray-400 hover:text-gray-300 active:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 dark:active:text-gray-600 dark:hover:bg-gray-800 text-sm px-2 transition"
                @click="deleteEntry(entry as Entry)"
            >
                {{ $t('Annuler') }}
            </button>
            <button
                v-if="model.is_editing"
                type="button"
                class="appearance-none bg-transparent font-bold text-gray-400 hover:text-gray-300 active:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 dark:active:text-gray-600 dark:hover:bg-gray-800 text-sm px-2 transition"
                @click="cancel"
            >
                {{ $t('Annuler') }}
            </button>
            <button
                type="submit"
                class="shadow bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-900 cursor-pointer rounded text-sm font-bold focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 inline-flex items-center justify-center h-9 px-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none gap-2 transition"
                :disabled="!(model.start_time && model.end_time && model.duration && model.project)"
            >
                {{ model.is_creating ? $t('Ajouter') : $t('Sauvegarder') }}
            </button>
        </div>
    </form>
    <div
        v-else
        class="relative p-4 bg-gray-100 dark:bg-gray-800 rounded flex flex-col gap-2 w-full border"
        :class="[
            has_overlap_previous || has_overlap_next ? 'border-red-500' : 'border-transparent',
            {
                'has-gap mt-10': has_gap,
                'opacity-50': entry.is_synced
            },
        ]"
        :data-gap-duration="has_gap"
    >
        <div class="flex items-start justify-between gap-2">
            <div>
                <label>{{ $t('Projet') }}</label>
                <strong class="block">{{ model.project.name }}</strong>
            </div>
            <div class="flex gap-2">
                <button
                    type="button"
                    class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-800 inline-flex items-center justify-center font-bold h-10 w-10 transition"
                    @click="toggleEntrySynced(model.id)"
                >
                    <INetsuite class="h-4" />
                </button>
                <button
                    type="button"
                    class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-800 inline-flex items-center justify-center font-bold h-10 w-10 transition"
                    @click="model.is_editing = true"
                >
                    <IEdit class="h-5" />
                </button>
                <button
                    type="button"
                    class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-red-500 hover:bg-red-400 active:bg-red-600 text-white dark:text-gray-800 inline-flex items-center justify-center font-bold h-10 w-10 transition"
                    @click="deleteEntry(entry as Entry)"
                >
                    <IDelete class="h-5" />
                </button>
            </div>
        </div>
        <div class="grid gap-2 grid-cols-2 sm:grid-cols-4">
            <div>
                <label>{{ $t('Début') }}</label>
                <strong class="block" :class="{ 'text-red-500': start_time_error }">{{ model.start_time }}</strong>
            </div>
            <div>
                <label>{{ $t('Fin') }}</label>
                <strong class="block" :class="{ 'text-red-500': end_time_error }">{{ model.end_time }}</strong>
            </div>
            <div>
                <label>{{ $t('Durée') }}</label>
                <strong class="block" :class="{ 'text-red-500': duration_error }">{{ model.duration }}</strong>
            </div>
            <div>
                <label>{{ $t('Date') }}</label>
                <strong class="block">{{ $moment(model.date).format('L') }}</strong>
            </div>
        </div>
        <div v-if="model.description">
            <label>{{ $t('Description') }}</label>
            <strong
                class="block v-html"
                v-html="
                    linkify(model.description, {
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
import { useStore } from '@/stores/index';

const { $moment } = useNuxtApp();

const store = useStore();
const { addProject, addEntry, updateEntry, deleteEntry, toggleEntrySynced } = store;
const { projects, selectedDay, todaysEntries } = storeToRefs(store);

const props = defineProps({
    entry: {
        type: Object,
        default: () => ({
            id: '',
            is_creating: true,
            is_editing: false,
            is_synced: false,
            is_live_clocking: false,
            start_time: '',
            end_time: '',
            duration: '',
            date: null,
            description: '',
            project: null,
        }),
    },
});

const emit = defineEmits<{
  (e: 'add'): void
}>()

const model = ref(Object.assign({}, props.entry));
const placeholder = ref('00:00:00');

const computedDate = computed(() => {
    return model.value.date ?? selectedDay.value;
});

const computedDuration = computed({
    get() {
        const date = !model.value.is_live_clocking ? computedDate.value : new Date().toLocaleDateString('en-CA');
        const start = $moment(computedDate.value + ' ' + model.value.start_time, 'YYYY-M-D HH:mm');
        const end = (model.value.end_time !== '00:00' ? $moment(date) : $moment(date).add(1, 'day')).set({hours: model.value.end_time.split(':')[0], minutes: model.value.end_time.split(':')[1]});

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

const previousEntry = computed((): undefined | Entry => {
    if (!model.value.id) return;
    const index = todaysEntries.value.findIndex((e: Entry) => e.id === model.value.id);
    if (index === 0) return;
    return todaysEntries.value[index - 1];
});

const nextEntry = computed((): undefined | Entry => {
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

        return;
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
    const date = !model.value.is_live_clocking ? computedDate.value : new Date().toLocaleDateString('en-CA');
    const start = $moment(computedDate.value + ' ' + model.value.start_time, 'YYYY-M-D HH:mm');
    const end = (model.value.end_time !== '00:00' ? $moment(date) : $moment(date).add(1, 'day')).set({hours: model.value.end_time.split(':')[0], minutes: model.value.end_time.split(':')[1]});

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
    if ((!model.value.start_time || !model.value.end_time) && !model.value.is_live_clocking) {
        start();
    } else if (model.value.is_live_clocking) {
        stop();
    } else if (!model.value.id) {
        add();
    } else {
        edit();
    }
}

function start() {
    if (!model.value.start_time) {
        model.value.start_time = $moment().format('HH:mm');
    }
    model.value.is_live_clocking = true;
    startTimer();
    commitEntry(model.value as Entry);
}

function stop() {
    model.value.end_time = model.value.end_time || $moment().format('HH:mm');
    model.value.is_live_clocking = false;
    updateEntry(model.value as Entry);
}

function add() {
    model.value.is_creating = false;
    commitEntry(model.value as Entry);
    emit('add');
}

function edit() {
    model.value.is_creating = false;
    model.value.is_editing = false;
    updateEntry(model.value as Entry);
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
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style lang="postcss" scoped>
label {
    @apply uppercase text-xs font-medium opacity-60;
}
.has-gap::before {
    content: attr(data-gap-duration);
    @apply absolute left-1/2 -translate-x-1/2 -translate-y-1/2 -top-6 bg-gray-100 dark:bg-gray-800 rounded px-2 font-bold z-10;
}
.has-gap::after {
    content: '';
    @apply absolute -top-6 left-0 right-0 block border-b dark:border-gray-800 z-0;
}
.v-html {
    :deep(a) {
        @apply text-primary-500;
        overflow-wrap: break-word;
    }
}
</style>
