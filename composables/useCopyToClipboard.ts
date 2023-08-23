import { useClipboard } from '@vueuse/core'

export function useCopyToClipboard() {
  const { copy: copyToClipboard, isSupported } = useClipboard()
  function copy(text: string) {
    if (!isSupported)
      return

    copyToClipboard(text)
  }

  return {
    copy,
  }
}
