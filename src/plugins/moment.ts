import moment from 'moment';
import 'moment/dist/locale/fr-ca';
import momentDurationFormatSetup from 'moment-duration-format';
import type { LocaleObject } from '#i18n';
import type { NuxtApp } from '#app';
import type { ComputedRef } from 'vue';

export default defineNuxtPlugin((nuxtApp) => {
    const locale = nuxtApp.$i18n.locale.value;
    const iso = nuxtApp.$i18n.locales.value.find((l: LocaleObject) => l.code === locale).iso;
    momentDurationFormatSetup(moment);
    moment.locale(iso);

    nuxtApp.$i18n.onBeforeLanguageSwitch = (
        oldLocale: string,
        newLocale: string,
        isInitialSetup: boolean,
        nuxtApp: NuxtApp,
    ) => {
        const locales = (nuxtApp.$i18n.locales as ComputedRef).value;
        const iso = locales.find((l: LocaleObject) => l.code === newLocale).iso;

        moment.locale(iso);
    };

    return {
        provide: {
            moment,
        },
    };
});
