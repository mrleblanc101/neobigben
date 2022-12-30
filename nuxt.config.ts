import ViteSvgLoader from 'vite-svg-loader';

export default defineNuxtConfig({
    srcDir: 'src/',

    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxtjs/color-mode',
        '@nuxtjs/google-fonts',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
    ],

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
            autoprefixer: {},
            'postcss-import': {},
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
