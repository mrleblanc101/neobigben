<script setup lang="ts">
const errorMessage = ref("");
</script>

<template>
    <AuthLayout>
        <Card>
            <CardHeader>
                <CardTitle class="text-2xl">
                    Login
                </CardTitle>
                <CardDescription>
                    Sign in with your Google account
                </CardDescription>
            </CardHeader>
            <CardContent class="grid gap-4">
                <Alert v-if="errorMessage" variant="destructive">
                    <AlertDescription>{{ errorMessage }}</AlertDescription>
                </Alert>
                <AuthGoogleSignInButton @error="errorMessage = $event">
                    Login with Google
                </AuthGoogleSignInButton>
            </CardContent>
        </Card>
    </AuthLayout>
</template>
