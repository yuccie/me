---
title: 'packagejson'
date: Wed Oct 11 2023 23:36:44 GMT+0800 (中国标准时间)
lastmod: '2023-09-30'
tags: ['npm配置', 'package.json']
draft: false
summary: 'npm 配置'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/about-npm/4_packagejson
---

## package.json

文件是 Node.js 项目中的配置文件，它包含了项目的元数据和依赖项信息。

## package.json 配置

[完整的 package.json 配置项](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)

- name：名字
- version：版本
  - [node-semver 解析版本号](https://github.com/npm/node-semver)
- description：描述
- keywords：关键字数组
- homepage：The url to the project homepage.
- bugs：问题搜集入口

```js
{
  "bugs": {
    "url": "https://github.com/owner/project/issues",
    "email": "project@hostname.com"
  }
}
```

- license：许可证

  - MIT License：MIT 许可证是一种宽松的许可证，允许在几乎所有环境中自由使用、修改和分发软件，同时保留版权和免责声明。
  - Apache License 2.0：Apache 许可证是一种开放源代码许可证，允许自由使用、修改和分发软件，同时要求附带原始版权和许可声明。
  - GNU General Public License (GPL)：GNU 通用公共许可证是一种开源许可证，要求任何以 GPL 许可证发布的软件都必须以 GPL 许可证发布其衍生作品。
  - BSD License: BSD 许可证是一系列类似的许可证，包括 BSD 2-Clause License、BSD 3-Clause License 等。BSD 许可证允许自由使用、修改和分发软件包，通常要求保留原始版权声明。
  - Creative Commons Licenses: Creative Commons 许可证是一系列开放版权许可证，用于控制知识、艺术和创意作品的共享和使用。
  - ISC License: ISC 许可证是一种简洁的开源许可证，类似于 MIT 许可证，允许在几乎所有情况下自由使用、修改和分发软件包。

- people fields: author, contributors
-
- files：可选的 files 字段是一个文件模式的数组，用于描述当你的软件包作为依赖项安装时应该包含的条目。文件模式遵循类似于 .gitignore 的语法，但是相反：包含一个文件、目录或者通配符模式（_、\*\*/_ 等）将使得在打包时该文件被包含在压缩文件中。如果省略该字段，则默认为 ["*"]，表示包含所有文件。
-
- main：The main field is a module ID that is the primary entry point to your program

  - This should be a module relative to the root of your package folder.
  - If main is not set, it defaults to index.js in the package's root folder.

- browser：If your module is meant to be used client-side the browser field should be used instead of the main field.
-
- bin
  - A lot of packages have one or more executable files that they'd like to install into the PATH.
  - 其实这个包作为依赖安装后，就会在 node_modules/bin 目录生成一个软链，从而在项目里可以直接使用
  - Please make sure that your file(s) referenced in bin starts with #!/usr/bin/env node,
- peerDependencies
  - 当前项目不包含这个依赖，而是未来这个包的宿主提供

在初始化 mpx 项目时，会自动安装依赖，同时会将 npm 里的 bin 字段脚本，通过软链映射到 node_modules/bin 目录，从而下面的 `mpx-cli-service serve --modes=dd` 可以直接运行

```json
{
  "name": "mpx-demo",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "serve": "mpx-cli-service serve --modes=dd",
    "build": "mpx-cli-service build",
    "lint": "eslint --ext .js,.ts,.mpx src/"
  },
  "dependencies": {
    "@mpxjs/api-proxy": "^2.8.0",
    "@mpxjs/core": "^2.8.0",
    "@mpxjs/fetch": "^2.8.0",
    "@mpxjs/pinia": "^2.8.0",
    "@mpxjs/store": "^2.8.0",
    "@mpxjs/utils": "^2.8.0",
    "pinia": "^2.0.14",
    "vue": "^2.6.14",
    "vue-demi": "^0.13.11",
    "vue-i18n": "^8.27.2",
    "vue-i18n-bridge": "^9.2.2",
    "vue-router": "^3.1.3"
  },
  "devDependencies": {
    "@babel/core": "^7.10.4",
    "@babel/plugin-transform-runtime": "^7.10.4",
    "@babel/preset-env": "^7.10.4",
    "@babel/runtime-corejs3": "^7.10.4",
    "@mpxjs/babel-plugin-inject-page-events": "^2.8.0",
    "@mpxjs/eslint-config": "^1.0.5",
    "@mpxjs/mpx-cli-service": "^2.0.0",
    "@mpxjs/size-report": "^2.8.0",
    "@mpxjs/vue-cli-plugin-mpx": "^2.0.0",
    "@mpxjs/vue-cli-plugin-mpx-eslint": "^2.0.0",
    "@mpxjs/webpack-plugin": "^2.8.0",
    "@vue/cli-service": "~5.0.0",
    "autoprefixer": "^10.2.4",
    "eslint": "^7.0.0",
    "postcss": "^8.2.6",
    "stylus": "^0.55.0",
    "stylus-loader": "^6.1.0",
    "vue-template-compiler": "^2.6.14",
    "webpack": "^5.43.0"
  },
  "browserslist": ["ios >= 8", "chrome >= 47"]
}
```
