<script setup lang="ts">
const { editor, projects, closeEditor, saveEditor } = useTimeTracker();

const form = ref<EntryDraft>({ project: "", start: "", end: "", note: "", url: "" });
// What the user typed in the duration field, kept while it isn't a valid duration yet
const durationDraft = ref<string | null>(null);

watch(editor, (value) => {
    if (!value) return;
    form.value = { ...value.form };
    durationDraft.value = null;
}, { immediate: true });

const open = computed({
    get: () => !!editor.value,
    set: value => !value && closeEditor(),
});

const minutes = computed(() => (form.value.start && form.value.end ? Math.max(0, entryMinutes(form.value)) : 0));
const canSave = computed(() => !!form.value.project && minutes.value > 0);

const presets = [15, 30, 60, 90, 120].map(value => ({
    value,
    label: value < 60 ? `${value} min` : `${Math.floor(value / 60)} h${value % 60 ? ` ${value % 60}` : ""}`,
}));

function setDuration(value: number, typed?: string) {
    durationDraft.value = typed ?? null;
    form.value.end = addToClock(toMinutes(form.value.start), value);
}

// Moving the start keeps the duration
function onStart(value: string | number) {
    const duration = minutes.value;
    form.value.start = String(value);
    if (form.value.start) form.value.end = addToClock(toMinutes(form.value.start), duration);
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
    if (canSave.value) saveEditor({ ...form.value, note: form.value.note.trim(), url: form.value.url.trim() });
}
</script>

<template>
    <Dialog v-model:open="open">
        <DialogContent class="gap-[18px] sm:max-w-[460px]">
            <DialogHeader>
                <DialogTitle>{{ editor?.id === "new" ? "Nouvelle entrée" : "Modifier l’entrée" }}</DialogTitle>
                <DialogDescription>Renseignez le projet, la plage horaire et un lien optionnel.</DialogDescription>
            </DialogHeader>

            <form class="flex flex-col gap-[18px]" @submit.prevent="save">
                <div class="flex flex-col gap-2">
                    <Label for="entry-project">Projet</Label>
                    <select
                        id="entry-project"
                        v-model="form.project"
                        class="h-9 rounded-md border bg-transparent px-2.5 text-sm shadow-xs dark:bg-input/30"
                    >
                        <option v-for="project in projects" :key="project.name" :value="project.name">
                            {{ project.name }}
                        </option>
                    </select>
                </div>

                <div class="flex flex-col gap-2.5">
                    <div class="grid grid-cols-3 gap-3">
                        <div class="flex min-w-0 flex-col gap-2">
                            <Label for="entry-start">Début</Label>
                            <Input id="entry-start" type="time" :model-value="form.start" class="font-mono" @update:model-value="onStart" />
                        </div>
                        <div class="flex min-w-0 flex-col gap-2">
                            <Label for="entry-end">Fin</Label>
                            <Input id="entry-end" type="time" :model-value="form.end" class="font-mono" @update:model-value="onEnd" />
                        </div>
                        <div class="flex min-w-0 flex-col gap-2">
                            <Label for="entry-duration">Durée</Label>
                            <Input
                                id="entry-duration"
                                :model-value="durationDraft ?? formatMinutes(minutes)"
                                placeholder="HH:MM"
                                class="font-mono"
                                @update:model-value="onDuration"
                            />
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                        <Button
                            v-for="preset in presets"
                            :key="preset.value"
                            type="button"
                            variant="outline"
                            size="xs"
                            class="h-[26px] px-2.5 font-mono font-normal"
                            :class="{ 'border-muted-foreground/60 bg-accent dark:bg-accent': minutes === preset.value }"
                            @click="setDuration(preset.value)"
                        >
                            {{ preset.label }}
                        </Button>
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <Label for="entry-note">Note</Label>
                    <Input id="entry-note" v-model="form.note" placeholder="Rencontre, corrections…" />
                </div>

                <div class="flex flex-col gap-2">
                    <Label for="entry-url">Lien</Label>
                    <Input id="entry-url" v-model="form.url" type="url" placeholder="https://libeocom.atlassian.net/browse/…" />
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" @click="closeEditor">
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
