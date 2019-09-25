function API() { }

// 序列化请求地址路径，地址与？后面的字符串分开
// 有些地址需要key才能访问
API.prototype.serializeString = function (data) {
    var str = "";
    for (var i in data) {
        console.log(data[i] instanceof Object);
        if (data[i] instanceof Object) {
            for (var j in data[i]) {
                console.log(data[i]);

                str += i+"?"+j + "=" + data[i][j] + "&";
            }
        } else {

            str += i+ "=" + data[i] + "&";
        }

    }
    str = str.slice(0, -1);

    return str;
}
// 获取选择器
API.prototype.query = function (seletor) {
    return document.querySelectorAll(seletor)[0];
}
// 点击事件
API.prototype.event = function (seletor, type, fn) {
    return this.query(seletor)["on" + type] = fn
}
// Ajax的get请求
API.prototype.get = function (obj) {


    var xhr = null;

    // 兼容浏览器
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        // 针对低版本浏览器
        xhr = new ActiveXObject();
    }

    xhr.onreadystatechange = function () {
        // 判断当前的请求的数据是否成功，否则会不断发生响应
        if (this.readyState == 4 && this.status == 200) {

            var result = this.responseText;

            var jsonObject = eval("(" + result + ")");

            obj.success(jsonObject);
        }
    }

    var str = this.serializeString(obj.data);

    // xhr.open(请求方式, 请求地址, 是否异步)
    xhr.open("GET", obj.url + "?" + str, obj.isAsync)
    //建立服务器连接
    xhr.send();
}

// Ajax的get请求

API.prototype.post = function (obj) {
    var xhr = null;
    // 兼容浏览器
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        // 针对低版本浏览器
        xhr = new ActiveXObject();
    }

    xhr.onreadystatechange = function () {
        // 判断当前的请求的数据是否成功，否则会不断发生响应
        if (this.readyState == 4 && this.status == 200) {

            var result = this.responseText;

            var jsonObject = eval("(" + result + ")");

            obj.success(jsonObject);
        }
    }


    // xhr.open(请求方式, 请求地址, 是否异步)
    xhr.open("POST", obj.url, obj.isAsync)
    console.log(obj.data);

    var str = this.serializeString(obj.data);
    console.log(str);
    //建立服务器连接
    xhr.send(str);
}
// 集成post，get，jsonp

API.prototype.ajax = function (obj) {
    if (obj.dataType == "jsonp") {
        this.Jsonp(obj)
    } else {
        var xhr = null;

        // 兼容浏览器
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            //     // 针对低版本浏览器
            //     xhr = new ActiveXObject();
            // }
            // console.log(xhr);

            // xhr.onreadystatechange = function() {
            //     // 判断当前的请求的数据是否成功，否则会不断发生响应
            //     if (this.readyState == 4 && this.status == 200) {

            //         var result = this.responseText;

            //         var jsonObject = eval("(" + result + ")");

            //         obj.success(jsonObject);
            //     }
            // }

            // var str = this.serializeString(obj.data);

            // if (obj.type.toUpperCase() == "GET") {

            //     // xhr.open(请求方式, 请求地址, 是否异步)
            //     xhr.open(obj.type.toUpperCase(), obj.url + "?" + str, obj.isAsync)
            // } else {
            //     xhr.open(obj.type.toUpperCase(), obj.url + "?" + str, obj.isAsync)

            this[obj.type.toLowerCase()](obj)
        }
        //建立服务器连接
        // xhr.send(obj.type.toUpperCase() == "GET" ? null : str);
    }



}

//JSONP，解决跨域问题
API.prototype.Jsonp = function (obj) {
    /*对象的参数
    {
    url,
    data,
    success,
    //后台约定回调函数名称
    jsonCallback,
    } */

    // 创建script标签
    var script = document.createElement("script");

    var fnName = "jsonp" + new Date().getTime();

    window[fnName] = obj.success;

    var src = obj.url + "?" + this.serializeString(obj.data) + '&' + obj.jsonpCallback + "=" + fnName;

    script.src = src;

    document.body.appendChild(script);

    setTimeout(function () {
        script.remove();
    }, 500);
}
var API = new API();