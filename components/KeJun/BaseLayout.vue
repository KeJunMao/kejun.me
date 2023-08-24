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
    <main mx-auto flex-1 overflow-hidden p-4 py-10 lt-md:max-w-100vw :class="[containerClass]">
      <div class="m-auto mb-8 prose lt-md:max-w-100vw" :class="[page.center ? 'text-center' : '']">
        <h1 class="mb-0 text-color-base">
          {{ page.title }}
        </h1>
        <p v-if="page.date" class="mt-2 opacity-50">
          {{ $dayjs(page.date).format('YYYY-MM-DD HH:mm') }}
        </p>
      </div>
      <slot />
      <Comment :config="commentConfig" />
    </main>
  </div>
</template>
