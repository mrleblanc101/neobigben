<template>
    <AppHeader />
    <main class="p-4 lg:p-8">
        <slot />
    </main>
</template>

<script setup lang="ts">
useHead({
    bodyAttrs: { class: 'antialiased text-gray-700 leading-normal bg-white dark:bg-gray-900 dark:text-gray-300' },
});
</script>
