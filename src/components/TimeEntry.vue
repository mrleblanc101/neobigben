<template>
    <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded flex flex-col gap-2 max-w-5xl">
        <div class="flex gap-2">
            <div class="grow">
                <label>De:</label>
                <TimeInput />
            </div>
            <div class="grow">
                <label>À:</label>
                <TimeInput />
            </div>
            <div class="grow">
                <label>Durée:</label>
                <TimeInput />
            </div>
            <div class="grow">
                <label>Date:</label>
                <input v-model="date" :class="{'date-input--has-value': date}" type="date" class="form-control form-input form-input-bordered w-full" placeholder="test" />
            </div>
        </div>
        <div>
            <label>Description:</label>
            <textarea class="block w-full form-control form-input form-input-bordered py-3 h-auto" rows="2" placeholder="Description..."></textarea>
        </div>
        <div class="text-right">
            <button type="button" class="shadow relative bg-primary-500 hover:bg-primary-400 text-white dark:text-gray-900 cursor-pointer rounded text-sm font-bold focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 inline-flex items-center justify-center h-9 px-3">Sauvegarder</button>
        </div>
    </div>
</template>

<script setup lang="ts">
const date = ref();
</script>

<style lang="postcss" scoped>
label {
    @apply uppercase font-bold text-xs;
}

/* placeholder text style */
input[type="date"]::-webkit-datetime-edit-text,
input[type="date"]::-webkit-datetime-edit-month-field,
input[type="date"]::-webkit-datetime-edit-day-field,
input[type="date"]::-webkit-datetime-edit-year-field {
    --tw-placeholder-opacity: 1;
    color: rgb(75 85 99 / var(--tw-placeholder-opacity))
}

/* regular text style */
input[type="date"].date-input--has-value::-webkit-datetime-edit-text,
input[type="date"].date-input--has-value::-webkit-datetime-edit-month-field,
input[type="date"].date-input--has-value::-webkit-datetime-edit-day-field,
input[type="date"].date-input--has-value::-webkit-datetime-edit-year-field {
  color: inherit;
}
</style>
