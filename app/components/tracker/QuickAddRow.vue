<script setup lang="ts">
import { useEventListener } from "@vueuse/core";

const { addEntry } = useTimeTracker();

const project = ref("");
const note = ref("");
const range = useTimeRange();
const noteInput = ref<HTMLTextAreaElement>();

const saving = ref(false);
const canAdd = computed(() => !!project.value && range.valid.value);

async function add() {
    if (saving.value || !canAdd.value) return;
    // A link pasted in the description becomes the entry's link
    saving.value = true;
    const added = await addEntry({
        project: project.value,
        start: formatMinutes(range.startMinutes.value!),
        end: formatMinutes(parseClock(range.end.value)!),
        ...splitNoteLink(note.value),
    });
    saving.value = false;
    if (added) {
        project.value = "";
        note.value = "";
        range.reset();
    }
}

// "/" jumps to the quick-add description from anywhere on the page
useEventListener(window, "keydown", (event: KeyboardEvent) => {
    const tag = (document.activeElement as HTMLElement | null)?.tagName ?? "";
    if (event.key === "/" && !/INPUT|SELECT|TEXTAREA/.test(tag)) {
        event.preventDefault();
        noteInput.value?.focus();
    }
});

const fieldClass = "rounded-sm bg-transparent outline-none hover:bg-muted focus:bg-muted";
</script>

<template>
    <form :class="ENTRY_GRID" class="min-h-13 bg-muted/25 py-2.5" @submit.prevent="add" @keydown.capture="focusPreviousOnBackspace">
        <TrackerProjectCombobox v-model="project" variant="inline" />
        <!-- One line that grows with its content (CSS field-sizing); Enter adds the entry, Shift+Enter starts a new line -->
        <textarea
            ref="noteInput"
            v-model="note"
            autocomplete="off"
            rows="1"
            aria-label="Description"
            placeholder="Courte description..."
            class="-ml-2.5 field-sizing-content max-h-40 min-h-8 min-w-0 resize-none px-2.5 py-1.5 text-sm placeholder:text-muted-foreground"
            :class="fieldClass"
            @keydown.enter.exact.prevent="add"
        />
        <div class="-ml-1 flex items-center gap-0.5">
            <input
                v-time-mask.advance
                autocomplete="off"
                :value="range.start.value"
                inputmode="numeric"
                maxlength="5"
                placeholder="HH:MM"
                title="Début"
                aria-label="Début"
                class="h-7 w-0 min-w-0 flex-1 text-center font-mono text-[13px] placeholder:text-muted-foreground"
                :class="fieldClass"
                @input="range.setStart(($event.target as HTMLInputElement).value)"
            >
            <span class="text-[13px] text-muted-foreground">–</span>
            <TrackerDurationPresets
                class="relative flex w-0 min-w-0 flex-1"
                :start="range.startMinutes.value"
                :minutes="range.durationMinutes.value ?? undefined"
                @duration="range.setDuration(formatMinutes($event))"
                @end="range.setEnd"
            >
                <input
                    v-time-mask.advance
                    autocomplete="off"
                    :value="range.end.value"
                    inputmode="numeric"
                    maxlength="5"
                    placeholder="HH:MM"
                    title="Fin"
                    aria-label="Fin"
                    class="h-7 w-full min-w-0 text-center font-mono text-[13px] placeholder:text-muted-foreground"
                    :class="fieldClass"
                    @input="range.setEnd(($event.target as HTMLInputElement).value)"
                >
                <Badge
                    v-if="range.endsNextDay.value"
                    variant="outline"
                    title="Se termine le lendemain : l’entrée sera séparée en deux à minuit"
                    class="absolute -top-2 -right-1.5 h-4 bg-background px-1.5 py-0 font-mono text-[10px] leading-none text-muted-foreground shadow-xs"
                >
                    +1 j
                </Badge>
            </TrackerDurationPresets>
        </div>
        <input
            v-time-mask
            autocomplete="off"
            :value="range.duration.value"
            inputmode="numeric"
            maxlength="5"
            placeholder="HH:MM"
            title="Durée"
            aria-label="Durée"
            class="h-7 w-full min-w-0 px-1 text-center font-mono text-[13px] font-medium placeholder:text-muted-foreground"
            :class="fieldClass"
            @input="range.setDuration(($event.target as HTMLInputElement).value)"
        >
        <div class="flex justify-end">
            <Button type="submit" size="sm" class="px-2.5 text-[13px]" :disabled="saving || !canAdd">
                Ajouter
                <kbd class="rounded-[3px] bg-primary-foreground/15 px-1 py-px font-mono text-[11px] text-primary-foreground/70">↵</kbd>
            </Button>
        </div>
    </form>
</template>
