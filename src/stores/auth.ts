import { defineStore } from 'pinia';
import { GoogleAuthProvider } from 'firebase/auth';
export const googleAuthProvider = new GoogleAuthProvider();
import { signInWithPopup, signOut } from 'firebase/auth';
import { useFirebaseAuth } from 'vuefire';

export const useAuthStore = defineStore('auth', () => {
    function login() {
        const auth = useFirebaseAuth()!;

        signInWithPopup(auth, googleAuthProvider).then(() => {
            navigateTo({
                path: '/',
            });
        });
    }
    function logout() {
        const auth = useFirebaseAuth()!;
        signOut(auth).then(() => {
            navigateTo({
                path: '/login',
            });
        });
    }

    return {
        // actions
        login,
        logout,
    };
});
