const express = require('express');
const multer = require('multer')

// 定义上传的目录(保存会自动生产该文件夹)
let upload = multer({ dest: 'uploads/' });

// 得到一个路由器
let router = express.Router()

// 栏目管理控制器控制器
let controller = require('../controller/controller.js');
// 引入文章控制器
let articleControl = require('../controller/articleControl');
// 用户登陆注册控制器
let userController = require('../controller/userController');
// 数据统计控制器
let statistics = require('../controller/statistics');


// 获取post 参数的中间件
router.use(express.json()) // for parsing application/json
router.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// 展示页面
router.get(/^\/$|^\/index$/, (req, res) => {
    res.render('index.html');
})

// 栏目管理页面
router.get('/table', (req, res) => {
    res.render('content/table.html')
})

// 文章分类页面
router.get('/articleSort', (req, res) => {
    res.render('content/article.html')
})

// 查询数据库
router.get('/getCate', controller.getCate)

// 数据库中删除数据
router.post('/delCat', controller.delCat)

// 添加数据页面
router.get('/addElement', (req, res) => {
    res.render('content/addElement.html')
})

// 数据库添加数据
router.post('/addData', controller.addData)

// 更新数据页面
router.get('/editData', (req, res) => {
    res.render('content/editData.html')
})

// 获取单条数据的信息
router.post('/getOneCate', controller.getOneCate)

// 修改更新数据内容
router.post('/updateData', controller.updateData)


// 获取文章管理数据
router.get('/articleAll', articleControl.articleAll)

// 删除文章管理数据 行
router.post('/deleartRow', articleControl.deleartRow)

// 添加文章页面
router.get('/addArticlePage', (req, res) => {
    res.render('content/addArticlePage.html');
})

// 获取文章分类数据
router.post('/classify', articleControl.classify);

// 添加新文章
router.post('/addarticle', articleControl.addarticle)

// 封面图片上传
router.post('/upload', upload.single('file'), articleControl.upload)

// 修改 审核状态 是否通过
router.post('/toExamine', articleControl.toExamine);

// 文章编辑页面
router.get('/artedit', (req, res) => {
    res.render('content/articleEditor.html');
})

// 文章编辑数据回显
router.post('/getOneArt', articleControl.getOneArt);

// 修改数据库文章内容
router.post('/modifyArticle', articleControl.modifyArticle);


// 显示登陆注册页面的接口
router.get('/Login_register', (req, res) => {
    // 当已经登陆有session信息  再访问该路径 则直接跳转到首页 
    if (req.session.userInfo) {
        res.redirect('/');
        return
    }
    res.render('common/login-register.html');
})


// 请求登陆的接口
router.post('/loginReq', userController.loginReq);

// 退出登陆
router.get('/LogOut', (req, res) => {
    // 删除所有的会话信息
    req.session.destroy(err => {
            if (err) { throw err }
        })
        // 跳转到登陆页面
    res.render('common/login-register.html');
})


// 获取session用户信息
router.get('/userSession', (req, res) => {
    let userSession = req.session.userInfo;
    res.json(req.session.userInfo);
})

// 统计出分类的文章总数
router.get('/cateCount', statistics.cateCount);


// 统计每月的文章总数
router.get('/monArtCount', statistics.monArtCount);

// 显示个人中心页面
router.get('/personal', (req, res) => {
    res.render('content/personal.html');
})

// 存入头像
router.post('/picture_upload', userController.picture_upload);

// 获取个人首页头像
router.post('/obtain_pict', userController.obtain_pict);


// 暴露路由器
module.exports = router;