<template>
    <NuxtLayout>
        <div class="flex flex-col items-center max-w-5xl gap-4 mx-auto">
            <div class="w-full flex flex-col items-center max-w-5xl gap-4 mx-auto">
                <TimeEntry v-for="(entry, index) in entries" :key="entry.id" :entry="entry" />
            </div>
            <TimeEntry :key="key" />
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '@/stores/index';

const { entries, projects } = useStore();

const key = ref(uuidv4());

watch(entries, () => {
    key.value = uuidv4();
});
</script>
