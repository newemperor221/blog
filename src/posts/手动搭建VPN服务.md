---
title: 手动搭建VPN服务
date: 2026-02-21
description: ""
tags: ["VPS", "服务器", "VPN", "代理"]
categories: ["VPS"]
draft: false
---

> vless-reality协议，sing-box代理管理器

## 安装软件

```bash
sudo apt update && sudo apt install btop vim wget curl sudo traceroute neofetch -y
```

## sing-box安装

```bash
sudo mkdir -p /etc/apt/keyrings &&
   sudo curl -fsSL https://sing-box.app/gpg.key -o /etc/apt/keyrings/sagernet.asc &&
   sudo chmod a+r /etc/apt/keyrings/sagernet.asc &&
   echo '
Types: deb
URIs: https://deb.sagernet.org/
Suites: *
Components: *
Enabled: yes
Signed-By: /etc/apt/keyrings/sagernet.asc
' | sudo tee /etc/apt/sources.list.d/sagernet.sources &&
   sudo apt-get update &&
   sudo apt-get install sing-box
sudo systemctl enable sing-box
```

## 配置信息

```bash
sudo vim /etc/sing-box/config.json
```
把原来的删掉，粘贴以下内容
```bash
{
  "log": {
    "level": "warn",
    "timestamp": true
  },
  "inbounds": [
    {
      "type": "vless",
      "tag": "in-vless-reality",
      "listen": "0.0.0.0",
      "listen_port": 随机端口,

      "reuse_addr": true,
      "tcp_fast_open": true,

      "users": [
        {
          "name": "client",
          "uuid": "你的uuid",
          "flow": "xtls-rprx-vision"
        }
      ],
      "tls": {
        "enabled": true,
        "server_name": "www.cloudflare.com",
        "alpn": ["h2", "http/1.1"],
        "reality": {
          "enabled": true,
          "handshake": {
            "server": "www.cloudflare.com",
            "server_port": 443
          },
          "private_key": "你的私钥",
          "short_id": ["你的short-id"]
        }
      }
    },
    {
      "type": "hysteria2",
      "tag": "in-hysteria2",
      "listen": "::",
      "listen_port": 随机端口,
      "sniff": true,
      "sniff_override_destination": true,
      "domain_strategy": "prefer_ipv6",
      "up_mbps": 500,
      "down_mbps": 500,
      "obfs": {
        "type": "salamander",
        "password": "混淆密码"
      },
      "users": [
        {
          "name": "client",
          "password": "认证密码"
        }
      ],
      "tls": {
        "enabled": true,
        "alpn": ["h3"],
        "certificate_path": "/home/thunder/proxy/src/cert.pem",
        "key_path": "/home/thunder/proxy/src/key.pem"
      }
    }
  ],
  "dns": {
    "servers": [
      { "type": "local", "tag": "local" },
      { "type": "https", "tag": "cf", "server": "1.1.1.1" }
    ],
    "strategy": "prefer_ipv6",
    "final": "local",
    "cache_capacity": 4096
  },
  "outbounds": [
    { "type": "direct", "tag": "direct" }
  ],
  "route": {
    "default_domain_resolver": {
      "server": "local",
      "strategy": "prefer_ipv6"
    },
    "rules": [
      { "ip_is_private": true, "action": "reject" },
      { "protocol": "bittorrent", "action": "reject" }
    ],
    "final": "direct"
  }
}
```

## 启动服务

```bash
sudo sing-box check -c /etc/sing-box/config.json # 检查语法
sudo systemctl enable sing-box # 设置开机自启
sudo systemctl status sing-box # 查看服务状态
sudo systemctl restart sing-box # 重启服务
```

## 订阅格式

`vless-reality`订阅格式

```bash
vless://UUID@服务器域名或IP:端口?type=tcp&encryption=none&security=reality&flow=xtls-rprx-vision&sni=www.cloudflare.com&fp=chrome&pbk=PUBLIC_KEY&sid=SHORT_ID#节点名字
```

`hysteria2` 订阅格式

```bash
hysteria2://认证密码@服务器域名或IP:端口/?insecure=1&obfs=salamander&obfs-password=混淆密码#节点名字
```

## 生成相关密钥

### sing-box公/私钥

```bash
sudo sing-box generate reality-keypair
```

### UUID

```bash
cat /proc/sys/kernel/random/uuid
```

### short-id

```bash
openssl rand -hex 8
```

### 强密码

> xxxxxxxxxx1 1nrm testbash

```bash
openssl rand -base64 12
```

### 随机端口

```bash
shuf -i 1024-65535 -n 1
```

### 生成hy2所需的证书

> 不添加hy2不用弄

`mkdir -p ~/proxy/src` 用于存储密钥的目录

`cd ~/proxy/src` 进入这个目录

`openssl genpkey -algorithm ED25519 -out key.pem` 生成私钥

`openssl req -new -key key.pem -out cert.csr` 私钥生成证书请求 **cert.csr**，会提示

国家输入CN，省输入Sichuan，城市输入Chengdu，公司随便写，空一个回车，填写域名，后面的直接回车，不用填

`openssl x509 -req -in cert.csr -signkey key.pem -out cert.pem -days 3650` 私钥 **key.pem** 和证书请求 **cert.csr** 生成一个数字证书

## 创建VPN订阅站点

把80/443端口打开

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

安装Docker

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
$(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
```

创建Compose.yaml文件

```bash
mkdir ~/.vpn_rss && cd ~/.vpn_rss

vim compose.yaml

# 输入以下内容
services:
  redis:
    image: redis:7-alpine
    command: ["redis-server", "--save", "60", "1", "--loglevel", "warning"]
    restart: unless-stopped
    volumes:
      - redis_data:/data
    networks:
      - internal

  myurls:
    image: careywong/myurls:latest
    restart: unless-stopped
    depends_on:
      - redis
    networks:
      - internal
    ports:
      - "127.0.0.1:8080:8080"
    command:
      - "-conn"
      - "redis:6379"
      - "-password"
      - ""
      - "-domain"
      - "s.357561.xyz"
      - "-port"
      - "8080"
      - "-proto"
      - "https"

  subconv:
    image: aethersailor/subconverter-extended:latest
    restart: unless-stopped
    networks:
      - internal
    ports:
      - "127.0.0.1:25500:25500"

networks:
  internal:
    driver: bridge

volumes:
  redis_data:
```

启动docker`sudo docker compose up -d`

查看`sudo docker ps`

安装nginx

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

创建目录

```bash
sudo mkdir -p /var/www/letsencrypt/.well-known/acme-challenge
```

创建nginx substack.conf配置文件

```bash
cd /etc/nginx/sites-available/
sudo vim substack.conf
# 输入以下内容
server {
  listen 80;
  listen [::]:80;
  server_name api.357561.xyz;

  location ^~ /.well-known/acme-challenge/ {
    root /var/www/letsencrypt;
    try_files $uri =404;
  }

  location / { return 200 "ok\n"; }
}

server {
  listen 80;
  listen [::]:80;
  server_name s.357561.xyz;

  location ^~ /.well-known/acme-challenge/ {
    root /var/www/letsencrypt;
    try_files $uri =404;
  }

  location / { return 200 "ok\n"; }
}

```

载入`sudo nginx -t`

签发证书

```bash
# 需要先将api和s两个子域名指向本机IP，不要开小黄云
sudo certbot --nginx -d api.357561.xyz -d s.357561.xyz
```

替换substack.conf配置文件为以下内容

```bash
server {
    listen 80;
    listen [::]:80;
    server_name api.357561.xyz;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
        try_files $uri =404;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.357561.xyz;

    ssl_certificate     /etc/letsencrypt/live/api.357561.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.357561.xyz/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://127.0.0.1:25500;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /sub {
        add_header Cache-Control "no-store";
        proxy_pass http://127.0.0.1:25500;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    listen [::]:80;
    server_name s.357561.xyz;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
        try_files $uri =404;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name s.357561.xyz;

    ssl_certificate     /etc/letsencrypt/live/api.357561.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.357561.xyz/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location = /short {
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET,POST,OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type" always;
        if ($request_method = OPTIONS) { return 204; }

        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

`sudo ln -s /etc/nginx/sites-available/substack.conf /etc/nginx/sites-enabled/`启用文件

`sudo rm -f /etc/nginx/sites-enabled/default`禁用默认配置文件

`sudo nginx -t && sudo systemctl reload nginx`重载nginx服务
