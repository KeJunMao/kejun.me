---
title: 探索 uni-app 下的基于文件名的按平台编译插件
description: 通过 vite 插件实现 uni-app 基于文件名后缀 (*.<h5|mp-weixin|app>.*) 的按平台编译
date: 2023-08-21 19:34
---

我们在 uni-app 中写跨端逻辑无非两种方案：
- 编译时：使用条件语法 `#ifdef ... #endif`，推荐的写法，这种方案会在编译时将其他平台的代码直接剔除
- 运行时：使用 `if (process.env.UNI_PLATFORM === '...') {...}`，灵活的写法，但是非本平台的代码也会包含在产物中

于我个人而言，运行时的环境变量判断一般只在开发打包插件时使用，如果你也在开发 uni 相关的插件不妨试试 [uni-helper/uni-env](https://github.com/uni-helper/uni-env)。

在应用中我总是使用条件语法，大多数情况都很不错。当不同平台的逻辑差异比较多而大时，我们往往使用拆分为多个文件或组件来管理不同平台的逻辑，然后再使用条件语法包裹导入语句。

```ts [src/index.vue]
// #ifdef H5
import Banner from "@/components/h5Banner.vue"
// #endif
// #ifdef MP-WEIXIN
import Banner from "@/components/mpBanner.vue"
// #endif
// #ifdef APP-PLUS
import Banner from "@/components/appBanner.vue"
// #endif
...
components: { Banner }
...
```
emmm，这没什么问题，确实更好管理不同平台的逻辑了。

## 缘起

正如前文的代码所示，既然我们都已经按不同文件来管理逻辑了，那么能否实现一次导入然后按文件名自动条件编译呢？

如果你使用过 [Nuxt3](https://nuxt.com/)，那么你对 `HighlightedMarkdown.server.vue`、`my-directive.client.ts`、`setup.global.ts` 这种命名风格绝不陌生。这些不同的 suffix 都有对应的功能，`*.server.vue` 将被视为服务器组件，`*.client.ts` 将总是只在客户端执行，`*.global.ts` 的中间件为每个页面都自动注入。

因此，我将文件名命名规则设计为 `*.UNI_PLATFORM.*`，将前文的代码将简化为：

```ts [src/index.vue]
import Banner from "@/components/Banner.vue"
...
components: { Banner }
...
```
当然，对应的文件树为：
```bash [src/]
components
- Banner.h5.ts        # H5 平台
- Banner.mp-weixin.ts # 微信小程序平台
- Banner.app.ts       # APP 平台
```
有了目标，开搞

## 思路

先看一眼 rollup 的[构建流程](https://rollup-docs-cn.netlify.app/plugin-development/#build-hooks)

看样子只需要定义自定义解析器(resolveId)或者自定义加载器(load)即可。

## 实现

首先是命名和确定插件顺序

```ts [main.ts]
import type { Plugin } from 'vite'

export function VitePluginUniPlatform(): Plugin {
  return {
    name: 'vite-plugin-uni-platform',
    enforce: 'pre',
    resolveId() { },
    load() { },
  }
}
```
先来看 `resolveId`：

```ts [main.ts]
async resolveId(source, importer, options) {
  // 检查是否为刻意导入带 {platform} 后缀的文件
  if (source.includes(`.${platform}`))
    return null
  const sourceResolution = await this.resolve(source, importer, {
    ...options,
    skipSelf: true, // 避免无限循环
  })
  if (sourceResolution)
    return null
  // 无法解析，尝试拼接 platform 后去解析
  const platformSource = source.replace(/(.*)\.(.*)$/, `$1.${platform}.$2`)
  const resolution = await this.resolve(platformSource, importer, { ...options, skipSelf: true })
  // 如果无法解析或是外部引用，则直接返回错误
  if (!resolution || resolution.external)
    return resolution
  const sourceId = normalizePath(resolve(dirname(importer!), source))
  const isVue = resolution.id.endsWith('vue')
  // 小程序的vue文件直接使用 sourceId，避免生成类似 test.mp-weixin.wxml
  // 其他平台的和其他文件直接使用 resolution
  return (isMp && isVue) ? sourceId : resolution
}
```

然后是 `load`:

```ts [main.ts]
// 自定义加载器，尝试将所有不带 {platform} 后缀的文件拼接 {platform} 后去加载
async load(id) {
  let platformId = id
  if (!id.includes(`.${platform}`))
    platformId = id.replace(/(.*)\.(.*)$/, `$1.${platform}.$2`) // 拼接

  // 如果存在的话，读取即可
  if (platformId && platformId !== id && existsSync(platformId)) {
    return readFileSync(platformId, {
      encoding: 'utf-8',
    })
  }
}
```

到这里就写完了，先试试页面 `pnpm run dev:h5` 看看

```bash [src/]
pages
- index.h5.vue
- index.mp-weixin.vue
- index.app.vue
```
```json [pages.json]
"pages": [
    {
      "path": "pages/index",
      "type": "home"
    },
]
```

good job!

## Hacker

来看看小程序环境 `pnpm run dev:mp-weixin`，好家伙直接异常。通过万能的 Javascript 调试终端发现是 `@dcloudio/uni-cli-shared` 这个包导出的 `normalizePagePath` 函数，在 Vite 启动前，序列化 pages.json 后，如果对应的文件不存在时直接异常！

好，那么我们复写这个函数

```ts [hacker.ts]
// overwrite uni-cli-shared utils normalizePagePath
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'

// @ts-expect-error ignore
import * as utils from '@dcloudio/uni-cli-shared/dist/utils.js'

// @ts-expect-error ignore
import * as constants from '@dcloudio/uni-cli-shared/dist/constants.js'
import { isApp, inputDir as uniInputDir } from '@uni-helper/uni-env'

// 解决 MP 和 APP 平台页面文件不存在时不继续执行的问题
// @ts-expect-error ignore
utils.normalizePagePath = function (pagePath, platform) {
  const absolutePagePath = resolve(uniInputDir, pagePath)
  let extensions = constants.PAGE_EXTNAME
  if (isApp)
    extensions = constants.PAGE_EXTNAME_APP

  for (let i = 0; i < extensions.length; i++) {
    const extname = extensions[i]

    if (existsSync(absolutePagePath + extname))
      return pagePath + extname

    const withPlatform = `${absolutePagePath}.${platform}${extname}`
    if (existsSync(withPlatform))
      return pagePath + extname
  }
  console.error(`${pagePath} not found`)
}
```

现在，当页面不存在时,检查是否有对应平台的页面，如果不存在，使用 `console.error` 提示

## 组件和 utils

试试组件和自定义函数，以 utils 为例

```bash
utils
- index.h5.ts        # H5 平台
- index.mp-weixin.ts # 微信小程序平台
- index.app.ts       # APP 平台
```
```ts [src/main.ts]
import utils from '@/utils/index'

utils.doSomething()
```

本以为万事大吉，但现实情况复杂的多，`vite:import-analysis` 插件貌似会做静态分析，如果 `@utils/index.ts` 不存在，就会抛出 `Cannot find ...`，在我四方 debug 八方查源码最终依然不知道如何解决。

这意味着，除了页面外，必须创建一个真实导入的文件（可以为空）来过 Vite 的静态分析，如果你有好的思路欢迎在评论区讨论哈！

## 总结

是的，现在所有的带有平台标识符的文件都会被自动替换！不过依然还有一些问题：

- 必须创建一个真实导入的文件
- TypeScript 类型
- 更多测试用例

如果你有解决方法或者思路欢迎评论区一起探讨哈~

已发布到 [NPM](https://www.npmjs.com/package/uni-helper/vite-plugin-uni-platform)，使用下面的命令即可安装并使用：

::code-group

```sh [pnpm]
pnpm i -D uni-helper/vite-plugin-uni-platform
```

```bash [yarn]
yarn add -D uni-helper/vite-plugin-uni-platform
```

```bash [npm]
npm install -D uni-helper/vite-plugin-uni-platform
```
::

完整代码访问 [uni-helper/vite-plugin-uni-platform](https://github.com/uni-helper/vite-plugin-uni-platform)，如果对你有用的话帮忙点个 star.
