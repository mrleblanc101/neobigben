<template>
    <button
        type="button"
        class="inline-flex h-9 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded bg-primary-500 px-3 py-2 text-sm font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus:ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-900 dark:ring-slate-600"
        @click="onClick"
    >
        <ColorScheme placeholder="...">
            <template v-if="colorMode.preference === 'dark'">
                {{ $t('Sombre') }}
                <IMoon class="h-5 w-5" />
            </template>
            <template v-else-if="colorMode.preference === 'light'">
                {{ $t('Clair') }}
                <ISun class="h-5 w-5" />
            </template>
            <template v-else>
                {{ $t('Système') }}
                <IComputer class="h-5 w-5" />
            </template>
        </ColorScheme>
    </button>
</template>

<script lang="ts" setup>
import IMoon from '@/assets/svg/moon.svg?component';
import ISun from '@/assets/svg/sun.svg?component';
import IComputer from '@/assets/svg/computer.svg?component';

const colorMode = useColorMode();
const onClick = () => {
    const values = ['system', 'light', 'dark'];
    const index = values.indexOf(colorMode.preference);
    const next = (index + 1) % values.length;
    colorMode.preference = values[next];
};
</script>
