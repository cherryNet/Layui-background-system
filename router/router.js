const express = require('express');

// 得到一个路由器
let router = express.Router()

// 倒入控制器
let controller = require('../controller/controller.js');

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


// 暴露路由器
module.exports = router;