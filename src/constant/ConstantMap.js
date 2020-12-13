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


    // 能量 精力等级 (1-5级)
    Level1: 1,
    Level2: 2,
    Level3: 3,
    Level4: 4,
    Level5: 5,


    // todo list 操作类型 1: 本周，2: 历史记录
    TodoOptCurrent: 1,
    TodoOptHistory: 2,


    // 类目 （健康状况 = 1， 娱乐情况 = 2，爱的现状 = 3， 事业情况 = 4）
    TodoTypeHealthy: 1,
    TodoTypeEntertainment: 2,
    TodoTypeFeeling: 3,
    TodoTypeCause: 4,

    // 状态 (就绪 = 1， 完成 = 2， 未完成 = 3)
    TodoStatusReady: 1,
    TodoStatusFinish: 2,
    TodoStatusUnFinish: 3,


    // 类目 （工作观 = 1， 人生观 = 2）
    WorthTypeWork: 1,
    WorthTypeLife: 2,
}

module.exports = ConstantMap;