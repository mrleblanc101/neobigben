<template>
    <button
        type="button"
        class="shadow bg-primary-500 hover:bg-primary-400 text-white dark:text-gray-900 cursor-pointer rounded text-sm font-bold focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 inline-flex items-center justify-center py-2 px-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none gap-2 whitespace-nowrap h-9 transition"
        @click="onClick"
    >
        <ColorScheme placeholder="...">
            <template v-if="colorMode.preference === 'dark'">
                {{ $t('Sombre') }}
                <IMoon class="h-5"  />
            </template>
            <template v-else-if="colorMode.preference === 'light'">
                {{ $t('Clair') }}
                <ISun class="h-5"  />
            </template>
            <template v-else>
                {{ $t('Système') }}
                <IComputer class="h-5"  />
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
