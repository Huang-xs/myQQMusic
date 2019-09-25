function Ajax() { }

Ajax.prototype.init = function () {
    // 设置歌曲当前播放时间和歌曲总时间


    // 开始截取的下标
    var startindex = 0;

    // 结束截取的下标
    var endindex = 20;




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
            <div class="aut">${local.playlists[i].updateTime}</div>
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

    // 下载按钮得点击事件
    // getId("loadBtn").onclick = function () {
    //     location.href = "./songLists.html";
    // }

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

    // $.ajax({
    //         url: "http://localhost/user/playlist?uid=141998290",
    //         type: "post",
    //         // dataType: "jsonp",
    //         data: {},
    //         isAsync: "true",
    //         success: function(data) {
    //             console.log(data);

    //             // 每次截取的10条数据
    //             var cutData = data.Body.slice(startindex, endindex);
    //             console.log(cutData);


    //             // 初始化播放器
    //             $(".headImage").attr("src", data.Body[0].pic);
    //             $(".title").text(data.Body[0].title)
    //             $(".author").text(data.Body[0].author)

    //             $(".icon2").on("click", function() {
    //                 console.log($(".audio"));
    //             })
    //             var url = data.Body[0].url;
    //             console.log(url.split("=")[1].split("&")[0]);

    //             // $.post({
    //             //     dataType: "jsonp",
    //             //     url: "http://music.163.com/song/media/outer/url",
    //             //     isAsync: "true",
    //             //     data: {
    //             //         id: url.split("=")[1].split("&")[0]
    //             //     },
    //             //     success: function(data) {
    //             //         console.log(data);
    //             //         // $(".audio").attr("src", data);
    //             //     },
    //             // })
    // }
    // })

}

var Ajax = new Ajax();