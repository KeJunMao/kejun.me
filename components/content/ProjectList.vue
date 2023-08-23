<script lang="ts" setup>
import ImgIcon from '@/components/content/ImgIcon.vue'

interface Project {
  name: string
  link: string
  desc: string
  icon?: string
}
defineProps<{
  projects: Record<string, Project[]>
}>()
</script>

<template>
  <div v-for="(category, categoryName) in projects" :key="categoryName" class="group">
    <h3 mb-4 mt-15 text-center text-xl font-bold leading-relaxed op-70 group-hover:op-100>
      {{ categoryName }}
    </h3>

    <div :class="[category.length === 1 ? '' : '']" grid="~ cols-1 md:cols-2 lg:cols-3 xl:cols-4 gap-4 ">
      <NuxtLink v-for="project in category" :key="project.name" :to="project.link" target="_blank" rounded-xl p-4 border="~ zinc/20 hover:transparent" class="group/item transition-all hover:bg-zinc/7">
        <div flex items-center>
          <div v-if="project.icon" mr-3 h-12 w-12 rounded class="bg-zinc-2/20" dark:bg-zinc-8 flex="~ items-center justify-center">
            <span v-if="project.icon.startsWith('i')" :class="project.icon" text-xl op-70 class="group-hover/item:op-100" />
            <ImgIcon v-else :src="project.icon" />
          </div>
          <h4 line-clamp-1 text-lg font-medium>
            {{ project.name }}
          </h4>
        </div>
        <p mt-2 text-sm op-70>
          {{ project.desc }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>
