<template>
    <Transition
        enter-active-class="transition transform origin-top-right ease-out duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition transform origin-top-right ease-in duration-200"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
    >
        <div
            v-if="is_open"
            class="absolute rounded top-full right-0 p-4 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 border min-w-full flex flex-col gap-6 translate-y-2 w-64"
            v-on-click-outside.bubble="onClickOutside"
        >
            <div class="flex flex-col gap-2">
                <div class="border-b dark:border-gray-800 pb-2">
                    <div class="text-xs font-bold uppercase opacity-80">{{ $t('Bonjour') }}</div>
                    <div v-if="user" class="text-2xl mt-1 font-black leading-[1] tabular-nums block">{{ user.displayName }}</div>
                </div>

                <LanguageSwitcher />
                <ColorSwitcher />
                <button
                    class="shadow bg-red-500 hover:bg-red-400 active:bg-red-600 text-white dark:text-gray-900 cursor-pointer rounded text-sm font-bold focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 inline-flex items-center justify-center py-2 px-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none gap-2 whitespace-nowrap h-9 transition"
                    type="button"
                    @click="logout"
                >
                    {{ $t('Déconnexion') }}
                    <ILogout class="h-5" />
                </button>
            </div>
        </div>
    </Transition>
</template>

<script lang="ts" setup>
import ILogout from '@/assets/svg/logout.svg?component';

import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore();
const { logout } = auth;
const user = useCurrentUser()

const route = useRoute();

defineProps(['is_open']);
const emit = defineEmits(['update:is_open']);

watch(() => route.name, () => {
    emit('update:is_open', false);
});
function onClickOutside() {
    emit('update:is_open', false);
}
</script>
