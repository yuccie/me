---
title: 'lerna包管理器'
date: Mon Aug 28 2023 21:51:29 GMT+0800 (中国标准时间)
lastmod: '2023-05-09'
tags: ['lerna']
draft: false
summary: '多包管理工具'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/about-tools/2_lerna管理器.md
---

## lerna

### 初始化 lerna 项目

```bash
# 安装 lerna
npm install --global lerna

# 初始化一个 git 项目
git init lerna-repo && cd lerna-repo

# 将仓库转变为 lerna 仓库
lerna init

# 转变完的结果
# lerna-repo/
#   packages/
#   package.json
#   lerna.json
```

### 添加 packages

手动的在 packages 添加目录，并不能被 lerna 管理，因此需要使用 命令 添加 packages

```bash
# 添加新的 packages
lerna create <package-name> # 执行该命令后，会让你输入新packages的一些信息，输入完就会生成一个基本的包结构

# 查看创建的包列表
lerna ls
```

### 安装对应包的依赖

- 可以直接进入到对应的 packages 里，然后 npm i xxx
- lerna add xxx --scope=xxx --dev
  - --dev 是开发依赖， -D, --dev Save to devDependencies
  - --scope=xxx 是添加到执行 package，如果不加则每个 package 都会安装一遍
  - lerna add 执行完，也就在指定的 packages 里安装好了依赖

```bash
# 比如
lerna add @rollup/plugin-replace --scope=p-a --dev
# lerna notice cli v3.22.1
# lerna notice filter including "p-a"
# lerna info filter [ 'p-a' ]
# lerna info Adding @rollup/plugin-replace in 1 package
# lerna info Bootstrapping 2 packages
# lerna info Installing external dependencies
# lerna info Symlinking packages and binaries
# lerna success Bootstrapped 2 packages
```

### 安装所有包的依赖

当将远程的仓库 clone 到本地后，每个 packages 里依赖其实并没有安装，此时可以执行 `lerna bootstrap` 将会安装每个包的依赖

如果之前 packages 的依赖是通过 `npm i xxx` 方式安装的，`lerna bootstrap` 依然可以安装

### 更多命令查看

```bash
lerna -h
# Usage: lerna <command> [options]

# 命令：
#   lerna add <pkg> [globs..]  Add a single dependency to matched packages
#   lerna bootstrap            Link local packages together and install remaining package dependencies
#   lerna changed              List local packages that have changed since the last tagged release      [aliases: updated]
#   lerna clean                Remove the node_modules directory from all packages
#   lerna create <name> [loc]  Create a new lerna-managed package
#   lerna diff [pkgName]       Diff all packages or a single package since the last release
#   lerna exec [cmd] [args..]  Execute an arbitrary command in each package
#   lerna import <dir>         Import a package into the monorepo with commit history
#   lerna info                 Prints debugging information about the local environment
#   lerna init                 Create a new Lerna repo or upgrade an existing repo to the current version of Lerna.
#   lerna link                 Symlink together all packages that are dependencies of each other
#   lerna list                 List local packages                                                   [aliases: ls, la, ll]
#   lerna publish [bump]       Publish packages in the current project.
#   lerna run <script>         Run an npm script in each package that contains that script
#   lerna version [bump]       Bump version of packages changed since the last release.

# Global Options:
#   --loglevel       What level of logs to report.                                                 [字符串] [默认值: info]
#   --concurrency    How many processes to use when lerna parallelizes tasks.                           [数字] [默认值: 8]
#   --reject-cycles  Fail if a cycle is detected among dependencies.                                                [布尔]
#   --no-progress    Disable progress bars. (Always off in CI)                                                      [布尔]
#   --no-sort        Do not sort packages topologically (dependencies before dependents).                           [布尔]
#   --max-buffer     Set max-buffer (in bytes) for subcommand execution                                             [数字]
#   -h, --help       显示帮助信息                                                                                   [布尔]
#   -v, --version    显示版本号                                                                                     [布尔]

# When a command fails, all logs are written to lerna-debug.log in the current working directory.

# For more information, find our manual at https://github.com/lerna/lerna

lerna exec -- npm install --only=dev # 安装
```

### .npmrc 文件

Lerna 是一个用于管理具有多个包的 JavaScript 项目的工具。.npmrc 文件是 npm 的配置文件，用于指定 npm 的行为和设置。

在 Lerna 项目中，根目录下的 .npmrc 文件通常用于设置全局的 npm 配置，以影响整个项目的包管理和依赖安装过程。然而，Lerna 并不会自动将根目录下的 .npmrc 文件应用于子包。

这是因为 Lerna 的工作原理是将每个子包视为独立的 npm 包，它们具有自己的独立配置和依赖。因此，**子包的配置不会继承根目录下的 .npmrc 文件**。

如果你希望在子包中应用特定的 npm 配置，可以在每个子包的目录中创建一个独立的 .npmrc 文件，并在其中设置相应的配置。这样，每个子包都可以具有自己的独立配置，并根据需要进行自定义。

### 问题列表

Q：lerna WARN No packages found where @rollup/plugin-replace can be added.
A：在使用 lerna add A --scope=xxx --dev 时，如果之前安装过，也就是 devDependencies 已经有了 A 的配置，再次安装就会失败；除非更改版本号再次安装

## monorepo

Monorepo 和 Lerna 都是用于管理多个相关项目的工具，但它们有一些区别：

Monorepo（单一代码仓库）是一种将多个相关项目组织在一个仓库中的开发模式。

在 Monorepo 中，不同的项目（如前端应用、后端服务、公共库等）被组织在同一个版本控制仓库中，共享相同的开发工具、构建配置和依赖管理。这样可以促进代码共享、跨项目重用和更简洁的协作。

Lerna 是一个用于管理 Monorepo 的工具，它提供了一些工具和命令行接口，帮助简化 Monorepo 的管理和发布过程。Lerna 主要解决 Monorepo 中的包管理问题，它可以自动化地管理项目的依赖关系、版本控制和发布流程。Lerna 提供了一些命令，如添加依赖、版本控制、构建、发布等，以便更方便地管理 Monorepo 中的项目。

- Monorepo 是一种开发模式，一种代码组织思想，用于组织多个相关项目在同一个版本控制仓库中。而 Lerna 是一个工具，用于管理 Monorepo。
- 可以说 Lerna 是 Monorepo 的一种实现方式。

其实 monorepo 只是一种思想，如果使用 `git submodule add xxx.git(测试仓库git地址) test(本地目录)` 这种添加另外一个仓库到本地仓库，后续随着项目的增大，git 的操作是否会变的更慢（当然添加子模块，主仓库只会跟踪版本，并不不会跟踪具体的代码改动，因为是相互隔离的）

## 公共引用

Lerna 处理 packages 之间的公共依赖主要通过 hoisting（提升）机制来实现。当使用 Lerna 管理 JavaScript monorepo 时，它会将所有 packages 的依赖项安装在 monorepo 的根目录下，而不是每个 package 的目录下。这样可以避免重复安装相同的依赖项，从而减少整个 monorepo 的依赖项数量和大小。

通过 hoisting 机制，Lerna 会将所有 packages 共享的依赖项提升至 monorepo 根目录的 node_modules 中。这意味着，如果多个 package 都依赖同一个版本的库，这个库只会被安装一次，而不会重复安装在每个 package 的 node_modules 中。

这种机制有助于减少 monorepo 的整体依赖项大小，提高安装速度，并确保所有 packages 使用的是相同版本的共享依赖项。 Lerna 通过 hoisting 机制来处理 packages 之间的公共依赖，从而优化 monorepo 的依赖管理。

在 Lerna 中，hoisting 机制是默认启用的，不需要单独配置。当你使用 Lerna 管理 Monorepo 时，hoisting 机制会自动生效，将共享的依赖项提升至 monorepo 根目录的 node_modules 中。

底层工作原理是，Lerna 使用 hoist-non-npm-dependencies 包来实现 hoisting 机制。这个包会将所有 packages 共享的依赖项提升至 monorepo 根目录的 node_modules 中，以避免重复安装相同的依赖项，减少整个 monorepo 的依赖项数量和大小。

通过 hoisting 机制，Lerna 能够优化 Monorepo 的依赖管理，提高安装速度，并确保所有 packages 使用的是相同版本的共享依赖项。
