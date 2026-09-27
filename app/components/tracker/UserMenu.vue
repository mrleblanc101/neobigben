<script setup lang="ts">
import { LogOut } from "@lucide/vue";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const colorMode = useColorMode();

// Only remembers the choice for now: the UI isn't translated yet
const language = useState("tracker:language", () => "fr");

const languages = [
    { value: "fr", label: "Français" },
    { value: "en", label: "English" },
];
const themes = [
    { value: "light", label: "Clair" },
    { value: "dark", label: "Sombre" },
    { value: "system", label: "Système" },
];

const name = computed(() => {
    const meta = user.value?.user_metadata;
    return (meta?.full_name ?? meta?.name ?? user.value?.email ?? "") as string;
});
const initials = computed(() =>
    name.value
        .split(/[\s@.]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0]!.toUpperCase())
        .join(""),
);

async function signOut() {
    await supabase.auth.signOut();
    await navigateTo("/login");
}
</script>

<template>
    <Popover>
        <PopoverTrigger as-child>
            <button
                type="button"
                aria-label="Menu utilisateur"
                class="flex size-8 items-center justify-center rounded-full border bg-muted text-xs font-semibold transition-colors hover:bg-accent data-[state=open]:border-muted-foreground"
            >
                {{ initials }}
            </button>
        </PopoverTrigger>
        <PopoverContent align="end" :side-offset="8" class="flex w-60 flex-col p-1">
            <div class="flex flex-col gap-0.5 px-2.5 py-2">
                <span class="text-sm font-semibold">{{ name }}</span>
                <span class="text-xs text-muted-foreground">{{ user?.email }}</span>
            </div>
            <div class="-mx-1 my-1 h-px bg-border" />
            <span class="px-2.5 pt-1.5 pb-1 text-xs font-medium text-muted-foreground/70">Langue</span>
            <div class="mx-1.5 mb-1.5 grid grid-cols-2 gap-0.5 rounded-md bg-muted p-[3px]">
                <button
                    v-for="option in languages"
                    :key="option.value"
                    type="button"
                    class="h-[26px] rounded-sm text-xs font-medium"
                    :class="language === option.value ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'"
                    @click="language = option.value"
                >
                    {{ option.label }}
                </button>
            </div>
            <span class="px-2.5 py-1 text-xs font-medium text-muted-foreground/70">Thème</span>
            <div class="mx-1.5 mb-1.5 grid grid-cols-3 gap-0.5 rounded-md bg-muted p-[3px]">
                <button
                    v-for="option in themes"
                    :key="option.value"
                    type="button"
                    class="h-[26px] rounded-sm text-xs font-medium"
                    :class="colorMode.preference === option.value ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'"
                    @click="colorMode.preference = option.value"
                >
                    {{ option.label }}
                </button>
            </div>
            <div class="-mx-1 my-1 h-px bg-border" />
            <button
                type="button"
                class="flex h-8 items-center gap-2 rounded-sm px-2.5 text-left text-[13px] text-red-500 hover:bg-red-500/12 dark:text-red-400"
                @click="signOut"
            >
                <LogOut class="size-3.5" />
                Déconnexion
            </button>
        </PopoverContent>
    </Popover>
</template>
