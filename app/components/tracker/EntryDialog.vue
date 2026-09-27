<script setup lang="ts">
const { editor, closeEditor, saveEditor } = useTimeTracker();
const { confirm } = useConfirm();

const form = ref<EntryDraft>({ project: "", start: "", end: "", note: "", url: "" });
// What the user typed in the duration field, kept while it isn't a valid duration yet
const durationDraft = ref<string | null>(null);
// The form as opened, to tell whether closing would drop changes
const initialForm = ref("");
const dirty = computed(() => JSON.stringify(form.value) !== initialForm.value);

watch(editor, (value) => {
    if (!value) return;
    // The link is edited inside the note, the same way it was typed in quick-add
    const { note, url } = value.form;
    form.value = { ...value.form, note: [note, url].filter(Boolean).join(" "), url: "" };
    initialForm.value = JSON.stringify(form.value);
    durationDraft.value = null;
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

// Start and end stay partial ("0H:MM") while being typed
const start = computed(() => parseClock(form.value.start));
const end = computed(() => parseClock(form.value.end));
const minutes = computed(() => (start.value !== null && end.value !== null ? Math.max(0, end.value - start.value) : 0));
// A project, a complete start and end with the end after the start, and no half-typed duration
const canSave = computed(() => !!form.value.project && minutes.value > 0 && (!durationDraft.value || parseDuration(durationDraft.value) !== null));
// Last valid duration, so retyping the start from scratch still moves the end with it
const keptDuration = ref(0);
watch(minutes, value => value > 0 && (keptDuration.value = value), { immediate: true });

function setDuration(value: number, typed?: string) {
    durationDraft.value = typed ?? null;
    if (start.value !== null) form.value.end = addToClock(start.value, value);
}

// Moving the start keeps the duration
function onStart(value: string | number) {
    form.value.start = String(value);
    if (start.value !== null && keptDuration.value) form.value.end = addToClock(start.value, keptDuration.value);
}

function onEnd(value: string | number) {
    durationDraft.value = null;
    form.value.end = String(value);
}

function onDuration(value: string | number) {
    const typed = String(value);
    const duration = parseDuration(typed);
    if (duration !== null) setDuration(duration, typed);
    else durationDraft.value = typed;
}

function save() {
    if (!canSave.value) return;
    // The link left in the note becomes the entry's link: deleting it from the note removes it
    saveEditor({ ...form.value, ...splitNoteLink(form.value.note) });
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
                                v-time-mask
                                autocomplete="off"
                                :model-value="form.start"
                                inputmode="numeric"
                                maxlength="5"
                                placeholder="HH:MM"
                                class="font-mono"
                                @update:model-value="onStart"
                            />
                        </div>
                        <div class="flex min-w-0 flex-col gap-2">
                            <Label for="entry-end">Fin</Label>
                            <TrackerDurationPresets :start="start" :minutes="minutes" @select="setDuration">
                                <Input
                                    id="entry-end"
                                    v-time-mask
                                    autocomplete="off"
                                    :model-value="form.end"
                                    inputmode="numeric"
                                    maxlength="5"
                                    placeholder="HH:MM"
                                    class="font-mono"
                                    @update:model-value="onEnd"
                                />
                            </TrackerDurationPresets>
                        </div>
                        <div class="flex min-w-0 flex-col gap-2">
                            <Label for="entry-duration">Durée</Label>
                            <Input
                                id="entry-duration"
                                v-time-mask:duration
                                autocomplete="off"
                                :model-value="durationDraft ?? (start !== null && end !== null ? formatMinutes(minutes) : '')"
                                inputmode="numeric"
                                maxlength="5"
                                placeholder="HH:MM"
                                class="font-mono"
                                @update:model-value="onDuration"
                            />
                        </div>
                    </div>
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
