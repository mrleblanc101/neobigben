<script setup lang="ts">
import type { DateValue } from "@internationalized/date";
import { parseDate } from "@internationalized/date";
import { CalendarDays } from "@lucide/vue";

const { editor, closeEditor, saveEditor } = useTimeTracker();
const { confirm } = useConfirm();

// Project and note; the times live in `range`
const form = ref({ project: "", note: "" });
const range = useTimeRange();
// Day of an entry being edited (YYYY-MM-DD): changing it moves the entry
const day = ref("");
const editing = computed(() => !!editor.value && editor.value.id !== "new");
const pickingDay = ref(false);
const dayValue = computed({
    get: () => (day.value ? parseDate(day.value) : undefined),
    set: (value: DateValue | undefined) => {
        if (!value) return;
        day.value = value.toString();
        pickingDay.value = false;
    },
});
const dayLabel = computed(() => {
    if (!day.value) return "";
    const date = parseDateKey(day.value);
    return `${DAY_NAMES[date.getDay()]} ${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
});

// The form as opened, to tell whether closing would drop changes
const snapshot = () => JSON.stringify([form.value, day.value, range.start.value, range.end.value, range.duration.value]);
const initialForm = ref("");
const dirty = computed(() => snapshot() !== initialForm.value);

watch(editor, (value) => {
    if (!value) return;
    const { project, start, end, note } = value.form;
    form.value = { project, note };
    range.reset(start, displayClock(end));
    day.value = value.day ?? "";
    initialForm.value = snapshot();
}, { immediate: true });

// Closing with Annuler, Escape, the close button or a click outside asks before dropping changes
async function requestClose() {
    const discard = !dirty.value || await confirm({
        title: "Abandonner les modifications ?",
        description: "Les changements apportés à cette entrée seront perdus.",
        confirmLabel: "Abandonner",
        destructive: true,
    });
    if (discard) closeEditor();
}

// iOS Safari only scrolls a focused field above its keyboard when the field is at rest, not while the
// sheet is still sliding up, but it only opens the keyboard for a focus made during the tap itself.
// So the tap focuses a hidden stand-in, which brings the keyboard up, and the first field takes over
// once the open animation is over; the keyboard is already shown by then, so it stays.
const focusProxy = useTemplateRef("focusProxy");

function focusProxyOnOpen(event: Event) {
    event.preventDefault();
    focusProxy.value?.focus({ preventScroll: true });
}

function focusFirstField(event: AnimationEvent) {
    const content = event.currentTarget as HTMLElement;
    if (event.target !== content || content.dataset.state !== "open") return;
    content.querySelector<HTMLElement>("#entry-start")?.focus();
}

const open = computed({
    get: () => !!editor.value,
    set: value => !value && requestClose(),
});

const canSave = computed(() => !!form.value.project && range.valid.value && (!editing.value || /^\d{4}-\d{2}-\d{2}$/.test(day.value)));

function save() {
    if (!canSave.value) return;
    saveEditor(
        { project: form.value.project, start: range.start.value, end: range.end.value, note: form.value.note.trim() },
        editing.value ? day.value : undefined,
    );
}
</script>

<template>
    <Dialog v-model:open="open">
        <!-- Below sm, a bottom sheet: pinned to the bottom edge, full width, sliding up instead of zooming in -->
        <DialogContent
            class="gap-[18px] sm:max-w-[460px] max-sm:top-auto max-sm:bottom-0 max-sm:left-0 max-sm:max-h-[90svh] max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:overflow-y-auto max-sm:rounded-b-none max-sm:border-x-0 max-sm:border-b-0 max-sm:pb-[calc(1.5rem+env(safe-area-inset-bottom))] max-sm:duration-300 max-sm:data-[state=closed]:zoom-out-100 max-sm:data-[state=closed]:fade-out-100 max-sm:data-[state=closed]:slide-out-to-bottom max-sm:data-[state=open]:zoom-in-100 max-sm:data-[state=open]:fade-in-100 max-sm:data-[state=open]:slide-in-from-bottom"
            @open-auto-focus="focusProxyOnOpen"
            @animationend="focusFirstField"
        >
            <!-- Numeric, like the first field, so the keyboard doesn't switch layouts when it takes over -->
            <input
                ref="focusProxy"
                aria-hidden="true"
                tabindex="-1"
                inputmode="numeric"
                class="pointer-events-none absolute top-0 left-0 size-px text-base opacity-0"
            >

            <DialogHeader>
                <DialogTitle>{{ editor?.id === "new" ? "Nouvelle entrée" : "Modifier l’entrée" }}</DialogTitle>
                <DialogDescription>Renseignez la plage horaire, le projet et une note optionnelle.</DialogDescription>
            </DialogHeader>

            <form class="flex flex-col gap-[18px]" @submit.prevent="save" @keydown.capture="focusPreviousOnBackspace">
                <div v-if="editing" class="flex flex-col gap-2">
                    <Label for="entry-day">Jour</Label>
                    <Popover v-model:open="pickingDay">
                        <PopoverTrigger as-child>
                            <Button id="entry-day" type="button" variant="outline" class="self-start font-normal">
                                <CalendarDays class="text-muted-foreground" />
                                {{ dayLabel }}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" class="w-auto p-0">
                            <!-- Weeks start on Sunday, so the weekend is the first and last column -->
                            <Calendar
                                v-model="dayValue"
                                locale="fr"
                                :week-starts-on="0"
                                initial-focus
                                class="[&_td:is(:first-child,:last-child)_[data-slot=calendar-cell-trigger]:not([data-selected])]:text-red-500 dark:[&_td:is(:first-child,:last-child)_[data-slot=calendar-cell-trigger]:not([data-selected])]:text-red-400 [&_td:is(:first-child,:last-child)_[data-slot=calendar-cell-trigger][data-outside-view]:not([data-selected])]:text-red-500/50 dark:[&_td:is(:first-child,:last-child)_[data-slot=calendar-cell-trigger][data-outside-view]:not([data-selected])]:text-red-400/50"
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div class="flex flex-col gap-2.5">
                    <div class="grid grid-cols-3 gap-3">
                        <div class="flex min-w-0 flex-col gap-2">
                            <Label for="entry-start">Début</Label>
                            <Input
                                id="entry-start"
                                v-time-mask.advance
                                autocomplete="off"
                                :model-value="range.start.value"
                                inputmode="numeric"
                                maxlength="5"
                                placeholder="HH:MM"
                                class="font-mono"
                                @update:model-value="range.setStart(String($event))"
                            />
                        </div>
                        <div class="flex min-w-0 flex-col gap-2">
                            <Label for="entry-end">Fin</Label>
                            <TrackerDurationPresets
                                :start="range.startMinutes.value"
                                :minutes="range.durationMinutes.value ?? undefined"
                                @duration="range.setDuration(formatMinutes($event))"
                                @end="range.setEnd"
                            >
                                <Input
                                    id="entry-end"
                                    v-time-mask.advance
                                    autocomplete="off"
                                    :model-value="range.end.value"
                                    inputmode="numeric"
                                    maxlength="5"
                                    placeholder="HH:MM"
                                    class="font-mono"
                                    @update:model-value="range.setEnd(String($event))"
                                />
                            </TrackerDurationPresets>
                        </div>
                        <div class="flex min-w-0 flex-col gap-2">
                            <Label for="entry-duration">Durée</Label>
                            <Input
                                id="entry-duration"
                                v-time-mask
                                :tabindex="range.endMinutes.value === null ? 0 : -1"
                                autocomplete="off"
                                :model-value="range.duration.value"
                                inputmode="numeric"
                                maxlength="5"
                                placeholder="00:00"
                                class="font-mono"
                                @update:model-value="range.setDuration(String($event))"
                            />
                        </div>
                    </div>
                    <p v-if="range.endsNextDay.value" class="text-xs text-muted-foreground">
                        Se termine le lendemain : l’entrée sera séparée en deux à minuit.
                    </p>
                </div>

                <div class="flex flex-col gap-2">
                    <Label for="entry-project">Projet</Label>
                    <TrackerProjectCombobox id="entry-project" v-model="form.project" />
                </div>

                <div class="flex flex-col gap-2">
                    <Label for="entry-note">Note</Label>
                    <!-- Grows with its content through CSS field-sizing, from 3 lines up to a max height -->
                    <Textarea
                        id="entry-note"
                        v-model="form.note"
                        autocomplete="off"
                        placeholder="Courte description..."
                        class="max-h-60 min-h-[calc(3lh+1rem+2px)] wrap-anywhere"
                    />
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" @click="requestClose">
                        Annuler
                    </Button>
                    <Button type="submit" :disabled="!canSave">
                        Enregistrer
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
