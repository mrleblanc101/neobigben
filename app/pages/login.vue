<script setup lang="ts">
const supabase = useSupabaseClient();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

async function signIn() {
    loading.value = true;
    errorMessage.value = "";

    const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    });

    loading.value = false;

    if (error) {
        errorMessage.value = error.message;
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
                    Login
                </CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form class="grid gap-4" @submit.prevent="signIn">
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
                            autocomplete="current-password"
                            required
                        />
                    </div>
                    <Button type="submit" class="w-full" :disabled="loading">
                        {{ loading ? "Signing in..." : "Login" }}
                    </Button>
                </form>
                <div class="mt-4 text-center text-sm">
                    Don't have an account?
                    <NuxtLink to="/register" class="underline underline-offset-4">
                        Sign up
                    </NuxtLink>
                </div>
            </CardContent>
        </Card>
    </AuthLayout>
</template>
