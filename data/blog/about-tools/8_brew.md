---
title: brew
date: Fri Nov 03 2023 13:06:54 GMT+0800 (中国标准时间)
lastmod: 2023/11/3
tags: [brew, mac]
draft: false
summary: mac下软件管理器
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/about-tools/8_brew.md
---

## 安装

```bash
# 安装
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"


# 安装后，注意看提示添加环境变量
==> Next steps:
- Run these two commands in your terminal to add Homebrew to your PATH:
    (echo; echo 'eval "$(/opt/homebrew/bin/brew shellenv)"') >> /Users/didi/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
- Run brew help to get started
```
