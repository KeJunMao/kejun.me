<script lang="ts" setup>
const { page } = useContent()
</script>

<template>
  <div min-h-screen flex flex-col>
    <header mx-auto flex items-center justify-between p-4 container>
      <NuxtLink to="/" text-xl color-primary>
        KeJun
      </NuxtLink>
      <div color-gray-500 space-x-4 dark:color-gray-400>
        <NuxtLink to="/posts" hover:color-gray-900 dark:hover:color-gray-50 active-class="color-primary">
          Blog
        </NuxtLink>
        <NuxtLink to="/projects" hover:color-gray-900 dark:hover:color-gray-50 active-class="color-primary">
          Projects
        </NuxtLink>
      </div>
    </header>
    <main mx-auto flex-1 p-4 container>
      <div mx-auto prose dark:prose-invert>
        <h1>{{ page.title }}</h1>
        <slot />
      </div>
    </main>
    <footer mx-auto py-2 text-sm op-50 prose>
      <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
        CC BY-NC-SA 4.0</a> 2021-PRESENT © KeJun
    </footer>
  </div>
</template>
