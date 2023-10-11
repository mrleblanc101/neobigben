import { defineStore } from 'pinia';
import { GoogleAuthProvider } from 'firebase/auth';
export const googleAuthProvider = new GoogleAuthProvider();
import { signInWithPopup, signOut } from 'firebase/auth';
import { useFirebaseAuth } from 'vuefire';
import { useIndexStore } from '@/stores/index';

export const useAuthStore = defineStore('auth', () => {
    async function login() {
        const auth = useFirebaseAuth()!;
        const localePath = useLocalePath();

        await signInWithPopup(auth, googleAuthProvider);
        return navigateTo(
            localePath({
                name: 'index',
            }),
        );
    }
    async function logout() {
        const localePath = useLocalePath();

        return navigateTo(
            localePath({
                name: 'logout',
            }),
        );
    }

    return {
        // actions
        login,
        logout,
    };
});
