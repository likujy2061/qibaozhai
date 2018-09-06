/*这里查询登录的用户信息*/
$.ajax({
    url: "/Buy/SimpleUserInfo",
    type: "get",
    data: { r: Math.random() },
    success: function (d) {
        if (d.IsSuccess) {
            if(d.Value.AreaName.indexOf("经典") > -1){
                $(".classic_hidden").hide();
                $(".js_battletMartial").hide();
                $(".js_enlightenment").hide();  
            }
            $(".public_ChooseRole_div").remove();
            var str = '<div class="sginfo fl">';
            var msgcut = "";
            var logotourl = window.location.href;
            if (d.Value.UnReadNoticesCount > 99) {
                msgcut = '<a class="yhxx icon" href="/Notices/Index?pageindex=1&readed=unread" ><em class="longs">99+</em>';
                $(".yhxx em").show();
            } else if (d.Value.UnReadNoticesCount == 0) {
                msgcut = '<a class="yhxx msgnone icon" href="/Notices/Index?pageindex=1&readed=unread" >';
            } else {
                msgcut = '<a class="yhxx icon" href="/Notices/Index?pageindex=1&readed=unread" ><em>' + d.Value.UnReadNoticesCount + '</em>';
            }
            if (d.Value.RoleName == "游客") {
                str += '<div><span class="span">您好，您尚未登录</span><a data-callback="QiBao.Goto(' + logotourl + ')" class="logina js_cl_login" href="javascript:;">登录</a><a class="yh_signout" href="/account.gyyx.cn/Member/Register/" target="_blank">注册</a></div><div class="yhye"></div><div class="yhqz">';

                if (d.Message != "cachedUserInfoIsNull") {
                    str += '<span>' + d.Value.AreaName + '→' + d.Value.ServerName + '</span>';
                }

                str += '<a href="javascript:;" onclick="QiBao.getLogoutToServerList()">重选区组</a></div></div><img class="fl" src="' + d.Value.RoleImage + '" alt="头像" /><div class="bg_arr1 fl"></div>';
            } else {
                str += '<div>欢迎， <span>' + d.Value.RoleName + '</span>' + msgcut + '</a><a class="yh_signout" href="javascript:;" onclick="QiBao.getLogoutToItemList();">退出</a></div><div class="yhye">您的账户余额：<strong>' + d.Value.Cash + '</strong></div><div class="yhqz"><span>' + d.Value.AreaName + '→' + d.Value.ServerName + '</span><a href="javascript:;" onclick="QiBao.getLogoutToServerList()">重选区组</a><a href="javascript:;" onclick="QiBao.showChooseRolediv();" class="js_chorole">切换角色</a></div></div><img class="fl" src="' + d.Value.RoleImage + '" alt="头像" /><div class="bg_arr1 fl"></div>';
            }
            $(".signinfo_wrap").html(str);
            //add by 骆崇飞 2015-7-15 start 在殷美洪的机器上签入的
            if (d.Value.RoleName != "游客") {
                //检查收藏状态
                QiBao.collectState();
            }
            //add by 骆崇飞 2015-7-15 end 在殷美洪的机器上签入的
            QiBao.chooseRolebtn();//判断当只有一个角色时切换角色按钮不可用
        } else {
            if (d.Data == "unauthorized") {
                QiBao.TimeOutDiv();
            } else if (d.Data == "JsonException") {
                window.location.href = d.ReturnUrl;
            } else {
                $(".puberror_pop").html(d.Message).show();
            }
        }
    },
    error: function () { alert("获取用户信息失败"); }
});