<%if request.querystring="v=1.0.0" then    server.transfer("Buy_Index.js_v=1.0.0") %>$(function () {
    /* 购买商品 */
    //隔行换色
    $(".js_tr_color tr:odd").css('background-color', '#ebebeb');
    /*加载菜单*/
    ChangeNav(0, "0", window.location.href, true);
    if($(".js_tr_color tr").length>1){QiBaoData.FollowingRoll();}
    QiBaoData.UItoTop();
})