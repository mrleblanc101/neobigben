import tailwindcss from "@tailwindcss/vite";

const baseURL = process.env.NUXT_APP_BASE_URL || "/";

export default defineNuxtConfig({
    ssr: false,
    app: {
        baseURL,
        head: {
            htmlAttrs: { lang: "fr" },
            // Lets env(safe-area-inset-*) report the notch and home indicator areas instead of 0
            viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
            titleTemplate: "%s %separator %siteName",
            templateParams: { separator: "|", siteName: "NeoBigBen" },
            link: [
                {
                    rel: "icon",
                    href: `${baseURL}favicon-light.png`,
                    media: "(prefers-color-scheme: dark)",
                },
                {
                    rel: "icon",
                    href: `${baseURL}favicon-dark.png`,
                    media: "(prefers-color-scheme: light)",
                },
                { rel: "manifest", href: `${baseURL}manifest.json` },
            ],
        },
    },
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],
    vite: {
        plugins: [tailwindcss()],
    },
    modules: [
        "shadcn-nuxt",
        "@nuxtjs/supabase",
        "@nuxt/eslint",
        "@nuxtjs/color-mode",
    ],
    shadcn: {
        /**
         * Prefix for all the imported component.
         * @default "Ui"
         */
        prefix: "",
        /**
         * Directory that the component lives in.
         * Will respect the Nuxt aliases.
         * @link https://nuxt.com/docs/api/nuxt-config#alias
         * @default "@/components/ui"
         */
        componentDir: "@/components/ui",
    },
    supabase: {
        redirectOptions: {
            login: "/login",
            callback: "/confirm",
        },
    },
    runtimeConfig: {
        public: {
            gitTag: "0.0.0",
            gitShortSha: "0000000",
        },
    },
    colorMode: {
        classSuffix: "",
    },
    nitro: {
        prerender: {
            // The prerender crawler follows the page head's manifest link and would write a page over public/manifest.json
            ignore: [/\/manifest\.json$/],
        },
    },
});
