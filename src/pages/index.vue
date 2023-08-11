<template>
    <div class="flex justify-center min-h-full grow xl:pr-[28rem] max-w-full">
        <div class="px-4 lg:px-8 py-6 flex mx-auto flex-col items-center max-w-5xl w-full">
            <TimeEntriesHeader />
            <div class="flex flex-col items-center w-full gap-2 mx-auto">
                <TimeEntry v-for="(entry, index) in todaysEntries" :key="entry.id" :entry="entry" />
                <TimeEntry v-if="canCreateEntry" :key="key" />
            </div>
        </div>
        <SummarySidebar />
    </div>
</template>

<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '@/stores/index';
import { storeToRefs } from 'pinia';

const store = useStore();
const { todaysEntries, canCreateEntry } = storeToRefs(store);

const key = ref(uuidv4());

watch(todaysEntries, () => {
    key.value = uuidv4();
});
</script>
