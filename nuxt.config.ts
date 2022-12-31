import ViteSvgLoader from 'vite-svg-loader';
import messages from './src/i18n';

export default defineNuxtConfig({
    srcDir: 'src/',

    modules: [
        '@nuxtjs/i18n',
        '@nuxtjs/tailwindcss',
        '@nuxtjs/color-mode',
        '@nuxtjs/google-fonts',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
    ],

    i18n: {
        strategy: 'prefix_except_default',
        defaultLocale: 'fr',
        locales: [
            {
                code: 'fr',
                name: 'Français',
                iso: 'fr-CA',
                momentLocale: 'fr-ca',
            },
            {
                code: 'en',
                name: 'English',
                iso: 'en-CA',
                momentLocale: 'en',
            },
        ],
        vueI18n: {
            legacy: false,
            // silentFallbackWarn: true,
            // silentTranslationWarn: true,
            messages,
        },
    },

    piniaPersistedstate: {
        storage: 'cookies',
        cookieOptions: {
            maxAge: 400 * 24 * 60 * 60, // 400 days
        },
    },

    googleFonts: {
        download: true,
        families: {
            'DM+Sans': {
                wght: [400, 500, 700],
                ital: [400],
            },
        },
    },

    colorMode: {
        classSuffix: '',
        dataValue: 'theme',
    },

    postcss: {
        plugins: {
            'postcss-import': {},
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    build: {
        transpile: ['moment'],
    },

    vite: {
        plugins: [
            ViteSvgLoader({
                svgoConfig: {
                    plugins: [
                        { name: 'prefixIds' },
                        { name: 'removeTitle' },
                        { name: 'removeDesc' },
                        { name: 'removeDimensions' },
                        {
                            name: 'removeAttrs',
                            params: {
                                attrs: '(fill|stroke)',
                            },
                        },
                    ],
                },
            }),
        ],
    },
});
