function Ajax() { }

Ajax.prototype.init = function () {

// 处理日期格式
function dealDate(getTime){
    var second = new Date(getTime);
    return addZero(second.getFullYear())+"-"+addZero(second.getMonth()+1)+"-"+addZero(second.getDate())
}
// 时间补0
function addZero(val) {
    return val = val < 10 ? "0" + val : val;
}

    // 获取元素
    function getId(selector) {
        return document.getElementById(selector);
    }

    // http://localhost/song/url?id=33894312   可获取id为33894312的歌曲播放地址
    // 获取歌手所有的歌曲列表
    // 歌单 ( 网友精选碟 )

    var playlists = localStorage.playlists;

    if (playlists) {

        var local = JSON.parse(playlists);

        console.log(local);

        for (var i = 0; i < local.playlists.length; i++) {
            var li = document.createElement("li");
            li.setAttribute("class", "clearfix");
            var str = `<div class="numImg float-left">
            <img src="${local.playlists[i].coverImgUrl}" class="auto-img">
        </div>
        <div class="musicName float-left">
            <div class="name">${local.playlists[i].name}</div>
            <div class="aut">${dealDate(local.playlists[i].updateTime)}</div>
        </div>
        <div class="more" data-id = "${local.playlists[i].id}">
            详情
        </div>`;

            li.innerHTML = str;
            $(".list").append(li);
        }
    } else {

        $.ajax({
            url: "http://localhost/top/playlist?limit=20&order=new",
            type: "get",
            isAsync: "true",
            success: function (data) {
                console.log("获取歌单列表=>", data);

                localStorage.setItem("playlists", JSON.stringify(data));
                
                for (var i = 0; i < data.playlists.length; i++) {
                    // console.log(data.playlists[i]);
                    var li = document.createElement("li");
                    li.setAttribute("class", "clearfix");
                    var str = `<div class="numImg float-left">
                    <img src="${data.playlists[i].coverImgUrl}" class="auto-img">
                </div>
                <div class="musicName float-left">
                    <div class="name">${data.playlists[i].name}</div>
                    <div class="aut">${data.playlists[i].updateTime}</div>
                </div>
                <div class="more" data-id = "${data.playlists[i].id}">
                    详情
                </div>`;
                    li.innerHTML = str;
                    $(".list").append(li);
                }
            },

        })
    }


    // 播放按钮的选择器
    var playBtn = getId("playBtn").children[0];

    // 关闭按钮的选择器
    var pauseBtn = audio;

    // 判断是否播放的标记
    var isPlay = true;

    // 播放按钮的点击事件
    playBtn.onclick = function () {
        console.log("444");
        if (isPlay) {
            pauseBtn.play();
            playBtn.removeAttribute("src");
            playBtn.setAttribute("src", "./img/play.png");
            isPlay = false;
        } else {
            pauseBtn.pause();
            playBtn.setAttribute("src", "./img/i2.png");
            isPlay = true;
        }
    }




}

var Ajax = new Ajax();