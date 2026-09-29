<script setup lang="ts">
import { ArrowUpRight } from "@lucide/vue";

defineProps<{ note: string }>();
</script>

<template>
    <!-- The note's text, with each link found in it shown as a badge in its place; badges wrap onto more lines -->
    <div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
        <template v-for="(part, index) in noteParts(note)" :key="index">
            <span v-if="part.type === 'text'" class="min-w-0 truncate text-foreground">{{ part.value }}</span>
            <a
                v-else
                :href="part.href"
                :title="part.href"
                target="_blank"
                rel="noopener"
                class="inline-flex h-5.5 shrink-0 items-center gap-1 rounded-md border px-2 font-mono text-xs font-medium whitespace-nowrap text-foreground hover:bg-accent"
            >
                {{ linkLabel(part.href) }}
                <ArrowUpRight class="size-3" />
            </a>
        </template>
        <span v-if="!note" class="text-muted-foreground/50">—</span>
    </div>
</template>
