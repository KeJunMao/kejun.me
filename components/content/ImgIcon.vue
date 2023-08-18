<script lang="ts" setup>
defineProps<{
  src: string
  alt?: string
}>()
</script>

<template>
  <img v-if="src" class="inline-block h-1.2em w-1.2em object-cover" loading="lazy" :src="src" :alt="alt">
</template>
