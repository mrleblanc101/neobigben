<template>
    <form
        v-if="is_editing"
        class="p-4 bg-gray-100 dark:bg-gray-800 rounded flex flex-col gap-2 w-full"
        @submit.prevent="onSave"
    >
        <div class="grid gap-2 grid-cols-2 md:grid-cols-4">
            <div>
                <label>Début<span class="text-red-500">*</span></label>
                <TimeInput v-model="start_time" />
            </div>
            <div>
                <label>Fin<span class="text-red-500">*</span></label>
                <TimeInput v-model="end_time" />
            </div>
            <div>
                <label>Durée<span class="text-red-500">*</span></label>
                <TimeInput
                    v-model="computedDuration"
                    class="read-only:pointer-events-none"
                    format="HH:MM"
                    :placeholder="is_live_clocking ? placeholder : undefined"
                    :readonly="is_live_clocking"
                />
            </div>
            <div>
                <label>Date</label>
                <input
                    v-model="date"
                    :class="{ 'has-value': date }"
                    type="date"
                    class="form-control form-input form-input-bordered w-full"
                />
            </div>
        </div>
        <div>
            <label>Projet<span class="text-red-500">*</span></label>
            <Multiselect
                v-model="project"
                :options="projects"
                track-by="name"
                label="name"
                value-prop="id"
                :object="true"
                placeholder="Choisir..."
                :classes="{
                    container:
                        'relative h-9 mx-auto w-full flex items-center justify-end box-border cursor-pointer rounded text-sm leading-snug outline-none bg-white dark:bg-gray-900 dark:focus:bg-gray-900 border border-gray-300 dark:border-gray-700 dark:focus:border-gray-500',
                    containerDisabled: 'cursor-default bg-gray-100',
                    containerOpen: 'rounded-b-none border-primary-300 dark:border-gray-500',
                    containerOpenTop: 'rounded-t-none border-primary-300 dark:border-gray-500',
                    containerActive: 'ring ring-primary-200 dark:ring-gray-600 border-primary-300 dark:border-gray-500',
                    singleLabel:
                        'flex items-center h-full max-w-full absolute left-0 top-0 pointer-events-none bg-transparent leading-snug pl-3.5 pr-16 box-border',
                    singleLabelText: 'overflow-ellipsis overflow-hidden block whitespace-nowrap max-w-full',
                    multipleLabel:
                        'flex items-center h-full absolute left-0 top-0 pointer-events-none bg-transparent leading-snug pl-3.5',
                    search: 'w-full absolute inset-0 outline-none appearance-none box-border border-0 text-sm font-sans rounded pl-3.5 bg-transparent',
                    tags: 'flex-grow flex-shrink flex flex-wrap items-center mt-1 pl-2 ',
                    tag: 'bg-primary-500 text-white text-sm font-semibold py-0.5 pl-2 rounded mr-1 mb-1 flex items-center whitespace-nowrap',
                    tagDisabled: 'pr-2 opacity-50',
                    tagRemove:
                        'flex items-center justify-center p-1 mx-0.5 rounded-sm hover:bg-black hover:bg-opacity-10 group',
                    tagRemoveIcon:
                        'bg-multiselect-remove bg-center bg-no-repeat opacity-30 inline-block w-3 h-3 group-hover:opacity-60',
                    tagsSearchWrapper: 'inline-block relative mx-1 mb-1 flex-grow flex-shrink h-full',
                    tagsSearch:
                        'absolute inset-0 border-0 outline-none appearance-none p-0 text-base font-sans box-border w-full',
                    tagsSearchCopy: 'invisible whitespace-pre-wrap inline-block h-px',
                    placeholder:
                        'flex items-center h-full absolute left-0 top-0 pointer-events-none bg-transparent leading-snug pl-3.5 text-gray-400 dark:text-gray-600',
                    caret: 'bg-multiselect-caret bg-center bg-no-repeat w-2.5 h-4 py-px box-content mr-3.5 relative z-10 flex-shrink-0 flex-grow-0 transition-transform transform pointer-events-none',
                    caretOpen: 'rotate-180 pointer-events-auto',
                    clear: 'pr-3.5 relative z-10 transition duration-300 flex-shrink-0 flex-grow-0 flex hover:opacity-80',
                    clearIcon: 'bg-multiselect-remove bg-center bg-no-repeat w-2.5 h-4 py-px box-content inline-block',
                    spinner:
                        'bg-multiselect-spinner bg-center bg-no-repeat w-4 h-4 z-10 mr-3.5 animate-spin flex-shrink-0 flex-grow-0',
                    inifite: 'flex items-center justify-center w-full',
                    inifiteSpinner:
                        'bg-multiselect-spinner bg-center bg-no-repeat w-4 h-4 z-10 animate-spin flex-shrink-0 flex-grow-0 m-3.5',
                    dropdown:
                        'max-h-60 absolute -left-px -right-px bottom-0 transform translate-y-full border border-white border-gray-300 dark:border-gray-700 dark:focus:border-gray-500 -mt-px overflow-y-scroll z-50 bg-white dark:bg-gray-900 flex flex-col rounded-b',
                    dropdownTop: '-translate-y-full top-px bottom-auto rounded-b-none rounded-t',
                    dropdownHidden: 'hidden',
                    options: 'flex flex-col p-0 m-0 list-none',
                    optionsTop: '',
                    group: 'p-0 m-0',
                    groupLabel:
                        'flex text-sm box-border items-center justify-start text-left py-1 px-3 font-semibold bg-gray-200 cursor-default leading-normal',
                    groupLabelPointable: 'cursor-pointer',
                    groupLabelPointed: 'bg-gray-300 text-gray-700',
                    groupLabelSelected: 'bg-primary-600 text-white',
                    groupLabelDisabled: 'bg-gray-100 text-gray-300 cursor-not-allowed',
                    groupLabelSelectedPointed: 'bg-primary-600 text-white opacity-90',
                    groupLabelSelectedDisabled: 'text-green-100 bg-primary-600 bg-opacity-50 cursor-not-allowed',
                    groupOptions: 'p-0 m-0',
                    option: 'flex items-center justify-start box-border text-left cursor-pointer text-sm leading-snug py-2 px-3',
                    optionPointed: 'text-white bg-primary-500',
                    optionSelected: 'text-primary-500 font-bold',
                    optionDisabled: 'text-gray-300 cursor-not-allowed',
                    optionSelectedPointed: 'text-white bg-primary-500 opacity-90 font-bold',
                    optionSelectedDisabled: 'text-green-100 bg-primary-500 bg-opacity-50 cursor-not-allowed',
                    noOptions: 'py-2 px-3 text-gray-600 bg-white dark:bg-gray-900 text-left',
                    noResults: 'py-2 px-3 text-gray-600 bg-white dark:bg-gray-900 text-left',
                    fakeInput:
                        'bg-transparent absolute left-0 right-0 -bottom-px w-full h-px border-0 p-0 appearance-none outline-none text-transparent',
                    spacer: 'h-9 py-px box-content',
                }"
                :appendNewOption="false"
                searchable
                createOption
                @create="addProject"
            />
        </div>
        <div>
            <label>Description</label>
            <textarea
                v-model="description"
                class="block w-full form-control form-input form-input-bordered py-3 h-auto"
                rows="2"
                placeholder="Description..."
            ></textarea>
        </div>
        <div class="flex gap-2 justify-end">
            <template v-if="!start_time || !end_time">
                <button
                    v-if="!is_live_clocking"
                    type="submit"
                    class="shadow relative bg-green-500 hover:bg-green-400 active:bg-green-600 text-white dark:text-gray-900 cursor-pointer rounded text-sm font-bold focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 inline-flex items-center justify-center h-9 px-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none gap-2"
                >
                    Démarrer
                    <IPlay class="h-3 w-4" />
                </button>
                <button
                    v-else
                    type="submit"
                    class="shadow relative bg-rose-500 hover:bg-rose-400 active:bg-rose-600 text-white dark:text-gray-900 cursor-pointer rounded text-sm font-bold focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 inline-flex items-center justify-center h-9 px-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none gap-2"
                >
                    Arrêter
                    <IStop class="h-3 w-4" />
                </button>
            </template>
            <button
                type="submit"
                class="shadow relative bg-primary-500 hover:bg-primary-400 text-white dark:text-gray-900 cursor-pointer rounded text-sm font-bold focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 inline-flex items-center justify-center h-9 px-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none gap-2"
                :disabled="!(entry.start_time && entry.end_time && entry.duration && entry.project)"
            >
                {{ !id ? 'Ajouter' : 'Sauvegarder' }}
                <ISave class="h-4 w-4" />
            </button>
        </div>
    </form>
    <div v-else class="p-4 bg-gray-100 dark:bg-gray-800 rounded flex flex-col gap-2 w-full">
        <div class="flex items-start justify-between gap-2">
            <div>
                <label>Projet</label>
                <strong class="block">{{ project?.name }}</strong>
            </div>
            <div class="flex gap-2">
                <button
                    type="button"
                    class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-800 inline-flex items-center justify-center font-bold h-10 w-10 text-sm"
                    @click="is_editing = true"
                >
                    <IEdit class="h-5" />
                </button>
                <button
                    type="button"
                    class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-red-500 hover:bg-red-400 active:bg-red-600 text-white dark:text-gray-800 inline-flex items-center justify-center font-bold h-10 w-10 text-sm"
                    @click="deleteEntry(entry as Entry)"
                >
                    <IDelete class="h-5" />
                </button>
            </div>
        </div>
        <div class="grid gap-2 grid-cols-2 md:grid-cols-4">
            <div>
                <label>Début</label>
                <strong class="block">{{ start_time }}</strong>
            </div>
            <div>
                <label>Fin</label>
                <strong class="block">{{ end_time }}</strong>
            </div>
            <div>
                <label>Durée</label>
                <strong class="block">{{ duration }}</strong>
            </div>
            <div>
                <label>Date</label>
                <strong class="block">{{ date }}</strong>
            </div>
        </div>
        <div v-if="description">
            <label>Description</label>
            <strong class="block">{{ description }}</strong>
        </div>
    </div>
</template>

<script setup lang="ts">
import IPlay from '@/assets/svg/play.svg?component';
import IStop from '@/assets/svg/stop.svg?component';
import IEdit from '@/assets/svg/edit.svg?component';
import ISave from '@/assets/svg/save.svg?component';
import IDelete from '@/assets/svg/delete.svg?component';

import Multiselect from '@vueform/multiselect';
import { storeToRefs } from 'pinia';
import { useStore } from '@/stores/index';
import { start } from 'repl';

const { $moment } = useNuxtApp();

const store = useStore();
const { addProject, addEntry, updateEntry, deleteEntry } = store;
const { projects, viewedDay } = storeToRefs(store);

const props = defineProps({
    entry: {
        type: Object,
        default: () =>
            reactive({
                id: '',
                is_editing: true,
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

const { id, is_editing, is_live_clocking, start_time, end_time, duration, date, description, project } = toRefs(
    props.entry,
);

const placeholder = ref('00:00:00');

const computedDate = computed(() => {
    return date.value ?? new Date().toLocaleDateString('en-CA');
});

const computedDuration = computed({
    get() {
        const now = new Date().toLocaleDateString('en-CA');
        const start = $moment(computedDate.value + ' ' + start_time.value, 'YYYY-M-D HH:mm');
        const end = $moment(now + ' ' + end_time.value, 'YYYY-M-D HH:mm');

        if ($moment(start_time.value, 'HH:mm', true).isValid() && $moment(end_time.value, 'HH:mm', true).isValid()) {
            const duration = $moment.duration(end.diff(start));
            if (duration.asMilliseconds() > 0) {
                return duration.format('HH:mm', {
                    trim: false,
                });
            }
        }
    },
    set(newValue) {
        const start = $moment(computedDate.value + ' ' + start_time.value, 'YYYY-M-D HH:mm');
        const end = start.add($moment.duration(newValue)).format('HH:mm');

        if ($moment(newValue, 'HH:mm', true).isValid() && $moment(start_time.value, 'HH:mm', true).isValid()) {
            end_time.value = end;
        }
    },
});

watch(computedDuration, (value) => {
    duration.value = value || '';
});

function onSave() {
    if ((!start_time.value || !end_time.value) && !is_live_clocking.value) {
        // Démarrer
        if (!start_time.value) {
            start_time.value = $moment().format('HH:mm');
        }
        is_live_clocking.value = true;
        startTimer();
        onAddEntry(props.entry as Entry);
    } else if (is_live_clocking.value) {
        // Arrêter
        end_time.value = $moment().format('HH:mm');
        is_live_clocking.value = false;
        updateEntry(props.entry as Entry);
    } else if (!id.value) {
        // Ajouter
        is_editing.value = false;
        onAddEntry(props.entry as Entry);
    } else {
        // Modifier
        is_editing.value = false;
        updateEntry(props.entry as Entry);
    }
}

function onAddEntry(entry: Entry) {
    addEntry({
        ...entry,
        date: computedDate.value,
    });
}

onMounted(() => {
    if (is_editing.value) {
        startTimer();
    }
});

function startTimer() {
    setInterval(() => {
        const start = $moment(computedDate.value + ' ' + start_time.value, 'YYYY-M-D HH:mm');
        const end = $moment();

        const duration = $moment.duration(end.diff(start)).format('HH:mm:ss', {
            trim: false,
        });
        placeholder.value = duration;
    }, 100);
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style lang="postcss" scoped>
label {
    @apply uppercase text-xs font-medium opacity-60;
}
</style>
