import ViteSvgLoader from 'vite-svg-loader';

const isElectron = process.env.isElectron || false;

export default defineNuxtConfig({
    srcDir: 'src/',

    ssr: false,

    modules: [
        '@nuxtjs/i18n',
        '@nuxtjs/tailwindcss',
        '@nuxtjs/color-mode',
        '@nuxtjs/google-fonts',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
        '@vueuse/nuxt',
    ],

    i18n: {
        strategy: 'prefix_except_default',
        defaultLocale: 'fr',
        langDir: 'i18n/',
        locales: [
            {
                code: 'fr',
                name: 'Français',
                iso: 'fr-CA',
                file: 'fr.json',
                momentLocale: 'fr-ca',
            },
            {
                code: 'en',
                name: 'English',
                iso: 'en-CA',
                file: 'en.json',
                momentLocale: 'en',
            },
        ],
        vueI18n: {
            legacy: false,
            fallbackWarn: false,
            missingWarn: false,
        },
    },

    piniaPersistedstate: {
        storage: 'localStorage',
        // cookieOptions: {
        //     maxAge: 400 * 24 * 60 * 60, // 400 days
        // },
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
        preference: 'system',
        fallback: 'dark',
        classSuffix: '',
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
