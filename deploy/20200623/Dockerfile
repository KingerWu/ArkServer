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
