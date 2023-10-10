<script setup>
const route = useRoute()
</script>

<template>
  <div min-h-screen flex flex-col>
    <NuxtLoadingIndicator />
    <AppHeader v-if="route.meta.appHeader !== false">
      <template #left>
        <AppLogo />
      </template>
    </AppHeader>
    <NuxtPage flex flex-1 flex-col />
  </div>
</template>
