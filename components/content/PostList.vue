<script setup>
const postList = await queryContent('/posts', './').only(['_path', 'title', 'date', 'tags']).sort({ date: -1 }).find()
</script>

<template>
  <div class="not-prose space-y-4">
    <div
      v-for="link of postList" :key="link._path"
      w-full rounded rounded-xl md:min-w-60ch
    >
      <NuxtLink

        :to="link._path"

        text-md flex flex-col-reverse font-medium md:flex-row md:items-center md:gap-2 hover:color-primary
      >
        <span>{{ link.title }}</span>
        <span v-if="link.date" block text-sm op-70>
          {{ $dayjs(link.date).format('YY 年 M 月 D') }}
        </span>
      </NuxtLink>
      <div v-if="link.tags" flex gap-1 op-70>
        <div v-for="item in link.tags" :key="item" rounded p-1 text-sm class="hover:bg-zinc/20">
          #{{ item }}
        </div>
      </div>
    </div>
  </div>
</template>
