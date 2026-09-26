<script setup lang="ts">
const user = useSupabaseUser();

// The Supabase client exchanges the code from the URL, then the user becomes available
watch(user, () => {
    if (user.value) {
        return navigateTo("/");
    }
}, { immediate: true });
</script>

<template>
    <AuthLayout>
        <p class="text-center text-sm text-muted-foreground">
            Waiting for login...
        </p>
    </AuthLayout>
</template>
