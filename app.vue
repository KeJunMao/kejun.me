<script lang="ts" setup>
useHead({
  titleTemplate: (title = 'KeJun') =>
    title && title.includes('KeJun') ? title : `${title} - KeJun`,
  bodyAttrs: {
    class:
      'antialiased font-sans text-color-base bg-color-base',
  },
})
</script>

<template>
  <AppLayout />
</template>
