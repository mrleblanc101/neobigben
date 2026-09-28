import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    ssr: false,
    app: {
        head: {
            link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
        },
    },
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],
    vite: {
        plugins: [tailwindcss()],
    },
    modules: ["shadcn-nuxt", "@nuxtjs/supabase", "@nuxt/eslint", "@nuxtjs/color-mode"],
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
            // Placeholders until the build sets NUXT_PUBLIC_GIT_TAG and NUXT_PUBLIC_GIT_SHA
            git_tag: "0.0.0",
            git_sha: "0000000",
        },
    },
    colorMode: {
        classSuffix: "",
    },
});
