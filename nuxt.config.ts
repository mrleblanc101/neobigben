import ViteSvgLoader from 'vite-svg-loader';

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
            },
            {
                code: 'en',
                name: 'English',
                iso: 'en-CA',
                file: 'en.json',
            },
        ],
        vueI18n: {
            legacy: false,
            fallbackWarn: false,
            missingWarn: false,
            fallbackFormat: true,
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
            'tailwindcss/nesting': {},
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    build: {
        transpile: ['moment'],
    },

    vite: {
        define: {
            __VUE_PROD_DEVTOOLS__: true,
        },
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
