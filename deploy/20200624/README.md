# 部署文档

纯代码的更新，只需要git pull 拉取代码，然后restart容器即可。

``` Shell
# 执行命令，更新代码
docker exec -it ark_server_1 git pull
docker exec -it ark_server_2 git pull

# 重启容器
docker restart ark_server_1 ark_server_2
```
