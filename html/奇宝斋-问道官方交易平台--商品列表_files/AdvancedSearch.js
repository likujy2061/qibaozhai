/*add by ligen 2016.8.22*/
$(function () {
    var roleMartialUrl = "/AdvancedSearch/RoleItemTypeList"; //获取角色门派接口
    var weaponMartialUrl = "/AdvancedSearch/WeaponItemTypeList"; //获取武器门派接口
    var propMartialUrl = "/AdvancedSearch/PropItemTypeList"; //获取道具类型接口
    var roleGetDataUrl = "/AdvancedSearch/RoleItemList"; //角色获取搜索数据
    var weaponGetDataUrl = "/AdvancedSearch/WeaponItemList"; //武器获取搜索数据
    var suitGetDataUrl = "/AdvancedSearch/SuitItemList"; //套装获取搜索数据
    var petTypeGetDataUrl = "/AdvancedSearch/PetItemTypeList"; //获取宠物种类数据
    var getServerListUrl = "/AdvancedSearch/GameServerList"; //获取区服
    var getAreaListUrl = "/Navigation/GetAreaList"; //获取大区区服
    var accouterDataUrl = "/AdvancedSearch/AccouterItemList"; //获取装备数据
    var propDataUrl = "/AdvancedSearch/PropItemList";//获取道具数据
    var petDataUrl = "/AdvancedSearch/PetItemList";//获取宠物、坐骑数据
    var moneyDataUrl = "/Buy/BuyGrid";//获取问道币数据
    var goodsListsUrl = "/AdvancedSearch/ItemRecommendList";//左侧推荐位商品接口
    var searchtype = 0;
    /*全服搜索搜索条件切换*/
    $(".js_nav_tabs_item0").show();
    $("input").not(".hidArea").val("");
    $(".nav_tabs a").click(function () {
        var itemindex = $(this).attr("data-item");
        //为左侧添加data-typeId值
        $('.imgDiv').attr("data-typeId", itemindex);
        
        var tabulli = $(".js_nav_tabs_item" + itemindex).find(".js_selli");
        searchtype = itemindex;
        //if (itemindex == 4 || itemindex == 5 || itemindex == 6) {
        //    $('.imgDiv').hide();
        //} else {
        //    $('.imgDiv').show();
        //}
        if (searchtype == 4) {
            $("#AreaList").hide();
            $("#ServerList").hide();
        } else {
            $("#AreaList").show();
            $("#ServerList").show();
        }
        if (itemindex != "") {
            $(".nav_tabs a").removeClass("curr");
            $(this).addClass("curr");
            $(".js_searchItemPanel").animate({ height: "80px" });
            $(".searchItemUp").addClass("searchItemDown").find("span").removeClass().addClass("sdowns").html("&nbsp;");
            $(".secondarypoint").show();
            $(".js_nav_tabs_item").hide();
            for (var i = 0; i < tabulli.length; i++) {
                tabulli.eq(i).find("a").removeClass("licur");
                tabulli.eq(i).find("a:first").addClass("licur");
            }
            searchAllServer();
            $(".js_lv").attr("data-lv", "不限");
            $("input").val("");
            $(".minnb").html("");
            $(".js_nav_tabs_item" + itemindex).show();
        }
        return false;
    });

    /*次要加点搜索条件切换*/
    function secpittab(con, tabs) {
        $(tabs + "1").show();
        $(con + " a").click(function () {
            var itemindex = $(this).attr("data-item");

            if (itemindex != "") {
                //此处如果是法宝，则将显示框拉长

                if (itemindex == 4 || itemindex == 2){
                     $(".js_searchItemPanel").animate({ height:"620px"});

                }else if(itemindex == 5){
                    $(".js_searchItemPanel").animate({ height:"400px"});
                }else if(itemindex == 1 && $(".js_searchbtn").attr("code")==0){
                    $(".js_searchbtn").attr("code",0)
                                                            console.log(con + " a")
                    $(".js_searchItemPanel").animate({ height:"580px"});
                }else if(itemindex == 3 ){
                    console.log("此处点击，将这个拦高度设置为500")
                    $(".js_searchItemPanel").animate({ height:"550px"});
                };

                $(con + " li").removeClass("spcur");
                $(this).parent("li").addClass("spcur");
                $(tabs).hide();
                $(tabs + itemindex).show();
            }
            return false;
        });
    };

    secpittab(".js_rolesecptnav", ".js_rolesdary_point");
    secpittab(".js_petsecptnav", ".js_petsdary_point");





    /*收起展开搜索条件 该事件控制下拉搜索条件的显示*/
    $(".searchItemUp").click(function () {
        if (!$(this).hasClass("searchItemDown")) {
            $(".js_searchItemPanel").animate({ height: "80px" });
            $(".secondarypoint").hide();
            $(this).addClass("searchItemDown").find("span").removeClass().addClass("sdowns").html("&nbsp;");
        } else {
            $(this).removeClass("searchItemDown").find("span").removeClass().addClass("sups").html("&nbsp;");
            for (var i = 0; i < $(".js_menu_sub1 a").length; i++) {
                if ($(".js_menu_sub1 a").eq(i).hasClass("curr")) {
                    $(".secondarypoint").show();
                    $(".js_searchItemPanel").animate({ height:"580px"});
                }
            }
        }
    });

    /*获取宠物种类*/
    $.ajax({
        url: petTypeGetDataUrl,
        type: "get",
        datatype: "json",
        data: {
            r: Math.random()
        },
        success: function (d) {
            if (d.IsSuccess) {
                if (d.Data.length > 0) {
                    $("#petRank").empty();
                    for (var i = 0; i < d.Data.length; i++) {
                        if (d.Data[i].Selected) {
                            $("#petRank").append('<option value="' + d.Data[i].Value + '" selected="selected">' + d.Data[i].Text + '</option>');
                        } else {
                            $("#petRank").append('<option value="' + d.Data[i].Value + '">' + d.Data[i].Text + '</option>');
                        }

                    }
                }
            } else {
                alert(d.Message);
            }
        }
    });

    //获取角色门派
    getMartialSelect(roleMartialUrl, ".js_roleMartial");
    //获取武器门派
    getMartialSelect(weaponMartialUrl, ".js_armsMartial");
    //获取道具类型
    getMartialSelect(propMartialUrl, ".js_propMartial");
    //获取套装武器门派
    getMartialSelect(weaponMartialUrl, ".js_armssuitMartial");

    /* 购买商品 */
    //隔行换色
    $(".js_tr_color tr:odd").css('background-color', '#ebebeb');

    /*交易管理*/
    // 交易管理 表头划入划出
    $(".js_tab_head").hover(function () {
        $(this).find(".js_head_hover").removeClass('dn');
    }, function () {
        $(this).find(".js_head_hover").addClass('dn');
    });
    $(".js_head_hover a").hover(function () {
        $(this).addClass("curr");
    }, function () {
        $(this).removeClass("curr");
    });

    /* 获取参数，重绘页面 */
    var Request = new Object();
    Request = QiBaoData.GetRequest();
    var state = "", order = "", pageindex = "";

    state = Request['state'];
    order = Request['order'];
    pageindex = Request['pageindex'];
    if (state != "" && state != null) {
        var statelist = state.split(",");
        $("input[type=checkbox]").removeAttr("checked");
        if (statelist.length == 6) {
            $("input[name=chkAll]").attr("checked", "checked");
        }
        for (var i = 0; i < statelist.length; i++) {
            $("input[type=checkbox]").each(function (j) {
                var $this = $(this);
                var chkval = $this.val();
                if (statelist[i] == chkval) {
                    $this.attr("checked", "checked");
                }
            });
        }
    };

    if (order != "" && order != null) {
        $(".js_head_hover a").each(function () {
            var $this = $(this);
            var tyid = $this.attr("data-order");
            if (order == tyid) {
                var cname = $this.find("span:eq(1)").attr("class") + "2";
                $this.addClass("clrr").siblings("a").removeClass("clrr");
                $this.parents("th").find(".js_thicon").removeClass().addClass("js_thicon").addClass(cname);
            }
        })
    };

    if (pageindex != "" && pageindex != null) {
        $(".page").find("a").removeClass("curr");
        $(".page").find("a:eq(" + pageindex + 2 + ")").addClass("curr");
    };

    if (state == "" || state == null) {
        state = 0;
    };
    if (order == "" || order == null) {
        //order = -1;
        order = 0;
        //if (itemTypeID == 4) { order = 3 }//如果是道具分类，默认价格从低到高
    };
    if (pageindex == "" || pageindex == null) {
        pageindex = 1;
    };

    var Area = [];
    var Server = [];
    /*当前区服*/
    var nowArea = 0;
    var nowServer = 0;
    /*获取大区内容*/
    $.ajax({
        url: getAreaListUrl,
        type: "get",
        datatype: "json",
        data: {
            r: Math.random()
        },
        success: function (d) {
             if (d.IsSuccess){
                 var areadata = d.Result;
                 var optionHtml = "<option value='0'>请选择</option>";
                 for(var k = 0; k < areadata.length; k++){
                    optionHtml+="<option value='"+areadata[k].code+"'>"+areadata[k].areaName+"</option>";
                 }
                $("#AreaList").html(optionHtml)
             }
        }
    })
    /*获取区服*/
    $.ajax({
        url: getServerListUrl,
        type: "get",
        datatype: "json",
        data: {
            r: Math.random()
        },
        success: function (d) {
            if (d.IsSuccess) {
                if (d.Data.length > 0) {
                    Server = d.Data;
                }
                /*当前区服*/
                nowArea = d.AreaCode;
                nowServer = d.ServerCode;

                //绑定服务器
                if (nowArea != 0) {
                    $("#AreaList").find("option[value='" + nowArea + "']").attr("selected", "selected");
                    $("#ServerList").empty().append("<option value='0'>请选择</option>");
                    for (var m = 0; m < Server.length; m++) {
                        if (Server[m].AreaCode == nowArea) {
                            if (Server[m].ServerCode == nowServer) {
                                $("#ServerList").append("<option value='" + Server[m].ServerCode + "' selected='selected'>" + Server[m].ServerName + "</option>");
                            } else {
                                $("#ServerList").append("<option value='" + Server[m].ServerCode + "'>" + Server[m].ServerName + "</option>");
                            }
                        }
                    }
                    $.ajax({
                        type: "get",
                        url: "/Buy/IsAlertCaptcha",
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
                                            $.ajax({
                                                url: "/buy/VerifyCaptcha",
                                                type: "post",
                                                dataType: "json",
                                                data: {
                                                    verifyCaptcha: captchaCode.val(),
                                                    r: Math.random()
                                                },
                                                beforeSend: function () {
                                                    $(".js_Codediv_btn").attr("disabled", "disabled").val("正在提交...");
                                                },
                                                success: function (d) {
                                                    $(".js_Codediv_btn").removeAttr("disabled").val("确  定");
                                                    if (d.IsSuccess) {
                                                        $(".public_Code_div").remove();
                                                        //getdata();
                                                        selstatefn(".js_selstate", ".js_selrolAll");
                                                        seltypefn(".js_roleMartial");
                                                        seltypefn(".js_mainPointMartial");
                                                        selstatefn(".js_battletMartial",".js_battlelAll");
                                                        selstatefn(".js_enlightenment",".js_enlighlAll");
                                                        seltypefn(".js_sexMartial");
                                                        seltypeiptfn(".js_levelMartial", "roleMinLevel", "roleMaxLevel");
                                                        getRoleData(searchtype);
                                                    } else {
                                                        if (d.Data == "unauthorized") {
                                                            QiBao.TimeOutDiv();
                                                        } else if (d.Data == "JsonException") {
                                                            window.location.href = d.ReturnUrl;
                                                        } else {
                                                            //$("#captcha_image").attr("src", "/Login/Create?fileName=" + Math.random());
                                                            QiBao.refreshCaptcha();
                                                            $(".public_Code_div").find(".js_pass_err").show().html(d.Message);
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                        return false;
                                    });
                                } else {
                                    //getdata();
                                    selstatefn(".js_selstate", ".js_selrolAll");
                                    seltypefn(".js_roleMartial");
                                    seltypefn(".js_mainPointMartial");
                                    selstatefn(".js_battletMartial",".js_battlelAll");
                                     selstatefn(".js_enlightenment",".js_enlighlAll");
                                    seltypefn(".js_sexMartial");
                                    seltypeiptfn(".js_levelMartial", "roleMinLevel", "roleMaxLevel");
                                    getRoleData(searchtype);
                                }
                            } else {
                                if (d.Data == "unauthorized") {
                                    QiBao.TimeOutDiv();
                                } else if (d.Data == "JsonException") {
                                    window.location.href = d.ReturnUrl;
                                } else {
                                    $(".puberror_table").show().html(d.Message)
                                }
                            }
                        }
                    });
                } else {
                    QiBao.TimeOutDiv();
                }
                //根据区组绑定服务器
                $("#AreaList").change(function () {
                    var areacode = $(this).val();
                    var aretext = $("#AreaList option:selected").text();
                    $("#ServerList").empty().append("<option value='0'>请选择</option>");
                    for (var m = 0; m < Server.length; m++) {
                        if (Server[m].AreaCode == areacode) {
                            $("#ServerList").append("<option value='" + Server[m].ServerCode + "'>" + Server[m].ServerName + "</option>");
                        }
                    }
                    nowServer = 0;
                    if (aretext.indexOf("经典") > -1) {
                        $(".classic_hidden").hide();
                        $(".js_battletMartial").hide();
                        $(".js_enlightenment").hide();
                         if ($(".js_roleMartial li").eq(6).text() == "刀客" || $(".js_roleMartial li").eq(7).text() == "灵兽" || $(".js_roleMartial li").eq(8).text() == "蛟龙" || $(".js_roleMartial li").eq(9).text() == "风翅" ||  $(".js_roleMartial li").eq(10).text() == "蛮荒" ||
                                $(".js_armsMartial li").eq(2).text() == "刀" || $(".js_armsMartial li").eq(4).text() == "拳套" ||  $(".js_armsMartial li").eq(6).text() == "双戟" || $(".js_armsMartial li").eq(8).text() == "弓" || $(".js_armsMartial li").eq(10).text() == "斧" ||
                                 $(".js_propMartial li").eq(2).text() == "魂兽石" || $(".js_propMartial li").eq(5).text() == "天书" ) {
                                $(".js_roleMartial li").eq(6).hide();
                                $(".js_roleMartial li").eq(7).hide();
                                $(".js_roleMartial li").eq(8).hide();
                                $(".js_roleMartial li").eq(9).hide();
                                $(".js_roleMartial li").eq(10).hide();
                                $(".js_armsMartial li").eq(2).hide();
                                $(".js_armsMartial li").eq(4).hide();
                                $(".js_armsMartial li").eq(6).hide();
                                $(".js_armsMartial li").eq(8).hide();
                                $(".js_armsMartial li").eq(10).hide();
                                $(".js_propMartial li").eq(2).hide();
                                $(".js_propMartial li").eq(5).hide();
                            
                            }
                    }else{
                        $(".classic_hidden").show();
                        $(".js_battletMartial").show();
                        $(".js_enlightenment").show();
                        if ($(".js_roleMartial li").eq(6).text() == "刀客" || $(".js_roleMartial li").eq(7).text() == "灵兽" || $(".js_roleMartial li").eq(8).text() == "蛟龙" || $(".js_roleMartial li").eq(9).text() == "风翅" ||  $(".js_roleMartial li").eq(10).text() == "蛮荒" ||
                                $(".js_armsMartial li").eq(2).text() == "刀" || $(".js_armsMartial li").eq(4).text() == "拳套" ||  $(".js_armsMartial li").eq(6).text() == "双戟" || $(".js_armsMartial li").eq(8).text() == "弓" || $(".js_armsMartial li").eq(10).text() == "斧" ||
                                 $(".js_propMartial li").eq(2).text() == "魂兽石" || $(".js_propMartial li").eq(5).text() == "天书" ) {
                                $(".js_roleMartial li").eq(6).show();
                                $(".js_roleMartial li").eq(7).show();
                                $(".js_roleMartial li").eq(8).show();
                                $(".js_roleMartial li").eq(9).show();
                                $(".js_roleMartial li").eq(10).show();
                                $(".js_armsMartial li").eq(2).show();
                                $(".js_armsMartial li").eq(4).show();
                                $(".js_armsMartial li").eq(6).show();
                                $(".js_armsMartial li").eq(8).show();
                                $(".js_armsMartial li").eq(10).show();
                                $(".js_propMartial li").eq(2).show();
                                $(".js_propMartial li").eq(5).show();
                            
                            }
                    }
                });
                $("#ServerList").change(function () {
                    nowServer = 0;
                });

            } else {
                alert(d.Message);
            }
        }
    });

    /*商品状态全选反选效果*/
    function selstatefn(sel, selall) {
        $(sel + " li a:not(" + selall + ")").die("click").live("click", function () {
            $(sel + " li a:first").removeClass("licur");
            if ($(this).hasClass("licur")) {
                $(this).removeClass("licur");
            } else {
                $(this).addClass("licur");
            }
            var issel = 0;
            for (var i = 0; i < $(sel + " li a").length; i++) {
                if ($(sel + " li a").eq(i).hasClass("licur")) {
                    issel++;
                }
            }
            if (issel != $(sel + " li a").length - 1 && issel != 0) {
                $(sel + " li a:first").removeClass("licur");
            } else if (issel == $(sel + " li a").length - 1) {
                $(sel + " li a").removeClass("licur").eq(0).addClass("licur");
            } else if (issel == 0) {
                $(sel + " li a:first").addClass("licur");
            };
            issel = 0;
        });
        $(selall).die("click").live("click", function () {
            $(sel + " li a").removeClass("licur");
            $(sel + " li a").eq(0).addClass("licur");
            state = 0;
        });
    };

    /*商品类别全选反选效果*/
    function seltypefn(sel) {
        $(sel + " li a").die("click").live("click", function () {
            $(this).addClass("licur").parent("li").siblings("li").find("a").removeClass("licur");
        });
    }

    /*商品类别全选反选效果加清除输入框*/
    function seltypeiptfn(sel,min,max) {
        $(sel + " li a").die("click").live("click", function () {
            $(this).addClass("licur").parent("li").siblings("li").find("a").removeClass("licur");
            $(this).parent().parent().attr("data-lv", $(this).text());
            $(sel).find("input").val("");
        });
        $(sel).find("input").keyup(function () {
            if ($(this).val() != "") {
                $(sel + " li").find("a.licur").removeClass("licur");
                $(sel).attr("data-lv", ($("input[name=" + min + "]").val() + '-' + $("input[name=" + max + "]").val()));
            } else{
                $(sel + " li").find("a").removeClass("licur");
                $(sel + " li:first").find("a").addClass("licur");
                $(sel).attr("data-lv", $(sel + " li:first").find("a").text());
            }
        });

    }

    /*状态选择遍历*/
    function seltitemtype(searchtype, seltypess) {
        state = "";
        var typelth = $(".js_nav_tabs_item" + searchtype).find($(seltypess + " li a"));
        for (var i = 0; i < typelth.length; i++) {
            if (typelth.eq(i).hasClass("licur")) {
                if (i == 0) {
                    state += typelth.eq(i).attr("data-tyid");
                } else {
                    state += typelth.eq(i).attr("data-tyid") + ",";
                }
            }
        }
        return state;
    }
    /*战力选择遍历*/
     function choseMoremtype(searchtype, seltypess) {
        choseMorestate = "";
        var typelth = $(".js_nav_tabs_item" + searchtype).find($(seltypess + " li a.licur"));
        for (var i = 0; i < typelth.length; i++) {
                if (i > 0) {
                    choseMorestate +=  "," + typelth.eq(i).attr("data-tyid")  ;
                } else {
                     choseMorestate = typelth.eq(i).attr("data-tyid");
                }           
        }
        return choseMorestate;
    }

    /*点击搜索按钮*/
    $(".js_searchbtn").die("click").live("click", function () {
        var code=1
        searchAllServer($(".js_searchbtn").attr("data-hsl"),code);
        $(".js_searchbtn").attr("code",1)
    });
    /*重置搜索条件按钮*/
    $(".js_resetbtn").die("click").live("click", function () {
        var tabulli = $(".js_searchItemPanel").find(".js_selli");
        for (var i = 0; i < tabulli.length; i++) {
            tabulli.eq(i).find("a").removeClass("licur");
            tabulli.eq(i).find("a:first").addClass("licur");
        }
        $(".js_lv").attr("data-lv", "不限");
        $("input").val("");
        $(".minnb").html("");
        if($('.menubg .nav_sub_div .js_nav_tabs_item3 .eclosionRank')){
            $('.menubg .nav_sub_div .js_nav_tabs_item3 .eclosionRank').addClass('disnone').removeClass('disblock');
        }
        if($('.menubg .nav_sub_div .js_nav_tabs_item2 .jewelNames')){
             $('.menubg .nav_sub_div .js_nav_tabs_item2 .jewelNames').addClass('disnone').removeClass('disblock');
        }
        
    });
    /* 点击排序 */
    $(".js_head_hover a").die("click").live("click", function () {
        order = $(this).attr("data-order");
        searchAllServer();
        return false;
    });

    /*记录次要条件*/
    function showminnb(mins, maxs, shownb) {
        var minstxt = $("input[name=" + mins + "]");
        var maxstxt = $("input[name=" + maxs + "]");
        $("input[name=" + mins + "]").blur(function () {
            if ($.trim(minstxt.val()) == "" && $.trim(maxstxt.val()) == "") {
                $(shownb).html("");
            } else {
                $(shownb).html($.trim(minstxt.val()) + "-" + $.trim(maxstxt.val()));
            }

        })
        $("input[name=" + maxs + "]").blur(function () {
            if ($.trim(minstxt.val()) == "" && $.trim(maxstxt.val()) == "") {
                $(shownb).html("");
            } else {
                $(shownb).html($.trim(minstxt.val()) + "-" + $.trim(maxstxt.val()));
            }
        })
    };
    showminnb("roleMinTiZhi", "roleMaxTiZhi", ".js_roleTiZhi");
    showminnb("roleMinLingLi", "roleMaxLingLi", ".js_roleLingLi");
    showminnb("roleMinLiLiang", "roleMaxLiLiang", ".js_roleLiLiang");
    showminnb("roleMinMinJie", "roleMaxMinJie", ".js_roleMinJie");
    showminnb("roleMinXianDao", "roleMaxXianDao", ".js_roleXianDao");
    showminnb("roleMinMoDao", "roleMaxMoDao", ".js_roleMoDao");
    /*记录次要条件*/
    function showselnb(sels, shownbs) {
        $(sels).find("li a").off("click").on("click", function () {
            $(shownbs).html($(this).attr("data-tyid"));
        });
    };
    showselnb(".js_shapeMartial", ".js_shapeM");
    showselnb(".js_magRdLvMartial", ".js_magRdLvM");
    showselnb(".js_phyRdLvMartial", ".js_phyRdLvM");
    showselnb(".js_petmalMartial", ".js_petmalM");
    showselnb(".js_enchantMartial", ".js_enchantM");
    showselnb(".js_eclosionMartial", ".js_eclosionM");
    showselnb(".js_rankMartial", ".js_rankM");
    showselnb(".js_capacityLevelMartial", ".js_capacityLevelM");

    //点击按钮时验证=======================================================start
    //验证角色搜索条件输入
    function checkRoleForm() {
        /*验证角色价格区间*/
        var regPrice = /^\+?[1-9][0-9]*$/;
        var regCount = /^[0-9]*$/;

        if (!ValidateInterval("roleMinPrice", "roleMaxPrice", "价格", regPrice, 10, 200000, "true")) { //验证价格
            return false;
        }
        if (!ValidateInterval("roleMinTao", "roleMaxTao", "道行", regCount, 10, 1000000000, "true")) { //验证道行
            return false;
        }

        return true;

    };

    /*验证宠物搜索条件输入*/
    function checkform() {
        /*验证宠物价格区间*/
        var regPrice = /^\+?[1-9][0-9]*$/;
        var regCount = /^[0-9]*$/;
        if ($.trim($("input[name='petName']").val()).length > 10) {   //验证名称
            //setTimeout(function () { alert("宠物名称不得超过10字") }, 1);
            alert("宠物名称不得超过10字");
            return false;
        }
        if (!ValidateInterval("petMinPrice", "petMaxPrice", "价格", regPrice, 10, 200000, "true")) { //验证价格
            return false;
        }
        if (!ValidateInterval("petMinLevel", "petMaxLevel", "等级", regCount, 1, 200, "true")) { //验证等级加点
            return false;
        }
        return true;
    }

    /*验证坐骑搜索条件输入*/
    function checkMontform() {
        /*验证坐骑价格区间*/
        var regPrice = /^\+?[1-9][0-9]*$/;
        var regCount = /^[0-9]*$/;
        if ($.trim($("input[name='Name']").val()).length > 10) {   //验证名称
            alert("坐骑名称不得超过10字");
            return false;
        }
        if (!ValidateInterval("MinPrice", "MaxPrice", "价格", regPrice, 10, 200000, "true")) { //验证价格
            return false;
        }
        if (!ValidateInterval("MinMagPower", "MaxMagPower", "法伤", regCount, 0, 20000000, "false")) { //验证法伤
            return false;
        }
        if (!ValidateInterval("MinMaxLife", "MaxMaxLife", "气血", regCount, 0, 20000000, "false")) { //验证体质加点
            return false;
        }
        if (!ValidateInterval("MinSpeed", "MaxSpeed", "速度", regCount, 0, 20000000, "false")) { //验证灵力加点
            return false;
        }
        if (!ValidateInterval("MinPhyPower", "MaxPhyPower", "物伤", regCount, 0, 20000000, "false")) { //验证力量加点
            return false;
        }
        return true;
    }

    //验证武器搜索条件输入
    function checkWeaponForm() {
        /*验证武器价格区间*/
        var regPrice = /^\+?[1-9][0-9]*$/;
        var regCount = /^[0-9]*$/;

        if (!ValidateInterval("weaponMinPrice", "weaponMaxPrice", "价格", regPrice, 10, 200000, "true")) { //验证价格
            return false;
        }
        if (!ValidateInterval("weaponMinHurt", "weaponMaxHurt", "伤害", regCount, 0, 8000000, "false")) { //验证伤害
            return false;
        }
        if (!ValidateInterval("weaponMinChange", "weaponMaxChange", "改造等级", regCount, 0, 10000, "false")) { //验证改造等级
            return false;
        }
        if (!ValidateInterval("armMinLevel", "armMaxLevel", "等级", regCount, 1, 200, "true")) { //验证等级加点
            return false;
        }
        return true;
    }

    //验证装备搜索条件输入
    function checkEquipageForm() {
        /*验证装备价格区间*/
        var regPrice = /^\+?[1-9][0-9]*$/;
        var regCount = /^[0-9]*$/;

        if (!ValidateInterval("equipageMinPrice", "equipageMaxPrice", "价格", regPrice, 10, 200000, "true")) { //验证价格
            return false;
        }
        if (!ValidateInterval("equipageMinHurt", "equipageMaxHurt", "伤害", regCount, 0, 8000000, "false")) { //验证伤害
            return false;
        }
        if (!ValidateInterval("equipageMinChange", "equipageMaxChange", "改造等级", regCount, 0, 10000, "false")) { //验证改造等级
            return false;
        }
        if (!ValidateInterval("weaponMinLevel", "weaponMaxLevel", "等级", regCount, 1, 200, "true")) { //验证等级加点
            return false;
        }
        return true;
    }

    //验证道具搜索条件输入
    function checkPropsForm() {
        var regPrice = /^\+?[1-9][0-9]*$/;
        var regCount = /^[0-9]*$/;
        if ($.trim($("input[name='propsName']").val()).length > 10) {   //验证名称
            alert("道具名称不得超过10字");
            return false;
        }
        if (!ValidateInterval("propsMinPrice", "propsMaxPrice", "价格", regPrice, 10, 200000, "true")) { //验证价格
            return false;
        }
        if (!ValidateInterval("propMinLevel", "propMaxLevel", "等级", regCount, 1, 500, "true")) { //验证等级加点
            return false;
        }
        return true;
    }

    //验证套装搜索条件输入
    function checkSuitForm() {
        /*验证套装价格区间*/
        var regPrice = /^\+?[1-9][0-9]*$/;
        var regCount = /^[0-9]*$/;

        if (!ValidateInterval("suitMinPrice", "suitMaxPrice", "价格", regPrice, 10, 200000, "true")) { //验证价格
            return false;
        }
        return true;
    }

    //验证区间输入验证
    function ValidateInterval(min, max, tip, exp, numMin, numMax, equal) {
        var flag = true;
        //min:最小值name、max:最大值name、tip:提示语中的类别、exp:验证正则、numMin:提示语中最小数值、numMax:提示语中最大数值
        if ($("input[name='" + min + "']").val() != "" && $("input[name='" + max + "']").val() != "") {
            //判断有没有最大值
            var first = (
            equal == "true" ?
            (!(exp.test($.trim($("input[name='" + min + "']").val())) && parseInt($.trim($("input[name='" + min + "']").val())) >= numMin && parseInt($.trim($("input[name='" + min + "']").val())) <= numMax) || !(exp.test($.trim($("input[name='" + max + "']").val())) && parseInt($.trim($("input[name='" + max + "']").val())) >= numMin && parseInt($.trim($("input[name='" + max + "']").val())) <= numMax))
            :
            (!(exp.test($.trim($("input[name='" + min + "']").val())) && parseInt($.trim($("input[name='" + min + "']").val())) > numMin && parseInt($.trim($("input[name='" + min + "']").val())) < numMax) || !(exp.test($.trim($("input[name='" + max + "']").val())) && parseInt($.trim($("input[name='" + max + "']").val())) > numMin && parseInt($.trim($("input[name='" + max + "']").val())) < numMax))
            );
            var firstTip = (equal == "true" ? tip + "必须为大于等于" + numMin + "小于等于" + numMax + "的整数" : tip + "必须为大于" + numMin + "小于" + numMax + "的整数");

            if (first) {
                alert(firstTip);

                flag = false;
                return false;
            }
            if (parseInt($.trim($("input[name='" + min + "']").val())) > parseInt($.trim($("input[name='" + max + "']").val()))) {
                alert("最小" + tip + "必须小于等于最大" + tip);
                flag = false;
                return false;
            }
        } else if ($("input[name='" + min + "']").val() == "" && $("input[name='" + max + "']").val() != "") {
            alert(tip + "区间有输入时，最小" + tip + "和最大" + tip + "必须都有输入");
            flag = false;
        } else if ($("input[name='" + min + "']").val() != "" && $("input[name='" + max + "']").val() == "") {
            alert(tip + "区间有输入时，最小" + tip + "和最大" + tip + "必须都有输入");
            flag = false;
        }
        return flag;
    }

    //单个文本框验证范围值
    function ValidateInputSin(obj, tip, exp, numMin, numMax, equal) {
        if (obj.val() != "") {
            var first = equal == "true" ? (!(exp.test($.trim(obj.val())) && parseInt($.trim(obj.val())) >= numMin && parseInt($.trim(obj.val())) <= numMax)) : (!(exp.test($.trim(obj.val())) && parseInt($.trim(obj.val())) > numMin && parseInt($.trim(obj.val())) < numMax));
            var firstTip = equal == "true" ? tip + "必须为大于等于" + numMin + "小于等于" + numMax + "的整数" : tip + "必须为大于" + numMin + "小于" + numMax + "的整数";
            if (first) {
                //setTimeout(function () { alert(firstTip) }, 1);  //延时1ms在火狐下会发生alert阻塞异常
                alert(firstTip);
                return false;
            }
        }
    }

    //点击按钮时验证==========================================================end

    //获取数据==================================================start
    //配置角色搜索参数
    function getRoleData(searchtype) {
        QiBaoData.GetDataListNew({
            AdvancedSearch: true,
            DataUrl: roleGetDataUrl,
            listHeadFormat: '<table><thead class="goods_tab_head icon icon_tab_head"><tr><th width="7%">图片</th><th class="bor_r_none" width="9%">名称</th><th class="bor_r_none" width="6%"><div class="pos_rel tab_head_link2 js_tab_head"><span class="dis_inb">等级</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="1"><span class="dis_inb">等级</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="2"><span class="dis_inb">等级</span><span class="link_down_icon"></span></a></div></div></th><th width="8%" class="bor_r_none"><div class="pos_rel tab_head_link2 js_tab_head"><span class="dis_inb">道行</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="3"><span class="dis_inb">道行</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="4"><span class="dis_inb">道行</span><span class="link_down_icon"></span></a> </div></div></th><th class="bor_r_none" width="6%"><div class="pos_rel tab_head_link2 js_tab_head"><span class="dis_inb">体质</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="5"><span class="dis_inb">体质</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="6"><span class="dis_inb">体质</span><span class="link_down_icon"></span></a></div></div></th><th  class="bor_r_none" width="6%"><div class="pos_rel tab_head_link2 js_tab_head"><span class="dis_inb">灵力</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="7"><span class="dis_inb">灵力</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="8"><span class="dis_inb">灵力</span><span class="link_down_icon"></span></a></div></div></th><th class="bor_r_none" width="6%"><div class="pos_rel tab_head_link2 js_tab_head"><span class="dis_inb">力量</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="9"><span class="dis_inb">力量</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="10"><span class="dis_inb">力量</span><span class="link_down_icon"></span></a></div></div></th><th  class="bor_r_none" width="6%"><div class="pos_rel tab_head_link2 js_tab_head"><span class="dis_inb">敏捷</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="11"><span class="dis_inb">敏捷</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="12"><span class="dis_inb">敏捷</span><span class="link_down_icon"></span></a></div></div></th><th class="bor_r_none" width="12%"><div class="pos_rel tab_head_link js_tab_head"><span class="dis_inb">价格(元)</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="13"><span class="dis_inb">价格</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="14"><span class="dis_inb">价格</span><span class="link_down_icon"></span></a></div></div></th><th class="bor_r_none" width="14%"><div class="pos_rel tab_head_link js_tab_head"><span class="dis_inb">剩余时间</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="15"><span class="dis_inb">剩余时间</span><span class="link_up_icon"></span></a> <a href="javascript:" data-order="16"><span class="dis_inb">剩余时间</span><span class="link_down_icon"></span></a></div></div></th><th width="11%">操作</th></tr></thead><tbody class="goods_tab_con js_tr_color">{0}</tbody></table>',
            listFormat: '<tr><td class="postd width100"><a target="_blank" href="/Buy/Order?ItemCode={8}"><img class="dis_inher js_flashimg" widht="50" height="50" src="{0}" data-code="{8}" data-itemtypeid="{12}" /></a><p class="iframep"></p></td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}</td><td>{9}</td><td>{10}</td><td class="bor_r_none tab_con_operation">{11}<span class="stydiv">{13}</span></td></tr>',
            rowName: ["ItemImageName", "ItemName", "ItemLevel", "TaoHtmlHelper", "ConHtmlHelper", "WizHtmlHelper", "StrHtmlHelper", "DexHtmlHelper", "ItemInfoCode", "PriceColorHtml", "BusinessValidDate", "OprateHtml", "ItemTypeId", "CurrentStateName"],
            PageIndex: pageindex,
            GoodsState: seltitemtype(searchtype, ".js_selstate"),
            Sort: order,
            ItemType: $(".js_roleMartial li a.licur").attr("data-tyid"),
            ajaxdata: {
                sex: $(".js_sexMartial li a.licur").attr("data-tyid"),
                mainPoint: $(".js_mainPointMartial li a.licur").attr("data-tyid"),
                zhanLiLv : choseMoremtype(searchtype, ".js_battletMartial"),
                level: $(".js_levelMartial").attr("data-lv"),
                wudaoStage :choseMoremtype(searchtype, ".js_enlightenment"),
                minTao: $("input[name='roleMinSkill']").val(),
                maxTao: $("input[name='roleMaxSkill']").val(),
                minCon: $("input[name='roleMinTiZhi']").val(),
                maxCon: $("input[name='roleMaxTiZhi']").val(),
                minWiz: $("input[name='roleMinLingLi']").val(),
                maxWiz: $("input[name='roleMaxLingLi']").val(),
                minStr: $("input[name='roleMinLiLiang']").val(),
                maxStr: $("input[name='roleMaxLiLiang']").val(),
                minDex: $("input[name='roleMinMinJie']").val(),
                maxDex: $("input[name='roleMaxMinJie']").val(),
                minImmortal: $("input[name='roleMinXianDao']").val(),
                maxImmortal: $("input[name='roleMaxXianDao']").val(),
                minMagic: $("input[name='roleMinMoDao']").val(),
                maxMagic: $("input[name='roleMaxMoDao']").val(),
                minPrice: $("input[name='roleMinPrice']").val(),
                maxPrice: $("input[name='roleMaxPrice']").val(),
                serverId: (nowServer == 0) ? $("#ServerList").val() : nowServer
            }

        });
        //goodsList(searchtype)
    }

    /*配置宠物搜索参数*/
    function getdata(searchtype) {
        QiBaoData.GetDataListNew({
            AdvancedSearch: true,
            DataUrl: petDataUrl,
            listHeadFormat: '<table><thead class="goods_tab_head icon icon_tab_head"><tr><th width="1%">图片</th><th class="bor_r_none" width="9%">名称</th><th class="bor_r_none" width="9%"><div class="pos_rel tab_head_link2 js_tab_head"><span class="dis_inb">等级</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="1"><span class="dis_inb">等级</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="2"><span class="dis_inb">等级</span><span class="link_down_icon"></span></a></div></div></th><th width="8%" class="bor_r_none"><div class="pos_rel tab_head_link2 js_tab_head"><span class="dis_inb">总成长</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="15"><span class="dis_inb">总成长</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="16"><span class="dis_inb">总成长</span><span class="link_down_icon"></span></a> </div></div></th><th class="bor_r_none" width="7%"><div class="pos_rel tab_head_link2 js_tab_head"><span class="dis_inb">武学</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="3"><span class="dis_inb">武学</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="4"><span class="dis_inb">武学</span><span class="link_down_icon"></span></a></div></div></th><th class="bor_r_none" width="12%"><div class="pos_rel tab_head_link js_tab_head"><span class="dis_inb">价格(元)</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="13"><span class="dis_inb">价格</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="14"><span class="dis_inb">价格</span><span class="link_down_icon"></span></a></div></div></th><th class="bor_r_none" width="14%"><div class="pos_rel tab_head_link js_tab_head"><span class="dis_inb">剩余时间</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="17"><span class="dis_inb">剩余时间</span><span class="link_up_icon"></span></a> <a href="javascript:" data-order="18"><span class="dis_inb">剩余时间</span><span class="link_down_icon"></span></a></div></div></th><th width="3%">操作</th></tr></thead><tbody class="goods_tab_con js_tr_color">{0}</tbody></table>',
            listFormat: '<tr><td class="postd width100"><a target="_blank" href="/Buy/Order?ItemCode={9}"><img class="dis_inher js_flashimg" widht="50" height="50" src="{0}" data-code="{9}" data-itemtypeid="{13}" /></a><p class="iframep"></p></td><td>{1}</td><td>{2}</td><td>{11}</td><td>{3}</td><td>{8}</td><td>{10}</td><td class="bor_r_none tab_con_operation">{12}<span class="stydiv">{14}</span></td></tr>',
            rowName: ["ItemImageName", "ItemName", "ItemLevel", "MartialHtmlHelper", "MagPowerHtmlHelper", "PhyPowerHtmlHelper", "SpeedHtmlHelper", "MaxLifeHtmlHelper", "PriceColorHtml", "ItemInfoCode", "BusinessValidDate", "ShapeHtmlHelper", "OprateHtml", "ItemTypeId", "CurrentStateName"],
            PageIndex: pageindex,
            GoodsState: seltitemtype(searchtype, ".js_selpetstate"),
            Sort: order,
            ItemType: $(".js_petMartial li a.licur").attr("data-tyid"),
            ajaxdata: {
                name: $("input[name='petName']").val(),
                rank: $(".js_rankMartial li a.licur").attr("data-tyid"),
                level: $(".js_petlevelMartial").attr("data-lv"),
                capacityLevel: $(".js_capacityLevelMartial li a.licur").attr("data-tyid"),
                minPrice: $("input[name='petMinPrice']").val(),
                maxPrice: $("input[name='petMaxPrice']").val(),
                martial: $(".js_petmalMartial li a.licur").attr("data-tyid"),
                shape: $(".js_shapeMartial li a.licur").attr("data-tyid"),
                minMagPower: "",
                maxMagPower: "",
                minMaxLife: "",
                maxMaxLife: "",
                minSpeed: "",
                maxSpeed: "",
                minPhyPower: "",
                maxPhyPower: "",
                enchant: $(".js_enchantMartial li a.licur").attr("data-tyid"),
                eclosion: $(".js_eclosionMartial li a.licur").attr("data-tyid"),
                magRebuildLevel: $(".js_magRdLvMartial li a.licur").attr("data-tyid"),
                phyRebuildLevel: $(".js_phyRdLvMartial li a.licur").attr("data-tyid"),
                morphLifeTimes: "不限",
                morphMagTimes: "不限",
                morphManaTimes: "不限",
                morphPhyTimes: "不限",
                morphSpeedTimes: "不限",
                isCrossServer: "0",
                serverId: (nowServer == 0) ? $("#ServerList").val() : nowServer,
                retainIntimacy: $(".js_petIntimacy li a.licur").attr("data-type"),//宠物亲密度
                eclosionRank: $(".js_eclosionRank li a.licur").attr("data-type"), //宠物添加真伪
                zhanliLv:choseMoremtype(searchtype, ".js_petbattletMartial")//宠物添加战力
            }

        });
        //goodsList(searchtype)
    }

    /*配置问道币搜索参数*/
    function getMoneyData(searchtype) {
        QiBaoData.GetDataListNew({
            AdvancedSearch: true,
            DataUrl: moneyDataUrl,
            listHeadFormat: '<table><thead class="goods_tab_head icon icon_tab_head"><tr><th width="7%">图片</th><th class="bor_r_none" width="17%">物品名称</th><th class="bor_r_none" width="17%"><div class="pos_rel tab_head_link js_tab_head"><span class="dis_inb">当前价格(元)</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="3"><span class="dis_inb">价格从低到高</span><span class="link_up_icon"></span></a> <a href="javascript:" data-order="4"><span class="dis_inb">价格从高到低</span><span class="link_down_icon"></span></a></div></div></th><th width="14%" class="bor_r_none"><div class="pos_rel tab_head_link js_tab_head"><span class="dis_inb">单价（文/元）</span><span class="js_thicon link_down_icon2"></span><div class="tab_head_hover js_head_hover dn"><a href="javascript:" data-order="7"><span class="dis_inb">单价从低到高</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="8" class="clrr" ><span class="dis_inb">单价从高到低</span><span class="link_down_icon"></span></a></div></div></th><th width="20%" class="bor_r_none"><div class="pos_rel tab_head_link js_tab_head"><span class="dis_inb">出售剩余时间</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="5"><span class="dis_inb">时间从低到高</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="6"><span class="dis_inb">时间从高到低</span><span class="link_down_icon"></span></a> </div></div></th><th class="bor_r_none" width="11%">操作</th></tr></thead><tbody class="goods_tab_con js_tr_color">{0}</tbody></table>',
            listFormat: '<tr><td class="postd"><a target="_blank" href="/Buy/Order?ItemCode={7}"><img class="dis_inher js_flashimg" widht="50" height="50" src="{0}" data-code="{7}" data-itemtypeid="{8}"></a><p class="iframep"></p></td><td>{4}</td><td>{3}</td><td>{2}</td><td>{5}</td><td class="bor_r_none tab_con_operation">{6}</td></tr>',
            rowName: ["ItemImageName", "ItemLevel", "ItemNameColor", "PriceColorHtml", "ItemName", "BusinessValidDate", "OprateHtml", "ItemInfoCode", "ItemTypeId"],
            PageIndex: pageindex,
            GoodsState: "Sales,FreeShow,PublicityAndAssureing,Publicity",
            Sort: order,
            ItemType: $(".js_moneyMartial li a.licur").attr("data-tyid")
        });
        //goodsList(searchtype)
    }

    /*配置武器搜索参数*/
    function getWeaponData(searchtype) {
        QiBaoData.GetDataListNew({
            AdvancedSearch: true,
            DataUrl: weaponGetDataUrl,
            listHeadFormat: '<table><thead class="goods_tab_head icon icon_tab_head"><tr><th width="1%">图片</th><th class="bor_r_none" width="9%">名称</th><th class="bor_r_none" width="9%"><div class="pos_rel tab_head_link2 js_tab_head"><span class="dis_inb">等级</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="1"><span class="dis_inb">等级</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="2"><span class="dis_inb">等级</span><span class="link_down_icon"></span></a></div></div></th><th width="8%" class="bor_r_none"><div class="pos_rel tab_head_link2 js_tab_head"><span class="dis_inb">伤害</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="3"><span class="dis_inb">伤害</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="4"><span class="dis_inb">伤害</span><span class="link_down_icon"></span></a> </div></div></th><th class="bor_r_none" width="12%"><div class="pos_rel tab_head_link js_tab_head"><span class="dis_inb">价格(元)</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="5"><span class="dis_inb">价格</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="6"><span class="dis_inb">价格</span><span class="link_down_icon"></span></a></div></div></th><th class="bor_r_none" width="14%"><div class="pos_rel tab_head_link js_tab_head"><span class="dis_inb">剩余时间</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="7"><span class="dis_inb">剩余时间</span><span class="link_up_icon"></span></a> <a href="javascript:" data-order="8"><span class="dis_inb">剩余时间</span><span class="link_down_icon"></span></a></div></div></th><th width="1%">操作</th></tr></thead><tbody class="goods_tab_con js_tr_color">{0}</tbody></table>',
            listFormat: '<tr><td class="postd width100"><a target="_blank" href="/Buy/Order?ItemCode={5}"><img class="dis_inher js_flashimg" widht="50" height="50" src="{0}" data-code="{5}" data-itemtypeid="{8}" /></a><p class="iframep"></p></td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{6}</td><td class="bor_r_none tab_con_operation">{7}<span class="stydiv">{9}</span></td></tr>',
            rowName: ["ItemImageName", "ItemName", "ItemLevel", "HurtHtmlHelper", "PriceColorHtml", "ItemInfoCode", "BusinessValidDate", "OprateHtml", "ItemTypeId", "CurrentStateName"],
            PageIndex: pageindex,
            GoodsState: seltitemtype(searchtype, ".js_selweaponstate"),
            Sort: order,
            ItemType: $(".js_armsMartial li a.licur").attr("data-tyid"),
            ajaxdata: {
                level: $(".js_armslevelMartial").attr("data-lv"),
                minPrice: $("input[name='weaponMinPrice']").val(),
                maxPrice: $("input[name='weaponMaxPrice']").val(),
                minHurt: $("input[name='weaponMinHurt']").val(),
                maxHurt: $("input[name='weaponMaxHurt']").val(),
                minRebuildLevel: $("input[name='weaponMinChange']").val(),
                maxRebuildLevel: $("input[name='weaponMaxChange']").val(),
                suitPolar: $(".js_armssPMartial li a.licur").attr("data-tyid"),
                serverId: (nowServer == 0) ? $("#ServerList").val() : nowServer
            }

        });
        //goodsList(searchtype)
    }

    /*配置装备搜索参数*/
    function getEquipageData(searchtype) {
        QiBaoData.GetDataListNew({
            AdvancedSearch: true,
            DataUrl: accouterDataUrl,
            listHeadFormat: '<table><thead class="goods_tab_head icon icon_tab_head"><tr><th width="7%">图片</th><th class="bor_r_none" width="10%">名称</th><th class="bor_r_none" width="10%"><div class="pos_rel tab_head_link2 js_tab_head"><span class="dis_inb">等级</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="1"><span class="dis_inb">等级</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="2"><span class="dis_inb">等级</span><span class="link_down_icon"></span></a></div></div></th><th width="8%" class="bor_r_none"><div class="pos_rel tab_head_link2 js_tab_head"><span class="dis_inb">伤害</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="3"><span class="dis_inb">伤害</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="4"><span class="dis_inb">伤害</span><span class="link_down_icon"></span></a></div></div></th><th width="8%" class="bor_r_none"><div class="pos_rel tab_head_link2 js_tab_head"><span class="dis_inb">防御</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="5"><span class="dis_inb">防御</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="6"><span class="dis_inb">防御</span><span class="link_down_icon"></span></a></div></div></th><th width="8%" class="bor_r_none"><div class="pos_rel tab_head_link2 js_tab_head"><span class="dis_inb">速度</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="7"><span class="dis_inb">速度</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="8"><span class="dis_inb">速度</span><span class="link_down_icon"></span></a></div></div></th><th width="8%" class="bor_r_none"><div class="pos_rel tab_head_link2 js_tab_head"><span class="dis_inb">闪避</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="9"><span class="dis_inb">闪避</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="10"><span class="dis_inb">闪避</span><span class="link_down_icon"></span></a></div></div></th><th class="bor_r_none" width="13%"><div class="pos_rel tab_head_link js_tab_head"><span class="dis_inb">价格(元)</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="11"><span class="dis_inb">价格</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="12"><span class="dis_inb">价格</span><span class="link_down_icon"></span></a></div></div></th><th class="bor_r_none" width="15%"><div class="pos_rel tab_head_link js_tab_head"><span class="dis_inb">剩余时间</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="13"><span class="dis_inb">剩余时间</span><span class="link_up_icon"></span></a> <a href="javascript:" data-order="14"><span class="dis_inb">剩余时间</span><span class="link_down_icon"></span></a></div></div></th><th width="11%">操作</th></tr></thead><tbody class="goods_tab_con js_tr_color">{0}</tbody></table>',
            listFormat: '<tr><td class="postd width100"><a target="_blank" href="/Buy/Order?ItemCode={1}"><img class="dis_inher js_flashimg" widht="50" height="50" src="{0}" data-code="{1}"  data-itemtypeid="{2}"></a><p class="iframep"></p></td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}</td><td>{8}</td><td>{9}</td><td>{10}</td><td class="bor_r_none tab_con_operation">{11}<span class="stydiv">{12}</span></td></tr>',
            rowName: ["ItemImageName", "ItemInfoCode", "ItemTypeId", "ItemName", "ItemLevel", "HurtHtmlHelper", "DefenseHtmlHelper", "SpeedHtmlHelper", "DodgeHtmlHelper", "PriceColorHtml", "BusinessValidDate", "OprateHtml", "CurrentStateName"],
            PageIndex: pageindex,
            GoodsState: seltitemtype(searchtype, ".js_selequipstate"),
            Sort: order,
            ItemType: $(".js_weaponMartial li a.licur").attr("data-tyid"),
            ajaxdata: {
                level: $(".js_weaponlevelMartial").attr("data-lv"),
                minPrice: $("input[name='equipageMinPrice']").val(),
                maxPrice: $("input[name='equipageMaxPrice']").val(),
                minHurt: $("input[name='equipageMinHurt']").val(),
                maxHurt: $("input[name='equipageMaxHurt']").val(),
                minDefense: "",
                maxDefense: "",
                minBlood: "",
                maxBlood: "",
                minMagic: "",
                maxMagic: "",
                minSpeed: "",
                maxSpeed: "",
                minDodge: "",
                maxDodge: "",
                minRebuildLevel: $("input[name='equipageMinChange']").val(),
                maxRebuildLevel: $("input[name='equipageMaxChange']").val(),
                suitPolar: $(".js_weaponsPMartial li a.licur").attr("data-tyid"),
                serverId: (nowServer == 0) ? $("#ServerList").val() : nowServer,
                retainIntimacy: $(".js_weaponsIntimacy li a.licur").attr("data-type"),//装备亲密度
                name:$(".js_jewellMartial li a.licur").attr("data-tyid")//装备法宝
            }

        });
    }

    /*配置道具搜索参数*/
    function getPropsData(searchtype) {
        QiBaoData.GetDataListNew({
            AdvancedSearch: true,
            DataUrl: propDataUrl,
            listHeadFormat: '<table><thead class="goods_tab_head icon icon_tab_head"><tr><th width="1%">图片</th><th class="bor_r_none" width="9%">物品名称</th><th class="bor_r_none" width="9%"><div class="pos_rel tab_head_link2 js_tab_head"><span class="dis_inb">等级</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="1"><span class="dis_inb">等级</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="2"><span class="dis_inb">等级</span><span class="link_down_icon"></span></a></div></div></th><th class="bor_r_none" width="12%"><div class="pos_rel tab_head_link js_tab_head"><span class="dis_inb">价格(元)</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="3"><span class="dis_inb">价格</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="4"><span class="dis_inb">价格</span><span class="link_down_icon"></span></a></div></div></th><th class="bor_r_none" width="12%"><div class="pos_rel tab_head_link js_tab_head"><span class="dis_inb">出售剩余时间</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="5"><span class="dis_inb">出售剩余时间</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="6"><span class="dis_inb">出售剩余时间</span><span class="link_down_icon"></span></a></div></div></th><th width="1%">操作</th></tr></thead><tbody class="goods_tab_con js_tr_color">{0}</tbody></table>',
            listFormat: '<tr><td  class="postd width100"><a target="_blank" href="/Buy/Order?ItemCode={1}"><img class="dis_inher js_flashimg" widht="50" height="50" src="{0}" data-code="{1}" data-itemtypeid="{2}"></a><p class="iframep"></p></td><td>{3}</td><td>{4}</td><td>{6}</td><td>{7}</td><td class="bor_r_none tab_con_operation">{8}<span class="stydiv">{5}</span></td></tr>',
            rowName: ["ItemImageName", "ItemInfoCode", "ItemTypeId", "ItemName", "ItemLevel", "CurrentStateName", "PriceColorHtml", "BusinessValidDate", "OprateHtml"],
            PageIndex: pageindex,
            GoodsState: seltitemtype(searchtype, ".js_selpropstate"),
            Sort: order,
            ItemType: $(".js_propMartial li a.licur").attr("data-tyid"),
            ajaxdata: {
                level: $(".js_proplevelMartial").attr("data-lv"),
                name: $("input[name='propsName']").val(),
                minPrice: $("input[name='propsMinPrice']").val(),
                maxPrice: $("input[name='propsMaxPrice']").val(),
                serverId: (nowServer == 0) ? $("#ServerList").val() : nowServer
            }

        });
    }

    /*配置套装搜索参数*/
    function getSuitData(searchtype) {
        QiBaoData.GetDataListNew({
            AdvancedSearch: true,
            DataUrl: suitGetDataUrl,
            listHeadFormat: '<table><thead class="goods_tab_head icon icon_tab_head"><tr><th width="1%">图片</th><th class="bor_r_none" width="8%">名称</th><th class="bor_r_none" width="5%"><div class="pos_rel tab_head_link2 js_tab_head"><span class="dis_inb">等级</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="1"><span class="dis_inb">等级</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="2"><span class="dis_inb">等级</span><span class="link_down_icon"></span></a></div></div></th><th width="5%" class="bor_r_none"><div class="pos_rel tab_head_link2 js_tab_head"><span class="dis_inb">相性</span></a> </div></div></th><th width="5%" class="bor_r_none"><div class="pos_rel tab_head_link2 js_tab_head"><span class="dis_inb">性别</span></a> </div></div></th><th class="bor_r_none tab_head_link2" width="18%">部位</th><th class="bor_r_none" width="10%"><div class="pos_rel tab_head_link2 js_tab_head"><span class="dis_inb">价格(元)</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="7"><span class="dis_inb">价格</span><span class="link_up_icon"></span></a><a href="javascript:" data-order="8"><span class="dis_inb">价格</span><span class="link_down_icon"></span></a></div></div></th><th class="bor_r_none" width="14%"><div class="pos_rel tab_head_link js_tab_head"><span class="dis_inb">剩余时间</span><span class="js_thicon link_up_icon2"></span><div class="tab_head_hover js_head_hover dn"><a class="clrr" href="javascript:" data-order="9"><span class="dis_inb">剩余时间</span><span class="link_up_icon"></span></a> <a href="javascript:" data-order="10"><span class="dis_inb">剩余时间</span><span class="link_down_icon"></span></a></div></div></th><th width="1%">操作</th></tr></thead><tbody class="goods_tab_con js_tr_color">{0}</tbody></table>',
            listFormat: '<tr><td class="postd width100"><a target="_blank" href="/Buy/Order?ItemCode={9}"><img class="dis_inher js_flashimg" widht="50" height="50" src="{0}" data-code="{9}" data-itemtypeid="{10}" /></a><p class="iframep"></p></td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}</td><td class="bor_r_none tab_con_operation">{8}<span class="stydiv">{11}</span></td></tr>',
            rowName: ["ItemImageName", "ItemName", "ItemLevel", "PolarHtmlHelper", "SexHtmlHelper", "AttribHtmlHelper", "PriceColorHtml", "BusinessValidDate", "OprateHtml", "ItemInfoCode", "ItemTypeId", "CurrentStateName"],
            PageIndex: pageindex,
            GoodsState: seltitemtype(searchtype, ".js_selsuitstate"),
            Sort: order,
            ItemType: $(".js_armsMartial li a.licur").attr("data-tyid"),
            ajaxdata: {
                level: $(".js_armssuitlevelMartial li a.licur").attr("data-tyid"),
                sex: $(".js_sexsuitMartial li a.licur").attr("data-tyid"),
                minPrice: $("input[name='suitMinPrice']").val(),
                maxPrice: $("input[name='suitMaxPrice']").val(),
                suitPolar: $(".js_suitPMartial li a.licur").attr("data-tyid"),
                serverId: (nowServer == 0) ? $("#ServerList").val() : nowServer
            }

        });
    }

    //搜索点击事件执行函数
    function searchAllServer(isshowbtn,code) {
            if (searchtype == 0) {
                if (checkRoleForm()) {
                    selstatefn(".js_selstate", ".js_selrolAll");
                    seltypefn(".js_roleMartial");
                    seltypefn(".js_mainPointMartial");
                    selstatefn(".js_battletMartial",".js_battlelAll");
                    selstatefn(".js_enlightenment",".js_enlighlAll");
                    seltypefn(".js_sexMartial");
                    seltypeiptfn(".js_levelMartial", "roleMinLevel", "roleMaxLevel");
                    //getRoleData(searchtype); //角色
                    //此处更换新接口
                    getRoleDataWebdao(searchtype); //角色
                    if (isshowbtn == 1) {
                        $(".js_searchItemPanel").animate({ height: "80px" });
                        $(".searchItemUp").addClass("searchItemDown").find("span").removeClass().addClass("sdowns").html("&nbsp;");
                    }
                    $(".js_nav_tabs_item0").find(".secondarypoint li a").eq(0).click();
                }
            } else if (searchtype == 1) {
                if (checkWeaponForm()) {
                    selstatefn(".js_selweaponstate", ".js_selweaponAll");
                    seltypefn(".js_armsMartial");
                    seltypefn(".js_weaponsIntimacy");//亲密度
                    seltypeiptfn(".js_armslevelMartial", "armMinLevel", "armMaxLevel");
                    seltypefn(".js_armssPMartial");
                    getWeaponData(searchtype);  //武器
                    if (isshowbtn == 1) {
                        $(".js_searchItemPanel").animate({ height: "80px" });
                        $(".searchItemUp").addClass("searchItemDown").find("span").removeClass().addClass("sdowns").html("&nbsp;");
                    }
                }
            } else if (searchtype == 2) {
                if (checkEquipageForm()) {
                    selstatefn(".js_selequipstate", ".js_selequipAll");
                    seltypefn(".js_weaponMartial");
                    //当部位中的不限和法宝有class="licur"时，亲密度显示

                    $('.js_weaponMartial li').off('click').on('click', function () {
                        
                        var index = $(this).index();
                        if (index == 0 || index == 4) {
                            $('.menubg .nav_sub_div .js_nav_tabs_item2 .weaponIntimacy').addClass('disblock').removeClass('disnone');

                        } else {
                            $('.js_weaponsIntimacy li:eq(0) a').addClass('licur');
                            $('.js_weaponsIntimacy li:eq(0)').siblings().children('a').removeClass('licur');
                            $('.menubg .nav_sub_div .js_nav_tabs_item2 .weaponIntimacy').addClass('disnone').removeClass('disblock');
                           
                        }
                        if (index == 4) {
                            $('.menubg .nav_sub_div .js_nav_tabs_item2 .jewelNames').addClass('disblock').removeClass('disnone');

                        } else {
                            $('.js_jewellMartial li:eq(0) a').addClass('licur');
                            $('.js_jewellMartial li:eq(0)').siblings().children('a').removeClass('licur');
                            $('.menubg .nav_sub_div .js_nav_tabs_item2 .jewelNames').addClass('disnone').removeClass('disblock');
                           
                        }

                    });
                    seltypeiptfn(".js_weaponlevelMartial", "weaponMinLevel", "weaponMaxLevel");
                    seltypefn(".js_weaponsPMartial");
                    seltypefn(".js_jewellMartial");//法宝名称
                    seltypefn(".js_weaponsIntimacy");//装备亲密度
                    getEquipageData(searchtype);  //装备
                    if (isshowbtn == 1) {
                        $(".js_searchItemPanel").animate({ height: "80px" });
                        $(".searchItemUp").addClass("searchItemDown").find("span").removeClass().addClass("sdowns").html("&nbsp;");
                    }
                }
            } else if (searchtype == 3) {
                if (checkform()) {
                    selstatefn(".js_selpetstate", ".js_selpetAll");
                    seltypefn(".js_petMartial");
                    selstatefn(".js_petbattletMartial", ".js_petbattlelAll");
                    seltypeiptfn(".js_petlevelMartial", "petMinLevel", "petMaxLevel");
                    seltypefn(".js_petIntimacy");//亲密度
                     $('.js_petMartial li').off('click').on('click', function () { 
                        var index = $(this).index();
                        if (index == 4 || index == 5 || index == 6) {
                            $('.menubg .nav_sub_div .js_nav_tabs_item3 .eclosionRank').addClass('disblock').removeClass('disnone');

                        } else {
                            $('.js_eclosionRank li:eq(0) a').addClass('licur');
                            $('.js_eclosionRank li:eq(0)').siblings().children('a').removeClass('licur');
                            $('.menubg .nav_sub_div .js_nav_tabs_item3 .eclosionRank').addClass('disnone').removeClass('disblock');
                           
                        }
                    });
                    seltypefn(".js_eclosionRank");//真伪选择
                    seltypefn(".js_petmalMartial");
                    seltypefn(".js_enchantMartial");
                    seltypefn(".js_eclosionMartial");
                    seltypefn(".js_rankMartial");
                    seltypefn(".js_capacityLevelMartial");
                    seltypefn(".js_shapeMartial");
                    seltypefn(".js_magRdLvMartial");
                    seltypefn(".js_phyRdLvMartial");
                    seltypefn(".js_phyRdLvMartial");
                    seltypefn(".js_morphLeTsMartial");
                    getdata(searchtype); //宠物
                    if (isshowbtn == 1) {
                        $(".js_searchItemPanel").animate({ height: "80px" });
                        $(".searchItemUp").addClass("searchItemDown").find("span").removeClass().addClass("sdowns").html("&nbsp;");
                    }
                    $(".js_nav_tabs_item3").find(".secondarypoint li a").eq(0).click();
                }
            } else if (searchtype == 4) {
                //if (checkMontform()) {
                selstatefn(".js_selmoneystate", ".js_selmoneyAll");
                seltypefn(".js_moneyMartial");
                getMoneyData(searchtype);  //问道币
                if (isshowbtn == 1) {
                    $(".js_searchItemPanel").animate({ height: "80px" });
                    $(".searchItemUp").addClass("searchItemDown").find("span").removeClass().addClass("sdowns").html("&nbsp;");
                }
                // }
            } else if (searchtype == 5) {
                if (checkPropsForm()) {
                    selstatefn(".js_selpropstate", ".js_selpropsAll");
                    seltypefn(".js_propMartial");
                    seltypeiptfn(".js_proplevelMartial", "propMinLevel", "propMaxLevel");
                    getPropsData(searchtype);  //道具
                    if (isshowbtn == 1) {
                        $(".js_searchItemPanel").animate({ height: "80px" });
                        $(".searchItemUp").addClass("searchItemDown").find("span").removeClass().addClass("sdowns").html("&nbsp;");
                    }
                }
            } else if (searchtype == 6) {
                if (checkSuitForm()) {
                    selstatefn(".js_selsuitstate", ".js_selsuitAll");
                    seltypefn(".js_armssuitMartial");
                    seltypefn(".js_armssuitlevelMartial");
                    seltypefn(".js_sexsuitMartial");
                    seltypefn(".js_armsssuitPMartial");
                    seltypefn(".js_weaponsuitMartial");
                    seltypefn(".js_suitPMartial");
                    getSuitData(searchtype);  //套装
                    if (isshowbtn == 1) {
                        $(".js_searchItemPanel").animate({ height: "80px" });
                        $(".searchItemUp").addClass("searchItemDown").find("span").removeClass().addClass("sdowns").html("&nbsp;");
                    }
                }
            }
        
    };
    $.ajax({
        url: "/Buy/SimpleUserInfo",
        type: "get",
        async: false,
        data: { r: Math.random() },
        success: function (d) {
            if (d.IsSuccess) {
                if (d.Value.AreaName.indexOf("经典") > -1) {
                    $("#hidclassicOrderType").val("经典区");
                }
            }
        }
    })
    //获取门派 接口 
    function getMartialSelect(url, con) {
        $.ajax({
            url: url,
            type: "GET",
            dataType: "JSON",
            data: {
                r: Math.random()
            },
            success: function (d) {
                if (d.IsSuccess) {
                    $(con).empty();
                    for (i = 0; i < d.Data.length; i++) {
                        if (i == 0) {
                            $(con).html('<li><a href="javascript:" data-tyid="' + d.Data[i].Value + '" class="licur">' + d.Data[i].Text + '</a></li>');
                        } else {
                            $(con).append('<li><a href="javascript:" data-tyid="' + d.Data[i].Value + '">' + d.Data[i].Text + '</a></li>');
                        }
                        //引藏经典区需要隐藏的内容
                        if($("#hidclassicOrderType").val() == "经典区"){
                            if ($(".js_roleMartial li").eq(6).text() == "刀客" || $(".js_roleMartial li").eq(7).text() == "灵兽" || $(".js_roleMartial li").eq(8).text() == "蛟龙" || $(".js_roleMartial li").eq(9).text() == "风翅" ||  $(".js_roleMartial li").eq(10).text() == "蛮荒" ||
                                $(".js_armsMartial li").eq(2).text() == "刀" || $(".js_armsMartial li").eq(4).text() == "拳套" ||  $(".js_armsMartial li").eq(6).text() == "双戟" || $(".js_armsMartial li").eq(8).text() == "弓" || $(".js_armsMartial li").eq(10).text() == "斧" ||
                                 $(".js_propMartial li").eq(2).text() == "魂兽石" || $(".js_propMartial li").eq(5).text() == "天书" ) {
                                $(".js_roleMartial li").eq(6).hide();
                                $(".js_roleMartial li").eq(7).hide();
                                $(".js_roleMartial li").eq(8).hide();
                                $(".js_roleMartial li").eq(9).hide();
                                $(".js_roleMartial li").eq(10).hide();
                                $(".js_armsMartial li").eq(2).hide();
                                $(".js_armsMartial li").eq(4).hide();
                                $(".js_armsMartial li").eq(6).hide();
                                $(".js_armsMartial li").eq(8).hide();
                                $(".js_armsMartial li").eq(10).hide();
                                $(".js_propMartial li").eq(2).hide();
                                $(".js_propMartial li").eq(5).hide();
                            
                            }
                            
                        }
                        //$(con).append("<option value='" + d.Data[i].Value + "'>" + d.Data[i].Text + "</option>")
                       
                    }
                }
            }
        });
    }
    /*滑过图片显示对应flash详细信息*/
    $(".postd").live('mouseover', function () {
        $(this).parent().siblings().children('td.postd p').css({ 'display': 'none', 'left': 0, 'top': 0 });
        $(this).children('p').css({ 'display': 'block', 'left': 70, 'top': 10 });
    }).live('mouseout', function () {
        $(this).children('p').css({ 'display': 'none', 'left': 0, 'top': 0 });
    });
});
function getRoleDataWebdao(searchtype) {
        //战力参数
        zhanlilvchoseMoremtype()
        GetDataListNewdemo({
                //人物
                //战力参数
                "zhanlilevel":zhanlilvchoseMoremtype(),
                //道行
                "minTao": $("input[name='roleMinTao']").val(),
                "maxTao": $("input[name='roleMaxTao']").val(),
                //法术伤害
                "minMag_power": $("input[name='roleminMag_power']").val(),
                "maxMag_power": $("input[name='rolemaxMag_power']").val(),
                //气血
                "minHp": $("input[name='roleMinHp']").val(),
                "maxHp": $("input[name='roleMaxHp']").val(),
                //移动速度
                "minSpeed": $("input[name='roleMinSpeed']").val(),
                "maxSpeed": $("input[name='roleMaxSpeed']").val(),
                 //魔法伤害
                "minPhyPower": $("input[name='roleMinPhyPower']").val(),
                "maxPhyPower": $("input[name='roleMaxPhyPower']").val(),               
                //防御
                "mindefAs": $("input[name='roleMindefAs']").val(),
                "maxdefAs": $("input[name='roleMaxdefAs']").val(),
                //价格
                 "minPrice": $("input[name='roleMinPrice']").val(),
                "maxPrice": $("input[name='roleMaxPrice']").val(),
                //服务器信息
                serverId: $("#ServerList").find("option:selected").text(),
                //公式状态
                "js_selli_gongshi": $("#js_selli_select_id").val(),
                //门派
                "nav_sub_type":$("#js_sellijs_roleMartial").val(),
                //悟道
                "Minwudao": $("input[name='roleMinwudao']").val(),
                "Maxwudao": $("input[name='roleMaxwudao']").val(),
                //等级
                "MinLevel": $("input[name='roleMinLevel']").val(),
                "MaxLevel": $("input[name='roleMaxLevel']").val(),
                //装备
                //装备镶嵌
                "zhuangbeixiangqian": $("input[name='zhuangbeixiangqian']").val(),
                //改造等级
                "zhuangbeigaizao": $("input[name='zhuangbeigaizao']").val(),    
                //装备属性
                "select_zhuangbei_shuxing_id": $("#select_zhuangbei_shuxing_id").find("option:selected").text(), 
                
  

                //首饰
                //首饰相性
                "shoushixiangxin": $("input[name='shoushixiangxin']").val(),


                //宠物
                //法术伤害
                "minchongwufashang": $("input[name='minchongwufashang']").val(),
                "maxchongwufashang": $("input[name='maxchongwufashang']").val(), 
                //物理伤害
                "minchongwuwushang": $("input[name='minchongwuwushang']").val(),
                "maxchongwuwushang": $("input[name='maxchongwuwushang']").val(), 
                //移动速度
                "minyidongsudu": $("input[name='minyidongsudu']").val(),
                "maxyidongsudu": $("input[name='maxyidongsudu']").val(), 
                //坐骑参数
                "zuoqi":zuoqihuoqubianli(),
                //法宝等级
                "minfabaodengji": $("input[name='minfabaodengji']").val(),
                "maxfabaodengji": $("input[name='maxfabaodengji']").val(),   
                //法宝物伤增加
                "minfabaowushang": $("input[name='minfabaowushang']").val(),
                "maxfabaowushang": $("input[name='maxfabaowushang']").val(),   
                //法宝伤害类别
                "select_fabaoshuxing_id": $("#select_fabaoshuxing_id").find("option:selected").val(),  
                //法宝后缀             
                "select_fabaohouzhui_id": $("#select_fabaohouzhui_id").find("option:selected").text(),         
                //娃娃
                "wawaminqinmidu": $("input[name='wawaminqinmidu']").val(), 
                "page":1,

        });

    };



function GetDataListNewdemo(options) {
     var url="/api/ApiRoleHandler?"
            for(var name in options){
              url+="&"
              url+=name
              url+="="
              url+=options[name]
              };
            console.log(url);
            console.log(options);
             $.get(url,function(data,status){
                  if (0 == data.errcode  ) {
                        $('tbody[class="goods_tab_con js_tr_color"]').html("");
                        $('tbody[class="goods_tab_con js_tr_color"]').attr("data-tyid",1111);
                        $('tbody[class="goods_tab_con js_tr_color"]').html(template("goods-list-tmpl", {goods:data.data}));
                        $('#page_id').html(template("page-list-tmpl", {data:data}));
                                                }else if (4001 == data.errcode ){
                                                    alert(data.data);
                                                };

             });

};

    /*战力选择遍历*/
function zhanlilvchoseMoremtype() {
        choseMorestate = "";
        var typelth = $("ul[class='js_selli js_battletMartial zhanli']").find($("a[code='1']"));

        for (var i = 0; i < typelth.length; i++) {
                if (i > 0) {
                    choseMorestate +=  "," + typelth.eq(i).attr("data-tyid") ;
                } else {
                     choseMorestate = typelth.eq(i).attr("data-tyid") ;
                }           
        }

        return encodeURIComponent(choseMorestate)

    }



//关于出售状态的获取
$("a[data-tyid='FreeShow'],a[data-tyid='Publicity'],a[data-tyid='Sales']").click(function(){

//判断按钮的植
if($(this).attr("code")==1){

$(this).attr("code",0);
$(this).removeAttr("style");

}else
//设置被点击按钮的code=1,拥有背景色
  {
$(this).attr("code",1);
$(this).css("background", "#37bcb2");
  };
    
});


//关于出售状态的获取
$("a[data-tyid='FreeShow'],a[data-tyid='Publicity'],a[data-tyid='Sales']").click(function(){
//判断按钮的植
if($(this).attr("code")==1){

$("a[data-tyid='Publicity']").attr("code",0);
$("a[data-tyid='Sales']").attr("code",0);
$("a[data-tyid='FreeShow']").attr("FreeShow",0);
$("a[data-tyid='Sales']").removeAttr("style");
$("a[data-tyid='Publicity']").removeAttr("style");
$("a[data-tyid='FreeShow']").removeAttr("style");
}else{

$("a[data-tyid='Publicity']").attr("code",0);
$("a[data-tyid='Sales']").attr("code",0);
$("a[data-tyid='FreeShow']").attr("FreeShow",0);
$("a[data-tyid='Sales']").removeAttr("style");
$("a[data-tyid='Publicity']").removeAttr("style");
$("a[data-tyid='FreeShow']").removeAttr("style");
$(this).attr("code",1);
$(this).css("background", "#37bcb2");
};
});


     //坐骑的获取
//关于战力的获取
$("a[data-tyid='宠物不限'],a[data-tyid='北极熊'],a[data-tyid='吉祥蛙'],a[data-tyid='至尊吉祥蛙'],a[data-tyid='至尊盘古猿'],a[data-tyid='玉蝶鱼'],a[data-tyid='至尊玉蝶鱼'],a[data-tyid='太极熊'],a[data-tyid='至尊太极熊'],a[data-tyid='鲁道夫'],a[data-tyid='巨骨刺'],a[data-tyid='至尊巨骨刺'],a[data-tyid='九尾仙狐'],a[data-tyid='北斗天蓬'],a[data-tyid='疾风蚀日']").click(function(){

  if($(this).attr("data-tyid")=='宠物不限'){

    $("a[data-tyid='北极熊'],a[data-tyid='吉祥蛙'],a[data-tyid='至尊吉祥蛙'],a[data-tyid='至尊盘古猿'],a[data-tyid='玉蝶鱼'],a[data-tyid='至尊玉蝶鱼'],a[data-tyid='太极熊'],a[data-tyid='至尊太极熊'],a[data-tyid='鲁道夫'],a[data-tyid='巨骨刺'],a[data-tyid='至尊巨骨刺'],a[data-tyid='九尾仙狐'],a[data-tyid='北斗天蓬'],a[data-tyid='疾风蚀日']").css('background','');
    $("a[data-tyid='北极熊'],a[data-tyid='吉祥蛙'],a[data-tyid='至尊吉祥蛙'],a[data-tyid='至尊盘古猿'],a[data-tyid='玉蝶鱼'],a[data-tyid='至尊玉蝶鱼'],a[data-tyid='太极熊'],a[data-tyid='至尊太极熊'],a[data-tyid='鲁道夫'],a[data-tyid='巨骨刺'],a[data-tyid='至尊巨骨刺'],a[data-tyid='九尾仙狐'],a[data-tyid='北斗天蓬'],a[data-tyid='疾风蚀日']").attr("code",0);
  }else{  
  $("a[data-tyid='宠物不限']").css('background','');
    //判断按钮的植
    if($(this).attr("code")==1){
        //设置被点击按钮的code=0,消除背景色
        $(this).attr("code",0);
        $(this).css('background','');
    }
    else{
        //设置被点击按钮的code=1,拥有背景色
        $(this).attr("code",1);
        $(this).css("background", "#37bcb2");
      };
  };  
});


    /*坐骑选择遍历*/
function zuoqihuoqubianli() {
        choseMorestate = "";
        var typelth = $("ul[class='js_selli js_battletMartial zuoqi']").find($("a[code='1']"));

        for (var i = 0; i < typelth.length; i++) {
                if (i > 0) {
                    choseMorestate +=  "," + typelth.eq(i).attr("data-tyid") ;
                } else {
                     choseMorestate = typelth.eq(i).attr("data-tyid") ;
                }           
        }
        return choseMorestate

    }



//关于战力的获取
$("a[data-tyid='战力不限'],a[data-tyid='E'],a[data-tyid='D'],a[data-tyid='C'],a[data-tyid='B'],a[data-tyid='A'],a[data-tyid='S'],a[data-tyid='S+'],a[data-tyid='SS'],a[data-tyid='SS+'],a[data-tyid='SSS']").click(function(){




  if($(this).attr("data-tyid")=='战力不限'){
    $("a[data-tyid='E'],a[data-tyid='D'],a[data-tyid='C'],a[data-tyid='B'],a[data-tyid='A'],a[data-tyid='S'],a[data-tyid='S+'],a[data-tyid='SS'],a[data-tyid='SS+'],a[data-tyid='SSS']").css('background','');
        $("a[data-tyid='E'],a[data-tyid='D'],a[data-tyid='C'],a[data-tyid='B'],a[data-tyid='A'],a[data-tyid='S'],a[data-tyid='S+'],a[data-tyid='SS'],a[data-tyid='SS+'],a[data-tyid='SSS']").attr("code",0);
  }else{  
  $("a[data-tyid='战力不限']").css('background','');
    //判断按钮的植
    if($(this).attr("code")==1){
        //设置被点击按钮的code=0,消除背景色
        $(this).attr("code",0);
        $(this).css('background','');
    }
    else{
        //设置被点击按钮的code=1,拥有背景色
        $(this).attr("code",1);
        $(this).css("background", "#37bcb2");
      };
  };  

});