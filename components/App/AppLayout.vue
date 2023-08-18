<template>
  <div min-h-screen flex flex-col>
    <NuxtLoadingIndicator />
    <AppHeader>
      <template #left>
        <AppLogo />
      </template>
    </AppHeader>
    <NuxtPage flex flex-1 flex-col />
  </div>
</template>
