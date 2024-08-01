import { defineStore } from 'pinia';
import { GoogleAuthProvider } from 'firebase/auth';
import { signInWithPopup } from 'firebase/auth';
import { useFirebaseAuth } from 'vuefire';
import { useIndexStore } from '@/stores/index';

export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
    prompt: 'select_account',
});

export const useAuthStore = defineStore('auth', () => {
    const auth = useFirebaseAuth()!;
    const localePath = useLocalePath();
    const store = useIndexStore();
    const { createUserInfo } = store;

    async function login() {
        return signInWithPopup(auth, googleAuthProvider).then(async (result) => {
            await createUserInfo(result);
            navigateTo(
                localePath({
                    name: 'index',
                }),
            );
        });
    }
    async function logout() {
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
