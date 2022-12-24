<template>
    <input
        ref="timeInput"
        class="form-control form-input form-input-bordered w-full"
        type="text"
        v-model="value"
        :placeholder="format"
        ondblclick="this.select()"
    />
</template>

<script setup lang="ts">
const timeInput = ref<HTMLElement | null>(null);
const { $inputmask } = useNuxtApp();

const props = defineProps({
    modelValue: {
        type: String,
        default: null,
    },
    format: {
        type: String,
        default: 'HH:MM',
    },
});
const emit = defineEmits(['update:modelValue']);

const value = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    },
});

onMounted(() => {
    new $inputmask('datetime', {
        inputFormat: props.format,
    }).mask(timeInput.value!);
});
</script>
