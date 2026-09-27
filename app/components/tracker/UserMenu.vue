<script setup lang="ts">
import { LogOut, Settings } from "@lucide/vue";
import { PopoverClose } from "reka-ui";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { reset } = useTimeTracker();
const { git_tag: gitTag, git_sha: gitSha } = useRuntimeConfig().public;

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
            <PopoverClose as-child>
                <NuxtLink to="/settings" class="flex h-8 items-center gap-2 rounded-sm px-2.5 text-[13px] hover:bg-accent">
                    <Settings class="size-3.5 text-muted-foreground" />
                    Paramètres
                </NuxtLink>
            </PopoverClose>
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
