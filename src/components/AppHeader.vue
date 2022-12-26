<template>
    <header class="fixed top-0 z-40 w-full border-b dark:border-gray-800 bg-white dark:bg-gray-900">
        <div class="flex items-center justify-between h-16 px-4 lg:px-8">
            <h1 class="text-2xl font-black">NeoBigben</h1>
            <div class="flex items-center gap-6">
                <div class="flex gap-2 items-center font-bold text-xl">
                    <IClock />
                    {{ remainingTime }}
                </div>
                <!-- 40h00 - 02h00 = 38h00 -->
                <!-- Total de la semaine -->
                <!-- Heures faites -->
                <!-- Heures restantes -->
                <!-- Total par journée -->
                <ColorSwitcher />
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>
import IClock from '@/assets/svg/clock.svg?component';
import { storeToRefs } from 'pinia';
import { useStore } from '@/stores/index';

const store = useStore();

const { remainingTime } = storeToRefs(store);
</script>
