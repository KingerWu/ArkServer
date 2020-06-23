# 部署文档

由于是第一次部署，我们需要安装、配置各种依赖：

1. MongoDB
2. Mysql
3. Redis
4. 应用服务器
5. Nginx
6. https

## MongoDB

(由于我的测试服务器已经有一个MongoDB，所以为了不影响配置，我新建了一个MongoDB，并修改了端口)

``` Shell

# 创建容器
docker run -itd --name ark_mongo -p 15000:27017 mongo:latest --auth

# 进去mongo cli命令
docker exec -it ark_mongo mongo admin

# 创建admin账号
> db.createUser({ user:'admin',pwd:'123456',roles:[ { role:'userAdminAnyDatabase', db: 'admin'}]});

# 授权admin登录
> db.auth('admin', '123456')


# 切换到learn数据库
> use learn
# 在learn数据库下创建专用用户
> db.createUser({
    user:"learn",
    pwd:"123456",
    roles:[
        {role:"dbOwner",db:"learn"}
    ]
})

# 查看是否创建成功
> show users
```

## Mysql

(由于我的测试服务器已经有一个Mysql，所以为了不影响配置，我新建了一个Mysql，并修改了端口)

``` Shell
# 后台运行，映射3306端口，设置MySQL服务root用户的密码为123456。
docker run -itd --name ark_mysql -p 15001:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql:latest

# docker执行shell命令, 并以root用户连接mysql(env LANG=C.UTF-8 是让shell环境支持中文输入)
docker exec -it ark_mysql env LANG=C.UTF-8 mysql -h localhost -u root -p

# 创建一个叫learn的数据库
> CREATE DATABASE learn;
```

## Redis

（前面都弄了，这个也统一端口)

```Shell
# 启动容器
docker run -itd --name ark_redis -p 15002:6379 redis:latest --requirepass "123456"


# 测试，通过 redis-cli 连接测试使用 redis 服务 (--raw 正常显示中文，-a 密码)
docker exec -it ark_redis redis-cli --raw -a "123456"
```

## 应用服务器

应用服务器，采用Dockerfile的方式进行构建（需要在Dockerfile目录下添加config.json文件）。

Dockerfile：

``` Dockerfile
# 设置基础镜像,如果本地没有该镜像，会从Docker.io服务器pull镜像
FROM node

# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone  && \
    dpkg-reconfigure -f noninteractive tzdata

# 创建app目录,保存我们的代码
RUN mkdir -p /usr/src/node

#设置工作目录
WORKDIR /usr/src/node

# 安装git工具
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git

# 拉取项目
RUN git clone https://github.com/KingerWu/ArkServer.git /usr/src/node

COPY config.json ./config

# 编译运行node项目，使用npm安装程序的所有依赖
RUN npm install

#运行命令
CMD ["node", "index.js"]
```

config.json：

``` json
{
    "mongo": {
        "url": "mongodb://172.17.0.1:15000/learn",
        "user": "learn",
        "pass": "123456"
    },
    "mysql": {
        "host": "172.17.0.1",
        "port": 15001,
        "db": "learn",
        "user": "root",
        "pass": "123456"
    },
    "redis": {
        "host": "172.17.0.1",
        "port": 15002,
        "pass": "123456"
    },
    "common": {
        "port": 80
    }
}
```

在完成上述配置后，即可在当前目标构建docker镜像：

``` Shell
# 构建docker镜像
docker build -t ark_server .

# 构建容器
docker run -itd --name ark_server_1 -p 14999:80 ark_server
docker run -itd --name ark_server_2 -p 14998:80 ark_server

# 查看日志 确认服务器启动情况
docker logs ark_server_1
docker logs ark_server_2
```

完成上述步骤后，如果你的云服务器已经配置了正确的入站规则（查看阿里云、腾讯云配置文档），那么你就已经可以通过ip：port的方式进行访问了。

由于我们的服务器是无状态的，所以可以建立多个应用服务器进行测试。

## Nginx && Https

Https,我们选择certbot，参考链接如下：

* [certbot](https://certbot.eff.org/lets-encrypt/debianbuster-nginx)

### 配置nginx

``` Shell
# 拉取nginx镜像
docker pull nginx
# 构建nginx容器，开放80 443端口
docker run --name nginx -d -p 80:80 -p 443:443 nginx
# 进入nginx容器
docker exec -it nginx bash
```

修改容器中/etc/nginx/nginx.conf文件

``` nginx.conf
user root;
worker_processes 2;
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {

    ##
    # Basic Settings
    ##

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    # server_tokens off;

    # server_names_hash_bucket_size 64;
    # server_name_in_redirect off;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    ##
    # Logging Settings
    ##

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    ##
    # Gzip Settings
    ##

    gzip on;
    gzip_disable "msie6";


    include /etc/nginx/conf.d/*.conf;
}

```

增加ArkServer的配置文件, 添加到/etc/nginx/conf.d目录中（需要删除/etc/nginx/conf.d/default.conf文件）。

``` ark.conf
upstream ark_server {
    server 172.17.0.1:14999;
    server 172.17.0.1:14998;
}
server {
    listen 80;
    server_name 输入你的域名地址;
    charset utf-8;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host  $http_host;
        proxy_set_header X-Nginx-Proxy true;
        proxy_http_version 1.1;
        proxy_set_header Connection "";

        # 配置upstream节点
        proxy_pass    http://ark_server;
    }
}
```

### 配置certbot

``` Shell
# 根据certbot的指导，我们安装关联配置（docker nginx 容器 为debian 10 系统）
apt-get install certbot python-certbot-nginx

# 申请https证书 （--register-unsafely-without-email 不使用账号密码，那么是本地保存的，不过我们是测试，没所谓）
certbot --nginx --register-unsafely-without-email
```

配置成功后，即可访问相应的域名，进行测试了。

## 碰到的问题

1. 服务器配置完成后，忘记添加device token了，所以一直显示接口验证签名失败。只需要将本地测试的token拷贝到服务器，或者新增，使用新的token即可。
2. 第二个问题，就是使用insert时，因为key是mysql的保留字，当使用了mysql保留字，需要用反引号将其引起来。
3. 注册发现一个bug，注册接口，refreshToken 与 UserTokenTb 字段refresh_token 映射错误

添加device token的代码：

``` shell
# 错误示例，因为key是mysql的保留字，当使用了mysql保留字，需要用反引号将其引起来。（错误码：ERROR 1064 (42000)）
INSERT INTO device_tb (key, token) VALUES ("Android", "4287caf2-db47-4d5f-9a0f-2f4af1d82ba3");

# 正确示例
INSERT INTO device_tb (`key`, `token`) VALUES ("Web","1b6abc5a-0e71-4877-8322-da4adb9f3e88");
INSERT INTO device_tb (`key`, `token`) VALUES ("Android", "4287caf2-db47-4d5f-9a0f-2f4af1d82ba3");
INSERT INTO device_tb (`key`, `token`) VALUES ("iOS", "29204f63-3233-466d-99be-08e196aaa3cb");
INSERT INTO device_tb (`key`, `token`) VALUES ("Pc", "e7dc253e-73ae-445e-9b11-8f3b0bf38806");
```
