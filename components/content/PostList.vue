<script setup>
const postList = await queryContent('/posts', './').only(['_path', 'title', 'date', 'tags']).sort({ date: -1 }).find()
</script>

<template>
  <div class="not-prose space-y-4">
    <div
      v-for="link of postList" :key="link._path"
      rounded rounded-xl p-4 p-6 border="~ zinc/20 hover:transparent" class="transition-all hover:bg-zinc/7"
    >
      <div v-if="link.date" mb-2 text-sm op-70>
        {{ $dayjs(link.date).format('YYYY-MM-DD HH:mm') }}
      </div>
      <NuxtLink
        text-xl font-medium
        :to="link._path"
        hover:color-primary
      >
        {{ link.title }}
      </NuxtLink>
      <div v-if="link.tags" mt-1 flex gap-1 op-70>
        <div v-for="item in link.tags" :key="item" rounded p-1 text-sm class="hover:bg-zinc/20">
          #{{ item }}
        </div>
      </div>
    </div>
  </div>
</template>
