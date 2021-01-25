const express = require('express');
const path = require('path');
// 引入session会话技术
let session = require('express-session');
// 模板引擎
const artTemplate = require('art-template');
const express_template = require('express-art-template');


const app = express();
// 导入路由器模块
let router = require('./router/router.js');

//配置模板的路径
app.set('views', __dirname + '/views/');

//设置express_template模板引擎的静态文件扩展名为.html
app.engine('html', express_template);

//使用模板引擎扩展名为html
app.set('view engine', 'html');

// 托管静态资源
app.use('/public', express.static(path.join(__dirname, './public')));
// 托管静态资源
app.use('/uploads', express.static('./uploads'))


// 初始化session,定义session一些配置
let options = {
    name: 'sessionid', //存放在cookie中的键名
    secret: 'haifd@#$*&%', //用来加密会话防止篡改(内容随便，越随机越好)
    cookie: {
        httpOnly: true,
        secure: false, //false是http(默认)，true是https
        maxAge: 6000 * 30 //session在cookies存活30分钟
            // 30分钟内再次访问就会重置，30分钟后访问才会失效
    }
}
app.use(session(options))


// 在进入路由 router函数 之前要进行 验证权限 (防翻墙)
app.use((req, res, next) => {
    // 获取当前访问的路由 req.path
    let path = req.path.toLowerCase(); //toLowerCase() 转换成小写
    // 定义不需要权限验证的路由
    let routeArr = ['/loginreq', '/login_register'];
    // 判断当前数组里有没有访问的路由
    if (routeArr.includes(path)) {
        //有 则 放行
        next();
    } else {
        //没有 则 验证 有没有用户信息 session
        if (req.session.userInfo) {
            // 有用户信息则继续操作
            next();
        } else {
            // 没有则跳转到登陆页面
            // res.redirect('/Login_register');
            next();
        }
    }
})

// 使用路由中间件
app.use(router)


app.listen(5000, (req, res) => {
    console.log('服务器已启动，5000端口监听中....');
})