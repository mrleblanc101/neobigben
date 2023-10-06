<template>
    <div class="flex w-full items-center justify-center px-4 py-6 lg:px-8">
        <button
            type="button"
            class="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded bg-primary-500 px-3 text-sm font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus:ring active:bg-primary-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-900 dark:ring-gray-600"
            @click="login"
        >
            {{ $t('Connexion avec Google') }}
        </button>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'login',
});

defineI18nRoute({
    paths: {
        fr: '/connexion',
        en: '/login',
    },
});

import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore();
const { login } = auth;
</script>
