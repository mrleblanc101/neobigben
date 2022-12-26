import ViteSvgLoader from 'vite-svg-loader';

import svgoConfig from './svgo.config.js';

export default defineNuxtConfig({
    srcDir: 'src/',

    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxtjs/color-mode',
        '@nuxtjs/google-fonts',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
    ],

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

    vite: {
        plugins: [
            ViteSvgLoader({
                svgoConfig,
            }),
        ],
    },
});
