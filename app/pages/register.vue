<script setup lang="ts">
const supabase = useSupabaseClient();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const errorMessage = ref("");
const emailSent = ref(false);

async function signUp() {
    errorMessage.value = "";

    if (password.value !== confirmPassword.value) {
        errorMessage.value = "Passwords do not match";
        return;
    }

    loading.value = true;

    const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
            emailRedirectTo: `${window.location.origin}/confirm`,
        },
    });

    loading.value = false;

    if (error) {
        errorMessage.value = error.message;
        return;
    }

    // No session means email confirmation is enabled on the Supabase project
    if (!data.session) {
        emailSent.value = true;
        return;
    }

    await navigateTo("/");
}
</script>

<template>
    <AuthLayout>
        <Card>
            <CardHeader>
                <CardTitle class="text-2xl">
                    Sign up
                </CardTitle>
                <CardDescription>
                    Create an account with your email and a password
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Alert v-if="emailSent">
                    <AlertTitle>Check your email</AlertTitle>
                    <AlertDescription>
                        We sent a confirmation link to {{ email }}.
                    </AlertDescription>
                </Alert>
                <form v-else class="grid gap-4" @submit.prevent="signUp">
                    <Alert v-if="errorMessage" variant="destructive">
                        <AlertDescription>{{ errorMessage }}</AlertDescription>
                    </Alert>
                    <div class="grid gap-2">
                        <Label for="email">Email</Label>
                        <Input
                            id="email"
                            v-model="email"
                            type="email"
                            placeholder="m@example.com"
                            autocomplete="email"
                            required
                        />
                    </div>
                    <div class="grid gap-2">
                        <Label for="password">Password</Label>
                        <Input
                            id="password"
                            v-model="password"
                            type="password"
                            autocomplete="new-password"
                            minlength="6"
                            required
                        />
                    </div>
                    <div class="grid gap-2">
                        <Label for="confirm-password">Confirm password</Label>
                        <Input
                            id="confirm-password"
                            v-model="confirmPassword"
                            type="password"
                            autocomplete="new-password"
                            required
                        />
                    </div>
                    <Button type="submit" class="w-full" :disabled="loading">
                        {{ loading ? "Creating account..." : "Create account" }}
                    </Button>
                </form>
                <div class="mt-4 text-center text-sm">
                    Already have an account?
                    <NuxtLink to="/login" class="underline underline-offset-4">
                        Login
                    </NuxtLink>
                </div>
            </CardContent>
        </Card>
    </AuthLayout>
</template>
