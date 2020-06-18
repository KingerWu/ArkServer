# 更新内容备注

1. 将现有数据库备份
2. 将现有的数据库，密码加盐存储
3. 添加默认的设备授权

## 数据库备份

目前我们的数据库比较小，直接导出好像没啥问题，期望后面数据多了，看下怎么处理更快。

``` shell
# -uroot -p123456 为mysql的root账号密码、需要连在一起，并不是语法格式问题。
docker exec -it mysql env LANG=C.UTF-8 mysqldump -uroot -p123456 learn > learn.sql
```

## 密码加盐

密码需要增加到100的长度，因为没有新增字段等复杂行为，直接使Api即可。

update_user_pass.js 文件

``` JavaScript
    UserTb.sync({ alter: true }).then(async function (result) {
        await sequelize.transaction({}, async (t) => {
            let users = await UserTb.findAll({
                transaction: t
            });
            for (let i = 0; i < users.length; i++) {
                let user = users[i];
                let shaPwd = CryptoJS.SHA256(user.pass).toString(CryptoJS.enc.Hex);
                let saltPwd = CryptoJS.SHA256(shaPwd + salt).toString(CryptoJS.enc.Hex);


                console.log(user.name, user.pass + "->" + saltPwd);
                await user.update({
                    pass: saltPwd,
                }, {
                    transaction: t
                });
            }
        })
    })
```
