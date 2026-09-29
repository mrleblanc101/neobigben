<script setup lang="ts">
const colorMode = useColorMode();
const { baseURL } = useRuntimeConfig().app;

useHead({
    meta: [{ name: "theme-color", content: () => (colorMode.value === "dark" ? "#0a0a0a" : "#ffffff") }],
    link: [{ rel: "apple-touch-icon", href: () => `${baseURL}apple-touch-icon-${colorMode.value === "dark" ? "dark" : "light"}.png` }],
});
</script>

<template>
    <div>
        <NuxtRouteAnnouncer />
        <NuxtPage />
    </div>
</template>
