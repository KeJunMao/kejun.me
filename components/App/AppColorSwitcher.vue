<script setup lang="ts">
const colorMode = useColorMode()
function onClick() {
  const values = ['system', 'light', 'dark']
  const index = values.indexOf(colorMode.preference)
  const next = (index + 1) % values.length

  colorMode.preference = values[next]
}
</script>

<template>
  <AppNavButton cursor-pointer @click="onClick">
    <!-- @vue-expect-error ignore -->
    <ColorScheme placeholder="...">
      <span
        v-if="colorMode.preference === 'dark'"
        i-ri-moon-fill
      />
      <span
        v-else-if="colorMode.preference === 'light'"
        i-ri-sun-fill
      />
      <span
        v-else
        i-ri-computer-fill
      />
    </ColorScheme>
  </AppNavButton>
</template>
