---
title: "Type Script学习"
date: 2026-02-26
description: ""
tags: ["TS", "Type-Script"]
categories: ["Type-script"]
draft: false
---

> 本教程基于windows下编写

## ts环境搭建

使用scoop安装nvm

```bash
scoop install nvm
```

nvm安装nodejs

```bash
nvm install 22.16.0
nvm use 22.16.0

node -v
npm -v
```

使用npm安装type-script

```bash
#全局安装
npm install typescript -g

#仅项目安装
npm install typescript --save-dev

tsc -v
```

安装ts-node

```bash
#全局安装
npm install -g ts-node

#仅项目安装
npm install --save-dev ts-node

#此命令会在项目目录内创建一个默认配置的 package.json 文件
npm init -y

# 会生成一个tsconfig.json文件
npx tsc --init
```

## 运行ts文件

```bash
npx ts-node index.ts
```