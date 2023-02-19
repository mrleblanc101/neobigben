<template>
    <div>
        <div class="grid grid-flow-row auto-cols-fr border-b border-gray-200 dark:border-gray-700">
            <button
                v-for="(tab, index) in tabs"
                class="p-4 pb-3 text-sm border-b-4 border-y-transparent border-x-gray-200 dark:border-x-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 row-start-1"
                type="button"
                :class="{
                    'font-bold text-primary-500  border-b-primary-500 dark:border-b-primary-500 ':
                        index === selectedTabIndex,
                    'border-l': index !== 0,
                }"
                @click="selectedTabIndex = index"
            >
                {{ tab.props?.title }}
            </button>
        </div>

        <div class="p-4 py-6 flex flex-col gap-2">
            <Component :is="selectedTab" :key="selectedTabIndex" />
        </div>
    </div>
</template>

<script lang="ts" setup>
const slots = useSlots();
const children = slots.default ? slots.default() : null;
const tabs = children?.filter((c) => (c.type as Component).name === 'Tab');

const selectedTabIndex = ref(0);
const selectedTab = computed(() => {
    return tabs?.at(selectedTabIndex.value);
});
</script>

<style lang="postcss" scoped></style>
