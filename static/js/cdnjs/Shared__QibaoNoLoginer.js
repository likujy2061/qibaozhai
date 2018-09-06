/*===============Upload log===================
 by wangaidi 2017/10/18
 *解决乱码
*/
$(function () {
    getadlist();
    function getadlist() {
        $.ajax({
            url: "/Navigation/Advertisement",
            data: {},
            dataType: "JSON",
            type: "POST",
            success: function (d) {
                if (d.IsSuccess) {
                    if (d.ResultList.length != 0 && d.ResultList != null) {
                        var lihtml = "";
                        for (var i = 0; i < d.ResultList.length; i++) {
                            lihtml += "" +
                                '<li><a href="' + d.ResultList[i].Link + '" target="_blank">' + d.ResultList[i].Title + '</a></li>';
                        }
                        $("#js_tap_ad").empty().html(lihtml);
                    }
                } else {
                    $(".puberror_table").show().html(d.Message)
                }

            }
        });
    };

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
})