import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    ssr: false,
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],
    vite: {
        plugins: [tailwindcss()],
    },
    modules: ["shadcn-nuxt", "@nuxtjs/supabase", "@nuxt/eslint"],
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
            exclude: ["/register"],
        },
    },
    eslint: {
        config: {
            stylistic: true,
        },
    },
});
