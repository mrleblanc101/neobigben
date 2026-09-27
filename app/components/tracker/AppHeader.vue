<script setup lang="ts">
import { Clock } from "@lucide/vue";
</script>

<template>
    <header class="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/85 px-6 backdrop-blur-sm">
        <NuxtLink to="/" class="flex items-center gap-2.5">
            <div class="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Clock class="size-4" :stroke-width="2.5" />
            </div>
            <span class="text-[15px] font-bold tracking-tight">Neobig Ben</span>
        </NuxtLink>
        <div class="flex items-center gap-3">
            <TrackerWeekProgress />
            <TrackerUserMenu />
        </div>
    </header>
</template>
