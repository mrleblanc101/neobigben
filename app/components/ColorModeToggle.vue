<script setup lang="ts">
import { Monitor, Moon, Sun } from "@lucide/vue";

const colorMode = useColorMode();

const modes = ["light", "dark", "system"] as const;
const icons = { light: Sun, dark: Moon, system: Monitor };

const current = computed(() =>
    modes.includes(colorMode.preference as typeof modes[number])
        ? colorMode.preference as typeof modes[number]
        : "system",
);

function toggle() {
    colorMode.preference = modes[(modes.indexOf(current.value) + 1) % modes.length]!;
}
</script>

<template>
    <Button variant="ghost" size="icon" :aria-label="`Color mode: ${current}`" @click="toggle">
        <component :is="icons[current]" class="size-5" />
    </Button>
</template>
