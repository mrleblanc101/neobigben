<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script lang="ts" setup>
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
        process.env.NODE_ENV !== 'development'
            ? {
                  rel: 'manifest',
                  href: '/neobigben/manifest.json',
              }
            : {},
    ],
    bodyAttrs: {
        class: 'antialiased overflow-x-clip text-gray-700 leading-normal bg-stone-50 dark:bg-gray-900 dark:text-gray-300',
    },
});
</script>
