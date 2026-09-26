<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();

async function signOut() {
    await supabase.auth.signOut();
    await navigateTo("/login");
}
</script>

<template>
    <div class="flex min-h-svh flex-col items-center justify-center gap-4">
        <p>Logged in as <strong>{{ user?.email }}</strong></p>
        <Button variant="outline" @click="signOut">
            Logout
        </Button>
    </div>
</template>
