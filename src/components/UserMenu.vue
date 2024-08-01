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
            v-on-click-outside.bubble="onClickOutside"
            class="absolute right-0 top-full flex w-64 min-w-full translate-y-2 flex-col gap-6 rounded border bg-stone-50 p-4 dark:border-slate-800 dark:bg-slate-900"
        >
            <div class="flex flex-col gap-2">
                <div class="border-b pb-2 dark:border-slate-800">
                    <div class="text-xs font-bold uppercase opacity-80">{{ $t('Bonjour') }}</div>
                    <div class="mt-1 block text-2xl font-black tabular-nums leading-[1]">
                        {{ user?.display_name }}
                    </div>
                </div>

                <LanguageSwitcher />
                <ColorSwitcher />
                <button
                    class="inline-flex h-9 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded bg-red-500 px-3 py-2 text-sm font-bold text-white shadow ring-primary-200 transition hover:bg-red-400 focus:outline-none focus-visible:ring active:bg-red-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-900 dark:ring-slate-600"
                    type="button"
                    @click="logout"
                >
                    {{ $t('Déconnexion') }}
                    <ILogout class="h-5 w-5" />
                </button>
                <div class="text-center text-xs">
                    Version:
                    {{ config.public.commitTag }}
                    {{ config.public.commitTag ? `(${config.public.commitShortSha})` : config.public.commitShortSha }}
                </div>
            </div>
        </div>
    </Transition>
</template>

<script lang="ts" setup>
import ILogout from '@/assets/svg/logout.svg?component';

import { useAuthStore } from '@/stores/auth';

withDefaults(
    defineProps<{
        is_open: boolean;
    }>(),
    {
        is_open: false,
    },
);
const emit = defineEmits(['update:is_open']);

const config = useRuntimeConfig();
const auth = useAuthStore();
const store = useIndexStore();
const { logout } = auth;
const { user } = storeToRefs(store);

const route = useRoute();

watch(
    () => route.name,
    () => {
        emit('update:is_open', false);
    },
);
function onClickOutside() {
    emit('update:is_open', false);
}
</script>
