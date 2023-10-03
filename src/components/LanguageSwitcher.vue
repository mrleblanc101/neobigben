<template>
    <button
        type="button"
        class="shadow bg-primary-500 hover:bg-primary-400 text-white dark:text-gray-900 cursor-pointer rounded text-sm font-bold focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 inline-flex items-center justify-center py-2 px-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none gap-2 whitespace-nowrap h-9 transition"
        @click="setLocale(nextLocale.code)"
    >
        {{ nextLocale.name }}
        <ILanguage class="h-5" />
    </button>
</template>

<script lang="ts" setup>
import ILanguage from '@/assets/svg/language.svg?component';

import type { LocaleObject } from '#i18n';

const { locale, locales, setLocale } = useI18n();

const nextLocale = computed(() => {
    const index = (locales.value as LocaleObject[]).findIndex((l) => l.code === locale.value);
    const nextIndex = index !== locales.value.length - 1 ? index + 1 : 0;

    return (locales.value.at(nextIndex) as LocaleObject);
});
</script>
