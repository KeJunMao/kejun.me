<script lang="ts" setup>
import Giscus from '@giscus/vue'

const props = defineProps<{
  config: any
}>()

const colorMode = useColorMode()
const showComment = computed(() => props.config.show)
</script>

<template>
  <div v-lazy-show="showComment" mx-auto mt-4 max-w-3xl>
    <Giscus
      repo="kejunmao/kejun.me"
      repo-id="R_kgDOKIg8yw"
      category="Announcements"
      category-id="DIC_kwDOKIg8y84CYub-"
      mapping="pathname"
      term="Welcome to @giscus/react component!"
      strict="0"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="bottom"
      :theme="colorMode.value"
      crossorigin="anonymous"
      lang="en"
      loading="lazy"
    />
  </div>
</template>
