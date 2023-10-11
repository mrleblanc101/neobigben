<template>
    <div class="flex w-full items-center justify-center px-4 py-6 lg:px-8">
        <h1>{{ $t('Déconnexion...') }}</h1>
    </div>
</template>

<script lang="ts" setup>
import { signOut } from 'firebase/auth';
import { useIndexStore } from '@/stores/index';

definePageMeta({
    layout: 'login',
});

defineI18nRoute({
    paths: {
        fr: '/deconnexion',
        en: '/logout',
    },
});

const auth = useFirebaseAuth()!;
const store = useIndexStore();
const localePath = useLocalePath();

onMounted(async () => {
    await nextTick();
    await signOut(auth);
    store.$reset();
    navigateTo(
        localePath({
            name: 'login',
        }),
    );
});
</script>
