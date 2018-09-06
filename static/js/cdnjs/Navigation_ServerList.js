/*===============Upload log===================
 by wangaidi 2017/10/18
 *解决乱码
*/
$(function () {
    /*首页*/
    //首页服务器切换效果
    $("#js_server > .tb_th > a").click(function () {
        $(this).addClass("curr").siblings("a").removeClass("curr");
        $("#js_server > .tb_tbody").hide();
        $("#js_server > .tb_tbody").eq($(this).index()).show();
    });

    $("#js_server > .tb_tbody > a,.nearlist a").click(function () {
        var datas = {
            serverCode: $(this).attr("data-sid"),
            areaCode: $(this).attr("data-aid"),
            areaName: $(this).attr("data-aname"),
            serverName: $(this).text(),
            r: Math.random()
        };
        isAlertPop(datas);

    });
    //首页搜索框模糊查询区组效果
    search({
        input: $("#search_input"),//搜索输入框
        searchtext: $("#js_server > .tb_tbody > a"),//需要查找内容
        listbox: $("#search_list"),//搜索显示下拉框
        maxlengt: 10//限制最多展示几个匹配项
    });


    function search(options) {
        $this = options.input;
        $searchtext = options.searchtext;
        $listbox = options.listbox;
        //保存当前所有区服
        var litext = "", liarr = [], curr = -1, k = 0;
        $searchtext.each(function (i, ele) {
            liarr[i] = $(ele).text() + "-" + $(ele).attr("data-aname") + "-" + $(ele).attr("data-aid") + "-" + $(ele).attr("data-sid");
        });
        $("#js_enter").click(function () {
            $this.focus();
            searchtext();
        });
        //当按下时
        $this.keyup(function (event) {
            //下拉框的上下箭头选择
            var maxlen = $listbox.find("li").length;
            switch (event.keyCode) {
                case 38://上
                    curr <= 0 ? curr = 0 : curr--;
                    $listbox.find("li").eq(curr).addClass("curr").siblings("li").removeClass("curr");
                    $this.val($listbox.find("li").eq(curr).text());
                    $this.attr("data-aname", $listbox.find("li").eq(curr).attr("data-aname"));
                    $this.attr("data-aid", $listbox.find("li").eq(curr).attr("data-aid"));
                    $this.attr("data-sid", $listbox.find("li").eq(curr).attr("data-sid"));
                    break;
                case 40://下
                    curr == maxlen - 1 ? curr = maxlen - 1 : curr++;
                    $listbox.find("li").eq(curr).addClass("curr").siblings("li").removeClass("curr");
                    $this.val($listbox.find("li").eq(curr).text());
                    $this.attr("data-aname", $listbox.find("li").eq(curr).attr("data-aname"));
                    $this.attr("data-aid", $listbox.find("li").eq(curr).attr("data-aid"));
                    $this.attr("data-sid", $listbox.find("li").eq(curr).attr("data-sid"));
                    break;
                case 8://删除
                    searchtext();
                    if (k == 0) { $listbox.fadeOut(500); }
                    break;
                case 13://回车
                    //通过搜索文本，然后找到区服，再进入游戏
                    var iscurr = false;
                    for (var i = 0; i < liarr.length; i++) {
                        var item = liarr[i].split("-");
                        if (item[0] == $(this).val()) {
                            $(this).attr("data-aname", item[1]);
                            $(this).attr("data-aid", item[2]);
                            $(this).attr("data-sid", item[3]);
                            var datas = {
                                serverCode: $(this).attr("data-sid"),
                                areaCode: $(this).attr("data-aid"),
                                areaName: $(this).attr("data-aname"),
                                serverName: $(this).val(),
                                r: Math.random()
                            };
                            isAlertPop(datas);
                            iscurr = true;
                            break;
                        }
                    }

                default:
                    searchtext();
            }
        });

        //匹配搜索
        function searchtext() {
            $listbox.empty().html("");
            curr = -1;
            k = 0;//保存当前匹配的搜索结果列表个数
            for (var j = 0; j < liarr.length; j++) {
                if ($this.val() == "") { return false; }
                var item = liarr[j].split("-");
                if (item[0].indexOf($this.val()) != "-1" && k < options.maxlengt) {
                    $listbox.append('<li data-aname="' + item[1] + '" data-aid="' + item[2] + '" data-sid="' + item[3] + '">' + item[0] + '</li>');
                    k++;
                    if (k >= options.maxlengt) { break; }
                }
            }
            //给搜索结果绑定进入游戏事件
            if (k > 0) {
                $listbox.fadeIn(500);
                $listbox.find("li").die("click").live("click", function () {

                    $this.val($(this).text());
                    for (var i = 0; i < $searchtext.length; i++) {
                        if ($searchtext.eq(i).text() == $(this).text()) {
                            var datas = {
                                serverCode: $(this).attr("data-sid"),
                                areaCode: $(this).attr("data-aid"),
                                areaName: $(this).attr("data-aname"),
                                serverName: $(this).text(),
                                r: Math.random()
                            };
                            isAlertPop(datas);
                            break;
                        }
                    }
                });
            } else { $listbox.fadeOut(500); }
        }
        //失去焦点时，下拉框消失
        $this.focusout(function () {
            $listbox.fadeOut(500);
        });
    };

    QiBao.GuiderJs({ /* 区服播放动画 */
        url: "/Navigation/GuideAnimation",
        guider_decImg: ".gindex div",  /* 说明图片对象 */
        Isfixed: true,
        type: "serverList",
        guiderObj: [".gynav", ".gynav"]  /* 需要引导的对象 */
    });
    //弹层
    function isAlertPop(datas) {
        $.ajax({
            type: "get",
            url: "/Navigation/IsAlertCaptcha",
            data: {
                r: Math.random()
            },
            success: function (d) {
                if (d.IsSuccess) {
                    if (d.Show) {
                        QiBao.showCodeDiv();
                        $(".js_Codediv_btn").die("click").live("click", function () {
                            $(".js_ekey_err").hide().html("");

                            var captchaCode = $(":input[data-id=txtCaptchaCode]");
                            if (captchaCode.val() == "") {
                                $(".public_Code_div").find(".js_pass_err").show().html("验证码不能为空");
                                return false;
                            } else {
                                datas.captcha = $(":input[data-id=txtCaptchaCode]").val();

                                gotoServerList(datas);
                            }
                            return false;
                        });
                    } else {
                        datas.captcha = $(":input[data-id=txtCaptchaCode]").val();


                        gotoServerList(datas);
                    }
                } else {
                    if (d.Data == "unauthorized") {
                        QiBao.TimeOutDiv();
                    } else if (d.Data == "JsonException") {
                        window.location.href = d.ReturnUrl;
                    } else {
                        $(".puberror_table").show().html(d.Message);
                    }
                }
            }
        });
    }
    //加载数据列表
    function gotoServerList(data) {
        $.ajax({
            type: "POST",
            url: "/Navigation/ServerList",
            data: data,
            success: function (d) {
                if (d.IsSuccess) {
                    window.location.href = d.Return_url;
                } else {
                    if (d.Data == "unauthorized") {
                        QiBao.TimeOutDiv();
                    } else if (d.Data == "JsonException") {
                        window.location.href = d.ReturnUrl;
                    } else {
                        $(".puberror_table").show().html(d.Message);
                        QiBao.refreshCaptcha();
                        $(".public_Code_div").find(".js_pass_err").show().html(d.Message);
                    }
                }
            }
        });
    }

})