<template>
    <header class="fixed top-0 z-40 w-full border-b dark:border-gray-800 bg-white dark:bg-gray-900">
        <div class="flex items-center justify-between h-16 px-4 lg:px-8">
            <h1 class="text-2xl font-black">NeoBigben</h1>
            <ColorSwitcher />
        </div>
    </header>
    <main class="pt-16">
        <div class="p-4 lg:px-8">
            <slot />
        </div>
    </main>
</template>

<script setup lang="ts">
useHead({
    bodyAttrs: { class: 'antialiased text-gray-700 leading-normal bg-white dark:bg-gray-900 dark:text-gray-300' },
});
</script>
