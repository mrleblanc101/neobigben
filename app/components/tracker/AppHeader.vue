<script setup lang="ts">
import { PanelRight } from "@lucide/vue";

// Below lg the side panel is an off-canvas opened from here
const panelOpen = useState("tracker:panel-open", () => false);
</script>

<template>
    <header class="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/85 px-6 backdrop-blur-sm">
        <NuxtLink to="/" class="flex items-center">
            <AppLogo class="h-[18px] w-auto" />
        </NuxtLink>
        <div class="flex items-center gap-3">
            <TrackerWeekProgress />
            <button
                type="button"
                aria-label="Résumé et projets"
                title="Résumé et projets"
                class="grid size-9 place-items-center rounded-md border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
                @click="panelOpen = true"
            >
                <PanelRight class="size-4" />
            </button>
            <TrackerUserMenu />
        </div>
    </header>
</template>
