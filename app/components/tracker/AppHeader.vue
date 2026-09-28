<template>
    <header class="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/85 px-6 backdrop-blur-sm">
        <NuxtLink to="/" class="flex items-center">
            <AppLogo class="h-[18px] w-auto" />
        </NuxtLink>
        <div class="flex items-center gap-3">
            <TrackerWeekProgress />
            <TrackerUserMenu />
        </div>
    </header>
</template>
