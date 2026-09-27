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
    // The link is edited inside the note, the same way it was typed in quick-add
    const { project, start, end, note, url } = value.form;
    form.value = { project, note: [note, url].filter(Boolean).join(" ") };
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

const open = computed({
    get: () => !!editor.value,
    set: value => !value && requestClose(),
});

const canSave = computed(() => !!form.value.project && range.valid.value && (!editing.value || /^\d{4}-\d{2}-\d{2}$/.test(day.value)));

function save() {
    if (!canSave.value) return;
    // The link left in the note becomes the entry's link: deleting it from the note removes it
    saveEditor(
        { project: form.value.project, start: range.start.value, end: range.end.value, ...splitNoteLink(form.value.note) },
        editing.value ? day.value : undefined,
    );
}
</script>

<template>
    <Dialog v-model:open="open">
        <DialogContent class="gap-[18px] sm:max-w-[460px]">
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
                        class="max-h-60 min-h-[calc(3lh+1rem+2px)] resize-none"
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
