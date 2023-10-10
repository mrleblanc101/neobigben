import ViteSvgLoader from 'vite-svg-loader';

export default defineNuxtConfig({
    srcDir: 'src/',

    devtools: { enabled: true },

    ssr: false,

    modules: [
        '@nuxtjs/i18n',
        '@nuxtjs/tailwindcss',
        '@nuxtjs/color-mode',
        '@nuxtjs/google-fonts',
        '@pinia/nuxt',
        '@vueuse/nuxt',
        'nuxt-vuefire',
    ],

    vuefire: {
        auth: {
            enabled: true,
        },
        config: {
            apiKey: 'AIzaSyArKefxLB6DdSkXhewC3_EzcOplCGGhuRs',
            authDomain: 'neobigben.firebaseapp.com',
            projectId: 'neobigben',
            storageBucket: 'neobigben.appspot.com',
            messagingSenderId: '681397227646',
            appId: '1:681397227646:web:fdc164818213b9f80cc82f',
        },
    },

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
    },

    piniaPersistedstate: {
        storage: 'localStorage',
    },

    googleFonts: {
        download: true,
        families: {
            'DM+Sans': {
                wght: [400, 500, 700, 900],
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
