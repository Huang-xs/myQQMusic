function REM() { }
// 设置rem

// 创建id便于后面的删除
var id = null;
REM.prototype.setRem = function () {
    // 动态计算屏幕的宽度
    var fontSize = innerWidth >= 768 ? "100px" : innerWidth / 767 * 100 + "px";

    id = new Date().getTime();

    // 为html设置字体样式
    var style = document.createElement("style");

    style.innerHTML = "html{font-size:" + fontSize + "}";
    style.id = id;
    document.getElementsByTagName("head")[0].append(style);
}
REM.prototype.resetRem = function () {
    var that = this;
    
    //保存定时器序号 
    var timers = [];
    // 该变浏览器窗口的大小
    window.onresize = function () {

        var timer = setTimeout(function () {
            //清除后续定时器，只保留第一个定时器，减少setRem()函数执行次数
            for (var i = 1; i < timers.length; i++) {
                clearTimeout(timers[i]);
            }

            //移除原本创建的style与元素
            document.getElementById(id).remove();

            that.setRem();
        },500);
      timers.push(timer);
    }
}

REM.prototype.init = function () {
    // 初始化html样式
    this.setRem();

    this.resetRem();

}

var rem = new REM();