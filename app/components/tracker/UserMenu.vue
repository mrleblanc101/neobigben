<script setup lang="ts">
import { LogOut } from "@lucide/vue";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const colorMode = useColorMode();
const { reset } = useTimeTracker();
const { git_tag: gitTag, git_sha: gitSha } = useRuntimeConfig().public;

const themes = [
    { value: "light", label: "Clair" },
    { value: "dark", label: "Sombre" },
    { value: "system", label: "Système" },
];

const name = computed(() => {
    const meta = user.value?.user_metadata;
    return (meta?.full_name ?? meta?.name ?? user.value?.email ?? "") as string;
});
// Google sign-in stores the profile photo in the user metadata
const picture = computed(() => {
    const meta = user.value?.user_metadata;
    return (meta?.avatar_url ?? meta?.picture ?? "") as string;
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
    reset();
    await navigateTo("/login");
}
</script>

<template>
    <Popover>
        <PopoverTrigger as-child>
            <button
                type="button"
                aria-label="Menu utilisateur"
                class="rounded-full ring-1 ring-border transition-shadow hover:ring-muted-foreground/60 data-[state=open]:ring-muted-foreground"
            >
                <Avatar>
                    <!-- Google refuses to serve profile photos to requests carrying a referrer -->
                    <AvatarImage v-if="picture" :src="picture" referrer-policy="no-referrer" :alt="name" />
                    <AvatarFallback class="text-xs font-semibold">
                        {{ initials }}
                    </AvatarFallback>
                </Avatar>
            </button>
        </PopoverTrigger>
        <PopoverContent align="end" :side-offset="8" class="flex w-60 flex-col p-1">
            <div class="flex flex-col gap-0.5 px-2.5 py-2">
                <span class="text-sm font-semibold">{{ name }}</span>
                <span class="text-xs text-muted-foreground">{{ user?.email }}</span>
            </div>
            <div class="-mx-1 my-1 h-px bg-border" />
            <span class="px-2.5 pt-1.5 pb-1 text-xs font-medium text-muted-foreground/70">Thème</span>
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
            <div class="-mx-1 mt-1 -mb-1 flex justify-between rounded-b-md border-t bg-muted px-3.5 py-2 font-mono text-[11px] text-muted-foreground">
                <span>{{ gitTag }}</span>
                <span>{{ gitSha }}</span>
            </div>
        </PopoverContent>
    </Popover>
</template>
