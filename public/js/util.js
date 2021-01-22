(function(window, undefined) {

    // 加载进度条
    (function() {
        NProgress.set(0.4); // 默认设置40% NProgress.set(0) 等价与 NProgress.start()
        let interval = setInterval(function() {
            NProgress.inc(); // 以小量递增
        }, 200)

        $(window).on('load', () => {
            clearInterval(interval)
            NProgress.done()
        })
    })()


    // 定义时间转换的 工具函数
    let util = {
        date_format: function(date, format = "YYYY-MM-DD HH:mm:ss") {
            return moment(date).format(format)
        }
    }

    // 暴露给全局
    window.util = util;
})(window)