<script setup lang="ts">
const slots = useSlots()

const selectedIndex = ref(0)

const tabs = computed(() => slots.default?.().map((slot, index) => {
  return {
    label: slot.props?.filename || slot.props?.label || `${index}`,
    component: slot,
  }
}) || [])

const selectedTab = computed(() => tabs.value.find((_, index) => index === selectedIndex.value))
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div :selected-index="selectedIndex" class="code-group">
    <div class="flex overflow-hidden border border-gray-200 rounded-t-md -mb-px dark:border-zinc-700">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        as="template"
        @click="selectedIndex = index"
      >
        <button
          class="border-r border-r-gray-200 px-4 py-2 text-sm dark:border-r-gray-700 focus:outline-none"
          tabindex="-1"
          :class="[selectedIndex === index ? 'font-medium bg-zinc-200 dark:bg-gray-800' : 'hover:bg-zinc-200 dark:hover:bg-gray-800']"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div
      class="border-t-0"
    >
      <component :is="selectedTab.component" v-if="selectedTab" class="!my-0 !rounded-t-none" />
    </div>
  </div>
</template>

<style>
.code-group .filename {
  display: none;
}
</style>
