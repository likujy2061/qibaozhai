/*===============Upload log===================
 by wangaidi 2017/10/18
 *解决乱码
*/
$(function () {
    var t = null;
    //一级导航
    $("#js_menu li a").hover(function () {
        $(this).removeClass("menu_ul_icon" + $(this).attr('alt') + "_1").addClass("menu_ul_icon" + $(this).attr('alt'));
        if ($(this).attr("alt") == "1" && !$(this).hasClass('js_curr')) { //滑过购买商品导航时
            $(".js_menu_sub1").addClass('dn');
            $(".js_nav_sub_div").addClass('dn');
            clearTimeout(t);
        }
    }, function () {
        if (!$(this).hasClass('js_curr')) {
            $(this).removeClass("menu_ul_icon" + $(this).attr('alt')).addClass("menu_ul_icon" + $(this).attr('alt') + "_1");
        }
        if ($(this).attr("alt") == "1" && !$(this).hasClass('js_curr')) { //划出购买商品导航时
            t = setTimeout(function () {
                $(".js_menu_sub1").addClass('dn');
                $(".js_nav_sub_div").addClass('dn');
            }, 50);
        }
    });

    //划入划出购买商品
    $(".js_menu_sub1").hover(function () {
        clearTimeout(t);
        $("#js_menu li a:eq(0)").removeClass("menu_ul_icon1_1").addClass("menu_ul_icon1");
    }, function () {
        t = setTimeout(function () {
            if (!$("#js_menu li a:eq(0)").hasClass('js_curr')) {
                $(".js_menu_sub1").addClass('dn');
                $(".js_nav_sub_div").addClass('dn');
                $("#js_menu li a:eq(0)").removeClass("menu_ul_icon1").addClass("menu_ul_icon1_1");
            }
        }, 50);
    });
    //二级导航
    $("#menu_sub1 dl").hover(function () {
        $(this).addClass('dlcurr');
    }, function () {
        $(this).removeClass('dlcurr');
    });

    $(".noopen").click(function () {
        QiBao.ShowMessageDiv({
            Content: "<p style='font-size:14px;'>该功能暂未开放，敬请期待</p>",
            IsDoubleBtn: false
        });
    });
});
/*showFirstNum:一级菜单；showSecondNum：二级菜单，Url跳转地址，isAllSelect是否全选(仅供商品列表页)，showThreeNum 三级菜单*/
function ChangeNav(showFirstNum, showSecondNum, Url, isAllSelect, showThreeNum) {

    $(".js_menu1").removeClass("js_curr");
    $(".js_menu1").eq(showFirstNum).addClass("js_curr").removeClass("menu_ul_icon" + (showFirstNum + 1) + "_1").addClass("menu_ul_icon" + (showFirstNum + 1));

    if (showSecondNum != "") {
        $(".js_menu2:eq(" + showSecondNum + ")").fadeIn();
    }
    $(".js_menu2").eq(1).find("a").each(function () {
        $(this).removeClass("curr");
        var index = $(this).index();
        if (showThreeNum == index) {
            $(this).addClass("curr");
        }
    });
}