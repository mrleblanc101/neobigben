<template>
    <div class="flex w-full items-center justify-center px-4 py-6 lg:px-8">
        <h1>{{ $t('Déconnexion...') }}</h1>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'login',
});

defineI18nRoute({
    paths: {
        fr: '/deconnexion',
        en: '/logout',
    },
});
</script>
