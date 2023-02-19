<template>
    <slot></slot>
</template>

<script lang="ts">
export default {
    name: 'Tab',
    props: {
        title: {
            type: String,
            default: '',
        },
    },
};
</script>

<style lang="postcss" scoped></style>
