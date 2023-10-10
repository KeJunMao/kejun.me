<script setup>
definePageMeta({
  layout: false,
  appHeader: false,
})
useHead({
  title: '我的简历',
})
const data = await queryContent('/resume').findOne()
const iconList = {
  掘金: 'i-simple-icons-juejin',
  GitHub: 'i-simple-icons-github',
  Twitter: 'i-simple-icons-twitter',
  Portfolio: 'i-carbon-user-avatar-filled',
}
</script>

<template>
  <div mx-auto flex flex-col px-4 prose prose-zinc container lg:flex-row lg:gap-16 dark:prose-invert>
    <section p-2 pt-8 text-center lg:text-left>
      <h3 mb-1 mt-0 text-2xl>
        {{ data.basics.name }}
      </h3>
      <p mb-1 mt--1 text-sm text-stone>
        {{ data.basics.label }}
      </p>

      <a pb-2px text-xs href="mailto:hi@kejun.me" target="_blank">hi@kejun.me</a>
      <div mt-4 text-sm space-x-4>
        <a v-for="item in data.basics.profiles" :key="item.network" target="_blank" :href="item.url" border-b-0 color-stone hover:color-blue>
          <div :class="iconList[item.network]" />
        </a>
      </div>
    </section>
    <section py-8 space-y-10 lg:px-16>
      <div>
        <h4 class="block-title">
          关于
        </h4>
        <p px-4>
          {{ data.basics.summary }}
        </p>
      </div>
      <div>
        <h4 class="block-title">
          项目
        </h4>
        <div px-4 space-y-6>
          <div v-for="item in data.projects" :key="item.name" space-y-2>
            <div flex items-center space-x-2>
              <span>{{ item.displayName }}</span>
              <a v-if="item.githubUrl" :href="item.githubUrl" target="_blank" border-b-0 color-inherit hover:color-blue>
                <div class="i-simple-icons-github" />
              </a>
              <a v-if="item.website" :href="item.website" target="_blank" border-b-0 color-inherit hover:color-blue>
                <div class="i-carbon-arrow-up-right" />
              </a>
            </div>
            <p mb-1 mt-0 text-sm color-stone-500>
              {{ item.summary }}
            </p>
          </div>
          <div mt-6>
            <a :href="data.basics.projectsUrl" target="_blank" color-stone>更多项目...</a>
          </div>
        </div>
      </div>
      <div>
        <h4 class="block-title">
          工作经历
        </h4>
        <div px-4 space-y-6>
          <div v-for="item in data.work" :key="item.company" space-y-2>
            <div space-x-2>
              <a inline :href="item.website" target="_blank">{{ item.company }}</a>
              <span color-stone-500>{{ item.position }}</span>
            </div>
            <p mb-1 mt-0 text-sm color-stone-500>
              {{ $dayjs(item.startDate).format('YYYY 年 M 月') }} - {{
                item.isCurrentRole ? '至今' : `${item.end.year} 年 ${item.end.month} 月`
              }} | {{ item.location }}
            </p>
            <p v-if="item.summary" text-base>
              {{ item.summary }}
            </p>
            <ul text-base leading-relaxed>
              <li v-for="(text, index) in item.highlights" :key="index">
                {{ text }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <h4 class="block-title">
          技术栈
        </h4>
        <div grid class="grid-cols-[80px_1fr]" gap-x-2 gap-y-4 px-4>
          <template v-for="item in data.skills" :key="item.name">
            <div font-bold>
              {{ item.name }}
            </div>
            <div>
              {{ item.keywords.join(', ') }}
            </div>
          </template>
        </div>
      </div>
      <div>
        <h4 class="block-title">
          教育经历
        </h4>
        <div space-y-6>
          <div v-for="item in data.education" :key="item.institution" px-4 space-y-2>
            <div space-x-2>
              <strong>{{ item.area }} {{ item.studyType }}</strong>
              <span color-stone-500>{{ item.institution }}</span>
            </div>
            <p mb-1 mt-0 text-sm color-stone-500>
              {{ `${item.start.year} 年 ${item.start.month} 月` }} -
              {{ `${item.end.year} 年 ${item.end.month} 月` }}
            </p>
            <p v-if="item.summary" text-base>
              {{ item.summary }}
            </p>
            <ul text-base leading-relaxed>
              <li v-for="(text, index) in item.highlights" :key="index">
                {{ text }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <h4 class="block-title">
          所获荣誉
        </h4>
        <div space-y-6>
          <div v-for="item in data.awards" :key="item.title" px-4 space-y-2>
            <div space-x-2>
              <strong>{{ item.title }}</strong>
              <span color-stone-500>{{ item.awarder }}</span>
            </div>
            <p mb-1 mt-0 text-sm color-stone-500>
              {{ `${item.fullDate.year} 年 ${item.fullDate.month} 月` }}
            </p>
            <p v-if="item.summary" text-base>
              {{ item.summary }}
            </p>
            <ul text-base leading-relaxed>
              <li v-for="(text, index) in item.highlights" :key="index">
                {{ text }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
.block-title {
  --at-apply: w-fit bg-zinc-900 text-center w-30 leading-snug color-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 mt-0;
}
</style>
