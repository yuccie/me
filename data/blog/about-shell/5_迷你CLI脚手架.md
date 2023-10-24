---
title: 迷你CLI脚手架
date: Fri Oct 20 2023 21:37:23 GMT+0800 (中国标准时间)
lastmod: 2023/10/20
tags: [vue, shell, CLI]
draft: false
summary: 迷你CLI脚手架
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/about-shell/5_迷你CLI脚手架.md
---

## 需求背景

常见项目初始化时，一般都会使用 CLI 进行初始化，那整个 CLI 是如何工作的呢？

## 需求拆解

1. 控制台直接输入命令，比如 `dume create vue`，创建 vue 项目
2. 解析命令行参数，根据参数选择不同的配置，比如此处的 vue 相关选项
3. 拉取远程配置的模版，并初始化

   1. 如何拉取远程的模版， `git clone？`

4. 展示最后成功的图形文案提示

```js
#! /usr/bin/env node

const { program } = require('commander')
const inquirer = require('inquirer')

const handleVueTemplate = () => {
  const vueQuestions = [
    {
      type: 'list',
      name: 'vueVersion',
      choices: ['vue3', 'vue2'],
      message: '选择vue版本',
    },
    {
      type: 'list',
      name: 'compileType',
      choices: ['vite', 'webpack'],
      message: '选择编译工具',
    },
    {
      type: 'list',
      name: 'installType',
      choices: ['npm', 'pnpm', 'yarn'],
      message: '选择安装工具',
    },
  ]

  inquirer
    .prompt(vueQuestions)
    .then((answsers) => {
      console.log('djch answsers', answsers)
    })
    .catch((err) => console.log('djch err', err))
}

program
  .command('create')
  .description('初始化脚手架')
  .version('1.0.0')
  .action(function (argv, opts, cmd) {
    // argv 使整个process上的对象
    // opts 是当前脚本的参数，比如 ./dume crate vue -> ['create', 'vue'] 是个数组
    // cmd
    const [actionName, frameName] = opts || []

    if (actionName === 'create') {
      switch (frameName) {
        case 'vue':
          handleVueTemplate()
          // 弹出vue相关的模版选项
          break
      }
    }
    // console.log('djch ', opts, cmd)
  })
  .parse(process.argv)
```

## 问题集合

### 在当前环境下，如何选择 npm 安装的包是 `commonjs` 还是 `ES modules`

当你使用 npm 安装 inquirer 时，**默认情况下会安装符合 ECMAScript 模块规范的包**。

不过，你可以通过指定 `--legacy-bundling` 标志来安装 CommonJS 规范的包。

```js
npm i inquirer--legacy - bundling
```

- 默认情况下安装的是 ES6 规范的包，
  - 那项目中，即使是 node 环境，也要使用 ES6 规范的包，该如何？
- 添加指定标识`--legacy-bundling`，可以安装对应规范的包

### 判断当前环境是什么环境

```js
if (typeof module !== 'undefined' && typeof module.exports === 'object') {
  // CommonJS module
  console.log('CommonJS module')
} else if (typeof module !== 'undefined' && typeof module.imports === 'object') {
  // ES module
  console.log('ES module')
} else {
  // Not supported
  console.log('ES modules are not supported in this environment')
}
```

### 如何确定一个包是哪种规范的？

要确定一个包是符合 ECMAScript 模块规范还是 CommonJS 模块规范，可以查看包的主要入口文件和 package.json 文件中的字段。

- 查看主要入口文件：打开包的文件结构，查找主要入口文件。通常，主要入口文件的名称是 index.js 或 main.js。如果主要入口文件使用了 import 和 export 语法，则该包符合 ECMAScript 模块规范。如果主要入口文件使用了 require() 和 module.exports 语法，则该包符合 CommonJS 模块规范。

- 查看 package.json 文件：打开包的根目录，查找 package.json 文件。在 package.json 文件中，可以检查以下字段：

  - type 字段：如果 package.json 文件中有 type 字段，并且其值为 "module"，则表示该包符合 ECMAScript 模块规范。如果 type 字段不存在或其值为 "commonjs"，则表示该包符合 CommonJS 模块规范。

  - exports 字段：如果 package.json 文件中有 exports 字段，并且其配置了使用 import 和 export 语法的路径映射，则该包符合 ECMAScript 模块规范。如果 exports 字段不存在或没有配置使用 import 和 export 语法的路径映射，则该包可能符合 CommonJS 模块规范。

通过 lerna 初始化的仓库，默认没有 `type和exports字段` ，而且在主入口里使用的是 `require` 语法，因此是 commmonjs 规范

### 如何在 `commonjs` 规范里，使用 ES moudule 规范的包？

如果直接使用则会报错： `require() of ES Module xxx from xxx not supported.` ，就表示使用 require 加载 ESmodule 的模块了。

- 要么安装 commonjs 规范的包
- 要么使用 import 导入
  - 直接使用还会报：`Cannot use import statement outside a module` 错误，表示你现在是 commonjs 规范，想使用 es6 规范的包，不能直接使用

<br/>
在 CommonJS 环境中使用 ES 模块的包可以通过一些工具和技术实现。下面是一些常见的方法：

- 使用 Babel 转换：Babel 是一个流行的 JavaScript 编译器，可以将 ES 模块转换为 CommonJS 模块，以便在 CommonJS 环境中使用。你可以使用 Babel 配置文件来指定转换规则，并使用 Babel CLI 或构建工具（如 webpack）来进行转换。

- 使用 ES 模块转换工具：有一些工具专门用于在 CommonJS 环境中使用 ES 模块。例如，可以使用 esm 模块加载器，它是一个在 Node.js 中运行 ES 模块的运行时。你可以通过在启动脚本中添加 node -r esm 来加载 ES 模块。

- 使用打包工具：如果你使用的是构建工具（如 webpack、Rollup 或 Parcel），它们通常支持将 ES 模块打包为 CommonJS 模块。你可以在构建配置中指定适当的规则，以确保 ES 模块可以在 CommonJS 环境中正确加载和使用。

- 使用转换库：有一些专门的库可用于在 CommonJS 环境中加载和使用 ES 模块。例如，@std/esm 是一个库，它提供了一种在 Node.js 中加载 ES 模块的方法。

请注意，尽管上述方法可以在 CommonJS 环境中使用 ES 模块，但由于两种模块系统的差异，可能会遇到一些限制和不兼容性。特别是，一些高级的 ES 模块功能（如动态导入）可能无法直接在 CommonJS 环境中使用。
