const ConstantMap = {
    // 验证码类型 （注册 = 1、登录 = 2、修改密码 = 3、账号注销 = 4）
    UserCodeTypeRegister: 1,
    UserCodeTypeLogin: 2,
    UserCodeTypeModifyPass: 3,
    UserCodeTypeLogOff: 4,

    // 登录类型 （Web = 1、Android = 2、iOS = 3）
    UserTokenTypeWeb: 1,
    UserTokenTypeAndroid: 2,
    UserTokenTypeiOS: 3,

    // 登录状态 （登录成功 = 1、密码错误 = 2、验证码错误 = 3）
    UserLoginStatusLoginSuccess: 1,
    UserLoginStatusLoginFailWithPass: 2,
    UserLoginStatusLoginFailWithCode: 3,

    // 1 修改昵称, 2 修改邮箱, 3 修改密码
    UserChangeTypeName: 1,
    UserChangeTypeEmail: 2,
    UserChangeTypePass: 3,

    // 文件类型 （私有专属 = 1， 全局分享 = 2）
    FileModePrivate: 1,
    FileModePublic: 2,
}

module.exports = ConstantMap;