<template>
    <div class="w-full flex justify-center items-center px-4 py-6 lg:px-8">
        <button
            type="button"
            class="shadow bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-900 cursor-pointer rounded text-sm font-bold focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 inline-flex items-center justify-center h-9 px-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none gap-2 transition"
            @click="login"
        >
            {{ $t('Connexion avec Google') }}
        </button>
    </div>
</template>

<script lang="ts" setup>
defineI18nRoute({
    paths: {
        fr:'/connexion',
        en: '/login'
    }
})

import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore();
const { login } = auth;
</script>

<style lang="postcss" scoped>

</style>
