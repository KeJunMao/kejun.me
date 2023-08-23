<script lang="ts">
import { defineComponent } from '#imports'

export default defineComponent({
  props: {
    code: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: null,
    },
    filename: {
      type: String,
      default: null,
    },
    highlights: {
      type: Array as () => number[],
      default: () => [],
    },
    meta: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const clipboard = useCopyToClipboard()
    const icon = ref('i-heroicons-clipboard-document')

    function copy() {
      clipboard.copy(props.code)

      icon.value = 'i-heroicons-clipboard-document-check'

      setTimeout(() => {
        icon.value = 'i-heroicons-clipboard-document'
      }, 2000)
    }

    return {
      icon,
      copy,
    }
  },
})
</script>

<template>
  <div class="group relative my-4 border border-gray-200 rounded-md backdrop-contrast-100 backdrop-filter [&>pre]:m-0 dark:border-zinc-700" :class="`language-${language}`">
    <div

      class="absolute right-3 top-3 z-[1] cursor-pointer rounded p-1 text-sm opacity-0 transition-opacity hover:bg-zinc-2/75 group-hover:opacity-100 hover:dark:bg-zinc-8/75"
      @click="copy"
    >
      <span :class="icon" />
    </div>

    <span v-if="filename" class="filename absolute bottom-3 right-3 text-sm text-gray-400 transition-opacity dark:text-gray-500 group-hover:opacity-0">{{ filename }}</span>

    <slot />
  </div>
</template>

<style>
pre code .line {
  display: block;
  min-height: 1rem;
}
</style>
