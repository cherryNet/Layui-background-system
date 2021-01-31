// 数据库增删改查
const database = require('../public/backstage-codeJS/database.js');
const md5 = require('md5');
let { secret } = require('../config/secretKey.json'); //密钥
const fs = require('fs');

let userController = {};

// 用户登陆
userController.loginReq = async(req, res) => {
    let { username, password } = req.body;
    // 要把密码加密钥后   再去“加密”对比 需要安装 (npm i md5加密)
    password = md5(`${password}${secret}`);
    let sql = `select * from users where username='${username}' and password = '${password}'`;
    let data = await database(sql);
    if (data.length) {
        // 把用户信息存入到session会话中
        req.session.userInfo = data[0];
        // 匹配成功 有当前用户名
        res.json({ errcode: 0, message: '登录成功' });
    } else {
        // 用户名或密码错误
        res.json({ errcode: 2, message: '用户名或密码错误' });
    }
}

// 保存(修改)上传的头像
userController.picture_upload = async(req, res) => {
    let { potr_url, user_id, OldPict } = req.body;
    // console.log(OldPict);
    OldPict && fs.unlinkSync(OldPict);
    let sql = `update users set avatar = '${potr_url}' where user_id = ${user_id}`;
    let data = await database(sql);
    // 受影响行
    if (data.affectedRows) {
        res.json({ errcode: 0, message: '上传成功' });
    } else {
        res.json({ errcode: 1, message: '网络异常请稍后再试' });
    }
}

// 获取个人首页头像
userController.obtain_pict = async(req, res) => {
    let { user_id } = req.body;
    // 查询数据库
    let sql = `select * from users where user_id = ${user_id}`;
    let data = await database(sql);
    // 返回数据
    if (data.length) {
        data[0].errcode = 0;
        res.json(data[0])
    } else {
        res.json({ errcode: 1, 'message': '网络异常，请稍后再试' })
    }
}

// 修改密码的接口
userController.passwordVer = async(req, res) => {
    let { usedPassword, newPassword, user_id } = req.body;
    usedPassword = md5(`${usedPassword}${secret}`);
    // 1.对比原密码是否正确
    let sql = `select * from users where password = '${usedPassword}' and user_id = ${user_id}`;
    let data = await database(sql);
    if (!data.length) {
        res.json({ errcode: 4, "message": "原密码错误" });
        return;
    }
    // 2.修改旧密码
    newPassword = md5(`${newPassword}${secret}`);
    let sql2 = `update users set password = '${newPassword}' where user_id = ${user_id}`;
    let result = await database(sql2);
    if (result.affectedRows) {
        res.json({ errcode: 0, "message": "修改成功" });
    } else {
        res.json({ errcode: 1, "message": "网络异常，请稍后再试" });
    }
}

// 用户注册
userController.registerReq = async(req, res) => {
    let { userName, Password } = req.body;
    // 1.查询数据库有没有当前用户名
    let sql = `select * from users where username = '${userName}'`
    let data = await database(sql);
    if (data.length) {
        res.json({ errcode: 5, "message": "用户名已存在" });
        return;
    };
    // 2.添加用户
    Password = md5(`${Password}${secret}`);
    let sql2 = `insert into users(username,password) values('${userName}','${Password}')`;
    let result = await database(sql2);
    // 受影响行不为0
    if (result.affectedRows) {
        // 成功
        res.json({ errcode: 0, 'message': '注册成功' });
    } else {
        res.json({ errcode: 1, 'message': '网络异常，请稍后再试' });
    }
}


module.exports = userController;