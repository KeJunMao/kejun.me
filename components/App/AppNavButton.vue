<script lang="ts" setup>
import type { NuxtLinkProps } from 'nuxt/app'

const props = defineProps<NuxtLinkProps>()
</script>

<template>
  <NuxtLink v-bind="props" hover:color-gray-900 dark:hover:color-gray-50 active-class="color-primary">
    <slot />
  </NuxtLink>
</template>
