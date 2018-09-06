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
                  if (0 == data.errcode || "0" == data.errcode ) {
                        $('tbody[class="goods_tab_con js_tr_color"]').html("");
                        $('tbody[class="goods_tab_con js_tr_color"]').attr("data-tyid",1111);
                        $('tbody[class="goods_tab_con js_tr_color"]').html(template("goods-list-tmpl", {goods:data.data}));

                                                }else if (4001 == data.errcode || "4001" == data.errcode){
                                                    alert(data.data);
                                                };
             })

};