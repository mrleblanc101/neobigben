import moment from 'moment';
import 'moment/dist/locale/fr-ca';
import momentDurationFormatSetup from 'moment-duration-format';
import type { LocaleObject } from '#i18n';
import type { Composer } from 'vue-i18n';

export default defineNuxtPlugin((nuxtApp) => {
    const i18n = nuxtApp.$i18n as Composer;
    const { locale, locales } = i18n;
    const iso = (locales.value as LocaleObject[]).find((l) => l.code === locale.value)?.iso;
    momentDurationFormatSetup(moment as any);
    moment.locale(iso);

    nuxtApp.hook('i18n:localeSwitched', ({oldLocale, newLocale}) => {
        const iso = (locales.value as LocaleObject[]).find((l) => l.code === newLocale)?.iso;
        moment.locale(iso);
    });

    return {
        provide: {
            moment,
        },
    };
});
