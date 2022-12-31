<template>
    <button
        type="button"
        class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-800 items-center justify-center font-bold h-10 w-10 text-sm inline-flex uppercase"
        @click="setLocale(nextLocale)"
    >
        {{ nextLocale }}
    </button>
</template>

<script lang="ts" setup>
import type { LocaleObject } from '#i18n';
const { locale, locales, setLocale } = useI18n();
const nextLocale = computed(() => {
    const index = (locales.value as LocaleObject[]).findIndex((l) => l.code === locale.value);
    const nextIndex = index !== locales.value.length - 1 ? index + 1 : 0;

    return (locales.value.at(nextIndex) as LocaleObject).code;
});
</script>
