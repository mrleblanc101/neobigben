<template>
    <input
        ref="timeInput"
        class="form-control form-input form-input-bordered w-full"
        type="text"
        :value="value"
        :placeholder="placeholder"
        @blur="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
</template>

<script setup lang="ts">
// TODO: Increment value using Arrow Up/Down
// TODO: Increment by 10 using Shift + Arrow Up/Down
const timeInput = ref<HTMLElement | null>(null);
const { $inputmask } = useNuxtApp();

const props = defineProps({
    type: {
        type: String,
        default: 'datetime',
    },
    mask: {
        type: String,
        default: null,
    },
    modelValue: {
        type: String,
        default: null,
    },
    placeholder: {
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
    props.mask
        ? new $inputmask({
              mask: props.mask,
              insertModeVisual: false,
              placeholder: 'HH:MM',
          }).mask(timeInput.value!)
        : new $inputmask('datetime', {
              inputFormat: 'HH:MM',
              insertModeVisual: false,
          }).mask(timeInput.value!);
});
</script>
