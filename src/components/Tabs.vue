<script lang="ts">
import { useIndexStore } from '@/stores/index';
import { storeToRefs } from 'pinia';

export default defineComponent({
    setup() {
        const slots = useSlots();
        const store = useIndexStore();
        const { selectedTabIndex } = storeToRefs(store);

        return () => {
            const children = slots.default ? slots.default() : null;
            const tabs = children?.filter((c) => (c.type as Component).name === 'Tab');

            const selectedTab = tabs?.at(selectedTabIndex.value);

            return h('div', [
                h(
                    'div',
                    { class: 'grid grid-flow-row auto-cols-fr border-b dark:border-gray-800' },
                    tabs?.map((tab, index) => {
                        return h(
                            'button',
                            {
                                class: [
                                    'relative p-4 pb-3 text-sm border-b-4 border-b-transparent border-l dark:border-l-gray-800 hover:bg-stone-100 dark:hover:bg-gray-800 row-start-1 focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 first:border-l-0',
                                    {
                                        'font-bold text-primary-500 after:absolute after:w-full after:border-b-4 after:left-0 after:-bottom-1 after:border-b-primary-500 after:dark:border-b-primary-500 ':
                                            index === selectedTabIndex.value,
                                    },
                                ],
                                type: 'button',
                                onClick: () => (selectedTabIndex.value = index),
                            },
                            tab.props?.title,
                        );
                    }),
                ),
                h(
                    'div',
                    {
                        key: selectedTabIndex.value,
                        class: 'p-4 py-6 flex flex-col gap-2 h-full overflow-y-auto relative',
                    },
                    selectedTab,
                ),
            ]);
        };
    },
});
</script>
