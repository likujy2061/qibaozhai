<%if request.querystring="v=1.0.0" then    server.transfer("Shared__QibaoGoodser.js_v=1.0.0") %>/*===============Upload log===================
 by wangaidi 2017/10/18
 *解决乱码
*/
$(function () {
    QiBaoData.UItoTop();
    /* 站内信提醒方法调用 */
    QiBao.autoRemind();
    /* 还价消息提醒方法调用 */
    QiBao.autoBanRemind();
    /* 交易消息提醒方法调用 */
    QiBao.autoBusNotRemind();
    /* 获取滚动广告 */
    var scrollTimer;
    $.ajax({
        url: "/Advertisement/GetAdInfo",
        type: "get",
        data: {
            r: Math.random(),
            adtype: "contentpage-string",
            getcount: 5
        },
        success: function (d) {
            if (d.IsSuccess) {
                var s = "";
                for (var i = 0; i < d.Data.length; i++) {
                    s += '<a href="' + d.Data[i].Link + '" target="_blank">' + d.Data[i].Title + '</a>'
                }
                $(".scroll ul li:eq(1)").html(s);
                $(".scroll").hover(function () {
                    if (scrollTimer) {
                        clearTimeout(scrollTimer);
                    }
                }, function () {
                    setTimeout(function () {
                        scrollNews($(".scroll"));
                    }, 50);
                }).trigger("mouseleave");

                function scrollNews(obj) {
                    var $self = obj.find("ul");
                    var liWidth = $self.find("li:first").width(); //获取宽度
                    marginLeft = parseInt($self.css("marginLeft"));
                    if (marginLeft == -(liWidth + 13)) {
                        $self.css("marginLeft", 0).find("li:first").appendTo($self);
                    } else {
                        $self.css("marginLeft", marginLeft - 1 + "px");
                    }
                    scrollTimer = setTimeout(function () {
                        scrollNews($(".scroll"));
                    }, 30);
                };
            } else {
                $(".js_top_error").show().html(d.Message)
            }
        }
    });

    //尾部图片轮播
    var getImg = function () { /* 异步请求 */
        $.ajax({
            url: "/Advertisement/GetAdInfo",
            type: "get",
            contentType: 'application/json',
            data: {
                r: Math.random(),
                adtype: 'contentpage-image',
                getcount: 4
            },
            dataType: "json",
            success: function (dimg) {
                if (dimg.IsSuccess) {
                    if (dimg.Data.length == 0) {
                        $(".slide_1").hide();
                    } else {
                        var tabimg = '';
                        var tabnub = '';
                        $.each(dimg.Data, function (i, item) {
                            if (item.Link == "") {
                                tabimg += '<li><img src="/Advertisement/GetImage/' + item.Code + '" width="998" height="100" alt="' + item.Title + '" /></li>';
                                tabnub += '<li><a  title="' + item.Title + '" href="javascript:void(0);">' + (i + 1) + '</a></li>';
                            } else {
                                tabimg += '<li><a  title="' + item.Title + '" href="' + item.Link + '" target="_blank"><img src="/Advertisement/GetImage/' + item.Code + '" width="998" height="100" alt="' + item.Title + '" /></a></li>';
                                tabnub += '<li><a title="' + item.Title + '" href="javascript:void(0);">' + (i + 1) + '</a></li>';
                            }
                        });
                    }
                    $('.slide_c1').append(tabimg);
                    $('.slide_n1').append(tabnub);
                    QiBao.lb();
                }
            }
        });
    };
    getImg();

    //热卖掌柜 最近浏览
    $(".hot_sale,.recent_browse,.contrast").click(function () {
        $("#js_dispensers").stop(true, true).fadeOut(500);
        $("#js_recently").stop(true, true).fadeOut(500);
        $("#js_contrast").stop(true, true).fadeOut(500);
        var currId = $(this).attr("href");
        if (currId == "#js_contrast") {
            if ($(".cotcontent").eq(0).find("ul li").length == 0) {
                $(".cotcontent").eq(0).find(".connonetip").show();
            }
            $(".js_navcotlist a").removeClass("curr");
            $(".js_navcotlist a:first").addClass("curr");
            $(".cotcontent").hide();
            $(".cotcontent").eq(0).show();
            $(".cotcontent").eq(0).find("ul li.on").find(".recently_r").click();
            $(".cotcontent").eq(0).find("ul li").eq(0).find(".recently_r").click();
            $(".cotcontent").eq(0).find("ul li").eq(1).find(".recently_r").click();
        }
        if ($(currId).is(":hidden")) {
            $(currId).fadeIn(500);
        } else {
            $(currId).fadeOut(500);
        }
        return false;
    });
    //隐藏最近浏览
    $(".js_floatbox").click(function () {
        $(this).parents(".floatbox").stop(true, true).fadeOut(500);
    });

    //获取热卖掌柜列表
    function getHotList() {
        $.ajax({
            url: "/BroadSide/GetTopFiveAccount",
            data: { r: Math.random() },
            dataType: "JSON",
            Type: "GET",
            success: function (d) {
                if (d != null) {
                    var lihtml = "";
                    for (var i = 0; i < d.length; i++) {
                        lihtml +=
                          '<li data-code=' + d[i].Code + ' >' +
                             '   <i class="desicon">' + parseInt(i + 1) + '</i>' +
                             '   <p class="disName">' + d[i].RoleName + '</p>  ' +
                             '   <p>本月成功交易量：<strong>' + d[i].Volume + '</strong>笔</p>' +
                             '   <a target="_blank" class="godislist" href="/Buy/HotSaleItem?roleName=' + d[i].RoleName + '&serverId=' + d[i].ServerId + '">查看掌柜所有商品<em></em></a>' +
                             '</li>';
                    };
                    $("#js_dispensers ul").empty().html(lihtml);
                }
            }
        })
    };
    //获取近期浏览列表
    function getRecentlyList() {
        $.ajax({
            url: "/BroadSide/GetLatelyGlanceOverInfo",
            data: { r: Math.random() },
            dataType: "JSON",
            Type: "GET",
            success: function (d) {
                if (d.length != 0) {
                    var lihtml = "";
                    for (var i = 0; i < d.length; i++) {
                        lihtml +=
                         '<li>' +
                         '   <div class="fl"><a  target="_blank"  href="' + d[i].LinkSrc + '"><img width="50" height="50" title="" src="' + d[i].ItemImage + '" /></a></div>' +
                         '   <div class="fl recently_r">' +
                         '       <p class="recName">' + d[i].ItemName.replace("<br/>", "") + '</p>  ' +
                         '       <p>&yen;' + d[i].ItemPrice + ' </p>' +
                         '   </div>' +
                         '</li>';
                    }
                    $("#js_recently ul").empty().html(lihtml);
                } else {
                    $("#js_recently ul").empty().html('<li style=" color:red;">亲，你还没有浏览过任何商品，快去浏览吧。！！！</li>');
                }
            }
        })
    };
    getHotList();
    getRecentlyList();
    //装备对比选项卡
    $(".js_navcotlist a").off("click").on("click", function () {
        if ($(".cotcontent").eq($(this).index()).find("ul li").length == 0) {
            $(".cotcontent").eq($(this).index()).find(".connonetip").show();
        }
        $(".js_navcotlist a").removeClass("curr");
        $(".js_cottip").html("");
        $(this).addClass("curr");
        $(".cotcontent").hide();
        $(".cotcontent").eq($(this).index()).show();
        $(".cotcontent").eq($(this).index()).find("ul li.on").find(".recently_r").click();
        $(".cotcontent").eq($(this).index()).find("ul li").eq(0).find(".recently_r").click();
        $(".cotcontent").eq($(this).index()).find("ul li").eq(1).find(".recently_r").click();
    });
    if (window.location.hostname == "qibao.gyyx.cn") {
        $(".js_hrefgo").attr("href", "/gpay.gyyx.cn/")
    } else {
        $(".js_hrefgo").attr("href", "/gpay.tjlong.cn/")
    }
});



function a(str) {
    window.location.href = "/www.gyyx.cn";
}