import tailwindcss from "@tailwindcss/vite";

// The path the app is served under: "/" locally, "/neobigben/" on GitHub Pages (NUXT_APP_BASE_URL, set by the CI).
// Nuxt applies it on its own; it's read here too for the links in the page head.
const baseURL = process.env.NUXT_APP_BASE_URL || "/";

export default defineNuxtConfig({
    ssr: false,
    app: {
        baseURL,
        head: {
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
            // Placeholders until the build sets NUXT_PUBLIC_GIT_TAG and NUXT_PUBLIC_GIT_SHORT_SHA
            gitTag: "0.0.0",
            gitShortSha: "0000000",
        },
    },
    colorMode: {
        classSuffix: "",
    },
});
