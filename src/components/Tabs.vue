<script lang="ts">
export default defineComponent({
    setup() {
        const slots = useSlots();
        const selectedTabIndex = ref(0);

        return () => {
            const children = slots.default ? slots.default() : null;
            const tabs = children?.filter((c) => (c.type as Component).name === 'Tab');

            const selectedTab = tabs?.at(selectedTabIndex.value);

            return h('div', [
                h(
                    'div',
                    { class: 'grid grid-flow-row auto-cols-fr border-b border-gray-200 dark:border-gray-700' },
                    tabs?.map((tab, index) => {
                        return h(
                            'button',
                            {
                                class: [
                                    'p-4 pb-3 text-sm border-b-4 border-y-transparent border-x-gray-200 dark:border-x-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 row-start-1',
                                    {
                                        'font-bold text-primary-500  border-b-primary-500 dark:border-b-primary-500 ':
                                            index === selectedTabIndex.value,
                                        'border-l': index !== 0,
                                    },
                                ],
                                type: 'button',
                                onClick: () => (selectedTabIndex.value = index),
                            },
                            tab.props?.title,
                        );
                    }),
                ),
                h('div', { class: 'p-4 py-6 flex flex-col gap-2 overflow-y-auto' }, selectedTab),
            ]);
        };
    },
});
</script>
