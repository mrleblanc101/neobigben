<template>
    <input
        ref="timeInput"
        class="form-control form-input-bordered form-input w-full"
        type="text"
        :value="value"
        :placeholder="placeholder"
        @blur="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
</template>

<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        type?: string;
        mask?: string;
        modelValue?: string;
        placeholder?: string;
    }>(),
    {
        mask: '',
        modelValue: '',
        type: 'datetime',
        placeholder: 'HH:MM',
    },
);
const emit = defineEmits(['update:modelValue']);
// TODO: Increment value using Arrow Up/Down
// TODO: Increment by 10 using Shift + Arrow Up/Down
const timeInput = ref<HTMLElement | null>(null);
const { $inputmask } = useNuxtApp();

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
