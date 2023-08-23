<script lang="ts" setup>
import Giscus from '@giscus/vue'

const props = defineProps<{
  config: any
}>()

const giscus = ref<ComponentPublicInstance | null>(null)
const iframe = ref<HTMLIFrameElement | null>(null)
const colorMode = useColorMode()
const showComment = computed(() => props.config.show)
const loading = ref(true)

watchOnce(iframe, () => {
  useEventListener(iframe, 'load', () => {
    loading.value = false
  })
})
onMounted(() => {
  setTimeout(() => {
    try {
      iframe.value = giscus.value?.$el?.shadowRoot.children[0] as HTMLIFrameElement
    }
    catch (error) {
      loading.value = false
    }
  }, 500)
})
</script>

<template>
  <div v-lazy-show="showComment" mx-auto mt-4 max-w-3xl>
    <div v-if="loading" my-4 flex flex-col items-center justify-center>
      <div
        i-ri-refresh-line animate-spin text-4xl
      />
      <p text-sm op-50>
        评论初始化中...
      </p>
    </div>
    <Giscus
      id="comments"
      ref="giscus"
      repo="kejunmao/kejun.me"
      repo-id="R_kgDOKIg8yw"
      category="Announcements"
      category-id="DIC_kwDOKIg8y84CYub-"
      mapping="pathname"
      term="Welcome to KeJun's Portfolio"
      strict="0"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="bottom"
      :theme="colorMode.value"
      crossorigin="anonymous"
      lang="zh-CN"
      loading="lazy"
    />
  </div>
</template>
