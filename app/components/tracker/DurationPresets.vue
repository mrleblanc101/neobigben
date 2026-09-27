<script setup lang="ts">
import { PopoverArrow } from "reka-ui";

/**
 * Wraps the "Fin" input: while it has focus and the start is set, a popover offers common durations that set the end from the start.
 * The buttons never take focus, so typing in the input can go on.
 */
defineOptions({ inheritAttrs: false });

const props = defineProps<{
    /** Start in minutes since midnight; while null a duration can't place the end, so the popover stays hidden */
    start: number | null;
    /** Current duration in minutes, to highlight the matching preset */
    minutes?: number;
}>();

const emit = defineEmits<{ select: [minutes: number] }>();

const PRESETS = [15, 30, 60, 90, 120].map(value => ({
    value,
    label: value < 60 ? `${value} min` : `${Math.floor(value / 60)} h${value % 60 ? ` ${value % 60}` : ""}`,
}));

const focused = ref(false);

// "Maintenant" ends the entry at the current time, read each time the popover opens
const now = ref(0);
watch(focused, (value) => {
    const date = new Date();
    if (value) now.value = date.getHours() * 60 + date.getMinutes();
});
const untilNow = computed(() => (props.start === null ? 0 : now.value - props.start));
</script>

<template>
    <Popover :open="focused && start !== null">
        <PopoverAnchor as-child>
            <div v-bind="$attrs" @focusin="focused = true" @focusout="focused = false">
                <slot />
            </div>
        </PopoverAnchor>
        <PopoverContent
            align="center"
            :side-offset="2"
            class="flex w-44 flex-col gap-1.5 p-2"
            @open-auto-focus.prevent
            @close-auto-focus.prevent
        >
            <span class="px-0.5 text-center text-xs text-muted-foreground">Durée</span>
            <div class="grid grid-cols-2 gap-1">
                <Button
                    v-for="preset in PRESETS"
                    :key="preset.value"
                    type="button"
                    variant="outline"
                    size="xs"
                    tabindex="-1"
                    class="h-6.5 w-full px-2.5 font-mono font-normal"
                    :class="{ 'border-muted-foreground/60 bg-accent dark:bg-accent': minutes === preset.value }"
                    @mousedown.prevent
                    @click="emit('select', preset.value)"
                >
                    {{ preset.label }}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    tabindex="-1"
                    class="h-6.5 w-full px-2.5 font-normal"
                    :disabled="untilNow <= 0"
                    :title="untilNow <= 0 ? 'Il n’est pas encore passé l’heure de début' : undefined"
                    @mousedown.prevent
                    @click="emit('select', untilNow)"
                >
                    Maintenant
                </Button>
            </div>
            <PopoverArrow :width="14" :height="7" class="fill-popover stroke-border" />
        </PopoverContent>
    </Popover>
</template>
