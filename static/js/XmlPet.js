<%if request.querystring="v=2.2.2" then    server.transfer("XmlPet.js_v=2.2.2") %>﻿/*-------------------------------------------------------------------------
 * 2017-2-27 by ligen
 * 独立宠物xml解析
 -------------------------------------------------------------------------*/

(function () {
    window.Xmlpet = {
        petCallBack: function (data, par, ispetseals, zhanliArr, petpolarArr, polarArr) {
            var itemId = getQuery("ItemCode");
            $.ajax({
                url: "/ItemInfo/IsClassicalServerByItemId",
                type: "get",
                async: false,
                data: {
                 itemId:itemId,
                 r: Math.random()
                },
                success: function (d) {
                    if (d.IsClassical) {
                        $("#hidclassicOrderType").val("经典区");
                    }
                }
            })
            var addDivDom = document.createElement('div');
            addDivDom.className = "daojuShowDetailInfo";
            addDivDom.style.display = "none";
            par.appendChild(addDivDom);
            var daojuShowDetailInfo = gy.getByClass("daojuShowDetailInfo", par)[0];
            //3：宠物 执行ajax请求xml成功后的回调函数
            //data为请求成功后返回的xml文档
            //执行getInnerNodeText方法 取得xml信息并返回json对象
            var JSONdata = getInnerNodeText(data);
            //执行compiled方法 传入json以及模板 执行拼接字符串方法
            compiled(JSONdata);
            //传一个参数最外层dom节点对象main，获取文档中所有节点的值 返回一个JSON对象
            function getInnerNodeText(main) {
                var htmlObjVal = {};
                eachInnerNode(arguments[0], htmlObjVal);
                return htmlObjVal;
            }

            //查找对象main下的所有元素节点对象
            //参数①：最外层节点对象main1
            //参数②：一个空对象，用来存放innerHTML
            function eachInnerNode(main1, obj1) {
                var main = arguments[0]; //保存第一个参数
                var obj = arguments[1];  //保存第二个参数
                var noSpanEleArr = ["icon", "color", "polar", "property_bind_attrib", "recognize_recognized"];
                //pet的XML格式分为attribs、extra_attrib、medicine_used、skills、pet_godbooks、seal,pet_tongyuan 七部分

                obj['attribs'] = {};  //属性
                obj['extra_attrib'] = "";//妖石部分写在一起是一个字符串
                obj['medicine_used'] = "";//药物服用也是一个字符串
                obj['skills'] = {}; //技能
                obj['pet_godbooks'] = "";//天书技能
                obj['seal'] = "";//封印属性
                obj['pet_tongyuan'] = {};//同源属性
                //找到seal部分的数据写入obj['seal']
                var seal = main.getElementsByTagName('seal')[0];
                if (seal) obj['seal'] = sealXMLToJSON(seal, obj['seal']);

                //找到attribs部分的数据写入obj['attribs']
                var attribs = main.getElementsByTagName('attribs')[0];
                if (attribs) obj['attribs'] = attribsXMLToJSON(attribs, obj['attribs']);


                //找到medicineused部分的数据写入obj['medicine_used']

                var medicineused = main.getElementsByTagName('medicine_used')[0];
                if (medicineused) obj['medicine_used'] = medicineusedXMLToJSON(medicineused, obj['medicine_used']);


                //找到extra_attrib部分的数据写入对象obj['extra_attrib']
                var extra_attrib = main.getElementsByTagName('extra_attrib')[0];
                if (extra_attrib) obj['extra_attrib'] = extraattribXMLToJSON(extra_attrib, obj['extra_attrib']);


                //找到skills部分的数据写入对象obj['skills']
                var skills = main.getElementsByTagName('skills')[0];
                if (skills) obj['skills'] = skillsXMLToJSON(skills, obj['skills']);

                //找到pet_godbooks部分的数据写入对象obj['pet_godbooks']
                var pet_godbooks = main.getElementsByTagName('pet_godbooks')[0];
                if (pet_godbooks) {
                    obj['pet_godbooks'] = petgodbooksXMLToJSON(pet_godbooks)
                }
                 //找到pet_tongyuan部分的数据写入对象obj['pet_tongyuan']
                var pet_tongyuan = main.getElementsByTagName('pet_tongyuan')[0];
                if (pet_tongyuan) obj['pet_tongyuan'] = pet_tongyuanXMLToJSON(pet_tongyuan, obj['pet_tongyuan']);
                
            }

            //宠物的xml格式可以分为attribs 、medicineused、extraattrib、skills、petgodbooks、seal、pet_tongyuan七部分
            //单独获取每一部分的数据
            //获取attribs里面的数据（基本属性）
            function attribsXMLToJSON(dom, obj) {

                //属性值为0的不用显示的属性
                var noShowArr = ["resist_earth", "resist_metal", "resist_wood", "resist_water", "resist_fire", "resist_poison", "resist_sleep", "resist_confusion", "resist_repress", "resist_cage", "resist_lock", "resist_lost", "resist_forgotten", "resist_frozen", "resist_melt"];//属性值为0的不用显示的属性
                //noSpanEleArr为不用套外层span标签的数据
                var noSpanEleArr = ["icon", "color", "property_bind_attrib", "recognize_recognized"];//不用套外层标签的属性
                var childrenNode = gy.getChildren(dom);
                var childrenNodeLength = childrenNode.length;
                var col = "";//把名字的颜色传递给rank属性
                var calv = "";//把默认阶位传递给阶位
                var retainintimacy = -1;
                if (childrenNodeLength > 0) {           
                var huanhuaTimes =0;
                var qianghuaTimes =0;
                    for (var i = 0; i < childrenNodeLength; i++) {
                        var nowNode = childrenNode[i];
                        var nowNodeName = childrenNode[i].nodeName.toLowerCase();
                        //这中情况为不用套外层标签的属性
                        if (noSpanEleArr.indexOf(nowNodeName) > -1) {
                            obj[nowNodeName] = gy.getxmlnodeText(nowNode);
                        } else {
                            if (nowNode.getAttribute('color')) {

                                if (noShowArr.indexOf(nowNodeName) > -1 && gy.getxmlnodeText(nowNode) == "0") {
                                    //这里是属性值为0 并且不用显示在面板上的属性，直接过掉
                                    continue;
                                }
                                //如果type属性里面存在颜色值，就给span标签加上样式
                                var color = gy.getColor(nowNode.getAttribute('color'));
                                col = color;
                                obj[nowNodeName] = "<span style=color:" + color + ">" + gy.getxmlnodeText(nowNode) + "</span>"
                            } else {
                                if (noShowArr.indexOf(nowNodeName) > -1 && gy.getxmlnodeText(nowNode) == "0") {
                                    continue;
                                }
                                if (nowNodeName == "name") {//默认颜色的名字
                                    if (ispetseals == "1") {
                                        obj[nowNodeName] = '<img src="/img.gyyxcdn.cn/qibao/Images/FlashImages/4575.png" alt=""/ style="display:inline-block;">&nbsp;<span style=color:#ffff00>' + gy.getxmlnodeText(nowNode) + '</span>';
                                    } else {
                                        obj[nowNodeName] = "<span style=color:#ffff00>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    }

                                } else if (nowNodeName == "rank") {//如果名字带颜色，把颜色传递给rank属性
                                    if (col == "#ff00ff") {
                                        obj[nowNodeName] = "<span style=color:" + col + ">(" + gy.getxmlnodeText(nowNode) + ")</span>"
                                    } else {
                                        obj[nowNodeName] = "<span style=color:#ffff00>(" + gy.getxmlnodeText(nowNode) + ")</span>"
                                    }
                                } else if (nowNodeName == "capacity_level") {
                                    calv = gy.getxmlnodeText(nowNode);
                                } else if (nowNodeName == "dunwu_left_times") {
                                    obj[nowNodeName] = "剩余顿悟次数(" + gy.getxmlnodeText(nowNode) + ")";
                                } else if (nowNodeName == "dunwu_total_times") {
                                    obj[nowNodeName] = "已免费获得顿悟次数(" + gy.getxmlnodeText(nowNode) + ")";
                                } else if (nowNodeName == "enchant") {//点化属性
                                    if( gy.getxmlnodeText(nowNode) == "点化完成"){
                                        obj['pet_enchant'] = "<span class='petenchant petencha'>点化完成</span>";
                                    }
                                    obj[nowNodeName] = "<span>" + gy.getxmlnodeText(nowNode) + "</span><img width='16' src='/img.gyyxcdn.cn/qibao/Images/FlashImages/6110.png' style=' left: 136px; top: 134px; position: absolute;'>";
                                } else if (nowNodeName == "eclosion") {//羽化属性
                                    if( gy.getxmlnodeText(nowNode) == "羽化完成"){
                                        obj['pet_eclosion'] = "<span class='peteclosion peteclo'>羽化完成</span>";
                                    }
                                    obj[nowNodeName] = "<span>" + gy.getxmlnodeText(nowNode) + "</span>"
                                } else if (nowNodeName == "merge_rate") {//融合完成率
                                    obj[nowNodeName] = "<span>融合完成率：" + gy.getxmlnodeText(nowNode) + "</span>"
                                } else if (nowNodeName == "default_capacity_level") {//阶位=总阶位-默认阶位
                                    if (calv - gy.getxmlnodeText(nowNode) == 0) {
                                        obj[nowNodeName] = gy.getxmlnodeText(nowNode) + "阶";
                                    } else {
                                        obj[nowNodeName] = gy.getxmlnodeText(nowNode) + '+' + (calv - gy.getxmlnodeText(nowNode) + "阶");
                                    }
                                } else if (nowNodeName == "important_item") {
                                    if (gy.getxmlnodeText(nowNode) == 1) {
                                        obj[nowNodeName] = "<img width='22' src='/img.gyyxcdn.cn/qibao/Images/FlashImages/iptitem.png' class='petiptimg'>";
                                    }
                                } else if (nowNodeName == "polar") {
                                    var polar_num = gy.getxmlnodeText(nowNode);
                                    if(polar_num == 1){
                                         obj['pet_polar'] = "<span class='petpolar petcwpolar1'>1</span>";
                                         obj['pet_polartit'] ="金";
                                         obj['pet_polarcont'] ="<span style='color:#00ff00;'>对木相性攻击提升40%</span></br><span style='color:#00ff00;'>受火相性攻击提升40%</span>";
                                    }else if(polar_num == 2){
                                         obj['pet_polar'] = "<span class='petpolar petcwpolar2'>2</span>";
                                         obj['pet_polartit'] ="木";
                                          obj['pet_polarcont'] ="<span style='color:#00ff00;'>土相性攻击提升40%</span></br><span style='color:#00ff00;'>受金相性攻击提升40%</span>";
                                    }else if(polar_num == 3){
                                        obj['pet_polar'] = "<span class='petpolar petcwpolar3'>3</span>";
                                        obj['pet_polartit'] ="水";
                                         obj['pet_polarcont'] ="<span style='color:#00ff00;'>对火相性攻击提升40%</span></br><span style='color:#00ff00;'>受土相性攻击提升40%</span>"; 
                                    }else if(polar_num == 4){
                                        obj['pet_polar'] = "<span class='petpolar petcwpolar4'>4</span>";
                                        obj['pet_polartit'] ="火";
                                         obj['pet_polarcont'] ="<span style='color:#00ff00;'>对金相性攻击提升40%</span></br><span style='color:#00ff00;'>受水相性攻击提升40%</span>";
                                    }else if(polar_num == 5){
                                         obj['pet_polar'] = "<span class='petpolar petcwpolar5'>5</span>";
                                         obj['pet_polartit'] ="土";
                                         obj['pet_polarcont'] ="<span style='color:#00ff00;'>对水相性攻击提升40%</span></br><span style='color:#00ff00;'>受木相性攻击提升40%</span>";
                                    }else{
                                        obj['pet_polar'] = "<span class='petpolar petcwpolar6'>6</span>";
                                        obj['pet_polartit'] ="物理";
                                        obj['pet_polarcont'] ="<span style='color:#00ff00;'>不受五行相性影响</span></br><span style='color:#00ff00;'>物理宠物之间的攻击提升40%</span>";
                                    }
                                    obj[nowNodeName] = '<img src="/img.gyyxcdn.cn/qibao/Images/FlashImages/' + petpolarArr[gy.getxmlnodeText(nowNode)] + '.png" alt="" style="width:12px; display: inline;padding: 0 0 0 5px;">&nbsp;';
                                } else if (nowNodeName == "zhanli_lv") {
                                    obj[nowNodeName] = "<span class='petzlimg'><img src='/img.gyyxcdn.cn/qibao/Images/FlashImages/" + zhanliArr[gy.getxmlnodeText(nowNode)] + ".png'></span></span>";
                                } else if (nowNodeName == "intimacy") {
                                	retainintimacy = gy.getxmlnodeText(nowNode);
                                } else if (nowNodeName == "retain_intimacy") {
                                	if(retainintimacy==-1){
                                		obj[nowNodeName]="" ;
                                	}else if (gy.getxmlnodeText(nowNode) == 1) {
		                                obj[nowNodeName] = retainintimacy + "<span style='color:#00ff00'>（保留）</span>"
		                            } else {
		                                obj[nowNodeName] = retainintimacy + "<span style='color:#ff2020'>（不保留）</span>"
		                            };
                                }else if (nowNodeName == "tongyuan_label"){
                                    if(gy.getxmlnodeText(nowNode)=="1"){
                                         obj[nowNodeName] = "仙霄玉宇";
                                          obj['cwspan'] = "<span class='cwspan typet tongyuan1'>1</span>";
                                    }else if(gy.getxmlnodeText(nowNode)=="2"){
                                         obj[nowNodeName] = "太古蛮荒";
                                          obj['cwspan'] = "<span class='cwspan typet tongyuan2'>1</span>";
                                    }else if(gy.getxmlnodeText(nowNode)=="3"){
                                         obj[nowNodeName] = "娑婆世界";
                                          obj['cwspan'] = "<span class='cwspan typet tongyuan3'>1</span>";
                                    }else if(gy.getxmlnodeText(nowNode)=="4"){
                                         obj[nowNodeName] = "昆墟寒野";
                                          obj['cwspan'] = "<span class='cwspan typet tongyuan4'>1</span>";
                                    }else if(gy.getxmlnodeText(nowNode)=="5"){
                                         obj[nowNodeName] = "东海鲸波";
                                          obj['cwspan'] = "<span class='cwspan typet tongyuan5'>1</span>";
                                    }else if(gy.getxmlnodeText(nowNode)=="6"){
                                        obj[nowNodeName] = "九黎洞天";
                                         obj['cwspan'] = "<span class='cwspan typet tongyuan6'>1</span>";
                                    }else if(gy.getxmlnodeText(nowNode)=="7"){
                                         obj[nowNodeName] = "阆苑仙阙";
                                          obj['cwspan'] = "<span class='cwspan typet tongyuan7'>1</span>";
                                    }else if(gy.getxmlnodeText(nowNode)=="8"){
                                         obj[nowNodeName] = "鬼域幽冥";
                                          obj['cwspan'] = "<span class='cwspan typet tongyuan8'>1</span>";
                                    }else if(gy.getxmlnodeText(nowNode)=="9"){
                                         obj[nowNodeName] = "天机秘府";
                                         obj['cwspan'] = "<span class='cwspan typet tongyuan9'>1</span>";
                                    }else if(gy.getxmlnodeText(nowNode)=="10"){
                                         obj[nowNodeName] = "万物有灵";
                                          obj['cwspan'] = "<span class='cwspan typet tongyuan10'>1</span>";
                                    }else if(gy.getxmlnodeText(nowNode)=="11"){
                                         obj[nowNodeName] = "流金岁月 ";
                                          obj['cwspan'] = "<span class='cwspan typet tongyuan11'>1</span>";
                                    }else{
                                        obj[nowNodeName] = "";
                                    }
                                }else if(nowNodeName =="phy_rebuild_level" ||nowNodeName =="mag_rebuild_level"){//强化属性
                                    obj[nowNodeName] = "<span>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    if (gy.getxmlnodeText(nowNode) == 0) {
                                        qianghuaTimes += parseInt(0);
                                    } else {
                                         qianghuaTimes += parseInt(gy.getxmlnodeText(nowNode));
                                    }
                                }else if(nowNodeName=="morph_life_times" || nowNodeName=="morph_mag_times" || nowNodeName=="morph_speed_times"|| nowNodeName=="morph_mana_times"||nowNodeName=="morph_phy_times"){
                                    //幻化
                                    obj[nowNodeName] = "<span>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    if (gy.getxmlnodeText(nowNode) == 0) {
                                        huanhuaTimes += parseInt(0);
                                    } else {
                                        huanhuaTimes +=  parseInt(gy.getxmlnodeText(nowNode));
                                    }
                                }else if(nowNodeName =="mount_type"){
                                    if(gy.getxmlnodeText(nowNode) == "精怪"){
                                        obj['pet_mounttype'] = "<span class='petmounttype pet_mountjg'>精怪</span>";
                                    }
                                    if(gy.getxmlnodeText(nowNode) == "御灵"){
                                        obj['pet_mounttype'] = "<span class='petmounttype pet_mountyl'>御灵</span>";
                                    }
                                }else if(nowNodeName =="raw_rank"){
                                    var raw_rankTxts = gy.getxmlnodeText(nowNode);
                                    if( raw_rankTxts == 1){
                                        obj['pet_primarypro'] = "<span class='petprimarypro petwild'>1</span>";
                                    }else if(raw_rankTxts == 8){
                                        obj['pet_primarypro'] = "<span class='petprimarypro petghost'>8</span>";
                                    }
                                }else {
                                    obj[nowNodeName] = "<span>" + gy.getxmlnodeText(nowNode) + "</span>"
                                    //if (gy.getxmlnodeText(nowNode) > 0) {//清除0数值
                                    //    obj[nowNodeName] = "<span>" + gy.getxmlnodeText(nowNode) + "</span>"
                                    //}
                                    //羽化冻结
                                    if(dom.getElementsByTagName('eclosion_blocked').length > 0){
                                        if(dom.getElementsByTagName('eclosion').length > 0){
                                            var eclosion_blockedTxt = $(dom.getElementsByTagName('eclosion_blocked')[0]).text();
                                            var eclosion_text = gy.getxmlnodeText(dom.getElementsByTagName("eclosion")[0]);
                                            if(eclosion_blockedTxt == 1 ){
                                                    obj['eclosion'] = "<span style='color:#666'> "+eclosion_text+" · 冻结</span>";
                                            }
                                        }
                                       
                                    }
                                   if(dom.getElementsByTagName('polar').length == 0){
                                        obj['pet_polar'] = "<span class='petpolar petcwpolar6'>6</span>";
                                         obj['pet_polartit'] ="物理";
                                        obj['pet_polarcont'] ="<span style='color:#00ff00;'>不受五行相性影响</span></br><span style='color:#00ff00;'>物理宠物之间的攻击提升40%</span>";
                                   }
                                     //单独处理宝宝原始类型
                                    var babay_ranklen = dom.getElementsByTagName('rank').length;
                                    var baby_mount_typelen = dom.getElementsByTagName('mount_type').length;
                                    var raw_ranklen = dom.getElementsByTagName('raw_rank').length;
                                    if(babay_ranklen > 0 && baby_mount_typelen == 0 && raw_ranklen > 0){
                                    var babay_rank = $(dom.getElementsByTagName('rank')[0]).text();
                                    var raw_rankTxt = $(dom.getElementsByTagName('raw_rank')[0]).text();
                                        if(babay_rank.indexOf("普通") > -1){
                                            if (raw_rankTxt == 2 || raw_rankTxt == 3 || raw_rankTxt == 4 || raw_rankTxt == 5 || raw_rankTxt == 6 || raw_rankTxt == 7 || raw_rankTxt == 9 || raw_rankTxt == 10 || raw_rankTxt == 11) {
                                                obj['pet_primarypro'] = "<span class='petprimarypro petbaby'>2</span>";
                                            }
                                        }
                                    }
                                    
                                   
                                }
                                if(qianghuaTimes>0){
                                    obj['pet_qianghua'] = "<span class='petqianghua petqiang'>6</span>";
                                } 
                                if(huanhuaTimes>0){
                                    obj['pet_huanhua'] = "<span class='pethuanhua pethuan'>6</span>";
                                } 
                            }
                        }
                        
                    }
                    
                }
                return obj;
            }

            //获取medicineused里面的数据（服用过量的药物）
            function medicineusedXMLToJSON(dom, str) {
                //服用药品的类型
                var medicineusedType = { "baohua-yuluwan": "宝花玉露丸", "sanqingwan": "三清丸", "jiuzhuan-xianlinglu": "九转仙灵露" };
                var childrenNode = gy.getChildren(dom);
                var childrenNodeLength = childrenNode.length;
                if (childrenNodeLength > 0) {
                    for (var i = 0; i < childrenNodeLength; i++) {
                        var nowNode = childrenNode[i];
                        var nowNodeName = childrenNode[i].nodeName.toLowerCase();

                        if (nowNode.getAttribute('color')) {
                            //存在type属性color的时候
                            var color = gy.getColor(nowNode.getAttribute('color'));
                            str += "<span stlye=" + color + ">" + medicineusedType[nowNodeName] + "(" + gy.getxmlnodeText(nowNode) + ")颗</span>";
                        } else {
                            //否则根据节点名称获取药品的名称
                            str += "<span>" + medicineusedType[nowNodeName] + "(" + gy.getxmlnodeText(nowNode) + ")颗</span>";
                        }
                    }
                }
                return str;
            }

            //获取seal里面的数据（封印属性）
            function sealXMLToJSON(dom, str) {
                var childrenNode = gy.getChildren(dom);
                var childrenNodeLength = childrenNode.length;
                var seallv = "", sealname = "";
                ispetseals = 1;
                if (childrenNodeLength > 0) {
                    for (var i = 0; i < childrenNodeLength; i++) {
                        var nowNode = childrenNode[i];
                        var nowNodeName = childrenNode[i].nodeName.toLowerCase();
                        if (nowNodeName == "level") {
                            seallv = gy.getxmlnodeText(nowNode) + "级&nbsp;&nbsp;";
                        } else if (nowNodeName == "name") {
                            if (nowNode.getAttribute('color')) {
                                //存在type属性color的时候
                                var color = gy.getColor(nowNode.getAttribute('color'));
                                str += '<span style=color:#ff00ff>封印法宝：' + gy.getxmlnodeText(nowNode) + '&nbsp;&nbsp;' + seallv;
                            } else {
                                str += "<span style=color:#ff00ff>封印法宝：" + gy.getxmlnodeText(nowNode) + "&nbsp;&nbsp;" + seallv;
                            }
                        } else if (nowNodeName == "polar") {
                            str += polarArr[gy.getxmlnodeText(nowNode)] + "相性</span>"
                        }
                    }
                }
                return str;
            }

            //获取extraattrib里面的数据（妖石）
            function extraattribXMLToJSON(dom, str) {
                if (dom.parentNode.nodeName.toLowerCase() != "extra_attribs") {
                    var childrenNode = gy.getChildren(dom);
                    var childrenNodeLength = childrenNode.length;
                    if (childrenNodeLength > 0) {
                        for (var i = 0; i < childrenNodeLength; i++) {
                            var nowNode = childrenNode[i];
                            var nowNodeName = childrenNode[i].nodeName.toLowerCase();
                            if (nowNode.getAttribute('color')) {
                                var color = gy.getColor(nowNode.getAttribute('color'));
                                str += "<span stlye=" + color + ">" + nowNodeName + "(" + gy.getxmlnodeText(nowNode) + ")</span>";
                            } else {
                                str += "<span>" + nowNodeName + "(" + gy.getxmlnodeText(nowNode) + ")</span>";
                            }
                        }
                    }
                } else {
                    var petrenexzts = gy.getChildren(dom.parentNode.parentNode.getElementsByTagName("extra_attribs")[0]);
                    var petnimbus = "", petnimbusname = "", maxlifts = "", pembname = "";
                    for (var k = 0; k < petrenexzts.length; k++) {
                        for (var o = 0; o < petrenexzts[k].childNodes.length; o++) {
                            var petcex = petrenexzts[k].childNodes[o];
                            var petcexN = petrenexzts[k].childNodes[o].nodeName.toLowerCase();
                            switch (petcexN) {
                                case "name":
                                    if (gy.getxmlnodeText(petcex) == "凝香幻彩") {
                                        pembname += gy.getxmlnodeText(petcex);
                                        petnimbusname += "<span class='ystone'>" + gy.getxmlnodeText(petcex) + "&nbsp;(&nbsp;" + maxlifts;
                                    } else if (gy.getxmlnodeText(petcex) == "风寂云清") {
                                        pembname += gy.getxmlnodeText(petcex);
                                        petnimbusname += "<span class='ystone'>" + gy.getxmlnodeText(petcex) + "&nbsp;(&nbsp;" + maxlifts;
                                    } else if (gy.getxmlnodeText(petcex) == "冰落残阳") {
                                        pembname += gy.getxmlnodeText(petcex);
                                        petnimbusname += "<span class='ystone'>" + gy.getxmlnodeText(petcex) + "&nbsp;(&nbsp;" + maxlifts;
                                    } else {
                                        str += "<span class='ystone'>" + gy.getxmlnodeText(petcex) + "&nbsp;(&nbsp;";
                                    }
                                    maxlifts = "";
                                    break
                                case "nimbus":
                                    if (pembname == "凝香幻彩") {
                                        str += petnimbusname + "灵气：" + gy.getxmlnodeText(petcex) + "&nbsp;)&nbsp;&nbsp;&nbsp;";
                                    } else if (pembname == "风寂云清") {
                                        str += petnimbusname + "灵气：" + gy.getxmlnodeText(petcex) + "&nbsp;)&nbsp;&nbsp;&nbsp;";
                                    } else if (pembname == "冰落残阳") {
                                        str += petnimbusname + "灵气：" + gy.getxmlnodeText(petcex) + "&nbsp;)&nbsp;&nbsp;&nbsp;";
                                    } else {
                                        petnimbus += "灵气：" + gy.getxmlnodeText(petcex);
                                    }
                                    pembname = "";
                                    petnimbusname = "";
                                    break
                                case "max_life":
                                    maxlifts += "气血：" + gy.getxmlnodeText(petcex) + "&nbsp;&nbsp;" + petnimbus;
                                    break
                                case "def":
                                    maxlifts += "防御：" + gy.getxmlnodeText(petcex) + "&nbsp;&nbsp;" + petnimbus;
                                    break
                                case "max_mana":
                                    maxlifts += "法力：" + gy.getxmlnodeText(petcex) + "&nbsp;&nbsp;" + petnimbus;
                                    break
                                case "speed":
                                    str += "速度：" + gy.getxmlnodeText(petcex) + "&nbsp;&nbsp;" + petnimbus + "&nbsp;)&nbsp;&nbsp;&nbsp;";
                                    petnimbus = "";
                                    break
                                case "power":
                                    str += "伤害：" + gy.getxmlnodeText(petcex) + "&nbsp;&nbsp;" + petnimbus + "&nbsp;)&nbsp;&nbsp;&nbsp;";
                                    petnimbus = "";
                                    break
                            }
                        }
                    }
                }
                return str;
            }

            //获取skills里面的数据（技能）
            function skillsXMLToJSON(dom, obj) {
                var childrenNode = gy.getChildren(dom);
                var childrenNodeLength = childrenNode.length;
                if (childrenNodeLength > 0) {
                    //技能里面分五大技能类别 分别定义技能对象下面的5个技能属性
                    obj['innateskills'] = ""; //天生技能
                    obj['talentskills'] = ""; //天赋技能
                    obj['reincarnationskills'] = "";//轮回技能
                    obj['ghostpetskills'] = "";//鬼宠技能
                    obj['epiphanyskills'] = "";//顿悟技能
                    obj['teachingskills'] = "";//师门技能
                    obj['heartskills'] = "";//心法技能
                    obj['hunshoustone'] = "";//魂兽石
                    for (var i = 0; i < childrenNodeLength; i++) {
                        var nowNode = childrenNode[i];
                        var nowNodeName = childrenNode[i].nodeName.toLowerCase();
                        var nowNodeType = nowNode.getAttribute('type');
                        //根据节点的type属性判断当前是那一个技能类别
                        var color = nowNode.getAttribute('color');
                        switch (nowNodeType) {
                            case "天生技能":
                                obj['innateskills'] += "<span>" + nowNodeName + "(" + gy.getxmlnodeText(nowNode) + ")</span>";
                                break;
                            case "天赋技能":
                                //判断当前存不存在color属性
                                if (color) {
                                    obj['talentskills'] += "<span style=color: " + gy.getColor(color) + ">" + nowNodeName + "(" + gy.getxmlnodeText(nowNode) + ")</span>";
                                } else {
                                    obj['talentskills'] += "<span>" + nowNodeName + "(" + gy.getxmlnodeText(nowNode) + ")</span>";
                                }
                                break;
                            case "轮回技能":
                                obj['reincarnationskills'] += "<span>" + nowNodeName + "(" + gy.getxmlnodeText(nowNode) + ")</span>";
                                break;
                            case "鬼宠技能":
                                obj['ghostpetskills'] += "<span>" + nowNodeName + "(" + gy.getxmlnodeText(nowNode) + ")</span>";
                                break;
                            case "顿悟技能":
                                obj['epiphanyskills'] += "<span>" + nowNodeName + "(" + gy.getxmlnodeText(nowNode) + ")</span>";
                                break;
                            case "师门技能":
                                obj['teachingskills'] += "<span>" + nowNodeName + "(" + gy.getxmlnodeText(nowNode) + ")</span>";
                                break;
                            case "心法技能":
                                obj['heartskills'] += "<span>" + nowNodeName + "(" + gy.getxmlnodeText(nowNode) + ")</span>";
                                break;
                            case "魂兽石":
                                if (color) {
                                    obj['hunshoustone'] += "<span style=color:" + gy.getColor(color) + ">" + nowNodeName + "(" + gy.getxmlnodeText(nowNode) + ")</span>";
                                } else {
                                    obj['hunshoustone'] += "<span>" + nowNodeName + "(" + gy.getxmlnodeText(nowNode) + ")</span>";

                                }
                                break;
                        }
                    }

                    //当其中某一项技能为空的时候 就直接删除当前技能选项
                    if (obj['innateskills'] == "") delete obj['innateskills'];
                    if (obj['talentskills'] == "") delete obj['talentskills'];
                    if (obj['reincarnationskills'] == "") delete obj['reincarnationskills'];
                    if (obj['ghostpetskills'] == "") delete obj['ghostpetskills'];
                    if (obj['epiphanyskills'] == "") delete obj['epiphanyskills'];
                    if (obj['mumbojumboskills'] == "") delete obj['mumbojumboskills'];
                    if (obj['heartskills'] == "") delete obj['heartskills'];
                    if (obj['hunshoustone'] == "") delete obj['hunshoustone'];
                }
                return obj;
            }

            //获取petgodbooks里面的数据（技能书）
            function petgodbooksXMLToJSON(dom) {
                var noSpanEleArr = ["icon", "color", "polar", "property_bind_attrib", "recognize_recognized"];
                var childrenNode = gy.getChildren(dom);
                var childrenNodeLength = childrenNode.length;
                var nowStr = {};//定义天书技能对象 里面可能包含多种天书技能（每种技能又包含各自的技能属性）
                var bkclo = "";
                /**
                 * goodbooks标签下的一级标签为goodbook是一个天书技能
                 * goodbook下的节点标签为当前天书技能的属性
                 * */
                if (childrenNodeLength > 0) {
                    //遍历天书技能的长度
                    for (var i = 0; i < childrenNodeLength; i++) {
                        nowStr[i] = {}; //第i个天书技能

                        var nowNode = childrenNode[i];

                        var nowNode_children = gy.getChildren(nowNode);

                        var nowNode_children_length = nowNode_children.length;
                        //遍历当前天书技能的属性
                        for (var j = 0; j < nowNode_children_length; j++) {
                            var nowEleNode = nowNode_children[j];
                            var nowEleNodeName = nowNode_children[j].nodeName.toLowerCase();
                            if (noSpanEleArr.indexOf(nowEleNodeName) > -1) {
                                if (nowEleNodeName == "color") {
                                    nowStr[i][nowEleNodeName] = gy.getColor(gy.getxmlnodeText(nowEleNode));
                                    bkclo = gy.getColor(gy.getxmlnodeText(nowEleNode));
                                } else {
                                    nowStr[i][nowEleNodeName] = gy.getxmlnodeText(nowEleNode);
                                }
                            } else {
                                var color = "";
                                //nowEle.getAttribute('color') 看当前节点 有没有自己单独的color值，有的话就获取
                                nowEleNode.getAttribute('color') ? color = gy.getColor(nowEleNode.getAttribute('color')) : color = color;

                                //看当前节点有没有重复的，有的话就把当前的值拼接到之前的值上（加span标签就是辨别不同的属性）
                                if (nowStr[i].hasOwnProperty(nowEleNodeName)) {
                                    //nowEle.getAttribute('type') 看有没有type属性，部分存在type属性，其中存放的文字信息
                                    nowEleNode.getAttribute('type') ? nowStr[i][nowEleNodeName] += "<br/><span style=color:" + color + ">" + nowEleNode.getAttribute('type').replace(/%s%|%s|s/, gy.getxmlnodeText(nowEleNode)) + "</span>" : nowStr[i][nowEleNodeName] += "<span style=color:" + color + ">" + gy.getxmlnodeText(nowEleNode) + "</span>";
                                } else {
                                    if (nowEleNodeName == "name") {
                                        nowEleNode.getAttribute('type') ? nowStr[i][nowEleNodeName] = "<span style=color:" + bkclo + ">" + nowEleNode.getAttribute('type').replace(/%s%|%s|s/, gy.getxmlnodeText(nowEleNode)) + "</span>" : nowStr[i][nowEleNodeName] = "<br/><span style=color:" + bkclo + ">" + gy.getxmlnodeText(nowEleNode) + "</span>";
                                    } else if (nowEleNodeName == "level") {
                                        nowEleNode.getAttribute('type') ? nowStr[i][nowEleNodeName] = "<span style=color:" + bkclo + ">" + nowEleNode.getAttribute('type').replace(/%s%|%s|s/, gy.getxmlnodeText(nowEleNode)) + "</span>" : nowStr[i][nowEleNodeName] = "<span style=color:" + bkclo + ">(" + gy.getxmlnodeText(nowEleNode) + "级</span>";
                                    } else if (nowEleNodeName == "nimbus") {
                                        nowEleNode.getAttribute('type') ? nowStr[i][nowEleNodeName] = "<span style=color:" + bkclo + ">" + nowEleNode.getAttribute('type').replace(/%s%|%s|s/, gy.getxmlnodeText(nowEleNode)) + "</span>" : nowStr[i][nowEleNodeName] = "<span style=color:" + bkclo + ">" + gy.getxmlnodeText(nowEleNode) + "灵气)</span>";
                                    } else {
                                        nowEleNode.getAttribute('type') ? nowStr[i][nowEleNodeName] = "<span style=color:" + color + ">" + nowEleNode.getAttribute('type').replace(/%s%|%s|s/, gy.getxmlnodeText(nowEleNode)) + "</span>" : nowStr[i][nowEleNodeName] = "<span style=color:" + color + ">" + gy.getxmlnodeText(nowEleNode) + "</span>";
                                    }

                                }
                            }

                        }
                    }
                }
                //将得到的对象nowStr转换成我们所需要的字符串
                var GBString = ""
                var GBtemplate = "<div style='color:#ffff00'>@name@　@level@　@nimbus@</div>@attrib@";
                for (var k in nowStr) {
                    GBString += GBtemplate.replace(/@([\w_-]*)@/g, function (a, b) {
                        //如果json存在当前数据就返回这个数据，没有就返回空值并且把这个值放进数组
                        if (nowStr[k].hasOwnProperty(b)) {

                            return nowStr[k][b];
                        } else {
                            if (b == "attrib" || b == "level" || b == "nimbus") return "";
                            return "0";
                        }
                    });
                }
                //返回这个字符串
                return GBString;
            }
            //获取同源属性的内容
            function pet_tongyuanXMLToJSON(dom, obj) {
                var childrenNode = gy.getChildren(dom);
                var childrenNodeLength = childrenNode.length;
                if (childrenNodeLength > 0) {
                    obj['attrib'] = "";
                    for (var i = 0; i < childrenNodeLength; i++) {
                        var nowNode = childrenNode[i];
                        var nowNodeName = childrenNode[i].nodeName.toLowerCase();
                        var color = gy.getColor(nowNode.getAttribute('color'));
                        if (nowNodeName == "attrib") {
                            nowNode.getAttribute('type') ? obj[nowNode.nodeName.toLowerCase()] += "<span style=color:" + color + ">" + nowNode.getAttribute('type').replace(/%s%|%s/, gy.getxmlnodeText(nowNode)) + "</span></br>" : obj[nowNode.nodeName.toLowerCase()] += "<span style=color:" + color + ">" + gy.getxmlnodeText(nowNode) + "</span></br>";
                        }

                    }
                }
                return obj;
            }
            //引藏经典服中战力
            if ($("#hidclassicOrderType").val() == "经典区") {
                $(".petzlimg,.pet_classicHidden").hide();
            }

            //传入两个参数 ①一个json数据 ②一个html模板结构  绑定json数据到模板上然后返回一个jquery对象
            function compiled(JSONdata) {
                var hasNoneArr = []; //保存模板中有的标签 而json中没有的数据


                //property_bind_attrib 绑定属性字段含义:0尚未绑定、1认主转绑定中、2正在清除绑定、3临时绑定、4永久绑定
                var propertybindattribArr = ["尚未绑定", '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6117.png" style=" left: 117px; top: 136px; width:16px; height:16px; position: absolute;">', '<img width="16" src="/Images/FlashImages/6115.png" style=" left: 117px; top: 136px; width:16px; height:16px; position: absolute;">', '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6113.jpg" style=" left: 117px; top: 136px; width:16px; height:16px; position: absolute;">', '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6111.png" style=" left: 117px; top: 136px; width:16px; height:16px; position: absolute;">'];

                //recognize_recognized 认主属性字段含义 0、尚未认主、1认主中、2正在清除认主
                var recognizeArr = ["尚未认主", "认主中", "正在清除认主"];
                /*  //让图片加载完成之后在绑定数据添加DOM
                 //创建image对象
                 var image = new Image();
                 //定义图片地址
                 image.src = "/Images/BigItemImages/"+JSONdata.icon+".jpg";
                 //图片加载完毕之后匹配模版
                 image.onload = function(){*/

                //匹配模板
                var tempString = templateString.pet;
                var compiledString = tempString.replace(/@([\w_-]*)@/g, function (a, b) {
                    //如果json存在当前数据就返回这个数据，没有就返回空值并且把这个值放进数组
                    if (b == "medicine_used") {

                        if (JSONdata["medicine_used"]) return JSONdata["medicine_used"];
                        hasNoneArr.push(b);
                        return "";

                    } else if (b == "extra_attrib") {

                        if (JSONdata["extra_attrib"]) return JSONdata["extra_attrib"];
                        hasNoneArr.push(b);
                        return "";

                    } else if (b == "seal") {
                        if (JSONdata["seal"]) return JSONdata["seal"];
                        hasNoneArr.push(b);
                        return "";

                    } else if (b == "innateskills" || b == "talentskills" || b == "hunshoustone" || b == "reincarnationskills" || b == "epiphanyskills" || b == "ghostpetskills" || b == "teachingskills" || b == "heartskills") {

                        if (JSONdata["skills"][b]) return JSONdata["skills"][b];
                        hasNoneArr.push(b);
                        return "";

                    } else if (b == "pet_godbooks") {
                        return JSONdata[b];
                    } else if(b == "pet_tongyuan"){
                         if (JSON.stringify(JSONdata[b]) != "{}"){
                             return JSONdata[b]["attrib"];
                         }else {
                             hasNoneArr.push(b);
                             return "";
                         }
                    }else {
                        if (JSONdata["attribs"].hasOwnProperty(b)) {
                            if (b == "property_bind_attrib") {
                                return propertybindattribArr[JSONdata["attribs"][b]]
                            }
                            if (b == "recognize_recognized") {
                                return recognizeArr[JSONdata["attribs"][b]]
                            }
                            return JSONdata["attribs"][b];
                        } else {
                            if (b == "color" || b == "icon" || b == "exp_to_next_level" || b == "max_durability" || b == "important_item" || b == "property_left_time" || b == "property_bind_attrib" || b == "dunwu_total_times" || b == "zhanli_score" || b == "zhanli_lv" || b == "intimacy"||b=="retain_intimacy") {
                                return "";
                            }
                            hasNoneArr.push(b);
                            return "";
                        }
                    }
                });
                //调用gy.parseHTML方法，将匹配好的html字符串转换为html文档对象
                var domCompiledString = gy.parseHTML(compiledString);
                /*var oDiv = document.createElement('div'); //创建div
                 oDiv.innerHTML = compiledString; //给div赋值
                 var domCompiledString = oDiv.children[0]; //间接得到dom对象*/

                //魂兽石PVE属性描述 魂兽石PVP属性描述 这两个属性要显示在一个标签里面，如果两个属性都不存在的话就移除这个标签
                if (hasNoneArr.indexOf("inborn_stone_attrib_pve") != -1 && hasNoneArr.indexOf("inborn_stone_attrib_pvp") != -1) {
                    var nowNodeinborn_stone = gy.getByClass("inborn_stone_attrib_pve", domCompiledString)[0];
                    nowNodeinborn_stone.parentNode.removeChild(nowNodeinborn_stone);
                }
                //从数组中删除这两项
                hasNoneArr.removeFromArr("inborn_stone_attrib_pve");
                hasNoneArr.removeFromArr("inborn_stone_attrib_pvp");


                //然后遍历数组 删除没有数据的标签
                var i = 0, aLength = hasNoneArr.length;
                for (i; i < aLength; i++) {
                    var nowEle = gy.getByClass(hasNoneArr[i], domCompiledString)[0];
                    if(nowEle!=undefined){
                         nowEle.parentNode.removeChild(nowEle);
                    }
                   
                }

                //遍历生成的DOM树 将innerHTML为空的dd节点隐藏掉
                var renwuDD = domCompiledString.getElementsByTagName('dd');
                var renwuDD_length = renwuDD.length;
                for (var n = 0; n < renwuDD_length; n++) {
                    if (gy.getInnerText(renwuDD[n]) == "") {
                        var nowDelDl = renwuDD[n].parentNode;
                        nowDelDl.style.display = "none";
                    };
                }

                //遍历生成的DOM树 将innerHTML为空的div节点隐藏掉
                var renwuDIV = domCompiledString.getElementsByTagName('div');
                var renwuDIV_length = renwuDIV.length;
                for (var p = 0; p < renwuDIV_length; p++) {
                    if (gy.getInnerText(renwuDIV[p]) == "") {
                        renwuDIV[p].style.display = "none";
                    };
                }

                daojuShowDetailInfo.appendChild(domCompiledString); //添加到dom中
                par.setAttribute("isGetXmlAjax", "true");//加载成功后 给他一个自定义属性，根据这个属性判断第二次就不需要加载ajax了
                // }

            }
        }
    }
})();
 function getQuery(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
            r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return r[2];
        }
        return null;
};
