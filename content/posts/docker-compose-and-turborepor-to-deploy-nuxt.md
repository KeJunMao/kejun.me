---
title: 使用 Docker Compose + Turborepo 部署 Monorepos & PNPM Workspace 中的 Nuxt3 应用
date: 2023-09-02 11:20
tags:
  - docker
  - docker-compose
  - nuxt
---

公司有很多项目，基本长得一样，但是也有客制化需求，且技术老大不喜欢也不注重前端工程化，基础设施更是别想了。当然不怪他，怪我菜，没能到一个足够好的公司。

本文我分享的不是最佳实践，纯个人情况和经验，不会适用于大部分人，希望你看完有所收获。

## 为什么是 Nuxt3

我是一个 Vue 开发者，Nuxt3 推出后就一直在关注，其中的 [Layers](https://nuxt.com/docs/getting-started/layers) 功能让我印象深刻。

这个功能总的来说就是你可以让你的 Nuxt 应用继承一个已经存在的 Nuxt3 应用，其中包括：

- `nuxt.config.ts` 配置信息
- 所有 `components/` 下的组件
- 所有 `composables/` 下的可组合函数
- 所有 `plugins/` 下的插件
- 所有 `server/` 下的服务器相关逻辑
- 所有 `pages/` 下的页面
- 所有 `middleware/` 下的中间件
- 所有 `layouts/` 下的布局
- 所有 `public/` 下的文件
- 所有 `app/` 下的文件，即 `app/router.options`
- `app.vue` 文件

这些功能很适合我的业务场景，即大量应用都几乎一模一样，但是也有客制化需求。

为此，抽离出一个 package，专门做一个 baseLayer，填充公共内容（api、库配置、公用逻辑和页面等），所有应用继承即可。

## Monorepos && PNPM Workspace

项目结构如下：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eca2e5a830d5437f872c5a5d52e5cfc0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=431&h=556&s=28154&e=png&b=181818)

这个没什么好说的，其中 packages 中主要为了抽出并复用：api、utils、eslint-config、stylelint-config，apps/ 中才是正菜。

pnpm-workspace.yaml 也很简单：

```yml
packages:
  - 'apps/*'
  - 'packages/*'
```

## 服务端渲染 SSR

先说结论，已弃用，原因是太消耗服务器资源（运行时、磁盘空间），本来就是小水管，如果跑个 Nginx 带几个静态页面不要太轻松，选择 ssr 意味着每个应用都要跑一个 node 进程，再加上使用 Docker 在服务器上做自动构建和部署（没有私有Hub），磁盘 IO 轻松爆炸。

当然，如果可以的话，我选 SSR，SEO 加 FCP 对于重内容的应用很香啊。

> 当然，本文还是先讲 SSR 的情况。

## Turborepo

没别的原因，就看重了 `turbo prune --scope $APP_NAME --docker` 这一个命令，具体可以看[这里](https://turbo.build/blog/turbo-0-4-0#experimental-pruned-workspaces)

他可以有效缩短大型 workspace 的 Docker 构建时间，起码对我来说是有用的

## Docker & Docker Compose

首先，我想解决的是：
- 把本地一个一个打包
- 然后压缩好丢服务器
- 使用 node run 起来(ssr)

Docker 是不二之选，可以轻松解决环境安装、打包、运行的问题。

### 通用的 Dockefile

利用分布构建，有效减少镜像大小。

```dockerfile
// docker/nuxt/Dockerfile

FROM node:16.20-alpine as base
ARG APP_NAME
WORKDIR /app

FROM base as pnpm
RUN corepack enable

FROM base as workspace
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope $APP_NAME --docker

FROM pnpm AS builder
COPY .gitignore .gitignore
COPY --from=workspace /app/out/json/ .
COPY --from=workspace /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install
COPY --from=workspace /app/out/full/ .
COPY assets ./assets
RUN pnpm exec turbo run build --filter=$APP_NAME...

FROM base
COPY --from=builder /app/apps/$APP_NAME/.output .output
# Fixed https://github.com/nuxt/nuxt/issues/12493
RUN mkdir /app/.output/server/node_modules/@popperjs && mv .output/server/node_modules/@sxzz/popperjs-es .output/server/node_modules/@popperjs/core
EXPOSE 3000
CMD ["node", "/app/.output/server/index.mjs"]
```

### docker-compose.yml

以单个 app 为例

#### 开发环境

```yml [docker-compose.dev.yml]
version: '3.9'

services:
  app1:
    build:
      context: .
      dockerfile: ./docker/nuxt/Dockerfile
      args:
        APP_NAME: app1
    ports:
      - '49152:3000'
    environment:
      NUXT_PUBLIC_API_BASE_URL: http://dev.example.com/api
```

#### 正式环境

```yml [docker-compose.yml]
version: '3.9'

services:
  app1:
    extends:
      file: ./docker-compose.dev.yml
      service: app1
    environment:
      NUXT_PUBLIC_API_BASE_URL: http://prod.example.com/api
    restart: always
```

## 部署

第一次

```bash
git clone monorepos.git
cd monorepos
docker compose build && docker compose up -d
```

更新

```bash
git pull
docker compose up -d --force-recreate --build
```

## 总结

这套模式在有限的条件下运行了很久也很好。可是，当应用数量到了 8 个的时候，服务器开始卡了，磁盘开始满了，最终回到了本地打包 SPA，SFTP 到服务器。
