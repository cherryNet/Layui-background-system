const mysql = require('mysql');

//连接数据库参数配置
var connection = mysql.createConnection({
    host: "localhost", //主机
    port: '3306', //端口
    user: "root", //用户名
    password: "0000", //密码
    database: "test" //数据库
});
//连接mysql
connection.connect(function(err) {
    if (err) {
        throw err;
    }
    console.log('connect mysql success');
});

function database(sql) {
    return new Promise((resolve, rejected) => {
        connection.query(sql, (err, rows) => {
            if (err) { rejected(err) };
            resolve(rows);
        })
    })
}

module.exports = database;