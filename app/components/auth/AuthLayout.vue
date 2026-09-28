<template>
    <div class="relative flex min-h-svh items-center justify-center bg-background p-6">
        <ColorModeToggle class="absolute top-4 right-4" />
        <div class="flex w-full max-w-sm flex-col gap-6">
            <AppLogo class="h-6 w-auto self-center" />
            <slot />
        </div>
    </div>
</template>
