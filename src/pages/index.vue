<template>
    <div class="flex min-h-full max-w-full grow justify-center xl:pr-[28rem]">
        <div class="mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-3 lg:px-8">
            <TimeEntriesHeader />
            <div class="mx-auto flex w-full flex-col items-center gap-2">
                <TimeEntry v-for="(entry, index) in todaysEntries" :key="entry.id" :entry="entry" />
                <TimeEntry v-if="canCreateEntry" :key="key" @add="key = Date.now()" />
            </div>
        </div>
        <SummarySidebar />
    </div>
</template>

<script lang="ts" setup>
import { useIndexStore } from '@/stores/index';
import { storeToRefs } from 'pinia';
import { usePendingPromises } from 'vuefire';

const store = useIndexStore();
await usePendingPromises();

const { todaysEntries, canCreateEntry } = storeToRefs(store);

const key = ref(Date.now());
</script>
