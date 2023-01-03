<template>
    <AppHeader />
    <main class="min-h-screen pt-16 flex overflow-x-clip">
        <slot />
    </main>
</template>

<script setup lang="ts">
useHead({
    title: 'NeoBigben',
    meta: [
        {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0',
        },
    ],
    link: [
        {
            rel: 'icon',
            href: '/neobigben/favicon.svg',
            type: 'image/svg+xml',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: '/neobigben/apple-touch-icon.png',
        },
        {
            rel: 'manifest',
            href: '/neobigben/manifest.webmanifest',
        },
    ],
    bodyAttrs: {
        class: 'antialiased text-gray-700 leading-normal bg-white dark:bg-gray-900 dark:text-gray-300',
    },
});
</script>
