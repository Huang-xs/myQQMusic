function Ajax() { }

Ajax.prototype.init = function () {
    // ================================存储
    // 存储audio
    var $audio = $("#audio")[0];

    //存储播放按钮
    var playBtn = getId("playBtn").children[0];

    // 关闭按钮的选择器
    var pauseBtn = $("#audio")[0];
    console.log(pauseBtn);


    // 判断是否播放的标记
    var isPlay = true;


    // 开始截取的下标
    var startindex = 0;

    // 结束截取的下标
    var endindex = 15;

    // 获取滑块的宽度
    var $mask = $(".mask");
    var maskwidth = $mask.width();

    //获取未激活进度条宽度
    var barsWidth = $('.bar').width();

    // 滑块的滑动范围
    var minLeft = 0;
    var maxLeft = barsWidth - maskwidth;

    // 存储事件层元素
    var $layer = $(".layer");

    // 判断状态是否改变
    var isChange = false;

    // 第几首歌曲
    var songIndex = 0;
    // ====================================处理函数
    // 处理日期格式
    function dealDate(getTime) {
        var second = new Date(getTime);
        return addZero(second.getFullYear()) + "-" + addZero(second.getMonth() + 1) + "-" + addZero(second.getDate())
    }
    // 时间补0
    function addZero(val) {
        return val = val < 10 ? "0" + val : val;
    }

    // 获取元素
    function getId(selector) {
        return document.getElementById(selector);
    }

    // 处理时间
    function dealTime(time) {
        var second = addZero(Math.floor(time / 1000 % 60));
        var minute = addZero(Math.floor(time / 1000 / 60));
        return minute + ":" + second;
    }

    // 进度条移动函数
    function move(e) {

        console.log("$layer==>", $layer.width());

        // 触碰屏幕的x坐标
        var x = e.targetTouches[0].pageX;
        console.log(x);


        // 获取当前元素距离左边的距离
        var offsetLeft = $(this).offset().left;

        var left = x - offsetLeft - maskwidth / 2;

        left = left >= maxLeft ? maxLeft : left <= minLeft ? minLeft : left;

        console.log("left==>", left);

        $mask.css({
            left: left + "px"
        });
        // 激活进度条

        var activeWidth = x - offsetLeft;
        activeWidth = activeWidth >= barsWidth ? barsWidth : activeWidth <= 0 ? 0 : activeWidth;
        $(".progress-active").css({
            width: activeWidth + "px"
        })
    }

    // 是否已经激活
    function isActive(selector, classname) {
        $(selector).removeClass(classname);
        if ($(selector).hasClass(classname)) {
            return;
        }
        $(this).parent().addClass(classname);
    }
    // ================================歌单列表 ( 网友精选碟 )
    //详情
    var songObj = {};
    var songArr = [];
    var songListDetail = localStorage.Detail;
    songListDetail = songListDetail == undefined ? songObj : songListDetail;

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
            <div class="moreplay">
                播放
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



    // 播放按钮的点击事件
    playBtn.onclick = function () {
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

    //==================================== 详情按钮的点击事件

    $(".list>li>.more").on("click", function () {
        var id = this.dataset.id;
        // $("footer").hide();
        console.log("获取歌单详情=>", id);

        $.ajax({
            type: "get",
            isAsync: "true",
            url: "http://localhost/playlist/detail?id=" + id,
            success: function (data) {
                console.log(data);

                //    渲染歌单描述
                var str = `<div class="songListImg fl">
                    <img src="${data.playlist.coverImgUrl}" alt="" class="auto-img">
                    </div>
                    <div class="descriptionContent fl">
                        <div class="songName">歌单名：${data.playlist.name}</div>
                        <div class="descriptionInfo">描述：${data.playlist.description == null ? "无" : data.playlist.description}</div>
                        <div class="songCTime">时间：${dealDate(data.playlist.createTime)}</div>
                        </div>`;

                $(".description").html(str);

                // 渲染歌单音乐列表

                var musicListNum = data.playlist.tracks.slice(startindex, endindex);

                var frame = document.createDocumentFragment();

                if ($(".Dsonglist>li").length != 0) {
                    $(".Dsonglist").children().remove();
                }
                for (var i = 0; i < musicListNum.length; i++) {

                    var li = document.createElement("li");

                    li.className = "clearfix";

                    li.setAttribute("data-id", musicListNum[i].id)
                    var liStr = `
                    <div class="headImg">
                        <img src="${musicListNum[i].al.picUrl}" alt="" class="auto-img">
                    </div>
                    <div class="songlistName">
                        <div class="DsonglName" data-author = "${musicListNum[i].ar[0].name}"> ${musicListNum[i].name}</div>
                        <div class="songListTime clearfix">
                            <div class="fl  durationTime">${dealTime(musicListNum[i].dt)}</div>
                            <div class="downLoadIcon fl">
                                <img src="./img/downLoad.png" class="auto-img" alt="" srcset="">
                            </div>
                            </div>
                    </div>
                    <div class="songListplayTip clearfix">
                        <i class=""></i>
                        <i class=""></i>
                        <i class=""></i>
                        <i class=""></i>
                    </div>`;
                    li.innerHTML = liStr;
                    frame.append(li)
                }
                $(".Dsonglist").append(frame)

                $(".Appcontent").slideDown();

                // 获取所有的li
                var getLi = $("#Dsonglist>li");

                getLi.on("click", function () {

                    getLi.removeClass("active")

                    if ($(this).hasClass("active")) {
                        return;
                    }
                    $(this).addClass("active");

                    // 获取当前播放音乐的图片
                    var currentSongImg = $(this).find(".headImg>img").attr("src");

                    //获取当前播放的歌曲名DsonglName
                    var currentSongName = $(this).find(".DsonglName").text();

                    //获取当前播放的歌曲作者
                    var currentSongAuthor = $(this).find(".DsonglName").data("author");

                    // 获取当前播放的歌曲总时间
                    var durationTime = $(this).find(".songListTime").find(".durationTime").text();
                    console.log(durationTime);

                    // 获取当前播放的歌曲id
                    var id = $(this).data("id");
                    // 获取当前播放的歌曲时间
                    // var currentSongTime = 
                    location.href = "./songWord.html?img+" + currentSongImg + "&SongName+" + currentSongName + "&author+" + currentSongAuthor + "&duration+" + durationTime + "&id+" + id;
                });
            }
        })
    })

    //================================ 歌单列表播放按钮点击事件
    var moreId = null; //播放的歌曲id

    $(".list>li>.moreplay").on("click", function () {
        // 当前的歌单id
        moreId = $(this).parent().find(".more").data("id");

        isActive.call(this, ".list>li", "songListActive");
        // 存储当前的图片w父元素
        var ImgSelector = $(this).parent().find(".numImg");
        // 存储当前的图片
        var initimg = ImgSelector.children().attr("src");
        // 获取图片的位置

        console.log(ImgSelector.offset());
        // 原始图片的x坐标
        var ImgX = ImgSelector.offset().left;
        //  原始图片的y坐标
        var ImgY = ImgSelector.offset().top;

        //  原始图片的宽度
        var ImgWidth = ImgSelector.width();
        // 克隆图片
        var cloneImg = ImgSelector.clone();
        cloneImg.css({
            width: ImgWidth + "px",
            position: "fixed",
            left: ImgX + "px",
            top: ImgY + "px"
        })
        $("body").append(cloneImg)

        //    获取播放头像的坐标
        var circleTop = $(".circle").offset().top;

        // 克隆图片动画
        cloneImg.animate({
            width: "10px",
            top: circleTop + "px"
        }, 1000, function () {
            $(".circle>img").attr("src", initimg);
            $(this).remove();
        })

        $.ajax({
            type: "get",
            isAsync: true,
            url: "http://localhost/playlist/detail?id=" + moreId,
            success: function (data) {
                var songId = data.playlist.tracks[songIndex].id;
                var songName = data.playlist.tracks[songIndex].name;
                var songActhor = data.playlist.tracks[songIndex].ar[0].name;
                var url = "https://music.163.com/song/media/outer/url?id=" + songId;

                $("#audio").attr("src", url);
                $(".title").text(songName);
                $(".author").text(songActhor);
                $("#playBtn>img").attr("src", "./img/play.png");
                isPlay = false;
                $audio.play();
            }
        })
    })
    // ==================================详情页返回按钮
    $("#icon1").on("click", function () {
        $(".Appcontent").slideToggle();
    });

    // ============================进度条

    // ============================音频播放事件
    $layer.on("touchstart", function (e) {
        move.call(this, e);
        isChange = true;
    })

    $layer.on("touchmove", function (e) {
        move.call(this, e);

        // 播放时拉动滑块
        var percent = $mask.position().left / maxLeft;
        var left = percent * duration * 1000;

        $("#currentTime").text(dealTime(left));
    })

    $layer.on("touchend", function (e) {
        var percent = $mask.position().left / maxLeft;

        $audio.currentTime = percent * duration;

        isChange = false;
    })

    // 存储当前总时间
    var duration = 0;

    // 总时间
    $audio.oncanplay = function () {
        console.log(moreId);
        
        duration = this.duration;


        $("#duration").text(dealTime(this.duration * 1000));
    }

    //监听音频实时变化
    // 当前时间
    $audio.ontimeupdate = function () {
        if (!isChange) {

            // 设置进度条上的当前时间
            $("#currentTime").text(dealTime(this.currentTime * 1000));

            // 设置进度条的实时变化的百分比
            var percent = this.currentTime / duration;


            // 滑块的实时变化
            $mask.css({
                left: percent * maxLeft + "px"
            })

            // 激活进度层的宽度
            $(".progress-active").css({
                width: percent * maxLeft + maskwidth / 2 + "px"
            })

        }
    }

    // 播放完成
    $audio.onended = function () {
        $("#playBtn>img").attr("src", "./img/i2.png");

        // 歌曲累加
        songIndex++;

        console.log(songIndex);

        $.ajax({
            type: "get",
            isAsync: true,
            url: "http://localhost/playlist/detail?id=" + moreId,
            success: function (data) {
                var songId = data.playlist.tracks[songIndex].id;
                var songName = data.playlist.tracks[songIndex].name;
                var songActhor = data.playlist.tracks[songIndex].ar[0].name;
                var url = "https://music.163.com/song/media/outer/url?id=" + songId;

                $("#audio").attr("src", url);
                $(".title").text(songName);
                $(".author").text(songActhor);
                $("#playBtn>img").attr("src", "./img/play.png");
                $audio.play();
            }
        })
    }

    $("#i1").on("click", function () {

        songIndex--;

        $.ajax({
            type: "get",
            isAsync: true,
            url: "http://localhost/playlist/detail?id=" + moreId,
            success: function (data) {
                if (songIndex < 0) {
                    songIndex = data.playlist.tracks.length - 1;
                }
                var songId = data.playlist.tracks[songIndex].id;
                var songName = data.playlist.tracks[songIndex].name;
                var songActhor = data.playlist.tracks[songIndex].ar[0].name;
                var url = "https://music.163.com/song/media/outer/url?id=" + songId;

                $("#audio").attr("src", url);
                $(".title").text(songName);
                $(".author").text(songActhor);
                $("#playBtn>img").attr("src", "./img/play.png");
                isPlay = false;
                $audio.play();
            }
        })
    })

    $("#i3").on("click", function () {

        songIndex++;

        $.ajax({
            type: "get",
            isAsync: true,
            url: "http://localhost/playlist/detail?id=" + moreId,
            success: function (data) {
                if (songIndex > data.playlist.tracks.length-1) {
                    songIndex = 0;
                }
                var songId = data.playlist.tracks[songIndex].id;
                var songName = data.playlist.tracks[songIndex].name;
                var songActhor = data.playlist.tracks[songIndex].ar[0].name;
                var url = "https://music.163.com/song/media/outer/url?id=" + songId;

                $("#audio").attr("src", url);
                $(".title").text(songName);
                $(".author").text(songActhor);
                $("#playBtn>img").attr("src", "./img/play.png");
                isPlay = false;
                $audio.play();
            }
        })
    })
}

var Ajax = new Ajax();