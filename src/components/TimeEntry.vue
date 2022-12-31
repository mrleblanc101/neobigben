<template>
    <form
        v-if="model.is_creating || model.is_editing"
        class="p-4 bg-gray-100 dark:bg-gray-800 rounded flex flex-col gap-2 w-full"
        @submit.prevent="onSave"
    >
        <div class="grid gap-2 grid-cols-2 md:grid-cols-4">
            <div>
                <label>Début<span class="text-red-500">*</span></label>
                <TimeInput v-model="model.start_time" />
            </div>
            <div>
                <label>Fin<span class="text-red-500">*</span></label>
                <TimeInput v-model="model.end_time" />
            </div>
            <div>
                <label>Durée<span class="text-red-500">*</span></label>
                <TimeInput
                    v-model="computedDuration"
                    class="read-only:pointer-events-none"
                    format="HH:MM"
                    :placeholder="model.is_live_clocking ? placeholder : undefined"
                    :readonly="model.is_live_clocking"
                />
            </div>
            <div>
                <label>Date</label>
                <input
                    v-model="model.date"
                    :class="{ 'has-value': model.date }"
                    type="date"
                    class="form-control form-input form-input-bordered w-full"
                />
            </div>
        </div>
        <div>
            <label>Projet<span class="text-red-500">*</span></label>
            <Multiselect
                v-model="model.project"
                :options="projects"
                track-by="name"
                label="name"
                value-prop="id"
                :object="true"
                placeholder="Choisir ou créer..."
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
                        'max-h-60 absolute -left-px -right-px bottom-0 transform translate-y-full border border-primary-300 dark:border-gray-500 dark:focus:border-gray-500 -mt-px overflow-y-scroll z-50 bg-white dark:bg-gray-900 flex flex-col rounded-b',
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
                v-model="model.description"
                class="block w-full form-control form-input form-input-bordered py-3 h-auto"
                rows="2"
                placeholder="Description..."
            ></textarea>
        </div>
        <div class="flex gap-2 justify-end">
            <template v-if="isToday && (!model.start_time || !model.end_time)">
                <button
                    v-if="!model.is_live_clocking"
                    type="submit"
                    class="shadow bg-green-500 hover:bg-green-400 active:bg-green-600 text-white dark:text-gray-900 cursor-pointer rounded text-sm font-bold focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 inline-flex items-center justify-center h-9 px-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none gap-2"
                >
                    Démarrer
                    <IPlay class="h-3 w-4" />
                </button>
                <button
                    v-else
                    type="submit"
                    class="shadow bg-rose-500 hover:bg-rose-400 active:bg-rose-600 text-white dark:text-gray-900 cursor-pointer rounded text-sm font-bold focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 inline-flex items-center justify-center h-9 px-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none gap-2"
                >
                    Arrêter
                    <IStop class="h-3 w-4" />
                </button>
            </template>
            <button
                v-else-if="model.id && model.is_creating"
                type="button"
                class="appearance-none bg-transparent font-bold text-gray-400 hover:text-gray-300 active:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 dark:active:text-gray-600 dark:hover:bg-gray-800 text-sm px-2"
                @click="deleteEntry(entry as Entry)"
            >
                Annuler
            </button>
            <button
                v-if="model.is_editing"
                type="button"
                class="appearance-none bg-transparent font-bold text-gray-400 hover:text-gray-300 active:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 dark:active:text-gray-600 dark:hover:bg-gray-800 text-sm px-2"
                @click="onCancelEdits"
            >
                Annuler
            </button>
            <button
                type="submit"
                class="shadow bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-900 cursor-pointer rounded text-sm font-bold focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 inline-flex items-center justify-center h-9 px-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none gap-2"
                :disabled="!(model.start_time && model.end_time && model.duration && model.project)"
            >
                {{ model.is_creating ? 'Ajouter' : 'Sauvegarder' }}
            </button>
        </div>
    </form>
    <div v-else class="p-4 bg-gray-100 dark:bg-gray-800 rounded flex flex-col gap-2 w-full">
        <div class="flex items-start justify-between gap-2">
            <div>
                <label>Projet</label>
                <strong class="block">{{ model.project?.name }}</strong>
            </div>
            <div class="flex gap-2">
                <button
                    type="button"
                    class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-800 inline-flex items-center justify-center font-bold h-10 w-10 text-sm"
                    @click="model.is_editing = true"
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
                <strong class="block">{{ model.start_time }}</strong>
            </div>
            <div>
                <label>Fin</label>
                <strong class="block">{{ model.end_time }}</strong>
            </div>
            <div>
                <label>Durée</label>
                <strong class="block">{{ model.duration }}</strong>
            </div>
            <div>
                <label>Date</label>
                <strong class="block">{{ model.date }}</strong>
            </div>
        </div>
        <div v-if="model.description">
            <label>Description</label>
            <strong class="block whitespace-pre">{{ model.description }}</strong>
        </div>
    </div>
</template>

<script setup lang="ts">
import IPlay from '@/assets/svg/play.svg?component';
import IStop from '@/assets/svg/stop.svg?component';
import IEdit from '@/assets/svg/edit.svg?component';
import IDelete from '@/assets/svg/delete.svg?component';

import Multiselect from '@vueform/multiselect';
import { storeToRefs } from 'pinia';
import { useStore } from '@/stores/index';

const { $moment } = useNuxtApp();

const store = useStore();
const { addProject, addEntry, updateEntry, deleteEntry } = store;
const { projects, selectedDay } = storeToRefs(store);

const props = defineProps({
    entry: {
        type: Object,
        default: () => ({
            id: '',
            is_creating: true,
            is_editing: false,
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

const model = ref(Object.assign({}, props.entry));
const placeholder = ref('00:00:00');

const computedDate = computed(() => {
    return model.value.date ?? selectedDay.value;
});

const computedDuration = computed({
    get() {
        const date = !model.value.is_live_clocking ? computedDate.value : new Date().toLocaleDateString('en-CA');
        const start = $moment(computedDate.value + ' ' + model.value.start_time, 'YYYY-M-D HH:mm');
        const end = $moment(date + ' ' + model.value.end_time, 'YYYY-M-D HH:mm');

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
        // Démarrer
        if (!model.value.start_time) {
            model.value.start_time = $moment().format('HH:mm');
        }
        model.value.is_live_clocking = true;
        startTimer();
        onAddEntry(model.value as Entry);
    } else if (model.value.is_live_clocking) {
        // Arrêter
        model.value.end_time = $moment().format('HH:mm');
        model.value.is_live_clocking = false;
        updateEntry(model.value as Entry);
    } else if (!model.value.id) {
        // Ajouter
        model.value.is_creating = false;
        onAddEntry(model.value as Entry);
    } else {
        // Modifier
        model.value.is_creating = false;
        model.value.is_editing = false;
        updateEntry(model.value as Entry);
    }
}

function onAddEntry(entry: Entry) {
    addEntry({
        ...entry,
        date: computedDate.value,
    });
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

function onCancelEdits() {
    model.value.is_editing = false;
    model.value = JSON.parse(JSON.stringify(props.entry));
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style lang="postcss" scoped>
label {
    @apply uppercase text-xs font-medium opacity-60;
}
</style>
