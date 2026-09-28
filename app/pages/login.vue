<script setup lang="ts">
useHead({ title: "Connexion" });

const errorMessage = ref("");
</script>

<template>
    <AuthLayout>
        <Card class="bg-background shadow-none">
            <CardHeader>
                <CardTitle class="text-2xl">
                    Connexion
                </CardTitle>
                <CardDescription>
                    Connectez-vous avec votre compte Google
                </CardDescription>
            </CardHeader>
            <CardContent class="grid gap-4">
                <Alert v-if="errorMessage" variant="destructive">
                    <AlertDescription>{{ errorMessage }}</AlertDescription>
                </Alert>
                <AuthGoogleSignInButton @error="errorMessage = $event">
                    Se connecter avec Google
                </AuthGoogleSignInButton>
            </CardContent>
        </Card>
    </AuthLayout>
</template>
