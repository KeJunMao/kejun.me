<script lang="ts" setup>
import ContentComment from '@/components/content/Comment.vue'

defineProps<{
  containerClass?: string
}>()
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
    <main mx-auto flex-1 p-4 :class="[containerClass ? containerClass : 'container']">
      <h1 my-4 text-center text-4xl font-600 leading-tight>
        {{ page.title }}
      </h1>
      <slot />
      <ContentComment :config="commentConfig" />
    </main>
  </div>
</template>
