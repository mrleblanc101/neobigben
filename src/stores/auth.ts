import { defineStore } from 'pinia';
import { GoogleAuthProvider } from 'firebase/auth';
export const googleAuthProvider = new GoogleAuthProvider();
import { signInWithPopup, signOut } from 'firebase/auth';
import { useFirebaseAuth } from 'vuefire';
import { useIndexStore } from '@/stores/index';

export const useAuthStore = defineStore('auth', () => {
    async function login() {
        const auth = useFirebaseAuth()!;
        const localeRoute = useLocaleRoute();

        await signInWithPopup(auth, googleAuthProvider);
        return navigateTo(
            localeRoute({
                name: 'index',
            }),
        );
    }
    async function logout() {
        const auth = useFirebaseAuth()!;
        const localeRoute = useLocaleRoute();
        const store = useIndexStore();

        await navigateTo(
            localeRoute({
                name: 'logout',
            }),
        );
        store.$reset();
        await signOut(auth);
        return navigateTo(
            localeRoute({
                name: 'login',
            }),
        );
    }

    return {
        // actions
        login,
        logout,
    };
});
