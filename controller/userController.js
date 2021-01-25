// 数据库增删改查
const database = require('../public/backstage-codeJS/database.js');

let userController = {};

userController.loginReq = async(req, res) => {
    let { username, password } = req.body;
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

module.exports = userController;