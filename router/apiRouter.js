const express = require('express');
// 得到一个路由器
let router = express.Router();
// 数据库增删查改
const model = require('../public/backstage-codeJS/database.js');
// 时间
let moment = require('../public/js/moment')

// 获取所有分类  和每个分类有几个
router.get('/cate', async(req, res) => {
    let sql = `select count(*) total, t1.* from category t1 left join article t2 on t1.cat_id = t2.cat_id group by t1.cat_id`;
    let data = await model(sql);
    res.json(data);
})

// 获取最新发布的文章
router.get('/article', async(req, res) => {
    let { _page = 1, _limit = 8 } = req.query;
    let offset = (_page - 1) * _limit;
    let sql = `select t1.*, t2.name from article  t1 left join category t2  on t1.cat_id = t2.cat_id 
        where status = 1 
        order by publish_date desc
        limit ${offset},${_limit}`;
    let data = await model(sql); // [{},{}]
    // 添加图片完整路径
    data.map(v => {
        if (v.cover) {
            v.cover = `http://localhost:5000/${v.cover}`
        }
        if (v.publish_date) {
            v.publish_date = moment(v.publish_date).format('YYYY-MM-DD')
        }
    })
    res.json(data)
})

// 获取所有文章条数
router.get('/articleSta', async(req, res) => {
    sql = `select * from article where status = 1`;
    let data = await model(sql);
    res.json(data);
})

// 获取文章详情
router.get('/articleInfo/:art_id', async(req, res) => {
    let { art_id } = req.params; // 路由参数 
    let sql = `select t1.*,t2.name cat_name from 
            article t1 left join category t2 on t1.cat_id = t2.cat_id 
            where art_id = ${art_id}`;
    let data = await model(sql); // [{}]
    data[0].publish_date = moment(data[0].publish_date).format('YYYY-MM-DD HH:mm')
    res.json(data[0] || {})
})

// 获取某个分类下面的文章
router.get('/getCateArticle/:cat_id', async(req, res) => {
    let { _page = 1, _limit = 5 } = req.query;
    let offset = (_page - 1) * _limit;

    let { cat_id = 0 } = req.params; // 路由参数 
    let sql = `select t1.*,t2.name cat_name from article t1
            left join category t2 on t1.cat_id = t2.cat_id
            where t1.cat_id = ${cat_id} and status = 1 order by publish_date desc limit ${offset},${_limit}`;
    let data = await model(sql); // [{},{}]
    data.map(v => {
        if (v.cover) {
            v.cover = 'http://localhost:5000/' + v.cover
        }
    })
    res.json(data)
})

// 文章查询模糊匹配
router.get('/fuzzyMatching', async(req, res) => {
    let { _page = 1, _limit = 5, value } = req.query;
    let offset = (_page - 1) * _limit;

    let sql = `select t1.*,t2.name from article t1 left join category t2 on t1.cat_id = t2.cat_id where title like '%${value}%' limit ${offset},${_limit}`
    let data = await model(sql);
    // 添加图片完整路径
    data.map(v => {
        if (v.cover) {
            v.cover = `http://localhost:5000/${v.cover}`
        }
        if (v.publish_date) {
            v.publish_date = moment(v.publish_date).format('YYYY-MM-DD')
        }
    })
    res.json(data);
})

module.exports = router;