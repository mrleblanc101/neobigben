<script setup lang="ts">
import { ChevronDown } from "@lucide/vue";
import { useEventListener } from "@vueuse/core";

const { projects, colorOf, addEntry } = useTimeTracker();

const empty = () => ({ project: "", note: "", start: "", end: "", duration: "" });
const draft = ref(empty());
const noteInput = ref<HTMLInputElement>();

// Keeps start, end and duration consistent: whichever field is typed updates the one that depends on it
function onStart(value: string) {
    const start = parseClock(value);
    const duration = parseDuration(draft.value.duration);
    const end = parseClock(draft.value.end);
    draft.value.start = value;
    if (start === null) return;
    if (duration !== null) draft.value.end = addToClock(start, duration);
    else if (end !== null) draft.value.duration = formatMinutes(Math.max(0, end - start));
}

function onEnd(value: string) {
    const start = parseClock(draft.value.start);
    const end = parseClock(value);
    draft.value.end = value;
    if (start !== null && end !== null) draft.value.duration = formatMinutes(Math.max(0, end - start));
}

function onDuration(value: string) {
    const start = parseClock(draft.value.start);
    const duration = parseDuration(value);
    draft.value.duration = value;
    if (start !== null && duration !== null) draft.value.end = addToClock(start, duration);
}

function add() {
    const start = parseClock(draft.value.start);
    const end = parseClock(draft.value.end);
    if (!draft.value.project || start === null || end === null || end <= start) return;

    // A link pasted in the description becomes the entry's link
    let note = draft.value.note.trim();
    const url = note.match(/https?:\/\/\S+/)?.[0] ?? "";
    if (url) note = note.replace(url, "").replace(/[:\s]+$/, "").trim();

    addEntry({ project: draft.value.project, start: formatMinutes(start), end: formatMinutes(end), note, url });
    draft.value = empty();
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
    <form :class="ENTRY_GRID" class="h-[52px] bg-muted/25" @submit.prevent="add">
        <div class="relative flex min-w-0 items-center">
            <span
                class="pointer-events-none absolute left-0 size-2 rounded-[2px]"
                :style="{ background: draft.project ? colorOf(draft.project) : 'transparent' }"
            />
            <select
                v-model="draft.project"
                aria-label="Projet"
                class="h-8 w-full cursor-pointer appearance-none truncate rounded-md bg-transparent pr-5.5 pl-4 text-sm font-medium"
                :class="draft.project ? 'text-foreground' : 'text-muted-foreground/70'"
            >
                <option value="" disabled>
                    Projet…
                </option>
                <option v-for="project in projects" :key="project.name" :value="project.name">
                    {{ project.name }}
                </option>
            </select>
            <ChevronDown class="pointer-events-none absolute right-0 size-3 text-muted-foreground" />
        </div>
        <input
            ref="noteInput"
            v-model="draft.note"
            aria-label="Description"
            placeholder="Ajout rapide — description ou lien Jira…"
            class="-ml-2.5 h-8 min-w-0 px-2.5 text-sm placeholder:text-muted-foreground"
            :class="fieldClass"
        >
        <div class="-ml-1 flex items-center gap-0.5">
            <input
                :value="draft.start"
                inputmode="numeric"
                maxlength="5"
                placeholder="00:00"
                title="Début"
                aria-label="Début"
                class="h-7 w-0 min-w-0 flex-1 text-center font-mono text-[13px] placeholder:text-muted-foreground"
                :class="fieldClass"
                @input="onStart(($event.target as HTMLInputElement).value)"
            >
            <span class="text-[13px] text-muted-foreground">–</span>
            <input
                :value="draft.end"
                inputmode="numeric"
                maxlength="5"
                placeholder="00:00"
                title="Fin"
                aria-label="Fin"
                class="h-7 w-0 min-w-0 flex-1 text-center font-mono text-[13px] placeholder:text-muted-foreground"
                :class="fieldClass"
                @input="onEnd(($event.target as HTMLInputElement).value)"
            >
        </div>
        <input
            :value="draft.duration"
            placeholder="00:00"
            title="Durée"
            aria-label="Durée"
            class="h-7 w-full min-w-0 px-1 text-center font-mono text-[13px] font-medium placeholder:text-muted-foreground"
            :class="fieldClass"
            @input="onDuration(($event.target as HTMLInputElement).value)"
        >
        <div class="flex justify-end">
            <Button type="submit" size="sm" class="px-2.5 text-[13px]">
                Ajouter
                <kbd class="rounded-[3px] bg-primary-foreground/15 px-1 py-px font-mono text-[11px] text-primary-foreground/70">↵</kbd>
            </Button>
        </div>
    </form>
</template>
