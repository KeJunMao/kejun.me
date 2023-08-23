<script lang="ts" setup>
const { page } = useContent()
const ccConfig = computed(() => {
  const {
    cc,
  } = page.value
  return cc || {
    show: true,
  }
})
const showCC = computed(() => {
  return ccConfig.value.show
})
</script>

<template>
  <KeJunBaseLayout container-class="prose prose-zinc dark:prose-invert">
    <slot />
    <KeJunFooter v-if="showCC">
      <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
        CC BY-NC-SA 4.0</a> 2016-PRESENT © KeJun
    </KeJunFooter>
  </KeJunBaseLayout>
</template>
