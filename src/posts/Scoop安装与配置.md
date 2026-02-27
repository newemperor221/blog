---
title: Scoop安装与配置
date: 2026-02-21
description: ""
tags: ["Scoop"]
categories: ["Scoop"]
draft: false 
---

> Windows 利用 scoop 安装 nvm、nodejs

## Scoop 安装
> [scoop 官方站](https://github.com/ScoopInstaller/Scoop)
scoop 部分教程来自 [scoop 国内镜像站](https://scoop.201704.xyz)
```bash
# 脚本执行策略更改，默认自动同意
Set-ExecutionPolicy RemoteSigned -scope CurrentUser -Force
```
ScoopDir是Scoop 的核心安装目录，安装的应用都在里面；如果不指定，默认放在`C:\User\用户名\`下，请执行`iwr -useb scoop.201704.xyz | iex`，此命令和下方命令任选其一
```bash
# 自定义安装目录
irm scoop.201704.xyz -outfile 'install.ps1'
.\install.ps1 -ScoopDir 'D:\Scoop\Scoop' -ScoopGlobalDir 'D:\Scoop\GlobalScoopApps'
```
安装成功后会提示安装git
`scoop install git`
会自动安装7zip，出现以下图片，说明安装成功
安装aria2 可多连接下载`scoop install aria2 `
`scoop config aria2-warning-enabled false`可抑制警告

### 安装或卸载应用
安装应用使用`scoop install 软件名`

卸载应用使用`scoop uninstall 软件名`

### 代理
> 魔法设置全局代理
```bash
# 添加代理
scoop config proxy 127.0.0.1:7890

# 删除代理
scoop config rm proxy
```

### 查看或添加bucket
> bucket是scoop的软件仓库

可使用以下命令查看已安装bucket或安装第三方bucket
```bash
# 查看已知bucket
scoop bucket known

# 添加需要的bucket
scoop bucket add extras
```

更多第三方bucket访问[镜像站](https://gitee.com/scoop-installer)
