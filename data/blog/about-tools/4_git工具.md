---
title: 'git工具'
date: Wed Oct 11 2023 09:15:30 GMT+0800 (中国标准时间)
lastmod: '2023-10-11'
tags: ['git工具']
draft: false
summary: 'git工具'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/about-tools/4_git工具
---

## git

### git reset

git reset 用于将分支的 HEAD 指针移动到另一个位置，并可以选择是否保留或丢弃之前的更改。主要用于修改分支的历史记录。

- git reset --soft <commit>：移动 HEAD 指针到指定的 commit，并保留之前的更改。撤销 commit 的提交历史，但保留之前的更改在暂存区中，你可以重新提交这些更改。
- git reset --mixed <commit>：与 --soft 类似，移动 HEAD 指针到指定的 commit，但丢弃之前的更改。撤销 commit 的提交历史，并将之前的更改放入工作目录中的未跟踪文件状态。
- git reset --hard <commit>：完全移动 HEAD 指针到指定的 commit，并丢弃之前的更改。撤销 commit 的提交历史，并丢弃之前的所有更改。

当想要撤销最近的提交并保留更改，可以使用 `git reset --soft HEAD~`

在 Git 中，~ 符号用于**表示相对于当前提交的位置**。在命令 `git reset --soft HEAD~` 中，`HEAD~ 表示当前提交的父提交（上一个提交）`。

使用 ~ 符号加上数字可以表示相对于当前提交的更早的提交。例如，HEAD~2 表示当前提交的父提交的父提交（上两个提交），这中间的提交记录将都会没有，相当于重新提交。

一般想丢弃提交，但保留修改使用这个

### git revert

git revert **用于创建一个新的提交，撤销指定提交的更改**。相当于在历史记录中添加了一个新的提交，该提交是原提交的相反操作。主要用于在不改变分支历史的情况下撤销 commit。

git revert <commit>：创建一个新的提交，撤销指定的 commit 的更改。新的提交是原提交的相反操作，可以保留分支的历史记录。

- git revert HEAD 撤销最近的提交
- git revert xxx 指定的提交

因此每次只会撤销一个历史提交

执行 git revert 命令后，Git 会打开一个文本编辑器，让你输入撤销提交的相关说明。保存说明并关闭编辑器后，Git 将创建一个新的撤销提交。

相当于把之前的提交以及修改全部干掉了，同时新增一个提交记录。

一般想丢弃之前修改的情况下会使用这个。

### git reflog 查看变动历史

当你操作了很多 git 命令后，不知道哪个环节出错了，可以使用 `git reflog` 查看历史的 git 修改记录，比如使用 revert，还是 reset 操作等等
