// 数据库增删改查
const database = require('../public/backstage-codeJS/database.js');
// 控制器
let controller = {};

// 查询数据库
controller.getCate = async(req, res) => {
    let sql = "select * from category order by sort"

    let data = await database(sql);
    res.json(data);
}

// 数据库中删除数据
controller.delCat = async(req, res) => {
    let { cat_id } = req.body;
    let sql = `delete from category where cat_id = ${cat_id}`;

    let data = await database(sql);
    // 受影响行数 不为空
    if (data.affectedRows) {
        res.json({ errcode: 0, 'message': '删除成功' })
    } else {
        res.json({ errcode: 2, 'message': "服务器繁忙,请稍后再试" })
    }
}

// 添加数据库数据
controller.addData = async(req, res) => {
    //接收参数
    let { name, sort, add_date } = req.body;
    let sql = `insert into category(name,sort,add_date) values('${name}',${sort},'${add_date}')`;
    let result = await database(sql);
    // 受影响行不为0
    if (result.affectedRows) {
        // 成功
        res.json({ errcode: 0, 'message': '添加成功' });
    } else {
        res.json({ errcode: 1, 'message': '网络异常，请稍后再试' });
    }
}

// 获取单条数据的信息
controller.getOneCate = async(req, res) => {
    // 接收参数
    let { cat_id } = req.body;
    // 2.查询数据库
    let sql = `select * from category where cat_id = ${cat_id}`;

    let data = await database(sql);
    // 3.返回数据
    if (data.length) {
        data[0].errcode = 0;
        res.json(data[0])
    } else {
        res.json({ errcode: 1, 'message': '网络异常，请稍后再试' })
    }
}

// 修改更新数据内容
controller.updateData = async(req, res) => {
    // 接收参数
    let { cat_id, name, sort, add_date } = req.body

    //2.编写sql
    let sql = `update category set name='${name}',sort=${sort},add_date='${add_date}' where cat_id = ${cat_id}`;
    let result = await database(sql)
        // 受影响行数不为空
    if (result.affectedRows) {
        res.json({ errcode: 0, 'message': '修改成功' })
    } else {
        res.json({ errcode: 1, 'message': '网络异常，请稍后再试' })
    }
}

module.exports = controller;