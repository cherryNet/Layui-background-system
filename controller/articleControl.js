let articleControl = {};

// 数据库增删查改
const database = require('../public/backstage-codeJS/database.js');

let moment = require('../public/js/moment')


articleControl.articleAll = async(req, res) => {
    let { page, limit: line } = req.query; //(页，显示行)
    page = (page - 1) * line; // 1 10   3 10
    line = page + line
    let sql = `select * from article where art_id between ${page} and ${line}`
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
        // 循环 转换时间  和  图片地址  状态
    Content.forEach(val => {
        val.publish_date = moment(val.publish_date).format('YYYY-MM-DD HH:mm:ss')
        val.cover = val['\r\ncover'];
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

module.exports = articleControl;