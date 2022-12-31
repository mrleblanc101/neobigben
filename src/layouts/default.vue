<template>
    <AppHeader />
    <main class="min-h-screen pt-16 flex overflow-x-clip">
        <slot />
    </main>
</template>

<script setup lang="ts">
useHead({
    title: 'NeoBigben',
    link: [
        {
            rel: 'icon',
            href: '/favicon.svg',
            type: 'image/svg+xml',
        },
    ],
    bodyAttrs: {
        class: 'antialiased text-gray-700 leading-normal bg-white dark:bg-gray-900 dark:text-gray-300',
    },
});
</script>
