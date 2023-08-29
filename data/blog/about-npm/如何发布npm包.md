---
title: '如何发布自己的npm包'
date: Tue Aug 29 2023 23:14:32 GMT+0800 (中国标准时间)
lastmod: '2023-09-29'
tags: ['npm包']
draft: false
summary: '如何发布自己的npm包'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/about-npm/如何发布npm包
---

## npm 包

为了组件或者逻辑的可复用性，一般我们都会将这些内容作为一个 npm 包发布到远程。

## 账号准备

在发布自己的 npm 包之前，需要在 npm 上注册账号，同时还需要登录

```bash
# 查看自己的身份
npm whoami

# 如果报类似下面的错误，则需要登录
# npm ERR! code ENEEDAUTH
# npm ERR! need auth This command requires you to be logged in.
# npm ERR! need auth You need to authorize this machine using `npm adduser`

# 登录之前，需要先在 https://www.npmjs.com/ 注册，输入用户名和密码即可注册
# 注册之后，登录时，为了安全，会给你的邮箱发送一个 a one-time password (OTP)
# 当然，也可以 Configuring two-factor authentication 参考：https://docs.npmjs.com/configuring-two-factor-authentication

npm login
# npm notice Log in on https://registry.npmjs.org/
# Username: asyncjslife
# Password:
# Email: (this IS public) asyncjslife@gmail.com
# npm notice Please check your email for a one-time password (OTP)
# Enter one-time password: xxxxx
# Logged in as asyncjslife on https://registry.npmjs.org/.

npm whoami
# asyncjslife
```

当然上面的方式，是在 npm 官网上注册，然后控制台登录。

还可以通过 `npm adduser` 直接在控制台注册并登录，注意已经使用过的邮箱，貌似无法重复使用

```js
npm adduser
// npm WARN adduser `adduser` will be split into `login` and `register` in a future version. `adduser` will become an alias of `register`. `login` (currently an alias) will become its own command.
// npm notice Log in on https://registry.npmjs.org/
// Username: asyncjslife
// Password:
// Email: (this IS public) asyncjslife@gmail.com
// npm notice Please check your email for a one-time password (OTP)
// Enter one-time password: 24574622
// Logged in as asyncjslife on https://registry.npmjs.org/.
```

## 发布包

```bash
# 初始化 npm 及 git
npm init -y
git init

# 根据 package.json 里 main 字段，编写入口文件
# {
#   "name": "test-npm-registery",
#   "version": "1.0.0",
#   "description": "",
#   "main": "index.js",
#   "scripts": {
#     "test": "echo \"Error: no test specified\" && exit 1"
#   },
#   "keywords": [],
#   "author": "",
#   "license": "ISC"
# }

# 发包
npm publish

# npm notice
# npm notice 📦  test-npm-registery@1.0.0
# npm notice === Tarball Contents ===
# npm notice 76B  index.js
# npm notice 232B package.json
# npm notice === Tarball Details ===
# npm notice name:          test-npm-registery
# npm notice version:       1.0.0
# npm notice filename:      test-npm-registery-1.0.0.tgz
# npm notice package size:  337 B
# npm notice unpacked size: 308 B
# npm notice shasum:        8109f3bc14f49a875dc8b7a7690c171b4c9af242
# npm notice integrity:     sha512-jin9w+UL/G5Ur[...]YwQUFS5OT1ZOg==
# npm notice total files:   2
# npm notice
# npm notice Publishing to https://registry.npmjs.org/
# + test-npm-registery@1.0.0
```

## 查看包列表

发布完后，如何查看这个包呢

```bash
# 方式一：命令行
# npm ls <your-username> | [less|more]
npm ls asyncjslife
# test-npm-registery@1.0.0 /Users/yq/FE/test/about-npm/test-npm-registery
# └── (empty)

# 方式二：登录 https://registry.npmjs 后台，查看 packages
```

## 更新包

```bash
# 更新成指定版本，并生成一个git提交
npm version 2.0.1

# 更新：主版本号（Major）、次版本号（Minor）和修订号（Patch）
# 依然会生成一个git提交
npm version major
npm version minor
npm version patch
```
