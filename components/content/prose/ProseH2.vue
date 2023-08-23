<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
  <h2 :id="id" class="scroll-mt-15">
    <NuxtLink :href="`#${id}`" class="group">
      <div class="absolute inline-flex py-2 pr-2 opacity-0 transition-opacity -ml-6 group-hover:lg:opacity-100">
        <span i-heroicons-hashtag-20-solid class="text-primary-500 dark:text-primary-400 h-4 w-4" />
      </div>

      <slot />
    </NuxtLink>
  </h2>
</template>
