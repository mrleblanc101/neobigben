<script setup lang="ts">
const colorMode = useColorMode();

useHead({
    meta: [{ name: "theme-color", content: () => (colorMode.value === "dark" ? "#0a0a0a" : "#ffffff") }],
});
</script>

<template>
    <div>
        <NuxtRouteAnnouncer />
        <NuxtPage />
    </div>
</template>
