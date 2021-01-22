let articleControl = {};

// 数据库增删查改
const database = require('../public/backstage-codeJS/database.js');

let moment = require('../public/js/moment')


articleControl.articleAll = async(req, res) => {
    let { page, limit: line } = req.query; //(页，显示行)
    page = (page - 1) * line; // 1 10   3 10
    let sql = `select * from article order by art_id desc limit ${page},${line} `;
    let sql2 = `select count(*) as count from article;`
    let Content = database(sql);
    let ContentLength = database(sql2);
    // 并行
    let result = await Promise.all([Content, ContentLength])
    Content = result[0];
    let count = result[1][0].count;

    let state = {
            0: '未发布',
            1: '已发布',
            2: '审核中'
        }
        // 循环 转换时间  和  状态
    Content.forEach(val => {
        val.publish_date = moment(val.publish_date).format('YYYY-MM-DD HH:mm:ss')
        val.status = state[val.status];
    })
    let artContent = {
        code: 0,
        mag: '',
        count: count,
        data: Content
    }
    res.json(artContent)
}


// 删除数据
articleControl.deleartRow = async(req, res) => {
    let { art_id } = req.body;
    let sql = `delete from article where art_id = ${art_id}`;

    let data = await database(sql);
    // 受影响行数 不为空
    if (data.affectedRows) {
        res.json({ errcode: 0, 'message': '删除成功' })
    } else {
        res.json({ errcode: 2, 'message': "服务器繁忙,请稍后再试" })
    }
}


// 获取文章分类
articleControl.classify = async(req, res) => {
    // 1.查询数据库
    let sql = "select * from category order by sort desc"
    let data = await database(sql)
        // 2.返回数据
    res.json(data)
}


// 添加新文章
articleControl.addarticle = async(req, res) => {
    //接收参数
    let { title, cat_id, status, content } = req.body;
    let sql = `insert into article(title, cat_id, status,content) values('${title}',${cat_id},${status},'${content}')`;
    let result = await database(sql);
    // 受影响行不为0
    if (result.affectedRows) {
        // 成功
        res.json({ errcode: 0, 'message': '添加成功' });
    } else {
        res.json({ errcode: 1, 'message': '网络异常，请稍后再试' });
    }
}

module.exports = articleControl;