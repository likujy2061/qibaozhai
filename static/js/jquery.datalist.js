<%if request.querystring="v=1.0.0" then    server.transfer("jquery.datalist.js_v=1.0.0") %>﻿/*-------------------------------------------------------------------------
 * 2014-12-3 by xuyan
 * 绑定表格数据
 * init  初始化数据
 * PageList  分页
 * PageClick 分页点击事件
 * GetDataList 取得分页数据
 * GetToday 当天时间
 * GetOneWeek 最近一周
 * GetOneMonth 最近一月
 * GetThreeMonth 最近三个月
 * SetUrlParam 修改url地址
 * GetRequest 获取url参数值
 * WhichBrowser 判断浏览器类型
 * UItoTop 返回顶部
 * FollowingRoll 跟随滚动

 -------------------------------------------------------------------------*/

(function () {
    var jsonconck = "", jsconl = "[", jsconr = "]", jsconno = 0;
    window.QiBaoData = {
        init: function () { },

        PageList: function (options) {
            /*==================参数说明=========================*/
            /* pageSize   一页显示几条数据             */
            /* allCounts  一共多少条数据     */
            /* curPage    当前页码                 */
            /* pageDigitalNum    显示几个页码               */
            /* pageContainer    容器               */
            /*===================================================*/
            var defaults = {
                pageSize: 10,
                allCounts: 30,
                curPage: 1,
                pageDigitalNum: 6,
                pageContainer: $(".page")
            };
            defaults = $.extend(defaults, options);

            var $this = defaults.pageContainer;

            var _allPages = Math.ceil(defaults.allCounts / defaults.pageSize);

            defaults.curPage = parseInt(defaults.curPage);

            var pageListHtml = '<a href="javascript:;"" id="page_fir">首页</a><a href="javascript:;""  id="page_up">上页</a>';
            if (_allPages <= defaults.pageDigitalNum) {
                for (var i = 1; i <= _allPages; i++) {
                    if (i == defaults.curPage) {
                        pageListHtml += '<a href="javascript:;"" class="pageindex curr">' + i + '</a>';
                    } else {
                        pageListHtml += '<a href="javascript:;"" class="pageindex">' + i + '</a>';
                    }
                }
            } else {
                if (defaults.curPage <= Math.ceil(defaults.pageDigitalNum / 2)) {
                    for (var i = 1; i <= defaults.pageDigitalNum; i++) {
                        if (i == defaults.curPage) {
                            pageListHtml += '<a href="javascript:;"" class="pageindex curr">' + i + '</a>';
                        } else {
                            pageListHtml += '<a href="javascript:;"" class="pageindex">' + i + '</a>';
                        }
                    }
                } else if (defaults.curPage >= _allPages - Math.ceil(defaults.pageDigitalNum / 2) + 1) {
                    for (var i = _allPages - defaults.pageDigitalNum + 1; i <= _allPages; i++) {
                        if (i == defaults.curPage) {
                            pageListHtml += '<a href="javascript:;"" class="pageindex curr">' + i + '</a>';
                        } else {
                            pageListHtml += '<a href="javascript:;"" class="pageindex">' + i + '</a>';
                        }
                    }
                }
                else {
                    for (var i = defaults.curPage - Math.ceil(defaults.pageDigitalNum / 2) + 1; i <= defaults.curPage + Math.ceil(defaults.pageDigitalNum / 2) - 1; i++) {

                        if (i == defaults.curPage) {
                            pageListHtml += '<a href="javascript:;"" class="pageindex curr">' + i + '</a>';
                        } else {
                            pageListHtml += '<a href="javascript:;"" class="pageindex">' + i + '</a>';
                        }
                    }
                }
            }
            pageListHtml += '<a href="javascript:;""  id="page_down">下页</a><a href="javascript:;"" id="page_las">尾页</a><span class="gotopage">跳转至</span><input type="text" class="js_pageipt" id="page_ipt"  value="" maxlength="4"/><a href="javascript:;"" id="page_go">GO</a><span class="js_tcpc"></span>';

            $this.empty().html(pageListHtml);
        },

        PageClick: function (options) {
            /*==================参数说明=========================*/
            /* pageSize   一页显示几条数据             */
            /* allCounts  一共多少条数据     */
            /* curPage    当前页码               */
            /* pageContainer    容器               */
            /*===================================================*/
            var defaults = {
                pageSize: 10,
                allCounts: 30,
                curPage: 1,
                pageContainer: $(".page"),
                url: window.location.href,
                AdvancedSearch: false,
                DataUrl: "",
                listHeadFormat: "",
                listFormat: "",
                rowName: [],
                PageIndex: "",
                GoodsState: "",
                Sort: "",
                ItemType: "",
                ajaxdata: {}
            };
            defaults = $.extend(defaults, options);
            defaults.ajaxdata = $.extend(defaults.ajaxdata, options.ajaxdata);
            var $this = defaults.pageContainer;

            var _allPages = Math.ceil(defaults.allCounts / defaults.pageSize);

            $this.find("#page_fir").die().live("click", function () {
                if (defaults.curPage != 1) {
                    if (defaults.AdvancedSearch) {
                        var pageindex = 1;
                        QiBaoData.GetDataListNew({
                            AdvancedSearch: true,
                            DataUrl: defaults.DataUrl,
                            listHeadFormat: defaults.listHeadFormat,
                            listFormat: defaults.listFormat,
                            rowName: defaults.rowName,
                            PageIndex: pageindex,
                            GoodsState: defaults.GoodsState,
                            Sort: defaults.Sort,
                            ItemType: defaults.ItemType,
                            ajaxdata: defaults.ajaxdata
                        });
                    } else {
                        window.location.href = QiBaoData.SetUrlParam('pageindex', 1, defaults.url);
                    }
                }
                return false;
            });
            $this.find("#page_las").die().live("click", function () {
                if (defaults.curPage != _allPages) {
                    if (defaults.AdvancedSearch) {
                        var pageindex = _allPages;
                        QiBaoData.GetDataListNew({
                            AdvancedSearch: true,
                            DataUrl: defaults.DataUrl,
                            listHeadFormat: defaults.listHeadFormat,
                            listFormat: defaults.listFormat,
                            rowName: defaults.rowName,
                            PageIndex: pageindex,
                            GoodsState: defaults.GoodsState,
                            Sort: defaults.Sort,
                            ItemType: defaults.ItemType,
                            ajaxdata: defaults.ajaxdata
                        });
                    } else {
                        window.location.href = QiBaoData.SetUrlParam('pageindex', _allPages, defaults.url);
                    }

                }
                return false;
            });
            $this.find("#page_up").die().live("click", function () {
                if (defaults.curPage != 1) {
                    if (defaults.AdvancedSearch) {
                        var pageindex = defaults.curPage - 1;
                        QiBaoData.GetDataListNew({
                            AdvancedSearch: true,
                            DataUrl: defaults.DataUrl,
                            listHeadFormat: defaults.listHeadFormat,
                            listFormat: defaults.listFormat,
                            rowName: defaults.rowName,
                            PageIndex: pageindex,
                            GoodsState: defaults.GoodsState,
                            Sort: defaults.Sort,
                            ItemType: defaults.ItemType,
                            ajaxdata: defaults.ajaxdata
                        });
                    } else {
                        window.location.href = QiBaoData.SetUrlParam('pageindex', defaults.curPage - 1, defaults.url);
                    }

                }
                return false;
            });
            $this.find("#page_down").die().live("click", function () {
                if (defaults.curPage != _allPages) {
                    if (defaults.AdvancedSearch) {
                        var pageindex = parseInt(defaults.curPage) + 1;
                        QiBaoData.GetDataListNew({
                            AdvancedSearch: true,
                            DataUrl: defaults.DataUrl,
                            listHeadFormat: defaults.listHeadFormat,
                            listFormat: defaults.listFormat,
                            rowName: defaults.rowName,
                            PageIndex: pageindex,
                            GoodsState: defaults.GoodsState,
                            Sort: defaults.Sort,
                            ItemType: defaults.ItemType,
                            ajaxdata: defaults.ajaxdata
                        });
                    } else {
                        window.location.href = QiBaoData.SetUrlParam('pageindex', parseInt(defaults.curPage) + 1, defaults.url);
                    }

                }
                return false;
            });
            $this.find(".pageindex").die().live("click", function () {
                if (defaults.AdvancedSearch) {
                    var pageindex = parseInt($(this).text());
                    QiBaoData.GetDataListNew({
                        AdvancedSearch: true,
                        DataUrl: defaults.DataUrl,
                        listHeadFormat: defaults.listHeadFormat,
                        listFormat: defaults.listFormat,
                        rowName: defaults.rowName,
                        PageIndex: pageindex,
                        GoodsState: defaults.GoodsState,
                        Sort: defaults.Sort,
                        ItemType: defaults.ItemType,
                        ajaxdata: defaults.ajaxdata
                    });
                } else {
                    window.location.href = QiBaoData.SetUrlParam('pageindex', parseInt($(this).text()), defaults.url);
                }
                return false;
            });
            $this.find("#page_go").die().live("click", function () {
                var _gopages = $.trim($("#page_ipt").val());
                var exp = new RegExp(/^[0-9]*[1-9][0-9]*$/);
                if (!exp.test(_gopages) || _gopages == "" || (_gopages > _allPages)) {
                    alert("请输入正确的页码")
                    return false
                } else {
                    if (defaults.curPage != _gopages) {
                        if (defaults.AdvancedSearch) {
                            var pageindex = _gopages;
                            QiBaoData.GetDataListNew({
                                AdvancedSearch: true,
                                DataUrl: defaults.DataUrl,
                                listHeadFormat: defaults.listHeadFormat,
                                listFormat: defaults.listFormat,
                                rowName: defaults.rowName,
                                PageIndex: pageindex,
                                GoodsState: defaults.GoodsState,
                                Sort: defaults.Sort,
                                ItemType: defaults.ItemType,
                                ajaxdata: defaults.ajaxdata
                            });
                        } else {
                            window.location.href = QiBaoData.SetUrlParam('pageindex', _gopages, defaults.url);
                        }
                    }
                    return false;
                }
            });
        },

        GetDataListNew: function (options) {
            /*==================参数说明=========================*/
            /* DataUrl   数据源             */
            /* StartTime   开始时间             */
            /* EndTime  结束时间     */
            /* PageIndex    当前页码               */
            /* PageSize    每页数据量               */
            /* GoodsState   商品状态               */
            /* OrderStatus   订单状态               */
            /* Sort   排序               */
            /* ItemType    类型               */
            /* keyWord    字符串                */
            /* TableContainer    table所在容器               */
            /* listHeadFormat    表头格式               */
            /* listFormat    每行的格式               */
            /* rowName    列名               */
            /*===================================================*/

            var defaults = {
                loadPop: ".public_SearchLoadBox_div",
                AdvancedSearch: false,
                DataUrl: "/Buy/BuyGrid",
                Time: "",
                PageIndex: 1,
                PageSize: 15,
                GoodsState: "",
                OrderStatus: "",
                Sort: "",
                ItemType: "",
                ItemState: "",
                keyWord: "",
                readed: "",
                TableContainer: $(".goods_tab"),
                listHeadFormat: '<table><thead class="goods_tab_head icon icon_tab_head"><tr><th class="bor_r_none" width="7%">图片</th><th class=" bor_r_none" width="14%"><div class="pos_rel tab_head_link js_tab_head"><span class="dis_inb">商品等级</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="1"><span class="dis_inb">等级从低到高</span><span class="link_up_icon"></span></a> <a href="javascript:" data-order="2"><span class="dis_inb">等级从高到低</span><span class="link_down_icon"></span></a> </div></div></th><th class="bor_r_none" width="17%">物品名称</th><th class=" bor_r_none" width="17%"><div class="pos_rel tab_head_link js_tab_head"><span class="dis_inb">当前价格(元)</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="3"><span class="dis_inb">价格从低到高</span><span class="link_up_icon"></span></a> <a href="javascript:" data-order="4"><span class="dis_inb">价格从高到低</span><span class="link_down_icon"></span></a> </div></div></th><th width="14%" class="bor_r_none">商品当前状态</th><th width="20%" class="bor_r_none"><div class="pos_rel tab_head_link js_tab_head"><span class="dis_inb">状态剩余时间</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="5"><span class="dis_inb">时间从低到高</span><span class="link_up_icon"></span></a> <a href="javascript:" data-order="6"><span class="dis_inb">时间从高到低</span><span class="link_down_icon"></span></a></div></div></th><th class="bor_r_none" width="11%">操作</th></tr></thead><tbody class="goods_tab_con js_tr_color">{0}</tbody></table>',

                //listFormat: '<tr><td class="postd"><a target="_blank" href="/Buy/Order?ItemCode={7}"><img class="dis_inher js_flashimg" widht="50" height="50" src="{0}" data-code="{7}"></a><p class="iframep"><iframe src="../../ItemShowFlash/ItemShow.htm?item_code={7}&type_code={8}" frameborder="0" allowtransparency scrolling="no"></iframe></p></td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td class="bor_r_none tab_con_operation">{6}</td></tr>',
                listFormat: '<tr><td class="postd"><a target="_blank" href="/Buy/Order?ItemCode={7}"><img class="dis_inher js_flashimg" widht="50" height="50" src="{0}" data-code="{7}" data-itemtypeid="{8}"></a><p class="iframep"></p></td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td class="bor_r_none tab_con_operation">{6}</td></tr>',
                rowName: ["ItemImageName", "ItemLevel", "ItemName", "PriceColorHtml", "CurrentStateName", "BusinessValidDate", "OprateHtml", "ItemInfoCode", "ItemTypeId"]
            };
            defaults = $.extend(defaults, options);
            var ajaxdata = {
                r: Math.random(),
                time: defaults.Time,
                orderState: defaults.OrderStatus,
                readed: defaults.readed,
                itemTypeID: defaults.ItemType,
                state: defaults.GoodsState,
                order: defaults.Sort,
                pageIndex: defaults.PageIndex,
                pageSize: defaults.PageSize,
                itemState: defaults.ItemState,
                keyWord: defaults.keyWord
            };
            ajaxdata = $.extend(options.ajaxdata, ajaxdata);
            var $this = $(this);
            $.ajax({
                url: defaults.DataUrl,
                type: "get",
                dataType: "json",
                beforeSend: function () {
                    if (defaults.loadPop != "" && defaults.loadPop != null) {
                        QiBao.ShowSearchLoadDiv();
                    }
                },
                data: ajaxdata,
                success: function (d) {
                    if (defaults.loadPop != "" && defaults.loadPop != null && $(defaults.loadPop).length == 1) {
                        $(defaults.loadPop).remove();
                    }
                    if (d.IsSuccess) {
                        var itemType = $('.imgDiv').attr('data-typeid');
                        $.ajax({
                            type: "get",
                            url: "/AdvancedSearch/ItemRecommendList",
                            async: false,
                            data: {
                                serverId: parseInt($('#ServerList option:selected').val()),
                                itemType: itemType,
                                r: Math.random()
                            },
                            success: function (res) {
                                if (res.IsSuccess) {
                                    var pipetArr=[{"len":3,"top":49},{"len":4,"top":15},{"len":4,"top":15},{"len":4,"top":37},
                                                  {"len":5,"top":11},{"len":5,"top":28},{"len":6,"top":8},{"len":6,"top":23},
                                                  {"len":7,"top":7},{"len":7,"top":19},{"len":8,"top":5},{"len":8,"top":16},
                                                  {"len":9,"top":5},{"len":9,"top":13},{"len":10,"top":5},{"len":10,"top":14}]
                                    var data = res.Data;
                                    var htmlarr = '';
                                    var itids = "";
                                    var imgName = "";
                                    //var priceName = itemType == 4 ? "商品单价:":"商品价钱:";
                                    if (d.Data.length>=0 && data.length>=10) {
                                         $('.imgDiv').show();
                                    	var pepALen=pipetArr[d.Data.length].len;
                                    	var pepTop=pipetArr[d.Data.length].top
                                        for (var i = 0; i <pepALen ; i++) {
                                            if (data[i].CurrentStateName == "可预订") {
                                                imgName = 'imgStateyu';
                                            } else if (data[i].CurrentStateName == "寄售期") {
                                                imgName = 'imgStateji';
                                            } else if (data[i].CurrentStateName == "公示期") {
                                                imgName = 'imgStategong';
                                            } else if (data[i].CurrentStateName == "免公示") {
                                                imgName = 'imgStatemian';
                                            }
                                            var itid = data[i].ItemTypeID.toString();
                                            if (itid != "205" && itid != "206" && itid != "207" && itid != "209") {
                                                itids = itid.substring(0, 1);
                                            } else {
                                                itids = itid;
                                            }
                                            if(itemType == 4){
                                                htmlarr += '<li class="imgInfo ">' +
                                                        '<div class="postd" >' +
                                                        '<a target="_blank" href="/Buy/Order?ItemCode=' + data[i].ItemID + '&remark=0">' +
                                                            '<img src="/img.gyyxcdn.cn/qibao/Images/bigItemImages/' + data[i].ItemImage + '.jpg" class="bigImg js_flashimg dis_inher" data-code=' + data[i].ItemID + ' data-itemtypeid=' + data[i].ItemTypeID + '>' +
                                                        '</a>' +
                                                        '</div>' + 
                                                        '<p class="iframep"></p>' +
                                                        '<div class="infoCon">' +
                                                        '<span class="imgState ' + imgName + '"></span>' +
                                                        '<p class="imgName">' + data[i].ItemName + '</p>' +                                                      
                                                        '<p class="imgPrice">商品单价:'+data[i].UnitPriceColorHtml+'</p>' +
                                                        '<p class="imgGrade">商品价格:' + data[i].PriceColorHtml + '</p>' +
                                                        '</div >' +
                                                      '</li>'
                                            }else{
                                                htmlarr += '<li class="imgInfo ">' +
                                                        '<div class="postd" >' +
                                                        '<a target="_blank" href="/Buy/Order?ItemCode=' + data[i].ItemID + '&remark=0">' +
                                                            '<img src="/img.gyyxcdn.cn/qibao/Images/bigItemImages/' + data[i].ItemImage + '.jpg" class="bigImg js_flashimg dis_inher" data-code=' + data[i].ItemID + ' data-itemtypeid=' + data[i].ItemTypeID + '>' +
                                                        '</a>' +
                                                        '</div>' + 
                                                        '<p class="iframep"></p>' +
                                                        '<div class="infoCon">' +
                                                        '<span class="imgState ' + imgName + '"></span>' +
                                                        '<p class="imgName">' + data[i].ItemName + '</p>' +
                                                        '<p class="imgGrade">等级:' + data[i].ItemLevel + '级</p>' +
                                                        '<p class="imgPrice">商品价格:'+data[i].PriceColorHtml+'</p>' +
                                                        '</div >' +
                                                      '</li>'
                                            }
                                            
                                        }
                                        $('.imgDiv .imgCon').html(htmlarr);
                                        $('.imgDiv .imgCon li').css({
                                    		"marginTop":pepTop+"px"
                                    	});
                                    }


                                    //获取xml数据推荐位浮动框具体信息
                                    var aDiv = gy.getByClass("postd");
                                    var tdlength = aDiv.length;
                                    for (var i = 0; i < tdlength; i++) {
                                        var itemcodes = $(".postd").eq(i).find("img").attr("data-code");
                                        var itid = $(".postd").eq(i).find("img").attr("data-itemtypeid");
                                        var itids = "";
                                        if (itid != "205" && itid != "206" && itid != "207" && itid != "209") {
                                            itids = itid.substring(0, 1);
                                        } else {
                                            itids = itid;
                                        }
                                        qibaoShowDetailInfo("/Buy/GetItemInfoXMLByItemId/" + itemcodes, aDiv[i], itids);
                                    }
                                } else {
                                    $('.imgDiv').hide();
                                }
                            }

                        })



                        $(".js_top_error").html("").hide();
                        if (d.Data != null && d.Data.length != 0) {
                            var dL = d.Data.length;
                            var dStr = JSON.stringify(d.Data);
                            var cStr = '';
                            var s = "";
                            var t = defaults.rowName;

                            for (n = 0; n < dL; n++) {
                                for (i = 0; i < t.length; i++) {
                                    var reg = new RegExp(t[i], "g");
                                    dStr = dStr.replace(reg, "a" + i);
                                }
                            }

                            dStr = JSON.parse(dStr);
                            $.each(dStr, function (j, item) {
                                cStr = defaults.listFormat;

                                for (m = 0; m <= 1000; m++) {
                                    if (m == 0) cStr = cStr.replace(/\{[0]\}/gi, item.a0);
                                    if (m == 1) cStr = cStr.replace(/\{[1]\}/gi, item.a1);
                                    if (m == 2) cStr = cStr.replace(/\{[2]\}/gi, item.a2);
                                    if (m == 3) cStr = cStr.replace(/\{[3]\}/gi, item.a3);
                                    if (m == 4) cStr = cStr.replace(/\{[4]\}/gi, item.a4);
                                    if (m == 5) cStr = cStr.replace(/\{[5]\}/gi, item.a5);
                                    if (m == 6) cStr = cStr.replace(/\{[6]\}/gi, item.a6);
                                    if (m == 7) cStr = cStr.replace(/\{[7]\}/gi, item.a7);
                                    if (m == 8) cStr = cStr.replace(/\{[8]\}/gi, item.a8);
                                    if (m == 9) cStr = cStr.replace(/\{[9]\}/gi, item.a9);
                                    if (m == 10) cStr = cStr.replace("{10}", item.a10);
                                    if (m == 11) cStr = cStr.replace("{11}", item.a11);
                                    if (m == 12) cStr = cStr.replace("{12}", item.a12);
                                    if (m == 13) cStr = cStr.replace("{13}", item.a13);
                                    if (m == 14) cStr = cStr.replace("{14}", item.a14);
                                    if (m == 15) cStr = cStr.replace("{15}", item.a15);
                                }
                                s += cStr;

                            });

                            headStr = defaults.listHeadFormat;
                            headStr = headStr.replace(/\{[0]\}/gi, s);

                            defaults.TableContainer.html(headStr);

                            $(".js_tab_head").hover(function () {
                                $(this).find(".js_head_hover").removeClass('dn');
                            }, function () {
                                $(this).find(".js_head_hover").addClass('dn');
                            });
                            $(".js_head_hover a").hover(function () {
                                $(this).addClass("curr");
                            }, function () {
                                $(this).removeClass("curr");
                            })


                            $(".js_head_hover a").each(function () {
                                var $this = $(this);
                                var tyid = $this.attr("data-order");
                                if (defaults.Sort == tyid) {
                                    var cname = $this.find("span:eq(1)").attr("class") + "2";
                                    $this.addClass("clrr").siblings("a").removeClass("clrr");
                                    $this.parents("th").find(".js_thicon").removeClass().addClass("js_thicon").addClass(cname);
                                }
                            })

                            $(".js_tr_color tr:odd").css('background-color', '#ebebeb');
                            
                           
                            //获取xml数据
                            var aDiv = gy.getByClass("postd");
                            var tdlength = aDiv.length;
                            for (var i = 0; i < tdlength; i++) {
                                var itemcodes = $(".postd").eq(i).find("img").attr("data-code");
                                var itid = $(".postd").eq(i).find("img").attr("data-itemtypeid");
                                var itids = "";
                                if (itid != "205" && itid != "206" && itid != "207" && itid != "209") {
                                    itids = itid.substring(0, 1);
                                } else {
                                    itids = itid;
                                }
                                qibaoShowDetailInfo("/Buy/GetItemInfoXMLByItemId/" + itemcodes, aDiv[i], itids);

                            }
                            //添加对比
                            $(".tab_con_operation .js_stimg").off("click").on("click", function () {
                                //记录已有cookie
                                var arr = document.cookie.split('; ');
                                var i = 0;
                                var isadds = 0;
                                var thiscode = $(this).parent().parent().parent().find("td").eq(0).find("img").attr("data-code");
                                for (i = 0; i < arr.length; i++) {
                                    var arr1 = arr[i].split('=');
                                    if (arr1[0] == "QbConlist") {
                                        jsonconck = arr1[1];
                                        if (jsonconck == "[]") {
                                            jsconno = 0;
                                            var index = jsonconck.lastIndexOf(']');
                                            jsonconck = jsonconck.substring(0, index);
                                            jsconl = "";
                                        } else {
                                            jsconno = 1;
                                            var index = jsonconck.lastIndexOf(']');
                                            jsonconck = jsonconck.substring(0, index);
                                            jsconl = "";
                                        }
                                        var getcokielists = $.parseJSON(arr1[1]);
                                        for (var j = 0; j < getcokielists.length; j++) {
                                            if (getcokielists[j].datacode == thiscode) {
                                                isadds = 1;
                                            }
                                        };
                                    }
                                }
                                if (isadds != 1) {
                                    if ($(".cotcontent").eq($(".js_menu_sub1 a.curr").index()).find("ul li").length > 3 || ($(".js_menu_sub1 a.curr").index() == 4 && $(".cotcontent").eq($(".js_menu_sub1 a.curr").index() - 1).find("ul li").length > 3)) {
                                        $("#js_contrast").fadeIn();
                                        $(".js_navcotlist a").removeClass("curr");
                                        $(".cotcontent").hide();
                                        if ($(".js_menu_sub1 a.curr").index() == 4) {
                                            $(".js_navcotlist a").eq($(".js_menu_sub1 a.curr").index() - 1).addClass("curr");
                                            $(".cotcontent").eq($(".js_menu_sub1 a.curr").index() - 1).show();
                                            $(".cotcontent").eq($(".js_menu_sub1 a.curr").index() - 1).find("ul li.on").find(".recently_r").click();
                                        } else {
                                            $(".js_navcotlist a").eq($(".js_menu_sub1 a.curr").index()).addClass("curr");
                                            $(".cotcontent").eq($(".js_menu_sub1 a.curr").index()).show();
                                            $(".cotcontent").eq($(".js_menu_sub1 a.curr").index()).find("ul li.on").find(".recently_r").click();
                                        }
                                        $(".js_cottip").html('最多添加&nbsp;<span class="tipcut">4</span>&nbsp;件商品').fadeIn();
                                        setTimeout(function () { $(".js_cottip").hide().html('<span class="con_add_triangle"></span>'); }, 2000);
                                    } else {
                                        if ($(".js_menu_sub1 a.curr").index() == 4) {
                                            $(".cotcontent").eq($(".js_menu_sub1 a.curr").index() - 1).find(".connonetip").hide();
                                        } else {
                                            $(".cotcontent").eq($(".js_menu_sub1 a.curr").index()).find(".connonetip").hide();
                                        }
                                        var addconicolist = "";
                                        $("#js_contrast").fadeIn();

                                        $(".js_navcotlist a").removeClass("curr");
                                        $(".cotcontent").hide();
                                        if ($(".js_menu_sub1 a.curr").index() == 4) {
                                            $(".js_navcotlist a").eq($(".js_menu_sub1 a.curr").index() - 1).addClass("curr");
                                            $(".cotcontent").eq($(".js_menu_sub1 a.curr").index() - 1).show();
                                            $(".cotcontent").eq($(".js_menu_sub1 a.curr").index() - 1).find("ul li.on").find(".recently_r").click();
                                        } else {
                                            $(".js_navcotlist a").eq($(".js_menu_sub1 a.curr").index()).addClass("curr");
                                            $(".cotcontent").eq($(".js_menu_sub1 a.curr").index()).show();
                                            $(".cotcontent").eq($(".js_menu_sub1 a.curr").index()).find("ul li.on").find(".recently_r").click();
                                        }



                                        $(".js_cottip").html('新增&nbsp;<span class="tipcut">' + ($(".cotcontent").eq($(".js_menu_sub1 a.curr").index()).find("ul li").length + 1) + '</span>&nbsp;个对比商品').fadeIn();
                                        if ($(".js_menu_sub1 a.curr").index() == 0) {
                                            addconicolist += '<li><span class="vsico">&nbsp;</span><div class="fl recently_l"><a target="_blank" href="' + $(this).parent().parent().parent().find("td:first a").attr("href") + '">' + $(this).parent().parent().parent().find("td:first a").html() + '</a></div><div class="fl recently_r"><p class="recName">' + $(this).parent().parent().parent().find("td").eq(1).html() + '</p><p>' + $(this).parent().parent().parent().find("td").eq(8).html() + '</p></div><span class="delico js_delico" data-delicoid="' + $(this).closest('tr').index() + '" data-type="' + $(".js_menu_sub1 a.curr").index() + '">移除</span></li>';
                                            if (jsconno == 0) {
                                                jsonconck += '{"typeid":' + $(".js_menu_sub1 a.curr").index() + ',"imgurl":"' + $(this).parent().parent().parent().find("td").eq(0).find("img").attr("src") + '","datacode":"' + $(this).parent().parent().parent().find("td").eq(0).find("img").attr("data-code") + '","itemname":"' + $(this).parent().parent().parent().find("td").eq(1).html() + '","classnames":"' + $(this).parent().parent().parent().find("td").eq(8).find("span").attr("class") + '","money":"' + $(this).parent().parent().parent().find("td").eq(8).text() + '","trclo":"' + $(this).closest('tr').index() + '","typeno":"' + $(".js_menu_sub1 a.curr").index() + '"' + '}';
                                            } else {
                                                jsonconck += ',{"typeid":' + $(".js_menu_sub1 a.curr").index() + ',"imgurl":"' + $(this).parent().parent().parent().find("td").eq(0).find("img").attr("src") + '","datacode":"' + $(this).parent().parent().parent().find("td").eq(0).find("img").attr("data-code") + '","itemname":"' + $(this).parent().parent().parent().find("td").eq(1).html() + '","classnames":"' + $(this).parent().parent().parent().find("td").eq(8).find("span").attr("class") + '","money":"' + $(this).parent().parent().parent().find("td").eq(8).text() + '","trclo":"' + $(this).closest('tr').index() + '","typeno":"' + $(".js_menu_sub1 a.curr").index() + '"' + '}';
                                            }
                                            jsconno++;
                                        } else if ($(".js_menu_sub1 a.curr").index() == 1) {
                                            addconicolist += '<li><span class="vsico">&nbsp;</span><div class="fl recently_l"><a target="_blank" href="' + $(this).parent().parent().parent().find("td:first a").attr("href") + '">' + $(this).parent().parent().parent().find("td:first a").html() + '</a></div><div class="fl recently_r"><p class="recName">' + $(this).parent().parent().parent().find("td").eq(1).html() + '</p><p>' + $(this).parent().parent().parent().find("td").eq(4).html() + '</p></div><span class="delico js_delico" data-delicoid="' + $(this).closest('tr').index() + '" data-type="' + $(".js_menu_sub1 a.curr").index() + '">移除</span></li>';
                                            if (jsconno == 0) {
                                                jsonconck += '{"typeid":' + $(".js_menu_sub1 a.curr").index() + ',"imgurl":"' + $(this).parent().parent().parent().find("td").eq(0).find("img").attr("src") + '","datacode":"' + $(this).parent().parent().parent().find("td").eq(0).find("img").attr("data-code") + '","itemname":"' + $(this).parent().parent().parent().find("td").eq(1).html() + '","classnames":"' + $(this).parent().parent().parent().find("td").eq(4).find("span").attr("class") + '","money":"' + $(this).parent().parent().parent().find("td").eq(4).text() + '","trclo":"' + $(this).closest('tr').index() + '","typeno":"' + $(".js_menu_sub1 a.curr").index() + '"' + '}';
                                            } else {
                                                jsonconck += ',{"typeid":' + $(".js_menu_sub1 a.curr").index() + ',"imgurl":"' + $(this).parent().parent().parent().find("td").eq(0).find("img").attr("src") + '","datacode":"' + $(this).parent().parent().parent().find("td").eq(0).find("img").attr("data-code") + '","itemname":"' + $(this).parent().parent().parent().find("td").eq(1).html() + '","classnames":"' + $(this).parent().parent().parent().find("td").eq(4).find("span").attr("class") + '","money":"' + $(this).parent().parent().parent().find("td").eq(4).text() + '","trclo":"' + $(this).closest('tr').index() + '","typeno":"' + $(".js_menu_sub1 a.curr").index() + '"' + '}';
                                            }
                                            jsconno++;
                                        } else if ($(".js_menu_sub1 a.curr").index() == 2) {
                                            addconicolist += '<li><span class="vsico">&nbsp;</span><div class="fl recently_l"><a target="_blank" href="' + $(this).parent().parent().parent().find("td:first a").attr("href") + '">' + $(this).parent().parent().parent().find("td:first a").html() + '</a></div><div class="fl recently_r"><p class="recName">' + $(this).parent().parent().parent().find("td").eq(1).html() + '</p><p>' + $(this).parent().parent().parent().find("td").eq(7).html() + '</p></div><span class="delico js_delico" data-delicoid="' + $(this).closest('tr').index() + '" data-type="' + $(".js_menu_sub1 a.curr").index() + '">移除</span></li>';
                                            if (jsconno == 0) {
                                                jsonconck += '{"typeid":' + $(".js_menu_sub1 a.curr").index() + ',"imgurl":"' + $(this).parent().parent().parent().find("td").eq(0).find("img").attr("src") + '","datacode":"' + $(this).parent().parent().parent().find("td").eq(0).find("img").attr("data-code") + '","itemname":"' + $(this).parent().parent().parent().find("td").eq(1).html() + '","classnames":"' + $(this).parent().parent().parent().find("td").eq(7).find("span").attr("class") + '","money":"' + $(this).parent().parent().parent().find("td").eq(7).text() + '","trclo":"' + $(this).closest('tr').index() + '","typeno":"' + $(".js_menu_sub1 a.curr").index() + '"' + '}';
                                            } else {
                                                jsonconck += ',{"typeid":' + $(".js_menu_sub1 a.curr").index() + ',"imgurl":"' + $(this).parent().parent().parent().find("td").eq(0).find("img").attr("src") + '","datacode":"' + $(this).parent().parent().parent().find("td").eq(0).find("img").attr("data-code") + '","itemname":"' + $(this).parent().parent().parent().find("td").eq(1).html() + '","classnames":"' + $(this).parent().parent().parent().find("td").eq(7).find("span").attr("class") + '","money":"' + $(this).parent().parent().parent().find("td").eq(7).text() + '","trclo":"' + $(this).closest('tr').index() + '","typeno":"' + $(".js_menu_sub1 a.curr").index() + '"' + '}';
                                            }
                                            jsconno++;
                                        } else if ($(".js_menu_sub1 a.curr").index() == 3) {
                                            addconicolist += '<li><span class="vsico">&nbsp;</span><div class="fl recently_l"><a target="_blank" href="' + $(this).parent().parent().parent().find("td:first a").attr("href") + '">' + $(this).parent().parent().parent().find("td:first a").html() + '</a></div><div class="fl recently_r"><p class="recName">' + $(this).parent().parent().parent().find("td").eq(1).html() + '</p><p>' + $(this).parent().parent().parent().find("td").eq(5).html() + '</p></div><span class="delico js_delico" data-delicoid="' + $(this).closest('tr').index() + '" data-type="' + $(".js_menu_sub1 a.curr").index() + '">移除</span></li>';
                                            if (jsconno == 0) {
                                                jsonconck += '{"typeid":' + $(".js_menu_sub1 a.curr").index() + ',"imgurl":"' + $(this).parent().parent().parent().find("td").eq(0).find("img").attr("src") + '","datacode":"' + $(this).parent().parent().parent().find("td").eq(0).find("img").attr("data-code") + '","itemname":"' + $(this).parent().parent().parent().find("td").eq(1).html() + '","classnames":"' + $(this).parent().parent().parent().find("td").eq(5).find("span").attr("class") + '","money":"' + $(this).parent().parent().parent().find("td").eq(5).text() + '","trclo":"' + $(this).closest('tr').index() + '","typeno":"' + $(".js_menu_sub1 a.curr").index() + '"' + '}';
                                            } else {
                                                jsonconck += ',{"typeid":' + $(".js_menu_sub1 a.curr").index() + ',"imgurl":"' + $(this).parent().parent().parent().find("td").eq(0).find("img").attr("src") + '","datacode":"' + $(this).parent().parent().parent().find("td").eq(0).find("img").attr("data-code") + '","itemname":"' + $(this).parent().parent().parent().find("td").eq(1).html() + '","classnames":"' + $(this).parent().parent().parent().find("td").eq(5).find("span").attr("class") + '","money":"' + $(this).parent().parent().parent().find("td").eq(5).text() + '","trclo":"' + $(this).closest('tr').index() + '","typeno":"' + $(".js_menu_sub1 a.curr").index() + '"' + '}';
                                            }
                                            jsconno++;
                                        } else if ($(".js_menu_sub1 a.curr").index() == 4) {
                                            addconicolist += '<li><span class="vsico">&nbsp;</span><div class="fl recently_l"><a target="_blank" href="' + $(this).parent().parent().parent().find("td:first a").attr("href") + '">' + $(this).parent().parent().parent().find("td:first a").html() + '</a></div><div class="fl recently_r"><p class="recName">' + $(this).parent().parent().parent().find("td").eq(1).html() + '</p><p>' + $(this).parent().parent().parent().find("td").eq(5).html() + '</p></div><span class="delico js_delico" data-delicoid="' + $(this).closest('tr').index() + '" data-type="' + $(".js_menu_sub1 a.curr").index() + '">移除</span></li>';
                                            if (jsconno == 0) {
                                                jsonconck += '{"typeid":' + ($(".js_menu_sub1 a.curr").index() - 1) + ',"imgurl":"' + $(this).parent().parent().parent().find("td").eq(0).find("img").attr("src") + '","datacode":"' + $(this).parent().parent().parent().find("td").eq(0).find("img").attr("data-code") + '","itemname":"' + $(this).parent().parent().parent().find("td").eq(1).html() + '","classnames":"' + $(this).parent().parent().parent().find("td").eq(5).find("span").attr("class") + '","money":"' + $(this).parent().parent().parent().find("td").eq(5).text() + '","trclo":"' + $(this).closest('tr').index() + '","typeno":"' + ($(".js_menu_sub1 a.curr").index() - 1) + '"' + '}';
                                            } else {
                                                jsonconck += ',{"typeid":' + ($(".js_menu_sub1 a.curr").index() - 1) + ',"imgurl":"' + $(this).parent().parent().parent().find("td").eq(0).find("img").attr("src") + '","datacode":"' + $(this).parent().parent().parent().find("td").eq(0).find("img").attr("data-code") + '","itemname":"' + $(this).parent().parent().parent().find("td").eq(1).html() + '","classnames":"' + $(this).parent().parent().parent().find("td").eq(5).find("span").attr("class") + '","money":"' + $(this).parent().parent().parent().find("td").eq(5).text() + '","trclo":"' + $(this).closest('tr').index() + '","typeno":"' + ($(".js_menu_sub1 a.curr").index() - 1) + '"' + '}';
                                            }
                                            jsconno++;
                                        }
                                        QiBaoData.setCookie("QbConlist", jsconl + jsonconck + jsconr);
                                        if ($(".js_menu_sub1 a.curr").index() == 4) {
                                            $(".cotcontent").eq($(".js_menu_sub1 a.curr").index() - 1).find("ul").append(addconicolist);
                                        } else {
                                            $(".cotcontent").eq($(".js_menu_sub1 a.curr").index()).find("ul").append(addconicolist);
                                        }

                                        //对比按钮
                                        $(".js_gocontrast").off("click").on("click", function () {
                                            $(".js_cottip").html("");
                                            if ($(this).parent(".cotcontent").find("ul li.on").length != 2) {
                                                $(".js_cottip").html('请选择两个商品进行对比').fadeIn();
                                                setTimeout(function () { $(".js_cottip").hide().html(''); }, 2000);
                                                $(this).attr("href", "javascript:;").removeAttr("target", "_blank");
                                            } else {
                                                $(this).attr("href", "/Buy/Contrast?ItemCode1=" + $(this).parent(".cotcontent").find("ul li.on").eq(0).find("img").attr("data-code") + "&ItemCode2=" + $(this).parent(".cotcontent").find("ul li.on").eq(1).find("img").attr("data-code")).attr("target", "_blank");
                                            }
                                        });
                                        //选中状态
                                        $("#js_contrast ul li .recently_r").toggle(function () { $(this).parent("li").addClass("on"); $(this).parent("li").find(".vsico").show(); }, function () { $(this).parent("li").removeClass("on"); $(this).parent("li").find(".vsico").hide(); });
                                        //移除对比按钮
                                        $(".js_delico").off("click").on("click", function () {
                                            $(this).parent("li").remove();
                                            if ((parseFloat($(".js_navcotlist a.curr").find(".js_cotnavtip").html()) - 1) == 0) {
                                                $(".js_navcotlist a.curr").find(".js_cotnavtip").html("").hide();
                                            } else {
                                                $(".js_navcotlist a.curr").find(".js_cotnavtip").html(parseFloat($(".js_navcotlist a.curr").find(".js_cotnavtip").html()) - 1)
                                            }
                                            if ($(".cotcontent").eq($(".js_navcotlist a.curr").index()).find("ul li").length == 0) {
                                                $(".cotcontent").eq($(".js_navcotlist a.curr").index()).find(".connonetip").show();
                                            } else {
                                                $(".cotcontent").eq($(".js_navcotlist a.curr").index()).find(".connonetip").hide();
                                            }
                                            QiBaoData.delnonesetcookie();
                                        });
                                        //清空对比
                                        $(".js_iconclear").off("click").on("click", function () {
                                            $(".js_cottip").html("");
                                            $(".js_navcotlist a.curr").find(".js_cotnavtip").html("").hide();
                                            $(this).parent(".cotcontent").find("ul").html("");
                                            $(".cotcontent").eq($(".js_navcotlist a.curr").index()).find(".connonetip").show();
                                            QiBaoData.delnonesetcookie();
                                        });
                                        setTimeout(function () { $(".js_conaddtip").hide().html('<span class="con_add_triangle"></span>'); }, 2000);
                                        setTimeout(function () { $(".js_cottip").hide().html('<span class="con_add_triangle"></span>'); }, 2000);
                                    }
                                    if ($(".js_menu_sub1 a.curr").index() == 4) {
                                        if ($(".cotcontent").eq($(".js_menu_sub1 a.curr").index() - 1).find("ul li").length > 0) {
                                            $(".js_navcotlist").find("a").eq($(".js_menu_sub1 a.curr").index() - 1).find(".js_cotnavtip").html($(".cotcontent").eq($(".js_menu_sub1 a.curr").index() - 1).find("ul li").length).show();
                                        }
                                    } else {
                                        if ($(".cotcontent").eq($(".js_menu_sub1 a.curr").index()).find("ul li").length > 0) {
                                            $(".js_navcotlist").find("a").eq($(".js_menu_sub1 a.curr").index()).find(".js_cotnavtip").html($(".cotcontent").eq($(".js_menu_sub1 a.curr").index()).find("ul li").length).show();
                                        }
                                    }


                                } else {
                                    $("#js_contrast").fadeIn();
                                    $(".js_navcotlist a").removeClass("curr");
                                    $(".cotcontent").hide();
                                    if ($(".js_menu_sub1 a.curr").index() == 4) {
                                        $(".js_navcotlist a").eq($(".js_menu_sub1 a.curr").index() - 1).addClass("curr");
                                        $(".cotcontent").eq($(".js_menu_sub1 a.curr").index() - 1).show();
                                        $(".cotcontent").eq($(".js_menu_sub1 a.curr").index() - 1).find("ul li.on").find(".recently_r").click();
                                    } else {
                                        $(".js_navcotlist a").eq($(".js_menu_sub1 a.curr").index()).addClass("curr");
                                        $(".cotcontent").eq($(".js_menu_sub1 a.curr").index()).show();
                                        $(".cotcontent").eq($(".js_menu_sub1 a.curr").index()).find("ul li.on").find(".recently_r").click();
                                    }
                                    $(".js_cottip").html('已经添加此商品').fadeIn();
                                    setTimeout(function () { $(".js_cottip").hide().html('<span class="con_add_triangle"></span>'); }, 2000);
                                }
                            });
                            if (defaults.AdvancedSearch) {
                                QiBaoData.PageClick({
                                    pageSize: defaults.PageSize,
                                    allCounts: d.TotalCount,
                                    curPage: defaults.PageIndex,
                                    AdvancedSearch: defaults.AdvancedSearch,
                                    DataUrl: defaults.DataUrl,
                                    listHeadFormat: defaults.listHeadFormat,
                                    listFormat: defaults.listFormat,
                                    rowName: defaults.rowName,
                                    PageIndex: defaults.PageIndex,
                                    GoodsState: defaults.GoodsState,
                                    Sort: defaults.Sort,
                                    ItemType: defaults.ItemType,
                                    ajaxdata: ajaxdata
                                });
                                QiBaoData.PageList({
                                    pageSize: defaults.PageSize,
                                    allCounts: d.TotalCount,
                                    curPage: defaults.PageIndex
                                });
                            } else {
                                QiBaoData.PageList({
                                    pageSize: defaults.PageSize,
                                    allCounts: d.TotalCount,
                                    curPage: defaults.PageIndex
                                });
                                QiBaoData.PageClick({
                                    pageSize: defaults.PageSize,
                                    allCounts: d.TotalCount,
                                    curPage: defaults.PageIndex
                                });
                            }
                            $(".js_tcpc").html("共" + d.PageCount + "页" + d.TotalCount + "条");
                        } else {
                            defaults.TableContainer.html('<div class="div_empty">该条件下暂无记录！</div>');
                            $(".page").html('');
                        }
                        QiBaoData.getCookie("QbConlist");
                    } else {
                        if (d.Data == "unauthorized") {
                            QiBao.TimeOutDiv();
                        } else if (d.Data == "JsonException") {
                            window.location.href = d.ReturnUrl;
                        } else if (d.IsAlert) {
                            alert(d.Message);
                        } else if (d.Message == "moreRefresh") {
                            //中文验证码接口
                            function loginAjax() {
                                $.ajax({
                                    url: "/Buy/ItemDetailVerifyCaptcha",
                                    type: "get",
                                    dataType: "json",
                                    data: {
                                        verifyCaptcha: $(":input[data-id=txtCaptchaCode]").val(),
                                        type: $("#formrefresh").attr("data-type"),
                                        r: Math.random()
                                    },
                                    beforeSend: function () { $("#formmima").find(":submit").attr("disabled", "disabled").val("正在登录..."); },
                                    success: function (d) {
                                        $("#formmima").find(":submit").removeAttr("disabled").val("登  录");
                                        if (d.IsSuccess) {
                                            window.location.reload(true);
                                        } else {
                                            if (d.Data == "unauthorized") {
                                                QiBao.TimeOutDiv();
                                            } else if (d.Data == "JsonException") {
                                                window.location.href = d.ReturnUrl;
                                            } else {
                                                chinaCaptcha.refreshCaptcha();
                                                alert(d.Message);
                                            }
                                        }
                                    },
                                    error: function () {
                                        $("#formmima").find(":submit").removeAttr("disabled").val("登  录");
                                        $("#formmima").find(".js_pass_err").show().html("登录失败，请稍后重试。");
                                    }
                                });
                            }
                            ChinaCaptcha.prototype.subFn = loginAjax;
                            //$(".js_order_error").html(d.Message).show().css("text-align", "left").css("padding", "0 0 0 10px");
                            //IE6下默认不缓存背景图片，CSS里每次更改图片的位置时都会重新发起请求，用这个方法告诉IE6缓存背景图片
                            var isIE6 = /msie 6/i.test(navigator.userAgent);
                            if (isIE6) {
                                try { document.execCommand('BackgroundImageCache', false, true); } catch (e) { }
                            }
                            chinaCaptcha = new ChinaCaptcha($("#formrefresh"), {
                                bid: "ybtvat"
                            });
                            chinaCaptcha.init();
                            chinaCaptcha.createCaptchaPop();
                            $("#formrefresh").attr("data-type", "itemList");
                        } else if (d.Message == "disabledLogin") {
                            //$(".js_order_error").html(d.Message).show();
                            QiBao.DisLoginDiv();
                        } else {
                            $(".js_top_error").html(d.Message).show();
                        }
                    }
                }
            });
        },

        setCookie: function (name, value) {
            if (window.location.hostname == "qibao.gyyx.cn") {
                var str = name + '=' + value + ";path=/;" + ";domain=qibao.gyyx.cn";
            } else {
                var str = name + '=' + value + ";path=/;" + ";domain=tjlong.cn";
            }
            document.cookie = str;
        },

        getCookie: function (name) { /*获取cookie*/
            var arr = document.cookie.split('; ');
            var i = 0;
            var getcokielist0 = "", getcokielist1 = "", getcokielist2 = "", getcokielist3 = "";
            for (i = 0; i < arr.length; i++) {
                var arr1 = arr[i].split('=');
                if (arr1[0] == name) {
                    var getcokie = $.parseJSON(arr1[1]);
                    for (var j = 0; j < getcokie.length; j++) {
                        if (getcokie[j].typeid == 0) {
                            getcokielist0 += '<li><span class="vsico">&nbsp;</span><div class="fl recently_l"><a target="_blank" href="/Buy/Order?ItemCode=' + getcokie[j].datacode + '"><img class="dis_inher js_flashimg" widht="50" src="' + getcokie[j].imgurl + '" data-code="' + getcokie[j].datacode + '" height="50"></a></div><div class="fl recently_r"><p class="recName">' + getcokie[j].itemname + '</p><p><span class="' + getcokie[j].classnames + '">' + getcokie[j].money + '</span></p></div><span class="delico js_delico" data-delicoid="' + getcokie[j].trclo + '" data-type="' + getcokie[j].typeno + '">移除</span></li>';
                        } else if (getcokie[j].typeid == 1) {
                            getcokielist1 += '<li><span class="vsico">&nbsp;</span><div class="fl recently_l"><a target="_blank" href="/Buy/Order?ItemCode=' + getcokie[j].datacode + '"><img class="dis_inher js_flashimg" widht="50" src="' + getcokie[j].imgurl + '" data-code="' + getcokie[j].datacode + '" height="50"></a></div><div class="fl recently_r"><p class="recName">' + getcokie[j].itemname + '</p><p><span class="' + getcokie[j].classnames + '">' + getcokie[j].money + '</span></p></div><span class="delico js_delico" data-delicoid="' + getcokie[j].trclo + '" data-type="' + getcokie[j].typeno + '">移除</span></li>';
                        } else if (getcokie[j].typeid == 2) {
                            getcokielist2 += '<li><span class="vsico">&nbsp;</span><div class="fl recently_l"><a target="_blank" href="/Buy/Order?ItemCode=' + getcokie[j].datacode + '"><img class="dis_inher js_flashimg" widht="50" src="' + getcokie[j].imgurl + '" data-code="' + getcokie[j].datacode + '" height="50"></a></div><div class="fl recently_r"><p class="recName">' + getcokie[j].itemname + '</p><p><span class="' + getcokie[j].classnames + '">' + getcokie[j].money + '</span></p></div><span class="delico js_delico" data-delicoid="' + getcokie[j].trclo + '" data-type="' + getcokie[j].typeno + '">移除</span></li>';
                        } else if (getcokie[j].typeid == 3) {
                            getcokielist3 += '<li><span class="vsico">&nbsp;</span><div class="fl recently_l"><a target="_blank" href="/Buy/Order?ItemCode=' + getcokie[j].datacode + '"><img class="dis_inher js_flashimg" widht="50" src="' + getcokie[j].imgurl + '" data-code="' + getcokie[j].datacode + '" height="50"></a></div><div class="fl recently_r"><p class="recName">' + getcokie[j].itemname + '</p><p><span class="' + getcokie[j].classnames + '">' + getcokie[j].money + '</span></p></div><span class="delico js_delico" data-delicoid="' + getcokie[j].trclo + '" data-type="' + getcokie[j].typeno + '">移除</span></li>';
                        }
                    };
                    $(".cotcontent").eq(0).find("ul").html(getcokielist0);
                    $(".cotcontent").eq(1).find("ul").html(getcokielist1);
                    $(".cotcontent").eq(2).find("ul").html(getcokielist2);
                    $(".cotcontent").eq(3).find("ul").html(getcokielist3);
                    var a0 = $(".cotcontent").eq(0).find("ul li").length;
                    var a1 = $(".cotcontent").eq(1).find("ul li").length;
                    var a2 = $(".cotcontent").eq(2).find("ul li").length;
                    var a3 = $(".cotcontent").eq(3).find("ul li").length;
                    if (a0 > 0) {
                        $(".js_navcotlist a").eq(0).find(".js_cotnavtip").html(a0).show();
                    }
                    if (a1 > 0) {
                        $(".js_navcotlist a").eq(1).find(".js_cotnavtip").html(a1).show();
                    }
                    if (a2 > 0) {
                        $(".js_navcotlist a").eq(2).find(".js_cotnavtip").html(a2).show();
                    }
                    if (a3 > 0) {
                        $(".js_navcotlist a").eq(3).find(".js_cotnavtip").html(a3).show();
                    }

                    //对比按钮
                    $(".js_gocontrast").off("click").on("click", function () {
                        $(".js_cottip").html("")
                        if ($(this).parent(".cotcontent").find("ul li.on").length != 2) {
                            $(".js_cottip").html('请选择两个商品进行对比').fadeIn();
                            setTimeout(function () { $(".js_cottip").hide().html(''); }, 2000);
                            $(this).attr("href", "javascript:;").removeAttr("target", "_blank");
                        } else {
                            $(this).attr("href", "/Buy/Contrast?ItemCode1=" + $(this).parent(".cotcontent").find("ul li.on").eq(0).find("img").attr("data-code") + "&ItemCode2=" + $(this).parent(".cotcontent").find("ul li.on").eq(1).find("img").attr("data-code")+"&r="+ Math.random()).attr("target", "_blank");
                        }
                    });
                    //选中状态
                    $("#js_contrast ul li .recently_r").toggle(function () { $(this).parent("li").addClass("on"); $(this).parent("li").find(".vsico").show(); }, function () { $(this).parent("li").removeClass("on"); $(this).parent("li").find(".vsico").hide(); });
                    //移除对比按钮
                    $(".js_delico").off("click").on("click", function () {
                        $(this).parent("li").remove();
                        if ((parseFloat($(".js_navcotlist a.curr").find(".js_cotnavtip").html()) - 1) == 0) {
                            $(".js_navcotlist a.curr").find(".js_cotnavtip").html("").hide();
                        } else {
                            $(".js_navcotlist a.curr").find(".js_cotnavtip").html(parseFloat($(".js_navcotlist a.curr").find(".js_cotnavtip").html()) - 1)
                        }

                        if ($(".cotcontent").eq($(".js_navcotlist a.curr").index()).find("ul li").length == 0) {
                            $(".cotcontent").eq($(".js_navcotlist a.curr").index()).find(".connonetip").show();
                        } else {
                            $(".cotcontent").eq($(".js_navcotlist a.curr").index()).find(".connonetip").hide();
                        }
                        QiBaoData.delnonesetcookie();
                    });
                    //清空对比
                    $(".js_iconclear").off("click").on("click", function () {
                        $(".js_cottip").html("");
                        $(".js_navcotlist a.curr").find(".js_cotnavtip").html("").hide();
                        $(this).parent(".cotcontent").find("ul").html("");
                        $(".cotcontent").eq($(".js_navcotlist a.curr").index()).find(".connonetip").show();
                        QiBaoData.delnonesetcookie();
                    });
                }
            }
            return '';
        },
        delnonesetcookie: function () {
            var delcokico = $("#js_contrast").find("li");
            var delcokicolist = "", jsconl = "[", jsconr = "]";
            for (var i = 0; i < delcokico.length; i++) {
                if (i == 0) {
                    delcokicolist += '{"typeid":' + delcokico.eq(i).find(".js_delico").attr("data-type") + ',"imgurl":"' + delcokico.eq(i).find("img").attr("src") + '","datacode":"' + delcokico.eq(i).find("img").attr("data-code") + '","itemname":"' + delcokico.eq(i).find(".recName").html() + '","classnames":"' + delcokico.eq(i).find("p:last span").attr("class") + '","money":"' + delcokico.eq(i).find("p:last span").text() + '","trclo":"' + delcokico.eq(i).find(".js_delico").attr("data-delicoid") + '","typeno":"' + delcokico.eq(i).find(".js_delico").attr("data-type") + '"' + '}';
                } else {
                    delcokicolist += ',{"typeid":' + delcokico.eq(i).find(".js_delico").attr("data-type") + ',"imgurl":"' + delcokico.eq(i).find("img").attr("src") + '","datacode":"' + delcokico.eq(i).find("img").attr("data-code") + '","itemname":"' + delcokico.eq(i).find(".recName").html() + '","classnames":"' + delcokico.eq(i).find("p:last span").attr("class") + '","money":"' + delcokico.eq(i).find("p:last span").text() + '","trclo":"' + delcokico.eq(i).find(".js_delico").attr("data-delicoid") + '","typeno":"' + delcokico.eq(i).find(".js_delico").attr("data-type") + '"' + '}';
                }
            };
            QiBaoData.setCookie("QbConlist", jsconl + delcokicolist + jsconr);
        },

        GetToday: function () {
            var d = new Date();
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            month = month < 10 ? ("0" + month) : month;
            var dt = d.getDate();
            dt = dt < 10 ? ("0" + dt) : dt;
            var today = year + "-" + month + "-" + dt;
            return today
        },

        GetOneWeek: function () {
            var today = new Date();
            var begin;
            var endTime;
            today.setTime(today.getTime() - 7 * 24 * 3600 * 1000);
            begin = today.format('yyyy-MM-dd');
            return begin
        },

        GetOneMonth: function () {
            var now = new Date($(document).GetToday().replace(/\-/g, "/"));
            var perMonth = new Date(now.setMonth(now.getMonth() - 1));
            var year = perMonth.getFullYear();
            var month = perMonth.getMonth() + 1;
            month = month < 10 ? ("0" + month) : month;
            var dt = perMonth.getDate();
            dt = dt < 10 ? ("0" + dt) : dt;
            var OneMonth = year + "-" + month + "-" + dt;
            return OneMonth;
        },

        GetThreeMonth: function () {
            var now = new Date($(document).GetToday().replace(/\-/g, "/"));
            var perMonth = new Date(now.setMonth(now.getMonth() - 3));
            var year = perMonth.getFullYear();
            var month = perMonth.getMonth() + 1;
            month = month < 10 ? ("0" + month) : month;
            var dt = perMonth.getDate();
            dt = dt < 10 ? ("0" + dt) : dt;
            var OneMonth = year + "-" + month + "-" + dt;
            return OneMonth;
        },

        SetUrlParam: function (para_name, para_value, url) {
            var strNewUrl = new String();
            var strUrl = url;
            if (strUrl.indexOf("?") != -1) {
                strUrl = strUrl.substr(strUrl.indexOf("?") + 1);
                if (strUrl.toLowerCase().indexOf(para_name.toLowerCase()) == -1) {
                    strNewUrl = url + "&" + para_name + "=" + para_value;
                    return strNewUrl;
                } else {
                    var aParam = strUrl.split("&");
                    for (var i = 0; i < aParam.length; i++) {
                        if (aParam[i].substr(0, aParam[i].indexOf("=")).toLowerCase() == para_name.toLowerCase()) {
                            aParam[i] = aParam[i].substr(0, aParam[i].indexOf("=")) + "=" + para_value;
                        }
                    }

                    strNewUrl = url.substr(0, url.indexOf("?") + 1) + aParam.join("&");
                    return strNewUrl;
                }

            } else {
                strUrl += "?" + para_name + "=" + para_value;
                return strUrl
            }
        },

        GetRequest: function (paramName) {
            var url = location.search; //获取url中"?"符后的字串
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
                }
            }
            return theRequest;
        },

        WhichBrowser: function () {
            var agt = navigator.userAgent.toLowerCase();
            if (agt.indexOf("opera") != -1) return 'Opera';
            if (agt.indexOf("staroffice") != -1) return 'Star Office';
            if (agt.indexOf("webtv") != -1) return 'WebTV';
            if (agt.indexOf("beonex") != -1) return 'Beonex';
            if (agt.indexOf("chimera") != -1) return 'Chimera';
            if (agt.indexOf("netpositive") != -1) return 'NetPositive';
            if (agt.indexOf("phoenix") != -1) return 'Phoenix';
            if (agt.indexOf("firefox") != -1) return 'Firefox';
            if (agt.indexOf("chrome") != -1) return 'chrome';
            if (agt.indexOf("safari") != -1) return 'Safari';
            if (agt.indexOf("skipstone") != -1) return 'SkipStone';
            if (agt.indexOf("msie") != -1) return 'Internet Explorer';
            if (agt.indexOf("netscape") != -1) return 'Netscape';
            if (agt.indexOf("mozilla/5.0") != -1) return 'Mozilla';
            if (agt.indexOf('\/') != -1) {
                if (agt.substr(0, agt.indexOf('\/')) != 'mozilla') {
                    return navigator.userAgent.substr(0, agt.indexOf('\/'));
                }
                else return 'Netscape';
            } else if (agt.indexOf(' ') != -1)
                return navigator.userAgent.substr(0, agt.indexOf(' '));
            else return navigator.userAgent;
        },

        UItoTop: function (options) {
            var defaults = {
                min: 200,
                inDelay: 600,
                outDelay: 400,
                containerID: 'toTop',
                containerHoverID: 'reTop',
                scrollSpeed: 300,
                easingType: 'linear'
            };
            var settings = $.extend(defaults, options);
            var containerIDhash = '#' + settings.containerID;
            $(containerIDhash).hide().click(function () {
                $('html, body').animate({ scrollTop: 0 }, settings.scrollSpeed, settings.easingType);
                $(this).stop().animate({}, settings.inDelay, settings.easingType);
                return false;
            });

            if ($(window).scrollTop() > settings.min) {
                $(containerIDhash).fadeIn(settings.inDelay);
            }
            $(window).scroll(function () {
                var sd = $(window).scrollTop();
                if (sd > settings.min) {
                    $(containerIDhash).fadeIn(settings.inDelay);
                } else {
                    $(containerIDhash).fadeOut(settings.Outdelay);
                }
            });
        },

        FollowingRoll: function (options) {
            var defaults = {
                conTopHeight: 250,/*滚动容器与页面顶部的距离*/
                conAfterTopHeight: 105,/*滚动容器之后的容器与滚动容器直接的高*/
                container: $('.js_menudiv'),/*需要跟随的容器*/
                containerAfter: $(".goods_tab")/*滚动容器之后的容器*/
            };
            var settings = $.extend(defaults, options);
            $(window).scroll(function () {    //滚动
                var _scroll = $(window).scrollTop();  //滚动条高度
                if (_scroll >= settings.conTopHeight) {    //判断当大于等于对象的offsetTop的时候
                    if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) { //针对IE6的判断
                        settings.container.css({ 'top': _scroll - settings.conTopHeight, 'z-index': '90' });
                    } else {
                        settings.container.css({ 'position': 'fixed', 'top': '0', 'z-index': '90' });
                        settings.containerAfter.css("margin-top", settings.conAfterTopHeight);
                    }
                } else {
                    if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) { //针对IE6的判断
                        settings.container.css({ 'top': '0' });
                    } else {
                        settings.container.css({ 'position': 'relative' });
                        settings.containerAfter.css("margin-top", 0);
                    }
                }
            });

        }
    }
})();
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
        RegExp.$1.length == 1 ? o[k] :
        ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}