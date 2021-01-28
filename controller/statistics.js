// 数据库增删查改
const database = require('../public/backstage-codeJS/database.js');

let statistics = {};

statistics.cateCount = async(req, res) => {
    let sql = `select count(*) total,t2.name from article t1 left join category t2 on t1.cat_id = t2.cat_id group by t1.cat_id;`
    let data = await database(sql);
    res.json(data);
}

statistics.monArtCount = async(req, res) => {
    let sql = `select month(publish_date) month,count(*) as total from article where year(publish_date) = year(now()) group by month(publish_date)`
    let data = await database(sql);
    res.json(data);
}

module.exports = statistics;