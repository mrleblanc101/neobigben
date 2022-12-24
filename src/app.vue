<template>
    <NuxtLayout>
        <div class="flex flex-col items-center max-w-5xl gap-4 mx-auto">
            <TimeEntry v-for="entry in entries" />
            <button
                type="button"
                class="shadow relative bg-primary-500 hover:bg-primary-400 text-white dark:text-gray-900 cursor-pointer rounded text-lg font-bold focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 inline-flex items-center justify-center h-12 px-3 w-full"
            >
                Ajouter
            </button>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '@/stores/index';

const { entries, projects } = useStore();
</script>
