import { defineStore } from 'pinia';
import { GoogleAuthProvider } from 'firebase/auth'
export const googleAuthProvider = new GoogleAuthProvider()
import {
  signInWithPopup,
  signOut
} from 'firebase/auth'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'

export const useAuthStore = defineStore('auth', {
    actions: {
        login() {
            const auth = useFirebaseAuth()!;
            const user = useCurrentUser();

            signInWithPopup(auth, googleAuthProvider).then(() => {
                navigateTo({
                    path: '/',
                });
            })
        },
        logout() {
            const auth = useFirebaseAuth()!;
            signOut(auth).then(() => {
                navigateTo({
                    path: '/login',
                });
            });
        }
    },
    persist: true,
});
