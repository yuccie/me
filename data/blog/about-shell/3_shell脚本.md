---
title: 'shell脚本'
date: Tue Oct 10 2023 15:58:13 GMT+0800 (中国标准时间)
lastmod: '2023-10-10'
tags: ['shell']
draft: false
summary: 'shell脚本'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/about-shell/3_shell脚本
---

## shell 脚本

```bash
if [ $ENV == xxx ];then
  UPLOAD_TYPE=xxx
  npm run build:xxx
else
  npm run build:xxx-a
fi

ret=$?

if [ $ret -ne 0 ];then
  echo "===== run build:xxx failure ====="
  exit $ret
else
  echo "===== npm run build:hyApp successfully! ====="
fi
```

- if 与 fi 配套使用，表示一个完整的 if 语句
- 在 Bash 脚本中，`$?` 是一个特殊变量，**它用于获取上一个命令的退出状态码（或返回值）**。
  - 因此这里就是获取 `run build:xxx 或 npm run build:xxx-a` 命令的退出状态码
  - 并将其保存在变量 ret 中
- ret 是变量名，用于存储值，而 $ret 是变量值的引用
  - 其实要想使用这个变量，则需要 使用 $xxxx
