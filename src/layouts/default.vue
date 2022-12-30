<template>
    <AppHeader />
    <main class="min-h-screen pt-16 flex">
        <slot />
    </main>
</template>

<script setup lang="ts">
useHead({
    bodyAttrs: { class: 'antialiased text-gray-700 leading-normal bg-white dark:bg-gray-900 dark:text-gray-300' },
});
</script>
