<template>
    <input ref="timeInput" type="text" ondblclick="this.select()" />
</template>

<script setup lang="ts">

const timeInput = ref<HTMLElement | null>(null);
const { $inputmask } = useNuxtApp();

onMounted(() => {
    new Inputmask("datetime", {
        inputFormat: "HH:MM",
        clearMaskOnLostFocus: false,
    }).mask(timeInput.value!);
})
</script>
