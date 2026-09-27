<script setup lang="ts">
const { request, settle } = useConfirm();

// Keeps the texts on screen while the dialog animates out
const shown = ref<ConfirmOptions | null>(null);
watch(request, value => value && (shown.value = value));

const open = computed({
    get: () => !!request.value,
    set: value => !value && settle(false),
});
</script>

<template>
    <AlertDialog v-model:open="open">
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{{ shown?.title }}</AlertDialogTitle>
                <AlertDialogDescription v-if="shown?.description">
                    {{ shown.description }}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <!-- A plain button: AlertDialogAction closes the dialog before this click handler runs -->
                <Button :variant="shown?.destructive ? 'destructive' : 'default'" @click="settle(true)">
                    {{ shown?.confirmLabel ?? "Confirmer" }}
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>
