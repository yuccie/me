---
title: '大数据断点续传'
date: Sun May 07 2023 22:37:02 GMT+0800 (中国标准时间)
lastmod: '2023-05-07'
tags: ['大数据上传', '断点续传']
draft: false
summary: ''
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/upload-big-data
---

## 背景

当一个文件很大时，

## 技术方案

1. 前端选择文件
   1. 支持什么类型: 
      1. xhr 可以发送任何数据类型
      2. antd 组件需要支持
   2. 文件大小
      1. 服务器需要设置接受文件大小
2. 前端如何处理文件
   1. 文件很大，前端需要切片
      1. 切割成多个 formData 
      2. 然后并行发起多个请求，支持设置max
      3. 切片slice很快，切好直接并发发送
   2. 如何切片
      1. file 数据流操作，直接 file.slice 即可
      2. 如何标记每个切片，高效
3. 后端如何组装文件
   1. 如何组装数据，若中间某个片段缺失？
4. 后端如何保存数据
   1. 写入硬盘
   2. 写入cdn
   3. 写入数据库

## 一些数据指标

### 网络数据的计量单位

假如一个 1.6G 的视频，文件系统是以 字节Byte计量的，即 `1.6G -> 1.6 * 1025M -> 1.6 * 1024 * 1024 KB -> 1.6 * 1024 * 1024 * 1024 Byte`

### 网络层分片的大小

在分片式，尽量利用网络协议分片的大小分，这样数据包就不用再次拆解

TCP协议没有限制每个chunk的最大大小，但是操作系统和网络设备会对TCP数据包的大小进行限制。

一般情况下，TCP数据包的大小不能超过`MTU(Maximum Transmission Unit)`的大小，MTU的默认值通常是`1500字节`。因此，TCP数据包的大小也通常被限制在1500字节以内。

那如何查看真实网络中，每个tcp数据包的大小呢？

1. 下载并安装Wireshark。
2. 打开Wireshark，选择网络接口（就是对应的网卡），开始捕获数据包。
3. 在捕获过程中，可以使用过滤器来只显示TCP数据包。在过滤器栏中输入"tcp"，回车
4. 在捕获过程中，可以看到每个TCP数据包的大小。在Wireshark的数据包列表中，可以看到每个数据包

注意：
- 关闭混杂模式，只接受发送给本机的数据包：设置 -> 取消勾选 enable promiscuous mode on all interfaces
- 客服端向DNS服务器查询域名时，一般返回的内容都不超过 512 字节，用 udp 传输即可，不经过三次握手，DNS服务器负载更低，响应更快。其实很多dns服务器仅支持UDP协议
- 过滤器输入： ip.src_host == ipxxx1，就是过滤源 ipxxx1 地址发出去的数据包
- 过滤器输入： ip.src_host == ipxxx1 || ip.dst_host == ipxxx2 支持or、and等语句，目标地址
- 过滤器有提示，有很多选择器

