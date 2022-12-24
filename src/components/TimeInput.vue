<template>
    <input
        ref="timeInput"
        class="form-control form-input form-input-bordered w-full"
        type="text"
        ondblclick="this.select()"
        placeholder="HH:MM"
    />
</template>

<script setup lang="ts">
const timeInput = ref<HTMLElement | null>(null);
const { $inputmask } = useNuxtApp();

onMounted(() => {
    new Inputmask('datetime', {
        inputFormat: 'HH:MM',
    }).mask(timeInput.value!);
});
</script>
