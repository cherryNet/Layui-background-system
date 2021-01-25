let articleControl = {};
const fs = require('fs');
// 数据库增删查改
const database = require('../public/backstage-codeJS/database.js');

let moment = require('../public/js/moment')


articleControl.articleAll = async(req, res) => {
    let { page, limit: line } = req.query; //(页，显示行)
    page = (page - 1) * line; // 1 10   3 10
    let sql = `select t1.*,t2.name from article t1 left join category t2 on t1.cat_id = t2.cat_id order by art_id desc limit ${page},${line} `;
    let sql2 = `select count(*) as count from article;`
    let Content = database(sql);
    let ContentLength = database(sql2);
    // 并行
    let result = await Promise.all([Content, ContentLength])
    Content = result[0];
    let count = result[1][0].count;

    // 循环 转换时间  和  状态
    Content.forEach(val => {
        val.publish_date = moment(val.publish_date).format('YYYY-MM-DD HH:mm:ss')
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

// 封面图片上传
articleControl.upload = (req, res) => {
    if (req.file) {
        let { originalname, destination, filename } = req.file;
        //1. 获取 01.png 点的下标
        let dot = originalname.lastIndexOf('.');
        //2. 获取后缀 从点下标开始截取 .png
        let suffix = originalname.substring(dot);
        //3. 拼接旧地址
        let old_address = `${destination}${filename}`;
        //4. 要替换的新地址
        let new_address = `${destination}${filename}${suffix}`;

        // 进行文件的重命名 fs.rename(旧文件,新文件,(err)=>{})
        fs.rename(old_address, new_address, err => {
            if (err) {
                res.json('出错了');
            }
            res.json({ code: 0, message: '上传成功', src: new_address });
        })
    } else {
        res.send({ message: "没有" })

    }
}


// 添加新文章
articleControl.addarticle = async(req, res) => {
    //接收参数
    let { title, cat_id, status, content, cover } = req.body;
    // 接收当前登陆账号的用户名
    let username = req.session.userInfo.username;
    let sql = `insert into article(title, cat_id, status,author,content,cover,publish_date) values('${title}',${cat_id},${status},'${username}','${content}','${cover}',now())`;
    let result = await database(sql);
    // 受影响行不为0
    if (result.affectedRows) {
        // 成功
        res.json({ errcode: 0, 'message': '添加成功' });
    } else {
        res.json({ errcode: 1, 'message': '网络异常，请稍后再试' });
    }
}


// 修改文章审核状态 是否通过
articleControl.toExamine = async(req, res) => {
    let { art_id, state } = req.body;
    let sql = `update article set status = ${state} where art_id = ${art_id}`;
    let modifyState = await database(sql);
    // 受影响行
    if (modifyState.affectedRows) {
        res.json({ errcode: 0, message: '已通过' });
    } else {
        res.json({ errcode: 3, message: '内容违规' });
    }
}

// 文章编辑页面回显
articleControl.getOneArt = async(req, res) => {
    // 接收参数
    let { art_id } = req.body;
    // 2.查询数据库
    let sql = `select * from article where art_id = ${art_id}`;
    let data = await database(sql);
    // 3.返回数据
    if (data.length) {
        data[0].errcode = 0;
        res.json(data[0])
    } else {
        res.json({ errcode: 1, 'message': '网络异常，请稍后再试' })
    }
}

// 修改数据库 数据
articleControl.modifyArticle = async(req, res) => {
    // 接收参数
    let { cover, title, cat_id, status, content, art_id, oldPictures } = req.body;
    let sql;
    if (cover) {
        //有新上传的图片
        sql = `update article set title='${title}',content='${content}',cover='${cover}',status=${status},cat_id=${cat_id},publish_date=now() where art_id = ${art_id}`;
    } else {
        //未修改旧图片
        sql = `update article set title='${title}',content='${content}',status=${status},cat_id=${cat_id},publish_date=now() where art_id = ${art_id}`;
    }
    let result = await database(sql)
        // 受影响行数不为空
    if (result.affectedRows) {
        // 如果有上传新图片 就删除旧图片
        cover && oldPictures && fs.unlinkSync(oldPictures);
        res.json({ errcode: 0, 'message': '修改成功' })
    } else {
        res.json({ errcode: 1, 'message': '网络异常，请稍后再试' })
    }
}

module.exports = articleControl;