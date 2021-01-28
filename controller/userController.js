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
    console.log(OldPict);
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

module.exports = userController;