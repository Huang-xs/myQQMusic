window.onload = function () {
    // 调用初始化rem函数
    rem.init();

    // 返回按钮的点击事件
    $(".songPrev").on("click", function () {
        history.go(-1);
    })

    // ========================================处理函数
    function dealUrl(url) {
        // 将请求地址与请求参数分开
        var data = url.split("?")[1].split("&");
        // 创建存储参数的对象
        var obj = {};

        for (var i = 0; i < data.length; i++) {
            // 将参数与键名分开
            var parameter = data[i].split("+");
            obj[parameter[0]] = parameter[1];
        }
        return obj;
    }

    // 处理时间
    function dealTime(time) {
        var second = addZero(Math.floor(time / 1000 % 60));
        var minute = addZero(Math.floor(time / 1000 / 60));
        return minute + ":" + second;
    }

    // 时间补0
    function addZero(val) {
        return val = val < 10 ? "0" + val : val;
    }
    // =========================================获取路径参数
    var url = dealUrl(decodeURI(location.search));
    console.log(url);

    $(".songTitle").text(url.SongName);
    $(".moveImg>img").attr("src", url.img);
    $(".acthor").text(url.author);
    $(".durationTime").text(url.duration);

    //音频是否播放的标志
    var isPlay = true;
    console.log(url.id);
    // ====================================获取歌词
    $.ajax({
        url: "http://localhost/lyric?id=" + url.id,
        type: "get",
        isAsync: "true",
        success: function (data) {
            // console.log(data.lrc.lyric);

            var lyric = data.lrc.lyric.split(/[\n\r]+/);

            for (var v of lyric) {
                let lrc = v.split("]")[1];
                var second = v.split("]")[0].slice(1).split(":");
                var time = Number(second[0]) * 60 + Number(second[1]);
                if (lrc) {
                    var P = $("<p data-time=" + time + ">" + lrc + "</p>");
                    $(".showWord").append(P);
                }

            }

        }
    })
    //==================================== 获取当前音频
    var $audio = $("#audio")[0];
    var songUrl = "https://music.163.com/song/media/outer/url?id=" + url.id;
    $audio.setAttribute("src", songUrl);
    if (isPlay) {
        $audio.play();
        $("#playBtn").attr("src", "./img/play.png");
        isPlay = false;
    }

    // ===================================进度条

    // 获取滑块的宽度
    var $mask = $(".mask");
    var maskwidth = $mask.width();

    //获取未激活进度条宽度
    var progressWidth = $('.progress').width();
    console.log(progressWidth);

    // 激活层
    var activeProgress = $(".progress-active");

    // 滑块的滑动范围
    var minLeft = 0;
    var maxLeft = progressWidth - maskwidth;

    // 存储事件层元素
    var $layer = $(".layer");

    // 当前播放的选择器
    var $currentTime = $(".currentTime");

    // 获取音频总时间
    var duration = 0;

    $audio.oncanplay = function () {
        duration = this.duration;

    }
    // 获取当前当前音频的播放时间

    
    
    $audio.ontimeupdate = function () {
        var $p = $(".showWord>p");

        var wordHeight = parseFloat($p.css("top"));
        var height = $p.height();
        var currentTime = this.currentTime;
        // console.log(currentTime);

        // 显示当前歌曲实时变化的时间
        $currentTime.text(dealTime(currentTime * 1000));

        // 滑块变化的百分比
        var percent = currentTime / duration;
        // 实时改变进度条
        $mask.css({
            left: percent * maxLeft + "px",
        })
        activeProgress.css({
            width: percent * maxLeft + "px"
        })

      
        // 歌词移动
        
        for (var i = 0; i < $p.length; i++) {
            //    获取当前的p和下一个p
            var currentPTime = $p.eq(i).data("time");
            var prevPTime = $p.eq(i + 1).data("time");

            console.log(prevPTime);
            if (i + 1 == $p.length) {
                prevPTime = Number.MAX_VALUE;
            }
            if(this.currentTime >= currentPTime && this.currentTime < prevPTime){
                console.log("4444====================");
                console.log(-wordHeight - height * i);
                
                  $(".showWord").animate({
                      marginTop : -wordHeight - height * i  + "px"
                  },150);
            }

        }
    }

    $audio.onended = function () {
        $("#playBtn").attr("src", "./img/i2.png");
    }

    var endX = 0;
    $("#layer").on("touchstart", function (e) {

        maskMove(e);
        var x = e.touches[0].pageX
        endX = x;
        var movePercent = (x - maskwidth / 2) / maxLeft;

        var left = movePercent * duration;

        console.log("left", left);

        console.log($audio.currentTime);

        $audio.currentTime = left;
        console.log("1", $audio.currentTime);
    })

    $("#layer").on("touchmove", function (e) {
        maskMove(e);

        // 进度条拖动的距离
        var movePercent = $mask.position().left / maxLeft;
        var left = movePercent * duration;

        $currentTime.text(dealTime(left * 1000));
    })

    $("#layer").on("touchend", function (e) {

        console.log(duration);
        var Percent = (endX - maskwidth / 2) / maxLeft;

        $audio.currentTime = Percent * duration;

        console.log("2", $audio.currentTime);

    })
    // =======================================封装滑块移动函数
    function maskMove(e) {
        var x = e.touches[0].pageX - maskwidth / 2;
        // console.log(x);
        var left = x < minLeft ? minLeft : x > maxLeft ? maxLeft : x;
        $mask.css({
            left: left + "px"
        })
        activeProgress.css({
            width: x + "px"
        })
    }
    //================================暂停或播放
    $("#playBtn").on("click", function () {
        // console.log($audio);
        if (isPlay) {
            // 播放音乐
            $audio.play();
            $(this).attr("src", "./img/play.png")
            isPlay = false;
        } else {
            $audio.pause();
            $(this).attr("src", "./img/i2.png")
            isPlay = true;
        }
    })




}
