<script lang="ts" setup>
withDefaults(defineProps<{
  containerClass?: string
}>(), {
  containerClass: 'container',
})
const { page } = useContent()
const commentConfig = computed(() => {
  const {
    comment,
  } = page.value
  return comment || {
    show: true,
  }
})
</script>

<template>
  <div flex flex-1 flex-col>
    <main mx-auto flex-1 p-4 :class="[containerClass]">
      <h1 my-4 text-center text-4xl font-600 leading-tight text-color-base>
        {{ page.title }}
      </h1>
      <slot />
      <Comment :config="commentConfig" />
    </main>
  </div>
</template>
