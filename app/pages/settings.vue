<script setup lang="ts">
import { ArrowLeft, X } from "@lucide/vue";

const colorMode = useColorMode();
const { weeklyGoalHours, dayStart, ready, error, init, saveSettings } = useTimeTracker();

onMounted(init);

const themes = [
    { value: "light", label: "Clair" },
    { value: "dark", label: "Sombre" },
    { value: "system", label: "Système" },
];

// Drafts of the settings saved in Supabase, filled once they're loaded
const goal = ref("");
const start = ref("");
function fill() {
    goal.value = String(weeklyGoalHours.value);
    start.value = dayStart.value;
}
watch(ready, value => value && fill(), { immediate: true });

const goalHours = computed(() => (/^\d{1,2}$/.test(goal.value) ? Number(goal.value) : null));
const goalValid = computed(() => goalHours.value !== null && goalHours.value >= 1 && goalHours.value <= 80);
const startValid = computed(() => parseClock(start.value) !== null);
const dirty = computed(() => goal.value !== String(weeklyGoalHours.value) || start.value !== dayStart.value);

const saving = ref(false);
const saved = ref(false);
watch([goal, start], () => (saved.value = false));

async function save() {
    if (!ready.value || !dirty.value || !goalValid.value || !startValid.value) return;
    saving.value = true;
    saved.value = await saveSettings({ weeklyGoalHours: goalHours.value!, dayStart: start.value });
    saving.value = false;
}
</script>

<template>
    <div class="flex min-h-svh flex-col">
        <TrackerAppHeader />
        <main class="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
            <div class="flex flex-col gap-3">
                <NuxtLink to="/" class="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft class="size-4" />
                    Retour
                </NuxtLink>
                <h1 class="text-2xl font-semibold tracking-tight">
                    Paramètres
                </h1>
            </div>

            <Alert v-if="error" variant="destructive" class="pr-10">
                <AlertDescription>{{ error }}</AlertDescription>
                <button type="button" aria-label="Fermer" class="absolute top-3 right-3 opacity-70 hover:opacity-100" @click="error = null">
                    <X class="size-4" />
                </button>
            </Alert>

            <Card>
                <CardHeader>
                    <CardTitle>Apparence</CardTitle>
                    <CardDescription>Le thème s’applique immédiatement et est mémorisé sur cet appareil.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="grid w-full max-w-xs grid-cols-3 gap-0.5 rounded-md bg-muted p-[3px]" role="radiogroup" aria-label="Thème">
                        <button
                            v-for="option in themes"
                            :key="option.value"
                            type="button"
                            role="radio"
                            :aria-checked="colorMode.preference === option.value"
                            class="h-8 rounded-sm text-sm font-medium"
                            :class="colorMode.preference === option.value ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'"
                            @click="colorMode.preference = option.value"
                        >
                            {{ option.label }}
                        </button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Suivi du temps</CardTitle>
                    <CardDescription>Enregistrés dans votre compte.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form class="flex flex-col gap-6" @submit.prevent="save">
                        <div class="flex flex-col gap-2">
                            <Label for="settings-goal">Objectif hebdomadaire</Label>
                            <div class="flex items-center gap-2">
                                <Input
                                    id="settings-goal"
                                    v-model="goal"
                                    autocomplete="off"
                                    inputmode="numeric"
                                    maxlength="2"
                                    class="w-20 font-mono"
                                    :aria-invalid="!goalValid"
                                    :disabled="!ready"
                                />
                                <span class="text-sm text-muted-foreground">heures par semaine</span>
                            </div>
                            <p class="text-xs text-muted-foreground">
                                Entre 1 et 80 heures. L’objectif d’une journée de semaine en est le cinquième.
                            </p>
                        </div>

                        <div class="flex flex-col gap-2">
                            <Label for="settings-start">Heure de début</Label>
                            <Input
                                id="settings-start"
                                v-time-mask
                                autocomplete="off"
                                :model-value="start"
                                inputmode="numeric"
                                maxlength="5"
                                placeholder="HH:MM"
                                class="w-24 font-mono"
                                :aria-invalid="!!start && !startValid"
                                :disabled="!ready"
                                @update:model-value="start = maskedValue(String($event))"
                            />
                            <p class="text-xs text-muted-foreground">
                                Début proposé pour une nouvelle entrée sur une journée encore vide.
                            </p>
                        </div>

                        <div class="flex items-center gap-3">
                            <Button type="submit" :disabled="!ready || saving || !dirty || !goalValid || !startValid">
                                Enregistrer
                            </Button>
                            <Button v-if="dirty" type="button" variant="ghost" @click="fill">
                                Annuler
                            </Button>
                            <span v-if="saved" class="text-sm text-muted-foreground">Paramètres enregistrés.</span>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
    </div>
</template>
