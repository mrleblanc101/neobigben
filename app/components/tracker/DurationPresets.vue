<script setup lang="ts">
import { PopoverArrow } from "reka-ui";

/**
 * Wraps the "Fin" input: while it has focus and the start is set, a popover offers common durations,
 * and "Maintenant" to end the entry at the current time.
 * The buttons never take focus, so typing in the input can go on; picking one moves on to the field after the times,
 * which closes the popover.
 */
defineOptions({ inheritAttrs: false });

const props = defineProps<{
    /** Start in minutes since midnight; while null a duration can't place the end, so the popover stays hidden */
    start: number | null;
    /** Current duration in minutes, to highlight the matching preset */
    minutes?: number;
}>();

const emit = defineEmits<{
    /** A preset duration was picked, in minutes */
    duration: [minutes: number];
    /** "Maintenant" was picked: the end, as HH:MM */
    end: [time: string];
}>();

const PRESETS = [15, 30, 60, 90, 120].map(value => ({
    value,
    label: value < 60 ? `${value} min` : `${Math.floor(value / 60)} h${value % 60 ? ` ${value % 60}` : ""}`,
}));

const focused = ref(false);
const wrapper = ref<HTMLElement>();

// Once the parent has rendered the picked time, Durée leaves the Tab order and the next field is the project
async function pick(event: () => void) {
    event();
    await nextTick();
    const input = wrapper.value?.querySelector("input");
    if (input) focusNextField(input);
}

// "Maintenant" ends the entry at the actual current moment, read each time the popover opens.
// It's offered only when that moment falls less than 24 hours after the start on the displayed day:
// later today, or early today for an entry started yesterday evening (then split at midnight).
const { date } = useTimeTracker();
const now = ref(new Date());
watch(focused, value => value && (now.value = new Date()));

const sinceStart = computed(() => {
    if (props.start === null) return null;
    const started = new Date(date.value);
    started.setHours(0, props.start, 0, 0);
    return Math.floor((now.value.getTime() - started.getTime()) / 60_000);
});
const nowUnavailable = computed(() => {
    if (sinceStart.value === null || sinceStart.value < 1) return "Il n’est pas encore passé l’heure de début";
    if (sinceStart.value >= MINUTES_PER_DAY) return "Plus de 24 h se sont écoulées depuis le début";
    return null;
});
</script>

<template>
    <Popover :open="focused && start !== null">
        <PopoverAnchor as-child>
            <div ref="wrapper" v-bind="$attrs" @focusin="focused = true" @focusout="focused = false">
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
                    @click="pick(() => emit('duration', preset.value))"
                >
                    {{ preset.label }}
                </Button>
                <!-- The tooltip sits on a wrapper: a disabled button ignores the pointer -->
                <span class="flex" :title="nowUnavailable ?? undefined">
                    <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        tabindex="-1"
                        class="h-6.5 w-full px-2.5 font-normal"
                        :disabled="!!nowUnavailable"
                        @mousedown.prevent
                        @click="pick(() => emit('end', formatMinutes(now.getHours() * 60 + now.getMinutes())))"
                    >
                        Maintenant
                    </Button>
                </span>
            </div>
            <!-- Moved 1px into the popover so its fill covers the popover border along its base -->
            <PopoverArrow :width="14" :height="7" class="-translate-y-px fill-popover stroke-border" />
        </PopoverContent>
    </Popover>
</template>
