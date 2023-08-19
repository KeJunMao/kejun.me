<script lang="ts" setup>
const { page } = useContent()
</script>

<template>
  <div flex flex-1 flex-col>
    <main mx-auto flex-1 p-4 container>
      <div mx-auto prose dark:prose-invert>
        <h1>{{ page.title }}</h1>
        <slot />
      </div>
    </main>
    <footer min-w-full py-4 text-center text-sm op-50 prose>
      <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
        CC BY-NC-SA 4.0</a> 2021-PRESENT © KeJun
    </footer>
  </div>
</template>
