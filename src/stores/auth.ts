import { defineStore } from 'pinia';
import { GoogleAuthProvider } from 'firebase/auth';
import { signInWithPopup } from 'firebase/auth';
import { useFirebaseAuth } from 'vuefire';
import { useIndexStore } from '@/stores/index';

export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
    prompt: 'select_account'
});

export const useAuthStore = defineStore('auth', () => {
    async function login() {
        const auth = useFirebaseAuth()!;
        const localePath = useLocalePath();

        return signInWithPopup(auth, googleAuthProvider).then(async (result) => {
            const store = useIndexStore();
            await store.createUserInfo(result);
            navigateTo(
                localePath({
                    name: 'index',
                }),
            );
        });
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
