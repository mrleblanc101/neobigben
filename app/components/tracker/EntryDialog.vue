<script setup lang="ts">
const { editor, closeEditor, saveEditor } = useTimeTracker();
const { confirm } = useConfirm();

// Project and note; the times live in `range`
const form = ref({ project: "", note: "" });
const range = useTimeRange();

// The form as opened, to tell whether closing would drop changes
const snapshot = () => JSON.stringify([form.value, range.start.value, range.end.value, range.duration.value]);
const initialForm = ref("");
const dirty = computed(() => snapshot() !== initialForm.value);

watch(editor, (value) => {
    if (!value) return;
    // The link is edited inside the note, the same way it was typed in quick-add
    const { project, start, end, note, url } = value.form;
    form.value = { project, note: [note, url].filter(Boolean).join(" ") };
    range.reset(start, displayClock(end));
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

const canSave = computed(() => !!form.value.project && range.valid.value);

function save() {
    if (!canSave.value) return;
    // The link left in the note becomes the entry's link: deleting it from the note removes it
    saveEditor({ project: form.value.project, start: range.start.value, end: range.end.value, ...splitNoteLink(form.value.note) });
}
</script>

<template>
    <Dialog v-model:open="open">
        <DialogContent class="gap-[18px] sm:max-w-[460px]">
            <DialogHeader>
                <DialogTitle>{{ editor?.id === "new" ? "Nouvelle entrée" : "Modifier l’entrée" }}</DialogTitle>
                <DialogDescription>Renseignez le projet, la plage horaire et une note optionnelle.</DialogDescription>
            </DialogHeader>

            <form class="flex flex-col gap-[18px]" @submit.prevent="save" @keydown.capture="focusPreviousOnBackspace">
                <div class="flex flex-col gap-2">
                    <Label for="entry-project">Projet</Label>
                    <TrackerProjectCombobox id="entry-project" v-model="form.project" />
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
                                v-time-mask:duration
                                autocomplete="off"
                                :model-value="range.duration.value"
                                inputmode="numeric"
                                maxlength="5"
                                placeholder="HH:MM"
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
