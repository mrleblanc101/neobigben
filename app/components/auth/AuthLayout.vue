<template>
    <div class="relative flex min-h-svh items-center justify-center bg-muted p-6">
        <ColorModeToggle class="absolute top-4 right-4" />
        <div class="w-full max-w-sm">
            <slot />
        </div>
    </div>
</template>
