<script setup lang="ts">
const colorMode = useColorMode();

// The browser and iOS status bar color: the page background (--background) of the theme in use
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
