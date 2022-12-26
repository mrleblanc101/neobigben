<template>
    <button
        type="button"
        aria-label="Color Mode"
        class="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-800 inline-flex items-center justify-center font-bold h-10 w-10 text-sm"
        @click="onClick"
    >
        <ColorScheme placeholder="...">
            <ISun v-if="colorMode.preference === 'dark'" inline src="" />
            <IMoon v-else-if="colorMode.preference === 'light'" inline src="" />
            <IComputer v-else inline src="" />
        </ColorScheme>
    </button>
</template>

<script setup lang="ts">
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

<!-- <style lang="ts" scoped>
css({
  button: {
    display: 'flex',
    color: '{color.gray.500}',
    '@dark': {
      color: '{color.gray.400}'
    },
    '&:hover': {
      color: '{color.gray.700}',
      '@dark': {
        color: '{color.gray.200}',
      }
    },
  }
})
</style> -->
