---
title: VPS保护流程
date: 2026-02-21
description: ""
tags: ["VPS", "服务器", "保护"]
categories: ["VPS"]
draft: false 
---

> 以下操作均在debian12中操作

## 创建普通用户

```bash
useradd -m -s /usr/bin/bash <username>
# -m: 创建用户目录
# -s <shell>: 指定shell
# 若没有添加-s参数使用以下命令
# user -s /usr/bin/bash <username>
```

### 添加密码

```bash
passwd <username>
```

### 使用root权限

> 如果没有sudo，先安装

```bash
vim /etc/sudoers
```

找到`root ALL=(ALL:ALL) ALL`这行，复制粘贴到下一行，把root改为<username>

使用`su <username>`可切换用户

## 上传公共密钥

### 客户端

#### 创建.ssh目录

在`C:\Users\<username>`或`/home/<username>`创建.ssh目录

```bash
# Windows
md .ssh
# Mac or Linux
mkdir .ssh
```

#### 生成密钥

```bash
# key name随便填
ssh-keygen -t ed25519 -C "<key name>"
```

按三次回车，密钥即可创建成功

#### 上传密钥到服务器

> ssh默认端口为22

```bash
# Windows
scp -P <port> C:\Users\<username>\.ssh\id_ed25519.pub <普通用户名>@<域名或服务器IP>:~/.ssh/authorized_keys
# Linux or Mac
scp -P <port> ~/.ssh/id_ed25519.pub <普通用户名>@<域名或服务器IP>:~/.ssh/authorized_keys
```

### 服务端

赋予密钥文件权限

```bash
chmod 600 authorized_keys
```

到这里已经可以使用密钥登陆了

## SSH修改端口

> 端口共有35536个，范围0-65535

```bash
sudo vim /etc/ssh/sshd_config
```

修改以下内容

```bash
Port <随机ssh端口>
PermitRootLogin no #禁用root用户登录
PasswordAuthentication no #禁用密码登录
PubkeyAuthentication yes #允许公钥认证
AddressFamily inet #sshd不监听ipv6端口
```

重启服务

```bash
sudo systemctl restart ssh
```

## UFW 防火墙配置

```bash
sudo apt update && sudo apt install ufw 
```
启用防火墙

```bash
sudo ufw enable
```

允许端口

```bash
sudo ufw limit from 0.0.0.0/0 to any port <ssh端口> proto tcp # 只开放ipv4端口，limit限速
sudo ufw allow 443/tcp
sudo ufw allow 80/tcp
```

>禁用端口
>
>```bash
>sudo ufw deny <port>/<udp or tcp>
>```

载入规则

```bash
sudo ufw reload
```

>查看规则
>
>```bash
>sudo ufw status
>```
>
>删除规则
>
>```bash
>sudo ufw status numbered
>sudo ufw delete <序号>
>```
>
>禁用防火墙
>
>```bash
>sudo ufw disable
>```

### 禁用Ping

```bash
sudo vim /etc/ufw/before.rules
```

搜`echo-request`，这有两个，把有`input`的那行的`ACCEPT`改成`DROP`

载入规则

```bash
sudo ufw reload
```

## 创建虚拟内存

```bash
sudo fallocate -l 512M /swap
sudo chmod 600 /swap
sudo mkswap /swap
sudo swapon /swap
echo '/swap none swap sw 0 0' | sudo tee -a /etc/fstab
```

验证

```bash
free -h
sudo swapon --show
```

在`/etc/sysctl.conf`里追加`vm.swappiness=10`

使用以下命令载入规则

```bash
sudo sysctl -p
```

## 添加Sysctl规则

```bash
sudo vim /etc/sysctl.conf
```

追加规则

```bash
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr
net.ipv4.tcp_mtu_probing = 1
net.ipv4.tcp_slow_start_after_idle = 0
net.ipv4.tcp_syncookies = 1
```

载入规则

```bash
sudo sysctl -p
```

## Fail2ban

> 防止ssh被暴力破解

安装fail2ban

```bash
sudo apt update && sudo apt install fail2ban
```

复制文件

```bash
cd /etc/fail2ban
sudo cp fail2ban.conf fail2ban.local
sudo vim fail2ban.local
```

添加内容

```bash
[sshd]
enabled = true
port = <SSH port>
filter = sshd
logpath = /var/log/auth.log
backend = auto

maxretry = 3
findtime = 10m
bantime  = 7d

bantime.increment = true
bantime.factor = 2
bantime.maxtime = 30d
```

创建日志文件

```bash
sudo touch /var/log/auth.log
```

重启fail2ban

```bash
sudo systemctl enable fail2ban
sudo systemctl restart fail2ban
```

查看状态

```bash
sudo fail2ban-client status
sudo fail2ban-client status sshd
```

> 解除指定IP
>
> ```bash
> sudo fail2ban-client set sshd unbanip <被禁用的IP>
> ```

## 修改日志大小上限

```bash
sudo vim /etc/systemd/journald.conf
```

修改以下参数

```bash
SystemMaxUse=200M
SystemKeepFree=500M
MaxRetentionSec=7day
```

重启服务

```bash
sudo systemctl restart systemd-journald
sudo systemctl status systemd-journald
```

## 时间同步

```bash
sudo apt update && sudo apt install chrony

sudo systemctl enable --now chrony
chronyc tracking
```

## 自动安全更新
>小型vps不要弄
```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```
确保
```bash
Unattended-Upgrade::Origins-Pattern {
        ...
};
```
里面只有
```bash
"origin=Debian,codename=${distro_codename}-security,label=Debian-Security";
```
这一句，其它的注释掉