---
title: 'npm你了解多少'
date: Wed Aug 30 2023 23:45:37 GMT+0800 (中国标准时间)
lastmod: '2023-09-30'
tags: ['npm配置', 'npm config']
draft: false
summary: 'npm 配置'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/about-npm/3_npm你了解多少
---

## npm

npm 代表 Node Package Manager（Node 包管理器），是 Node.js 环境中用于管理和分发开源 JavaScript 模块的默认包管理工具。

它是一个命令行工具，允许开发者在自己的项目中安装、更新、删除和共享 JavaScript 代码包。

<br>

npm 的主要功能包括：

- 包管理：npm 允许开发者在项目中安装和管理依赖的 JavaScript 模块。开发者可以通过 npm 安装已发布到 npm 注册表的模块，也可以在项目中管理自己的模块。

- 版本控制：npm 使用语义化版本控制（Semantic Versioning）规范，允许开发者指定对模块的依赖关系的版本范围。这样可以确保项目在安装或更新依赖时，使用与之兼容的模块版本。

- 脚本执行：npm 允许在项目中定义和运行自定义脚本。开发者可以在 package.json 文件中定义各种脚本命令，以简化构建、测试、部署等任务的执行。

- 发布和共享：开发者可以使用 npm 将自己的 JavaScript 模块发布到 npm 注册表，供其他开发者使用和共享。

- 版本管理：npm 允许开发者在全局范围内安装和管理多个 Node.js 版本。这对于在不同项目中使用不同的 Node.js 版本或测试新版本的功能非常有用。

- 构建生态系统：npm 作为 Node.js 生态系统的重要组成部分，提供了大量的开源模块供开发者使用。开发者可以通过 npm 快速找到和安装适用于自己项目的模块，加速开发过程。

<br>
npm附带安装在Node.js环境中，并与Node.js紧密集成。在安装Node.js后，您可以直接使用npm来管理JavaScript模块和项目依赖。

## 命令行解析

```bash
npm -h
# npm <command>

# Usage:

# npm install        install all the dependencies in your project
# npm install <foo>  add the <foo> dependency to your project
# npm test           run this project's tests
# npm run <foo>      run the script named <foo>
# npm <command> -h   quick help on <command>
# npm -l             display usage info for all commands   ✅ 注意这里，又是打开新世界的大门啊
# npm help <term>    search for help on <term>
# npm help npm       more involved overview

# All commands:  ✅ 注意这里，列举了所有的，你用过几个？

#     access, adduser, audit, bin, bugs, cache, ci, completion,
#     config, dedupe, deprecate, diff, dist-tag, docs, doctor,
#     edit, exec, explain, explore, find-dupes, fund, get, help,
#     hook, init, install, install-ci-test, install-test, link,
#     ll, login, logout, ls, org, outdated, owner, pack, ping,
#     pkg, prefix, profile, prune, publish, query, rebuild, repo,
#     restart, root, run-script, search, set, set-script,
#     shrinkwrap, star, stars, start, stop, team, test, token,
#     uninstall, unpublish, unstar, update, version, view, whoami

# Specify configs in the ini-formatted file:
#     /Users/yq/.npmrc       ✅ 配置文件在这里
# or on the command line via: npm <command> --key=value  ✅ 还可以这么使用额

# More configuration info: npm help config ✅ 更多信息
# Configuration fields: npm help 7 config

# npm@8.19.3 /Users/yq/.nvm/versions/node/v16.19.0/lib/node_modules/npm
```

仅仅从上面的帮助信息里，就可以知道很多，是不是也不一定非得百度或 google 才可以解决问题啊，格局要打开
