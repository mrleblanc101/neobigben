<template>
    <button
        type="button"
        class="inline-flex h-9 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded bg-primary-500 px-3 py-2 text-sm font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus:ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-900 dark:ring-slate-600"
        @click="setLocale(nextLocale.code)"
    >
        {{ nextLocale.name }}
        <ILanguage class="h-5 w-5" />
    </button>
</template>

<script lang="ts" setup>
import ILanguage from '@/assets/svg/language.svg?component';

import type { LocaleObject } from '#i18n';

const { locale, locales, setLocale } = useI18n();

const nextLocale = computed(() => {
    const index = (locales.value as LocaleObject[]).findIndex((l) => l.code === locale.value);
    const nextIndex = index !== locales.value.length - 1 ? index + 1 : 0;

    return locales.value.at(nextIndex) as LocaleObject;
});
</script>
