(function(window, undefined) {
    // 定义时间转换的 工具函数
    let util = {
        date_format: function(date, format = "YYYY-MM-DD HH:mm:ss") {
            return moment(date).format(format)
        }
    }

    // 暴露给全局
    window.util = util;
})(window)