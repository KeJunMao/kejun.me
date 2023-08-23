<script lang="ts" setup>
const [open, toggle] = useToggle()
const [DefineTemplate, ReuseTemplate] = createReusableTemplate()
</script>

<template>
  <DefineTemplate>
    <header sticky top-0 z-9 p-4 backdrop-blur class="bg-zinc-50/75 dark:bg-zinc-900/75">
      <div mx-auto flex items-center justify-between container>
        <slot name="left" />
        <div flex gap-4 color-gray-500 lg:gap-4 dark:color-gray-400>
          <AppNavigation class="hidden! lg:flex!" />
          <AppColorSwitcher />
          <AppNavButton
            class="cursor-pointer text-lg lg:hidden"
            @click="toggle(!open)"
          >
            <span :class="[open ? 'i-ri-close-fill' : 'i-ri-menu-fill']" />
          </AppNavButton>
        </div>
      </div>
    </header>
  </DefineTemplate>
  <ReuseTemplate />
  <Transition name="fade">
    <div v-if="open" fixed inset-0 bottom-0 z-50 overflow-y-auto bg-white lg:hidden dark:bg-zinc-900>
      <ReuseTemplate />
      <div text-md px-4 pb-6 pt-3 sm:px-6>
        <AppNavigation class="flex-col" @click="toggle(false)" />
      </div>
    </div>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
