const express = require('express');
const path = require('path');
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


// 使用路由中间件
app.use(router)


app.listen(5000, (req, res) => {
    console.log('服务器已启动，5000端口监听中....');
})