<%if request.querystring="v=2.3.4" then    server.transfer("XmlRoleView.js_v=2.3.4") %>﻿/*-------------------------------------------------------------------------
 * 2017-2-27 by ligen
 * 独立角色xml解析
 -------------------------------------------------------------------------*/

(function () {
    /*这里查询登录的用户信息*/
    var tongyuan_labelText = "";
    window.Xmlroleview = {
        roleviewCallBack: function (data, par, zhanliArr, stoneslot, polarArr, suitpolarArr) {
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
            //7：人物详情 执行ajax请求xml成功后回调函数
            //data为请求成功后返回的xml文档
            //执行getInnerNodeText方法 取得xml信息并返回json对象
            var JSONdata = getInnerNodeText(data);
            //执行compiled方法 传入json以及模板 执行拼接字符串方法
            compiled(JSONdata, data.getElementsByTagName("equip")[0].getElementsByTagName("item"));
            //传一个参数最外层dom节点对象main，获取文档中所有节点的值 返回一个JSON对象
            function getInnerNodeText(main) {
                var htmlObjVal = {};
                eachInnerNode(arguments[0], htmlObjVal);
                //console.log(htmlObjVal)
                return htmlObjVal;
            }
            //查找对象main下的所有元素节点对象
            //参数①：最外层节点对象main1
            //参数②：一个空对象，用来存放innerHTML
            function eachInnerNode(main1, obj1) {
                var main = arguments[0]; //保存第一个参数
                var obj = arguments[1];  //保存第二个参数
                /**-----------------------------人物基础信息-----------------------------**/
                var roleInfo = main.getElementsByTagName("role")[0].getElementsByTagName("attribs")[0];
                var main_children = gy.getChildren(roleInfo); //获取最外层节点的所有子节点
                var aLength = main_children.length; //当前子节点的长度
                var i = 0;
                var color = "", exp_1 = 0, exp_2 = 0, exp_3 = 0, isexp = 0, expele = 0, expspan = ""; //保存单独的颜色值(比如：描述性文字中部分颜色和name的颜色不一样需要单独处理)
                //遍历所有的子代元素，看其还有没有子代，如果有的话继续遍历子代，没有的话就返回当前元素的innerHTML
                for (i; i < aLength; i++) {
                    //nowEle 遍历中当前的节点
                    var nowEle = main_children[i];
                    //当前节点的子节点长度
                    var bLength = gy.getChildren(nowEle).length;
                    //根据当前节点的子节点长度判断，如果子节点长度大于0 就继续遍历，没有子节点的话 就获取他的innerHTML
                    if (bLength > 0) {
                        arguments.callee(nowEle, obj); //继续执行当前函数
                    } else {
                        //nowEleNodeName 当前节点的名称
                        var nowEleNodeName = nowEle.nodeName.toLowerCase();
                        var si = gy.getxmlnodeText(nowEle);
                        // console.log("人物基础信息--" + nowEleNodeName);
                        if (nowEleNodeName == "icon") {//一般角色图片
                            obj[nowEle.nodeName.toLowerCase()] = '<img src="/img.gyyxcdn.cn/qibao/Images/bigItemImages/' + gy.getxmlnodeText(nowEle) + '.png" style="height:125px;">';
                        } else if (nowEleNodeName == "suit_icon") {//套装角色图片
                            if (si != "861401" && si != "861403" && si != "861405" && si != "861503" && si != "861505" && si != "871401" && si != "871402" && si != "871404" && si != "871405" && si != "861403" && si != "871501" && si != "871505") {
                                obj[nowEle.nodeName.toLowerCase()] = '<img src="/img.gyyxcdn.cn/qibao/Images/bigItemImages/' + gy.getxmlnodeText(nowEle) + '.png" style="height:150px; position:absolute; top:-12px;">';
                            } else {
                                obj[nowEle.nodeName.toLowerCase()] = '<img src="/img.gyyxcdn.cn/qibao/Images/bigItemImages/' + gy.getxmlnodeText(nowEle) + '.png" style="height:150px; position:absolute; top:-12px;left:-27px;" class="widic">';
                            }
                        } else if (nowEleNodeName == "show_icon") {//变身卡角色图片
                            if (gy.getxmlnodeText(nowEle) != "0") {
                                obj[nowEle.nodeName.toLowerCase()] = '<img src="/img.gyyxcdn.cn/qibao/Images/bigItemImages/' + gy.getxmlnodeText(nowEle) + '.png" style="height:125px;">';
                            }
                        } else if (nowEleNodeName == "zhanli_lv") {
                            obj[nowEle.nodeName.toLowerCase()] = '<img src="/img.gyyxcdn.cn/qibao/Images/FlashImages/' + zhanliArr[gy.getxmlnodeText(nowEle)] + '.png">'
                        } else if (nowEleNodeName == "zhanli_lv_backup") {
                            obj[nowEle.nodeName.toLowerCase()] = '<img src="/img.gyyxcdn.cn/qibao/Images/FlashImages/' + zhanliArr[gy.getxmlnodeText(nowEle)] + '.png">'
                        } else if (nowEleNodeName == "max_life" || nowEleNodeName == "max_life_backup") {
                            obj[nowEle.nodeName.toLowerCase()] = '<span class="lifeexphp" style="width:93px;"><span id="perrdcwhp" style="width:100.0%">&nbsp;</span></span><span class="lifehp">' + gy.getxmlnodeText(nowEle) + '</span>';
                        } else if (nowEleNodeName == "max_mana" || nowEleNodeName == "max_mana_backup") {
                            obj[nowEle.nodeName.toLowerCase()] = '<span class="lifeexpmn" style="width:93px;"><span id="perrdcwmn" style="width:100.0%">&nbsp;</span></span><span class="lifemn">' + gy.getxmlnodeText(nowEle) + '</span>';
                        } else if (nowEleNodeName == "exp") {
                            obj[nowEle.nodeName.toLowerCase()] = gy.getxmlnodeText(nowEle);
                            exp_1 = gy.getxmlnodeText(nowEle);
                        } else if (nowEleNodeName == "exp_to_next_level") {
                            obj[nowEle.nodeName.toLowerCase()] = gy.getxmlnodeText(nowEle);
                            exp_2 = gy.getxmlnodeText(nowEle);
                        } else if (nowEleNodeName == "exp_to_next_level_ex") {
                            obj[nowEle.nodeName.toLowerCase()] = gy.getxmlnodeText(nowEle);
                            isexp = 1;
                            exp_3 = gy.getxmlnodeText(nowEle);
                        } else if (nowEleNodeName == "upgrade_immortal" || nowEleNodeName == "upgrade_immortal_backup") {
                            if (exp_3 == 0) {
                                expele = exp_1 + "/" + exp_2 + " (" + (exp_1 * 100 / parseInt(exp_2)).toFixed(1) + "%)";//角色经验百分比
                                expspan = '<span class="rd2sp rd2ab" style="width:231px; z-index:10;">' + expele + '</span> '
                            } else {
                                expele = exp_1 + "/" + (exp_3 * 2100000000 + parseInt(exp_2)) + " (" + (exp_1 * 100 / (exp_3 * 2100000000 + parseInt(exp_2))).toFixed(1) + "%)";//角色经验百分比
                                expspan = '<span class="rd2sp rd2ab" style="width:231px; z-index:10;">' + expele + '</span> '
                            }
                            obj[nowEle.nodeName.toLowerCase()] = gy.getxmlnodeText(nowEle) + expspan
                        } else if (nowEleNodeName == "pet_capcity") {
                            obj[nowEle.nodeName.toLowerCase()] = gy.getxmlnodeText(nowEle) + '</span>';
                        } else {
                            nowEle.getAttribute('type') ? obj[nowEle.nodeName.toLowerCase()] = nowEle.getAttribute('type').replace(/%s%|%s/, gy.getxmlnodeText(nowEle)) : obj[nowEle.nodeName.toLowerCase()] = gy.getxmlnodeText(nowEle);
                        }
                    }
                    if (main.getElementsByTagName("role")[0].getElementsByTagName("attribs")[0].getElementsByTagName("pet_capcity").length == 0) {
                        obj["pet_capcity"] = '8</span>';
                    }
                }

                /**-----------------------------人物悟道信息-----------------------------**/
                var roleInfo = main.getElementsByTagName("role")[0].getElementsByTagName("wudao")[0];
                if (roleInfo != undefined) {
                    var main_children = gy.getChildren(roleInfo); //获取最外层节点的所有子节点
                    var aLength = main_children.length; //当前子节点的长度
                    var i = 0;
                    //遍历所有的子代元素，看其还有没有子代，如果有的话继续遍历子代，没有的话就返回当前元素的innerHTML
                    for (i; i < aLength; i++) {
                        //nowEle 遍历中当前的节点
                        var nowEle = main_children[i];
                        //当前节点的子节点长度
                        var bLength = gy.getChildren(nowEle).length;
                        //根据当前节点的子节点长度判断，如果子节点长度大于0 就继续遍历，没有子节点的话 就获取他的innerHTML
                        if (bLength > 0) {
                            arguments.callee(nowEle, obj); //继续执行当前函数
                        } else {
                            nowEle.getAttribute('type') ? obj["wudao_" + nowEle.nodeName.toLowerCase()] = nowEle.getAttribute('type').replace(/%s%|%s/, gy.getxmlnodeText(nowEle)) : obj["wudao_" + nowEle.nodeName.toLowerCase()] = gy.getxmlnodeText(nowEle);
                        }
                        if (main.getElementsByTagName("role")[0].getElementsByTagName("wudao")[0].getElementsByTagName("extra_attrib").length == 0) {
                            obj["wudao_extra_attrib"] = "无";
                        }
                        if (main.getElementsByTagName("role")[0].getElementsByTagName("wudao")[0].getElementsByTagName("backup_extra_attrib").length == 0) {
                            obj["wudao_backup_extra_attrib"] = "无";
                        }
                    }
                }
                /**-----------------------------人物阵型信息-----------------------------**/
                obj['zhenxing'] = {}; //阵型
                //找到zhenxing部分的数据写入对象obj['zhenxing']
                var zhenxing = main.getElementsByTagName("role")[0].getElementsByTagName("zhenxing")[0];
                if (zhenxing) obj['zhenxing'] = zhenxingXMLToJSON(zhenxing, obj['zhenxing']);

                /**-----------------------------人物技能信息-----------------------------**/
                obj['skills'] = {}; //技能
                //找到skills部分的数据写入对象obj['skills']
                var skills = main.getElementsByTagName("role")[0].getElementsByTagName("skills")[0];
                if (skills) obj['skills'] = skillsXMLToJSON(skills, obj['skills']);

                /**-----------------------------元婴基础信息-----------------------------**/
                var roleInfo = main.getElementsByTagName("upgrade")[0].getElementsByTagName("attribs")[0];
                if (roleInfo != null) {
                    var main_children = gy.getChildren(roleInfo); //获取最外层节点的所有子节点
                    var aLength = main_children.length; //当前子节点的长度
                    var i = 0;
                    //遍历所有的子代元素，看其还有没有子代，如果有的话继续遍历子代，没有的话就返回当前元素的innerHTML
                    for (i; i < aLength; i++) {
                        //nowEle 遍历中当前的节点
                        var nowEle = main_children[i];
                        //当前节点的子节点长度
                        var bLength = gy.getChildren(nowEle).length;
                        //根据当前节点的子节点长度判断，如果子节点长度大于0 就继续遍历，没有子节点的话 就获取他的innerHTML
                        if (bLength > 0) {
                            arguments.callee(nowEle, obj); //继续执行当前函数
                        } else {
                            //nowEleNodeName 当前节点的名称
                            var nowEleNodeName = nowEle.nodeName.toLowerCase() + "yy";//yy元婴
                            //console.log("元婴基础信息----" + nowEleNodeName);
                            obj[nowEleNodeName] = gy.getxmlnodeText(nowEle);
                        }
                    }
                }
                /**-----------------------------元婴技能信息-----------------------------**/
                obj['skillsyy'] = {}; //技能
                //找到skillsyy部分的数据写入对象obj['skillsyy']
                var skillsyy = main.getElementsByTagName("upgrade")[0].getElementsByTagName("skills")[0];
                if (skillsyy) obj['skillsyy'] = skillsyyXMLToJSON(skillsyy, obj['skillsyy']);

                /**-----------------------------守护基础信息-----------------------------**/
                obj['sh'] = {}; //技能
                //找到shouhu部分的数据写入对象obj['sh']
                var shouhu = main.getElementsByTagName("guards")[0].getElementsByTagName("guard");
                if (shouhu) obj['sh'] = shouhuXMLToJSON(shouhu, obj['sh']);

                /**-----------------------------宠物基础信息-----------------------------**/
                obj['cw'] = {}; //基础
                //找到chongwu部分的数据写入对象obj['cw']
                var chongwu = main.getElementsByTagName("pets")[0].getElementsByTagName("pet");
                if ($("#hidclassicOrderType").val() == "经典区") {
                    if (chongwu) obj['cw'] = classicchongwuXMLToJSON(chongwu, obj['cw']);
                } else {
                    if (chongwu) obj['cw'] = chongwuXMLToJSON(chongwu, obj['cw']);
                }

                /**-----------------------------宠物技能信息-----------------------------**/
                obj['cwskill'] = {}; //技能
                //找到chongwuskill部分的数据写入对象obj['cwskill']
                var chongwuskill = main.getElementsByTagName("pets")[0].getElementsByTagName("pet");
                if (chongwuskill) obj['cwskill'] = chongwuskillXMLToJSON(chongwuskill, obj['cwskill']);

                /**-----------------------------娃娃基础信息-----------------------------**/
                obj['ww'] = {}; //基础
                //找到wawa部分的数据写入对象obj['ww']
                var wawa = main.getElementsByTagName("children")[0].getElementsByTagName("child");
                if (wawa) obj['ww'] = wawaXMLToJSON(wawa, obj['ww']);

                /**-----------------------------娃娃技能信息-----------------------------**/
                obj['wwskill'] = {}; //技能
                //找到wawaskill部分的数据写入对象obj['wwskill']
                var wawaskill = main.getElementsByTagName("children")[0].getElementsByTagName("child");
                if (wawaskill) obj['wwskill'] = wawaskillXMLToJSON(wawaskill, obj['wwskill']);

                /**-----------------------------背包基础信息-----------------------------**/
                obj['bg'] = {}; //背包
                //找到bag部分的数据写入对象obj['bg']
                var bag = main.getElementsByTagName("bag")[0].getElementsByTagName("item");
                if (bag) obj['bg'] = bagXMLToJSON(bag, obj['bg']);

                /**-----------------------------装备基础信息-----------------------------**/
                obj['ep'] = {}; //装备
                //找到equip部分的数据写入对象obj['ep']
                var equip = main.getElementsByTagName("equip")[0].getElementsByTagName("item");
                if (equip) obj['ep'] = equipXMLToJSON(equip, obj['ep']);
            }

            //获取装备的数据
            function equipXMLToJSON(dom, obj) {
                obj['eps'] = ""; //装备
                obj['epss'] = ""; //备用装备
                obj['epsyy'] = ""; //元、血婴装备
                obj['epssyy'] = ""; //元、血备用装备
                //先遍历守护的个数，在添加属性
                for (var i = 0; i < dom.length; i++) {
                    var childrenNode = gy.getChildren(dom[i].getElementsByTagName("attribs")[0]);
                    var childrenNodeLength = childrenNode.length;
                    if (childrenNodeLength > 0) {
                        for (var j = 0; j < childrenNodeLength; j++) {
                            var nowNode = childrenNode[j];
                            var nowNodeName = childrenNode[j].nodeName.toLowerCase();
                            var loc = dom[i].getAttribute('locality');
                            var upg = dom[i].getAttribute('upgrade');
                            var probidattr = "";
                            var bidimg1 = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6117.png" style="right: 0px; bottom: 0px; position: absolute;">';
                            var bidimg2 = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6115.png" style="right: 0px; bottom: 0px; position: absolute;">';
                            var bidimg3 = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6113.jpg" style="right: 0px; bottom: 0px; position: absolute;">';
                            var bidimg4 = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6111.png" style="right: 0px; bottom: 0px; position: absolute;">';
                            switch (nowNodeName) {
                                case "icon":
                                    if ((loc < 11 && upg == 0) || (loc == 51 && upg == 0)) {//真身装备
                                        obj['eps'] += "<span class='js_eqsp eqa" + loc + "' data-id=" + loc + " data-idx=" + i + "><img class='bag' src='/img.gyyxcdn.cn/qibao/Images/bigItemImages/" + gy.getxmlnodeText(nowNode) + ".jpg' style='width:50px;height:50px;' >";
                                    } else if (((loc > 10 && upg == 0) && (loc < 20 && upg == 0)) || (loc == 52 && upg == 0)) {//真身备用装备
                                        obj['epss'] += "<span class='js_eqsp eqa" + loc + "' data-id=" + loc + " data-idx=" + i + "><img class='bag' src='/img.gyyxcdn.cn/qibao/Images/bigItemImages/" + gy.getxmlnodeText(nowNode) + ".jpg' style='width:50px;height:50px;'>";
                                    } else if ((loc < 11 && upg == 1) || (loc == 51 && upg == 1)) {//元、血婴装备
                                        obj['epsyy'] += "<span class='js_eqsp eqa" + loc + "' data-id=" + loc + " data-idx=" + i + "><img class='bag' src='/img.gyyxcdn.cn/qibao/Images/bigItemImages/" + gy.getxmlnodeText(nowNode) + ".jpg' style='width:50px;height:50px;'>";
                                    } else if (((loc > 10 && upg == 1) && (loc < 20 && upg == 1)) || (loc == 52 && upg == 1)) {//元、血婴备用装备
                                        obj['epssyy'] += "<span class='js_eqsp eqa" + loc + "' data-id=" + loc + " data-idx=" + i + "><img class='bag' src='/img.gyyxcdn.cn/qibao/Images/bigItemImages/" + gy.getxmlnodeText(nowNode) + ".jpg' style='width:50px;height:50px;'>";
                                    }
                                    break;
                                case "property_bind_attrib":
                                    //装备专有图标(1、认主绑定 2、解绑中 3、临时解绑 4、永久绑定)
                                    if ((loc < 11 && upg == 0) || (loc == 51 && upg == 0)) {
                                        if (gy.getxmlnodeText(nowNode) == "1") {
                                            obj['eps'] += bidimg1;
                                        } else if (gy.getxmlnodeText(nowNode) == "2") {
                                            obj['eps'] += bidimg2;
                                        } else if (gy.getxmlnodeText(nowNode) == "3") {
                                            obj['eps'] += bidimg3;
                                        } else if (gy.getxmlnodeText(nowNode) == "4") {
                                            obj['eps'] += bidimg4;
                                        }
                                    } else if (((loc > 10 && upg == 0) && (loc < 20 && upg == 0)) || (loc == 52 && upg == 0)) {
                                        if (gy.getxmlnodeText(nowNode) == "1") {
                                            obj['epss'] += bidimg1;
                                        } else if (gy.getxmlnodeText(nowNode) == "2") {
                                            obj['epss'] += bidimg2;
                                        } else if (gy.getxmlnodeText(nowNode) == "3") {
                                            obj['epss'] += bidimg3;
                                        } else if (gy.getxmlnodeText(nowNode) == "4") {
                                            obj['epss'] += bidimg4;
                                        }
                                    } else if ((loc < 11 && upg == 1) || (loc == 51 && upg == 1)) {
                                        if (gy.getxmlnodeText(nowNode) == "1") {
                                            obj['epsyy'] += bidimg1;
                                        } else if (gy.getxmlnodeText(nowNode) == "2") {
                                            obj['epsyy'] = bidimg2;
                                        } else if (gy.getxmlnodeText(nowNode) == "3") {
                                            obj['epsyy'] += bidimg3;
                                        } else if (gy.getxmlnodeText(nowNode) == "4") {
                                            obj['epsyy'] = bidimg4;
                                        }
                                    } else if (((loc > 10 && upg == 1) && (loc < 20 && upg == 1)) || (loc == 52 && upg == 1)) {
                                        if (gy.getxmlnodeText(nowNode) == "1") {
                                            obj['epssyy'] += bidimg1;
                                        } else if (gy.getxmlnodeText(nowNode) == "2") {
                                            obj['epssyy'] += bidimg2;
                                        } else if (gy.getxmlnodeText(nowNode) == "3") {
                                            obj['epssyy'] += bidimg3;
                                        } else if (gy.getxmlnodeText(nowNode) == "4") {
                                            obj['epssyy'] += bidimg4;
                                        }
                                    }
                                    break;
                                case "recognize_recognized":
                                    if ((loc < 11 && upg == 0) || (loc == 51 && upg == 0)) {
                                        obj['eps'] += "</span>";
                                    } else if (((loc > 10 && upg == 0) && (loc < 20 && upg == 0)) || (loc == 52 && upg == 0)) {
                                        obj['epss'] += "</span>";
                                    } else if ((loc < 11 && upg == 1) || (loc == 51 && upg == 1)) {
                                        obj['epsyy'] += "</span>";
                                    } else if (((loc > 10 && upg == 1) && (loc < 20 && upg == 1)) || (loc == 52 && upg == 1)) {
                                        obj['epssyy'] += "</span>";
                                    }
                                    break;
                            }
                        }
                    }
                }
                return obj;
            }

            //获取背包的数据
            function bagXMLToJSON(dom, obj) {
                obj['bgs'] = "<ul>"; //背包
                //先遍历守护的个数，在添加属性
                for (var i = 0; i < dom.length; i++) {
                    var childrenNode = gy.getChildren(dom[i].getElementsByTagName("attribs")[0]);
                    var childrenNodeLength = childrenNode.length;
                    var bidimg1 = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6117.png" style="right: 0px; bottom: 0px; position: absolute;">';
                    var bidimg2 = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6115.png" style="right: 0px; bottom: 0px; position: absolute;">';
                    var bidimg3 = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6113.jpg" style="right: 0px; bottom: 0px; position: absolute;">';
                    var bidimg4 = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6111.png" style="right: 0px; bottom: 0px; position: absolute;">';
                    if (childrenNodeLength > 0) {
                        var isgyd = 0;
                        for (var j = 0; j < childrenNodeLength; j++) {
                            var nowNode = childrenNode[j];
                            var nowNodeName = childrenNode[j].nodeName.toLowerCase();
                            var gyd = gy.getxmlnodeText(nowNode);
                            switch (nowNodeName) {
                                case "icon":
                                    if (gyd != 8809 && gyd != 9330 && gyd != 380008097 && gyd != 9246 && gyd != 8909 && gyd != 9322 && gyd != 9186 && gyd != 9247 && gyd != 9185 && gyd != 1423 && gyd != 1797 && gyd != 9296 && gyd != 1823 && gyd != 1422 && gyd != 9215 && gyd != 9210 && gyd != 9329 && gyd != 8810 && gyd != 1426 && gyd != 9331 && gyd != 9332 && gyd != 9333 && gyd != 8446 && gyd != 9623 && gyd != 9327 && gyd != 9238 && gyd != 6857 && gyd != 10034 && gyd != 9323 && gyd != 9324 && gyd != 9325 && gyd != 9328 && gyd != 1610 && gyd != 8907 && gyd != 9319 && gyd != 8444 && gyd != 8439 && gyd != 1424 && gyd != 8441 && gyd != 8445 && gyd != 8443 && gyd != 10025 && gyd != 10026 && gyd != 10022 && gyd != 10023 && gyd != 8471 && gyd != 9320 && gyd != 8442 && gyd != 9218 && gyd != 1845 && gyd != 8449 && gyd != 8906 && gyd != 8459 && gyd != 8460 && gyd != 8480 && gyd != 2015 && gyd != 9298 && gyd != 9299 && gyd != 9273 && gyd != 8479 && gyd != 7707 && gyd != 9183 && gyd != 9283 && gyd != 9242 && gyd != 8447 && gyd != 9301 && gyd != 9248 && gyd != 9303 && gyd != 9281 && gyd != 9622 && gyd != 9289 && gyd != 9293 && gyd != 9306 && gyd != 9300 && gyd != 9305 && gyd != 8448 && gyd != 10021 && gyd != 10024 && gyd != 2023 && gyd != 9302 && gyd != 9280 && gyd != 9326 && gyd != 8464 && gyd != 8416 && gyd != 1421 && gyd != 8493 && gyd != 9271 && gyd != 9267 && gyd != 8440 && gyd != 9308 && gyd != 1425 && gyd != 9297 && gyd != 9304 && gyd != 9321 && gyd != 8461 && gyd != 9295 && gyd != 9285 && gyd != 9272 && gyd != 9270 && gyd != 8462 && gyd != 9307 && gyd != 8811 && gyd != 8411 && gyd != 9292 && gyd != 8413 && gyd != 9217 && gyd != 8458 && gyd != 9284 && gyd != 9309 && gyd != 9287 && gyd != 9274 && gyd != 9290 && gyd != 10027 && gyd != 8407 && gyd != 8435 && gyd != "1420" && gyd != "9316" && gyd != 9288) {
                                        obj['bgs'] += "<li class='js_bag js_bg" + i + "' data-bagidx=" + i + "><img class='bag' src='/img.gyyxcdn.cn/qibao/Images/itemImages/" + gy.getxmlnodeText(nowNode) + ".jpg' style='width:50px;height:50px;'>";
                                    } else {
                                        obj['bgs'] += "<li class='js_bag js_bg" + i + "' data-bagidx='000'>";
                                        isgyd = 1;
                                    }
                                    break;
                                case "property_bind_attrib":
                                    if (isgyd != 1) {
                                        //装备专有图标(1、认主绑定 2、解绑中 3、临时解绑 4、永久绑定)
                                        if (gy.getxmlnodeText(nowNode) == "1") {
                                            obj['bgs'] += bidimg1;
                                        } else if (gy.getxmlnodeText(nowNode) == "2") {
                                            obj['bgs'] += bidimg2;
                                        } else if (gy.getxmlnodeText(nowNode) == "3") {
                                            obj['bgs'] += bidimg3;
                                        } else if (gy.getxmlnodeText(nowNode) == "4") {
                                            obj['bgs'] += bidimg4;
                                        }
                                    }
                                    obj['bgs'] += '</li>';
                                    isgyd = 0;
                                    break;
                            }
                        }
                        //当其中某一项技能为空的时候 就直接删除当前技能选项
                        if (obj['bgs'] == "") delete obj['bgs'];
                    }
                }
                obj['bgs'] += "</ul>";
                return obj;
            }

            //获取娃娃技能数据
            function wawaskillXMLToJSON(dom, obj) {
                obj['wwskills'] = "<div class='wwskillbg' id='wwskillbg' style=' display: block; left: 342px; top: 0px; '><span id='wwskillclose' class='wwskillclose'>&nbsp;</span>"; //宠物技能
                //先遍历守护的个数，在添加属性
                for (var i = 0; i < dom.length; i++) {
                    obj['wwskills'] += "<div><span class='wwtitle'><span class='skilltitleww'>技能名称</span><span class='skilltitleww srd'>技能等级</span></span><span id='wwskill_con" + i + "'><span class='wwtag" + i + "'><span class='scolldiv' id='wwa" + i + "' style='height:150px;'><ul id='wwb" + i + "'>";
                    var childrenNode = gy.getChildren(dom[i].getElementsByTagName("skills")[0]);
                    var childrenNodeLength = childrenNode.length;
                    var stonelv = 0, stonename = "", tfname = "", tflv = "";

                    //娃娃技能
                    if (childrenNodeLength > 0) {
                        for (var j = 0; j < childrenNodeLength; j++) {
                            var nowNode = childrenNode[j];
                            var nowNodeName = childrenNode[j].nodeName.toLowerCase();
                            var nowNodeType = nowNode.getAttribute('type');
                            var color = nowNode.getAttribute('color');
                            obj['wwskills'] += "<li><a href='javascript:;' class=''><span class='kname'>" + nowNodeName + "</span><span class='klv'>" + gy.getxmlnodeText(nowNode) + "</span></a></li>";
                        }
                        //当其中某一项技能为空的时候 就直接删除当前技能选项
                        if (obj['wwskills'] == "") delete obj['wwskills'];
                    }

                    obj['wwskills'] += "</ul><span class='scrollBar' id='wwc" + i + "' style='height: 150px;'><span class='scrtop'>&nbsp;</span><span class='tip' id='wwd" + i + "' style='height:20px;'></span><span class='scrbottom'>&nbsp;</span></span></span></span></span></div>";
                }
                obj['wwskills'] += "</div>";
                return obj;
            }

            //获取娃娃详情的数据
            function wawaXMLToJSON(dom, obj) {
                obj['wwname'] = ""; //娃娃名称
                obj['wwattr'] = ""; //娃娃属性详情
                obj['wwaptitude'] = "";//娃娃装备详情
                obj['wwaptitude'] += "<div class='wwequipbg' id='wwequipbg' style=' display: block; top: 0px; left: 657px; '><span id='wwclose' class='wwclose'>&nbsp;</span>";
                obj['wwcheats'] = "";//娃娃秘籍详情
                obj['wwcheats'] += "<div class='wwcheatsbg' id='wwcheatsbg' style=' display: none; top: 0px; left: 451px; '><span id='wwcheatclose' class='wwcheatclose'>&nbsp;</span>";
                //先遍历娃娃的个数，在添加属性
                var ll = -1;
                for (var i = 0; i < dom.length; i++) {
                    obj['wwattr'] += "<div class='tag3'>";
                    obj['wwaptitude'] += "<div style=' display: block;'>";
                    obj['wwcheats'] += "<div style=' display: block;'>";
                    if (dom[i].getElementsByTagName("equip")[0] != undefined) {
                        var cdequipNdLength = gy.getChildren(dom[i].getElementsByTagName("equip")[0]);
                        for (var j = 0; j < cdequipNdLength.length; j++) {
                            ll++
                            var cdeqndlh = gy.getChildren(cdequipNdLength[j].getElementsByTagName("attribs")[0]);
                            var wwequipno = cdequipNdLength[j].getAttribute('locality');
                            for (var o = 0; o < cdeqndlh.length; o++) {
                                var nN = cdeqndlh[o];
                                var nNN = cdeqndlh[o].nodeName.toLowerCase();
                                switch (nNN) {
                                    case "icon":
                                        if (wwequipno == 9 || wwequipno == 10 || wwequipno == 11 || wwequipno == 12) {
                                            obj['wwaptitude'] += '<span class="wwequ' + wwequipno + ' js_wwep" data-wwidx=' + ll + ' data-id=' + wwequipno + '><img style="width:50px; height:50px;" src="/img.gyyxcdn.cn/qibao/Images/bigItemImages/' + gy.getxmlnodeText(nN) + '.jpg" ></span>';
                                        } else {
                                            obj['wwcheats'] += '<span class="wwequ' + wwequipno + ' js_wwep" data-wwidx=' + ll + ' data-id=' + wwequipno + '><img style="width:50px; height:50px;" src="/img.gyyxcdn.cn/qibao/Images/bigItemImages/' + gy.getxmlnodeText(nN) + '.jpg" ></span>';
                                        };
                                        break
                                }
                            }
                        }
                    }
                    var childrenNode = gy.getChildren(dom[i].getElementsByTagName("attribs")[0]);
                    var childrenNodeLength = childrenNode.length;
                    var foodhp = 0, moodhp = 0, maxfd = 0, maxmd = 0, fdhp = "", mdhp = "", names = "", col = "", icons = "", expww = 0, expnextww = 0, expwwpar = "", enchants = "", prbidib = "", wwnames = "", wwonattr = "", wwonattr1 = "", wwonattr2 = "", wwonattr3 = "", wwonattr4 = "", wwonattr5 = "", wwonattr6 = "", war3 = 0, war4 = 0, war5 = 0, war6 = 0, allwar = 0, wwstart = "";
                    if (childrenNodeLength > 0) {
                        for (var j = 0; j < childrenNodeLength; j++) {
                            var nowNode = childrenNode[j];
                            var nowNodeName = childrenNode[j].nodeName.toLowerCase();
                            var color = nowNode.getAttribute('color');
                            switch (nowNodeName) {
                                case "name":
                                    obj['wwname'] += "<li><a href='javascript:;'><span class='wwname'>" + gy.getxmlnodeText(nowNode) + "</span></a></li>";
                                    obj['wwattr'] += "<span class='wwspan wwmc'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "level":
                                    obj['wwattr'] += "<span class='wwspan wwdj'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "food":
                                    foodhp = gy.getxmlnodeText(nowNode);
                                    break;
                                case "max_food":
                                    maxfd = gy.getxmlnodeText(nowNode);
                                    if ((foodhp * 100 / maxfd).toFixed(1) > 100) {
                                        fdhp = "100%";
                                    } else {
                                        fdhp = (foodhp * 100 / maxfd).toFixed(1) + "%";//计算娃娃饱食度进度条长度
                                    }
                                    obj['wwattr'] += "<span class='foodmaxhp'style='width:221px;'><span id='perrdwwfd' style='width:" + fdhp + "'>&nbsp;</span></span><span class='foodhp'>" + foodhp + "/" + maxfd + "</span>";
                                    break;
                                case "max_mood":
                                    moodhp = gy.getxmlnodeText(nowNode);
                                    break;
                                case "mood":
                                    maxmd = gy.getxmlnodeText(nowNode);
                                    if ((maxmd * 100 / moodhp).toFixed(1) > 100) {
                                        mdhp = "100%";
                                    } else {
                                        mdhp = (maxmd * 100 / moodhp).toFixed(1) + "%";//计算娃娃心情度进度条长度
                                    }
                                    obj['wwattr'] += "<span class='moodmaxhp'style='width:221px;'><span id='perrdwwmd' style='width:" + mdhp + "'>&nbsp;</span></span><span class='moodhp'>" + maxmd + "/" + moodhp + "</span>";
                                    break;
                                case "phy_power":
                                    obj['wwattr'] += "<span class='wwspan wwws'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "mag_power":
                                    obj['wwattr'] += "<span class='wwspan wwfs'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "str":
                                    obj['wwattr'] += "<span class='wwspan wwlq'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "wisdom":
                                    obj['wwattr'] += "<span class='wwspan wwzh'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "dex":
                                    obj['wwattr'] += "<span class='wwspan wwlm'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "child_damage_reduce":
                                    obj['wwattr'] += "<span class='wwspan wwhj'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "intimacy":
                                    obj['wwattr'] += "<span class='wwspan wwqm'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "physique":
                                    obj['wwattr'] += "<span class='wwspan wwtp'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "stamina":
                                    obj['wwattr'] += "<span class='wwspan wwtl'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "capacity":
                                    obj['wwattr'] += "<span class='wwspan wwqz'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "exp":
                                    expww = gy.getxmlnodeText(nowNode);
                                    break;
                                case "exp_to_next_level":
                                    expnextww = gy.getxmlnodeText(nowNode);
                                    if (expww >= 0) {
                                        exppar = (expww * 100 / expnextww).toFixed(1) + "%";//计算宠物经验进度条长度
                                        if ((expww * 100 / expnextww).toFixed(1) > 100) {
                                            exppar = "100%";
                                        }
                                        obj['wwattr'] += "<span class='maxexpww'style='width:238px;'><span id='perrdwwexp' style='width:" + exppar + "'>&nbsp;</span></span><span class='lifemax'>" + expww + "/" + expnextww + " (" + (expww * 100 / expnextww).toFixed(1) + "%)</span>";
                                    }
                                    break;
                                case "icon":
                                    icons = gy.getxmlnodeText(nowNode);
                                    obj['wwattr'] += "<span class='wwspan shic' id='wwimgshow" + i + "'><img src='/img.gyyxcdn.cn/qibao/Images/bigItemImages/" + gy.getxmlnodeText(nowNode) + ".jpg' style=' height: 146px; width: 120px !important;'></span>";
                                    break;
                                case "wit_effect":
                                    allwar = (parseInt(war3) + parseInt(war4) + parseInt(war5) + parseInt(war6));
                                    wwstart = gy.getwwStar(allwar)
                                    obj['wwattr'] += "<span class='wwattrs' id='wwattrs" + i + "'><span class='wwsmallimg'><img src='/img.gyyxcdn.cn/qibao/Images/bigItemImages/" + icons + ".png' style='height:127px;'></span>" + wwonattr1 + "<span class='wwonspan'>智慧成长：" + gy.getxmlnodeText(nowNode) + "</span>" + wwonattr2 + "" + wwonattr3 + "" + wwonattr4 + "" + wwonattr5 + "" + wwonattr6 + "<span class='wwonspan'>总评分：" + allwar + "</span></span>" + wwstart;//总评分及其他属性
                                    break;
                                case "phy_effect":
                                    wwonattr1 += "<span class='wwonspan'>体魄成长：" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "str_effect":
                                    wwonattr1 += "<span class='wwonspan'>气力成长：" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "dex_effect":
                                    wwonattr2 += "<span class='wwonspan' style='height:25px;'>灵敏成长：" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "child_score_lv":
                                    war3 = gy.getxmlnodeText(nowNode);
                                    wwonattr3 += "<span class='wwonspan'>等级评分：" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "child_score_skill":
                                    war4 = gy.getxmlnodeText(nowNode);
                                    wwonattr4 += "<span class='wwonspan'>技能评分：" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "child_score_equip":
                                    war5 = gy.getxmlnodeText(nowNode);
                                    wwonattr5 += "<span class='wwonspan'>装备评分：" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "child_score_book":
                                    war6 = gy.getxmlnodeText(nowNode);
                                    wwonattr6 += "<span class='wwonspan'>秘籍评分：" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "child_reduce_phy":
                                    obj['wwaptitude'] += "<span class='wwspan hjws'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "child_rd_metal":
                                    obj['wwaptitude'] += "<span class='wwspan hjjs'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "child_rd_wood":
                                    obj['wwaptitude'] += "<span class='wwspan hjms'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "child_rd_water":
                                    obj['wwaptitude'] += "<span class='wwspan hjss'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "child_rd_fire":
                                    obj['wwaptitude'] += "<span class='wwspan hjhs'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "child_rd_earth":
                                    obj['wwaptitude'] += "<span class='wwspan hjts'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "child_ir_metal":
                                    obj['wwaptitude'] += "<span class='wwspan hskj'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "child_ir_wood":
                                    obj['wwaptitude'] += "<span class='wwspan hskm'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "child_ir_water":
                                    obj['wwaptitude'] += "<span class='wwspan hsks'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "child_ir_fire":
                                    obj['wwaptitude'] += "<span class='wwspan hskh'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "child_ir_earth":
                                    obj['wwaptitude'] += "<span class='wwspan hskt'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                            }
                        }
                        //当其中某一项技能为空的时候 就直接删除当前技能选项
                        if (obj['wwname'] == "") delete obj['wwname'];
                        if (obj['wwattr'] == "") delete obj['wwattr'];
                        if (obj['wwaptitude'] == "") delete obj['wwaptitude'];
                        if (obj['wwcheats'] == "") delete obj['wwcheats'];
                    }
                    obj['wwaptitude'] += "</div>";
                    obj['wwcheats'] += "</div>";
                    obj['wwattr'] += "</div>";
                }
                obj['wwaptitude'] += "</div>";
                obj['wwcheats'] += "</div>";

                return obj;
            }

            //获取宠物技能数据
            function chongwuskillXMLToJSON(dom, obj) {
                obj['cwskills'] = "<div class='cwskillbg' id='cwskillbg' style=' display: block; left: 340px; top: 0px; '><span id='cwskillclose' class='cwskillclose'>&nbsp;</span>"; //宠物技能
                obj['cwdw'] = "";//宠物顿悟技能
                obj['cwhsstone'] = "<div class='cwtstonebg' id='cwtstonebg' style=' display: none; top: -0px; left: 340px; '><b id='cwtstoneclose' class='cwtstoneclose'>&nbsp;</b>";//宠物魂兽石
                obj['cwbook'] = "";//宠物天书
                obj['cwtalent'] = "<div class='cwtalentbg' id='cwtalentbg' style=' display: block; top: 0px; left: 340px; '><span id='talentbgclose' class='talentbgclose'>&nbsp;</span><span class='talenttitle'>技能名称</span><span class='talenttitle sed'>技能等级</span><span class='talenttitle srd'>魂兽石等级</span>";//宠物天赋技能
                obj['cwheartmethod'] = "";//宠物心法
                //先遍历守护的个数，在添加属性
                for (var i = 0; i < dom.length; i++) {
                    obj['cwskills'] += "<div><span class='skillleft_tabcw' id='cwskillnav" + i + "'><span class='divisiontab'><a href='javascript:;' class=''>&nbsp;</a></span><span class='lifetabbook' type='" + i + "'><a href='javascript:;' class=''>&nbsp;</a></span><span class='othertab'><a href='javascript:;' class=''>&nbsp;</a></span><span class='heartmethod'><a href='javascript:;' class=''>&nbsp;</a></span></span><span id='changetitle" + i + "'><span class='skilltitle'>技能名称</span><span class='skilltitle srd'>技能等级</span></span><span id='cwskill_con" + i + "'><span class='cwtag" + i + "'><span class='scolldiv' id='cwa" + i + "' style='height:150px;'><ul id='cwb" + i + "'>";
                    obj['cwdw'] = "";//重置宠物顿悟技能
                    obj['cwdw'] += "<span class='cwtag" + i + "'><span class='scolldiv' id='cwdwa" + i + "' style='height:150px;'><ul id='cwdwb" + i + "'>";
                    obj['cwbook'] = "";//重置宠物天书
                    obj['cwbook'] += "<span class='cwtag" + i + "'><span class='scolldiv' id='cwbooka" + i + "' style='height:150px;'><ul id='cwbookb" + i + "'>";
                    obj['cwtalent'] += "<div class='scolldiv' id='cwta" + i + "' style='height:343px; display:block;'><ul class='cwtalent' id='cwtb" + i + "'>";
                    obj['cwhsstone'] += "<div id='cwstone" + i + "' class='cwstdiv' style='display:block;'>";
                    obj['cwheartmethod'] = "";//重置宠物心法
                    obj['cwheartmethod'] += "<span class='cwtag" + i + "'><span class='scolldiv' id='cwheartmethoda" + i + "' style='height:150px;'><ul id='cwheartmethodb" + i + "'>";
                    var childrenNode = gy.getChildren(dom[i].getElementsByTagName("skills")[0]);
                    var childrenNodeLength = childrenNode.length;
                    var stonelv = 0, stonename = "", tfname = "", tflv = "";
                    //宠物天书技能
                    if (dom[i].getElementsByTagName("pet_godbooks")[0] != undefined) {
                        var childrenNodebook = gy.getChildren(dom[i].getElementsByTagName("pet_godbooks")[0]);
                        var childrenNodebookLength = childrenNodebook.length;
                        if (childrenNodebookLength > 0) {
                            for (var j = 0; j < childrenNodebookLength; j++) {
                                //nowEle 遍历中当前的节点
                                var nowEle = childrenNodebook[j];
                                //当前节点的子节点长度
                                var nowElecol = gy.getColor(gy.getxmlnodeText(gy.getChildren(nowEle)[0]));
                                var nowElelv = gy.getChildren(nowEle)[3];
                                var nowElename = gy.getChildren(nowEle)[4];
                                var nowElenimbus = gy.getChildren(nowEle)[5];
                                obj['cwbook'] += "<li><a href='javascript:;' class=''><span class='knames' style='color:" + nowElecol + "'>" + gy.getxmlnodeText(nowElename) + "</span><span class='knames' style='color:" + nowElecol + "'>" + gy.getxmlnodeText(nowElelv) + "</span><span class='knames' style='color:" + nowElecol + "'>" + gy.getxmlnodeText(nowElenimbus) + "</span></a></li>";
                            }
                            //当其中某一项技能为空的时候 就直接删除当前技能选项
                            if (obj['cwbook'] == "") delete obj['cwbook'];
                        }
                    }
                    //宠物魂兽石
                    if (dom[i].getElementsByTagName("mount_stones")[0] != undefined) {
                        var childrenNodebook = gy.getChildren(dom[i].getElementsByTagName("mount_stones")[0]);
                        var childrenNodebookLength = childrenNodebook.length;
                        var colcss = "";
                        if (childrenNodebookLength > 0) {
                            for (var j = 0; j < childrenNodebookLength; j++) {
                                //nowEle 遍历中当前的节点
                                var nowEle = childrenNodebook[j];
                                //当前节点的子节点长度
                                for (var m = 0; m < gy.getChildren(nowEle).length; m++) {
                                    if (gy.getChildren(nowEle)[m].nodeName.toLowerCase() == "color") {
                                        var nowElestcol = gy.getColor(gy.getxmlnodeText(gy.getChildren(nowEle)[m]));
                                        if (gy.getxmlnodeText(gy.getChildren(nowEle)[m]) == "绿色") {
                                            colcss = "green"
                                        } else if (gy.getxmlnodeText(gy.getChildren(nowEle)[m]) == "白色") {
                                            colcss = "white"
                                        } else if (gy.getxmlnodeText(gy.getChildren(nowEle)[m]) == "蓝色") {
                                            colcss = "blue"
                                        } else if (gy.getxmlnodeText(gy.getChildren(nowEle)[m]) == "金色") {
                                            colcss = "gold"
                                        } else if (gy.getxmlnodeText(gy.getChildren(nowEle)[m]) == "粉色") {
                                            colcss = "pink"
                                        }
                                    } else if (gy.getChildren(nowEle)[m].nodeName.toLowerCase() == "level") {
                                        var nowElestlv = gy.getChildren(nowEle)[m];
                                    } else if (gy.getChildren(nowEle)[m].nodeName.toLowerCase() == "name") {
                                        var nowElestname = gy.getxmlnodeText(gy.getChildren(nowEle)[m]);
                                        var index = nowElestname.lastIndexOf('魂');
                                        nowElestname = nowElestname.substring(0, index);
                                    }
                                }
                                obj['cwhsstone'] += "<span type='cwcolimg' class='" + colcss + " cwcolimg cwcimg" + j + "' id='cwcimg" + j + "'>&nbsp;<b class='cwstlv' style='color:#eff120'>" + gy.getxmlnodeText(nowElestlv) + "</b><b type='cwstname' class='cwstname' id='cwstname" + j + "' style='color:" + nowElestcol + "; display:none;'>" + nowElestname + "</b></span>";
                            }
                            //当其中某一项技能为空的时候 就直接删除当前技能选项
                            if (obj['cwhsstone'] == "") delete obj['cwhsstone'];
                        }
                    }

                    var istonearr = [];
                    //宠物技能
                    if (childrenNodeLength > 0) {
                        for (var j = 0; j < childrenNodeLength; j++) {
                            var nowNode = childrenNode[j];
                            var nowNodeName = childrenNode[j].nodeName.toLowerCase();
                            var nowNodeType = nowNode.getAttribute('type');
                            var color = nowNode.getAttribute('color');
                            var petstonelv = '';
                            switch (nowNodeType) {
                                case "师门技能":
                                    obj['cwskills'] += "<li><a href='javascript:;' class=''><span class='kname'>" + nowNodeName + "</span><span class='klv'>" + gy.getxmlnodeText(nowNode) + "</span></a></li>";
                                    break;
                                case "天生技能":
                                    obj['cwskills'] += "<li><a href='javascript:;' class=''><span class='kname'>" + nowNodeName + "</span><span class='klv'>" + gy.getxmlnodeText(nowNode) + "</span></a></li>";
                                    break;
                                case "顿悟技能":
                                    obj['cwdw'] += "<li><a href='javascript:;' class=''><span class='kname'>" + nowNodeName + "</span><span class='klv'>" + gy.getxmlnodeText(nowNode) + "</span></a></li>";
                                    break;
                                case "魂兽石":
                                    stonelv = gy.getxmlnodeText(nowNode);
                                    stonename = nowNodeName;
                                    //处理魂兽石等级和技能等级匹配
                                    petstonelv = gy.unique(gy.stonelvs(istonearr, stonename, stonelv));
                                    break;
                                case "天赋技能":
                                    var istone = nowNodeName;
                                    istonearr.push(istone + '|' + gy.getxmlnodeText(nowNode));
                                    tfname = nowNodeName;
                                    tflv = gy.getxmlnodeText(nowNode);
                                    break;
                                case "心法技能":
                                    obj['cwheartmethod'] += "<li><a href='javascript:;' class=''><span class='kname'>" + nowNodeName + "</span><span class='klv'>" + gy.getxmlnodeText(nowNode) + "</span></a></li>";
                                    break;

                            }
                        }
                        //当其中某一项技能为空的时候 就直接删除当前技能选项
                        if (obj['cwskills'] == "") delete obj['cwskills'];
                        if (obj['cwdw'] == "") delete obj['cwdw'];
                        if (obj['cwtalent'] == "") delete obj['cwtalent'];
                        if (obj['cwheartmethod'] == "") delete obj['cwheartmethod'];
                    } else {//当宠物没有技能时cml中出现<skills/>此时设为空，避免undefined
                        petstonelv = "";
                        obj['cwskills'] += "";
                        obj['cwdw'] += "";
                        obj['cwheartmethod'] == "";
                    }
                    obj['cwtalent'] += petstonelv; //处理魂兽石等级和技能等级匹配
                    obj['cwbook'] += "</ul><span class='scrollBar' id='cwbookc" + i + "' style='height: 150px;'><span class='scrtop'>&nbsp;</span><span class='tip' id='cwbookd" + i + "' style='height:20px;'></span><span class='scrbottom'>&nbsp;</span></span></span></span>";
                    obj['cwdw'] += "</ul><span class='scrollBar' id='cwdwc" + i + "' style='height: 150px;'><span class='scrtop'>&nbsp;</span><span class='tip' id='cwdwd" + i + "' style='height:20px;'></span><span class='scrbottom'>&nbsp;</span></span></span></span>";
                    obj['cwheartmethod'] += "</ul><span class='scrollBar' id='cwheartmethodc" + i + "' style='height: 150px;'><span class='scrtop'>&nbsp;</span><span class='tip' id='cwheartmethodd" + i + "' style='height:20px;'></span><span class='scrbottom'>&nbsp;</span></span></span></span>";
                    obj['cwhsstone'] += "</div>";
                    obj['cwtalent'] += "</ul><span class='scrollBar long' id='cwtc" + i + "' style='height: 340px;'><span class='scrtop'>&nbsp;</span><span class='tip' id='cwtd" + i + "' style='height:20px;'></span><span class='scrbottom'>&nbsp;</span></span></div>";
                    obj['cwskills'] += "</ul><span class='scrollBar' id='cwc" + i + "' style='height: 150px;'><span class='scrtop'>&nbsp;</span><span class='tip' id='cwd" + i + "' style='height:20px;'></span><span class='scrbottom'>&nbsp;</span></span></span></span>" + obj['cwbook'] + obj['cwdw'] + obj['cwheartmethod'] + "</span></div>";

                }
                obj['cwhsstone'] += "</div>";
                obj['cwtalent'] += "</div>";
                obj['cwskills'] += "</div>" + obj['cwtalent'] + obj['cwhsstone'];
                return obj;
            }

            //获取宠物详情的数据
            function chongwuXMLToJSON(dom, obj) {
                obj['cwcapctity'] = "<span class='petcap_number'>" + dom.length + " / ";
                obj['cwname'] = ""; //宠物名称
                obj['cwattr'] = ""; //宠物属性详情
                obj['cwaptitude'] = "<span id='zizhiResit'>";//宠物资质详情                
                cwys = "", cwyslv = "", cwmxlift = "", cwnimbus = "", cwnamet = "", cwnet = "", cwdef = "", cwmxma = "";//宠物妖石

                obj['cwaptitude'] += "<div class='cwzizhibg' id='cwzizhibg' style=' display: block; top: 0px; left: 653px; '><span id='zizhiclose' class='zizhiclose'>&nbsp;</span>";
                obj['cwaptitude'] += "<p class='cwzizhi_nav'><span class='cwzizhibtn on' id='cwzizhibtn'></span><span class='cwresistancebtn' id='cwresistancebtn'></span></p>";
                //先遍宠物护的个数，在添加属性
                for (var i = 0; i < dom.length; i++) {
                    obj['cwattr'] += "<div class='tag2'>";
                    obj['cwaptitude'] += "<div style=' display: block;'>";
                    var childrenNode = gy.getChildren(dom[i].getElementsByTagName("attribs")[0]);
                    var childrenNodeLength = childrenNode.length;
                    var lefthp = 0, expbsh = 0, exphp = "", names = "", col = "", mana = 0, maxmana = 0, manapar = "", expcw = 0, expnextcw = 0, exppar = "", enchants = "", prbidib = "", cwnames = "", cwpolar = "", cwpolarnone = 0, cwicon = "", cwwg = "", cwfg = "", cwqhwg = "", cwqhfg = "", cwdwsy = "", cwhp = "", cwdh = "", cwyh = "", cwjw = "", cwhhqx = "", cwhhfg = "", cwhhsd = "", cwhhfl = "", cwhhwg = "", iptico = "", zlico = "";
                    var petseal = ""; var calv = "";//把默认阶位传递给阶位
                    //宠物妖石
                    if (dom[i].getElementsByTagName("extra_attribs")[0] == undefined && dom[i].getElementsByTagName("extra_attrib")[0] != undefined) {
                        var childrenNodebook = gy.getChildren(dom[i].getElementsByTagName("extra_attrib")[0]);
                        var childrenNodebookLength = childrenNodebook.length;
                        if (childrenNodebookLength > 0) {
                            cwys = "妖石：<br/>";//宠物妖石
                            for (var j = 0; j < childrenNodebookLength; j++) {
                                //nowEle 遍历中当前的节点
                                var nowEle = childrenNodebook[j];
                                //当前节点的子节点长度
                                var cwElename = nowEle.nodeName.toLowerCase();
                                var cwElenlv = gy.getxmlnodeText(nowEle);
                                cwys += "<span class='ystone'>" + cwElename + "(" + cwElenlv + ") " + "</span>";
                            }
                        }
                    } else if (dom[i].getElementsByTagName("extra_attribs")[0] != undefined) {
                        var childrenexzts = gy.getChildren(dom[i].getElementsByTagName("extra_attribs")[0]);
                        cwys = "妖石：<br/>";//宠物妖石
                        for (var k = 0; k < childrenexzts.length; k++) {
                            for (var o = 0; o < childrenexzts[k].childNodes.length; o++) {
                                var cex = childrenexzts[k].childNodes[o];
                                var cexN = childrenexzts[k].childNodes[o].nodeName.toLowerCase();
                                switch (cexN) {
                                    case "level":
                                        cwyslv += "&nbsp;<span style='color:#fff'>等级：" + gy.getxmlnodeText(cex) + "&nbsp;&nbsp;&nbsp;&nbsp;";
                                        break
                                    case "name":
                                        if (gy.getxmlnodeText(cex) == "凝香幻彩") {
                                            cwnamet = gy.getxmlnodeText(cex);
                                            cwnet += "<span class='ystone'>" + gy.getxmlnodeText(cex) + "<br />" + cwyslv;
                                        } else if (gy.getxmlnodeText(cex) == "风寂云清") {
                                            cwnamet = gy.getxmlnodeText(cex);
                                            cwnet += "<span class='ystone'>" + gy.getxmlnodeText(cex) + "<br />" + cwyslv;
                                        } else if (gy.getxmlnodeText(cex) == "冰落残阳") {
                                            cwnamet = gy.getxmlnodeText(cex);
                                            cwnet += "<span class='ystone'>" + gy.getxmlnodeText(cex) + "<br />" + cwyslv;
                                        } else {
                                            cwys += "<span class='ystone'>" + gy.getxmlnodeText(cex) + "<br />" + cwyslv;
                                        }
                                        cwyslv = "";
                                        break
                                    case "nimbus":
                                        if (cwnamet == "凝香幻彩") {
                                            cwys += cwnet + "灵气：" + gy.getxmlnodeText(cex) + "</span></span><br />" + cwmxlift;
                                        } else if (cwnamet == "冰落残阳") {
                                            cwys += cwnet + "灵气：" + gy.getxmlnodeText(cex) + "</span></span><br />" + cwmxlift + cwmxma;
                                        } else if (cwnamet == "风寂云清") {
                                            cwys += cwnet + "灵气：" + gy.getxmlnodeText(cex) + "</span></span><br />" + cwmxlift + cwdef;
                                        } else {
                                            cwys += "灵气：" + gy.getxmlnodeText(cex) + "</span></span><br />";
                                        }
                                        cwmxlift = "";
                                        cwnamet = "";
                                        cwnet = "";
                                        cwdef = "";
                                        cwmxma = "";
                                        break
                                    case "max_life":
                                        cwmxlift += "<span style='color:#9090ff'>增加宠物气血：" + gy.getxmlnodeText(cex) + "</span><br />";
                                        break
                                    case "speed":
                                        cwys += "<span style='color:#9090ff'>增加宠物速度：" + gy.getxmlnodeText(cex) + "</span><br />";
                                        break
                                    case "power":
                                        cwys += "<span style='color:#9090ff'>增加宠物伤害：" + gy.getxmlnodeText(cex) + "</span><br />";
                                        break
                                    case "max_mana":
                                        cwmxma += "<span style='color:#9090ff'>增加宠物法力：" + gy.getxmlnodeText(cex) + "</span><br />";
                                        break
                                    case "def":
                                        cwdef += "<span style='color:#9090ff'>增加宠物防御：" + gy.getxmlnodeText(cex) + "</span><br />";
                                        break
                                }
                            }
                        }
                    } else {
                        cwys = "";
                    }
                    var petsealCont = ""; var polarTxts = "";
                    if (dom[i].getElementsByTagName("seal")[0] != undefined) {
                        petsealCont = "封印法宝<br/>";
                        petseal += '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/4575.png" style="left: 238px; top: -65px; position: absolute;">';
                        var childrenNodeSeal = gy.getChildren(dom[i].getElementsByTagName("seal")[0]);

                        var childrenNodesealLength = childrenNodeSeal.length;
                        for (var o = 0; o < childrenNodesealLength; o++) {
                            var nowEle = childrenNodeSeal[o];
                            var petsealNodeName = nowEle.nodeName.toLowerCase();
                            var cwseal = gy.getxmlnodeText(nowEle);
                            switch (petsealNodeName) {
                                case "name":
                                    petsealCont += "<span style='color:#9090ff;left:0;'>" + gy.getxmlnodeText(nowEle) + "</span>";
                                    break;
                                case "level":
                                    petsealCont += "<span style='color:#9090ff;position: absolute;left: 47%;'>" + gy.getxmlnodeText(nowEle) + "级</span>";
                                    break;
                                case "polar":
                                    var polar_num = gy.getxmlnodeText(nowEle);
                                    if (polar_num == 1) {
                                        polarTxts = "金相性";
                                    } else if (polar_num == 2) {
                                        polarTxts = "木相性";
                                    } else if (polar_num == 3) {
                                        polarTxts = "水相性";
                                    } else if (polar_num == 4) {
                                        polarTxts = "火相性";
                                    } else if (polar_num == 5) {
                                        polarTxts = "土相性";
                                    } else if (polar_num == 6) {
                                        polarTxts = "物理相性";
                                    }
                                    petsealCont += "<span style='color:#9090ff;right:0;'>" + polarTxts + "</span>";
                                    break;
                            }
                        }
                    }
                    if (childrenNodeLength > 0) {
                        var huanhuaTimes = 0;
                        var qianghuaTimes = 0;
                        for (var j = 0; j < childrenNodeLength; j++) {
                            var nowNode = childrenNode[j];
                            var nowNodeName = childrenNode[j].nodeName.toLowerCase();
                            var color = nowNode.getAttribute('color');
                            switch (nowNodeName) {
                                case "life":
                                    lefthp = gy.getxmlnodeText(nowNode);
                                    break;
                                case "max_life":
                                    expbsh = gy.getxmlnodeText(nowNode);
                                    exphp = (lefthp * 100 / expbsh).toFixed(1) + "%";//计算宠物气血进度条长度
                                    obj['cwattr'] += "<span class='lifeexphp'style='width:94px;'><span id='perrdcwhp' style='width:" + exphp + "'>&nbsp;</span></span><span class='lifehp'>" + lefthp + "/" + expbsh + "</span>";
                                    break;
                                case "mana":
                                    mana = gy.getxmlnodeText(nowNode);
                                    break;
                                case "max_mana":
                                    maxmana = gy.getxmlnodeText(nowNode);
                                    manapar = (mana * 100 / maxmana).toFixed(1) + "%";//计算宠物法力进度条长度
                                    obj['cwattr'] += "<span class='lifeexpmn'style='width:94px;'><span id='perrdcwmn' style='width:" + manapar + "'>&nbsp;</span></span><span class='lifemn'>" + mana + "/" + maxmana + "</span>";
                                    break;
                                case "name":
                                    col = gy.getColor(color);
                                    names = "<span class='cwname' style='color:" + col + "'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "rank":
                                    // if(gy.getxmlnodeText(nowNode)=="鬼宠"){
                                    //   obj['cwaptitude'] += "@<span class='cwegostpic cwegost zizhi'></span>@!";
                                    // }
                                    obj['cwname'] += "<li><a href='javascript:;'>" + names + "<span class='klv' style='color:" + col + "'>(" + gy.getxmlnodeText(nowNode) + ")</span></a></li>";
                                    break;
                                case "raw_name":
                                    obj['cwattr'] += cwnames + enchants + iptico;
                                    break;
                                case "phy_power":
                                    obj['cwattr'] += "<span class='cwspan cwws'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "mag_power":
                                    obj['cwattr'] += "<span class='cwspan cwfs'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "speed":
                                    obj['cwattr'] += "<span class='cwspan cwsd'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "def":
                                    obj['cwattr'] += "<span class='cwspan cwfy'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "con":
                                    obj['cwattr'] += "<span class='cwspan cwtz'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "wiz":
                                    if (cwpolarnone == 0) {
                                        cwpolar = "<span class='cwonspan polar'>相性：无</span>";
                                    }
                                    var cwwgfg = "";
                                    if (cwqhwg != "" && cwqhfg == "") {
                                        cwwgfg = cwqhwg + "</span>";
                                    } else if (cwqhwg == "" && cwqhfg != "") {
                                        cwwgfg = "<span class='cwonspan rebuild'>强化：" + cwqhfg;
                                    } else if (cwqhwg != "" && cwqhfg != "") {
                                        cwwgfg = cwqhwg + cwqhfg;
                                    }

                                    var cwhhlt = "";
                                    if (cwhhqx != "" || cwhhfg != "" || cwhhsd != "" || cwhhfl != "" || cwhhwg != "") {
                                        cwhhlt = "<span class='cwonspan rebuild' style='height:auto;'>" + cwhhqx + cwhhfg + cwhhsd + cwhhfl + cwhhwg + "</span>";
                                    }
                                    obj['cwattr'] += "<span class='cwspan cwll'>" + gy.getxmlnodeText(nowNode) + "</span>" + prbidib + petseal;
                                    obj['cwattr'] += "<span class='cwattrs' id='cwattrs" + i + "'><span class='cwsmallimg'><img src='" + cwicon + "' style='height:127px;'></span><span class='heinone'>&nbsp;</span>" + cwpolar + "" + cwwgfg + "" + cwhhlt + "" + cwjw + "" + cwdwsy + "" + cwhp + "<span class='cwonspanst'>" + cwys + "</span>" + cwdh + "" + cwyh + "<span class='petseal' style='color: #ecf73b;'>" + petsealCont + "</span></span>";
                                    break;
                                case "str":
                                    obj['cwattr'] += "<span class='cwspan cwlil'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "dex":
                                    obj['cwattr'] += "<span class='cwspan cwmj'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "attrib_point":
                                    obj['cwattr'] += "<span class='cwspan cwsxd'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "martial":
                                    obj['cwattr'] += "<span class='cwspan cwwx'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "capacity_level":
                                    stoneslot.push(i + ":" + gy.getxmlnodeText(nowNode));
                                    calv = gy.getxmlnodeText(nowNode);
                                    break;
                                case "exp":
                                    expcw = gy.getxmlnodeText(nowNode);
                                    break;
                                case "enchant":
                                    enchants = "<img width='16' src='/img.gyyxcdn.cn/qibao/Images/FlashImages/6110.png' class='petenchaipt'>";
                                    cwdh += "<span class='cwonspan'><img width='16' src='/img.gyyxcdn.cn/qibao/Images/FlashImages/6110.png' style=' left: 98px; top:96px; position: absolute;'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    if (gy.getxmlnodeText(nowNode) == "点化完成") {
                                        obj['cwaptitude'] += '@<span class="cwenchantpic cwenchant zizhi samedetail"><span class="cwenchant_descriptions" style="display: none;"><span class="petenchant petencha petenchades"></span><br><span>璞经雕琢成良玉，兽蒙点化悟玄机。</span><br><span>点化可以提高宠物的各项成长值。</span></span></span>@!';
                                    }
                                    break;

                                case "mount_type":
                                    if (gy.getxmlnodeText(nowNode) == "精怪") {
                                        //  obj['cwaptitude'] += "@<span class='cwmount_typepic mount_type cwmount_type zizhi'></span>@!";
                                        obj['cwaptitude'] += '@<span class="cwmount_typepic mount_type cwmount_type zizhi samedetail"><span class="cwjg_descriptions" style="display: none;"><span class="petmounttype pet_mountjg pet_mountjgdes"></span><br><span>无人织锦韂，谁为铸金鞭。</span><br><span></span><span>此灵物可被驯化为<span class="petmountstyle">御灵</span>，以供骑乘，<br>成为坐骑后可以为主人带来额外的能力。</span></span></span>@!';

                                    }
                                    if (gy.getxmlnodeText(nowNode) == "御灵") {
                                        // obj['cwaptitude'] += "@<span class='cwmount_typeylpic mount_type  cwmount_typeyl zizhi'></span>@!";
                                        obj['cwaptitude'] += '@<span class="cwmount_typeylpic mount_type  cwmount_typeyl zizhi samedetail"><span class="cwyl_descriptions" style="display: none;"><span class="petmounttype pet_mountyl pet_mountyldes"></span><br><span>奔腾千里荡尘埃，渡水登山紫雾开。</span><br><span></span><span><span class="petmountstyle">御灵</span>类坐骑宠物不仅可以提升主人属性，<br>还有助阵的能力。</span></span></span>@!';

                                    }
                                    break;
                                case "property_bind_attrib":
                                    //宠物绑定属性(1、认主绑定 2、解绑中 3、临时解绑 4、永久绑定)
                                    if (gy.getxmlnodeText(nowNode) == "1") {
                                        prbidib = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6117.png" style="left: 255px; top: -65px; position: absolute;">';
                                    } else if (gy.getxmlnodeText(nowNode) == "2") {
                                        prbidib = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6115.png" style="left: 255px; top: -65px; position: absolute;">';
                                    } else if (gy.getxmlnodeText(nowNode) == "3") {
                                        prbidib = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6113.png" style="left: 255px; top: -65px; position: absolute;">';
                                    } else if (gy.getxmlnodeText(nowNode) == "4") {
                                        prbidib = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6111.png" style="left: 255px; top: -65px; position: absolute;"><span class="cwspan yjbd">永久绑定</span>';
                                    }
                                    break;
                                case "recognize_recognized":
                                    //宠物认主属性(0、尚未认主 1、认主中 2、正在清除认主)
                                    if (gy.getxmlnodeText(nowNode) == "0") {
                                        prbidib = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6115.png" style="left: 255px; top: -65px; position: absolute;">';
                                    } else if (gy.getxmlnodeText(nowNode) == "1") {
                                        prbidib = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6117.png" style="left: 255px; top: -65px; position: absolute;">';
                                    } else if (gy.getxmlnodeText(nowNode) == "2") {
                                        prbidib = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6113.png" style="left: 255px; top: -65px; position: absolute;">';
                                    }
                                    break;
                                case "icon":
                                    cwicon = "/img.gyyxcdn.cn/qibao/Images/bigItemImages/" + gy.getxmlnodeText(nowNode) + ".jpg";
                                    cwnames += "<span class='cwspan shic' id='cwimgshow" + i + "'><img src='/img.gyyxcdn.cn/qibao/Images/bigItemImages/" + gy.getxmlnodeText(nowNode) + ".jpg' style='width:103px!important;height:120px;'></span>";
                                    break;
                                case "tongyuan_label":
                                    if (gy.getxmlnodeText(nowNode) == "1") {
                                        obj['cwattr'] += "<span class='cwspan ty tongyuan1'></span>";
                                    } else if (gy.getxmlnodeText(nowNode) == "2") {
                                        obj['cwattr'] += "<span class='cwspan ty tongyuan2'></span>";
                                    } else if (gy.getxmlnodeText(nowNode) == "3") {
                                        obj['cwattr'] += "<span class='cwspan ty tongyuan3'></span>";
                                    } else if (gy.getxmlnodeText(nowNode) == "4") {
                                        obj['cwattr'] += "<span class='cwspan ty tongyuan4'></span>";
                                    } else if (gy.getxmlnodeText(nowNode) == "5") {
                                        obj['cwattr'] += "<span class='cwspan ty tongyuan5'></span>";
                                    } else if (gy.getxmlnodeText(nowNode) == "6") {
                                        obj['cwattr'] += "<span class='cwspan ty tongyuan6'></span>";
                                    } else if (gy.getxmlnodeText(nowNode) == "7") {
                                        obj['cwattr'] += "<span class='cwspan ty tongyuan7'></span>";
                                    } else if (gy.getxmlnodeText(nowNode) == "8") {
                                        obj['cwattr'] += "<span class='cwspan ty tongyuan8'></span>";
                                    } else if (gy.getxmlnodeText(nowNode) == "9") {
                                        obj['cwattr'] += "<span class='cwspan ty tongyuan9'></span>";
                                    } else if (gy.getxmlnodeText(nowNode) == "10") {
                                        obj['cwattr'] += "<span class='cwspan ty tongyuan10'></span>";
                                    } else if (gy.getxmlnodeText(nowNode) == "11") {
                                        obj['cwattr'] += "<span class='cwspan ty tongyuan11'></span>";
                                    }

                                    break;
                                case "level":
                                    obj['cwattr'] += "<span class='cwspan cwdj'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "intimacy":
                                    obj['cwattr'] += "<span class='cwspan cwqm'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "exp_to_next_level":
                                    expnextcw = gy.getxmlnodeText(nowNode);
                                    if (expcw >= 0) {
                                        exppar = (expcw * 100 / expnextcw).toFixed(1) + "%";//计算宠物经验进度条长度
                                        if ((expcw * 100 / expnextcw).toFixed(1) > 100) {
                                            exppar = "100%";
                                        }
                                        obj['cwattr'] += "<span class='maxexpmn'style='width:238px;'><span id='perrdcwexp' style='width:" + exppar + "'>&nbsp;</span></span><span class='lifemax'>" + expcw + "/" + expnextcw + " (" + (expcw * 100 / expnextcw).toFixed(1) + "%)</span>";
                                    }
                                    break;
                                case "longevity":
                                    obj['cwaptitude'] += "<span class='cwspan cwsm zizhi'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "pet_life_shape":
                                    obj['cwaptitude'] += "<span class='cwspan cwxlcz zizhi'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "shape":
                                    obj['cwaptitude'] += "<span class='cwspan cwzcz zizhi'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "pet_mana_shape":
                                    obj['cwaptitude'] += "<span class='cwspan cwflcz zizhi'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "pet_speed_shape":
                                    obj['cwaptitude'] += "<span class='cwspan cwsdcz zizhi'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "pet_phy_shape":
                                    obj['cwaptitude'] += "<span class='cwspan cwwgcz zizhi'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "pet_mag_shape":
                                    obj['cwaptitude'] += "<span class='cwspan cwfgcz zizhi'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_forgotten":
                                    obj['cwaptitude'] += "<span class='cwspan cwkyw resist'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_poison":
                                    obj['cwaptitude'] += "<span class='cwspan cwkzd resist'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_frozen":
                                    obj['cwaptitude'] += "<span class='cwspan cwkbd resist'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_sleep":
                                    obj['cwaptitude'] += "<span class='cwspan cwkhs resist'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_confusion":
                                    obj['cwaptitude'] += "<span class='cwspan cwkhl resist'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_repress":
                                    obj['cwaptitude'] += "<span class='cwspan cwkzh resist'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_melt":
                                    obj['cwaptitude'] += "<span class='cwspan cwkhg resist'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_cage":
                                    obj['cwaptitude'] += "<span class='cwspan cwksl resist'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_lock":
                                    obj['cwaptitude'] += "<span class='cwspan cwksul resist'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_lost":
                                    obj['cwaptitude'] += "<span class='cwspan cwkmx resist'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_metal":
                                    obj['cwaptitude'] += "<span class='cwspan cwkj resist'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_wood":
                                    obj['cwaptitude'] += "<span class='cwspan cwkm resist'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_water":
                                    obj['cwaptitude'] += "<span class='cwspan cwks resist'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_fire":
                                    obj['cwaptitude'] += "<span class='cwspan cwkh resist'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_earth":
                                    obj['cwaptitude'] += "<span class='cwspan cwkt resist'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_point":
                                    obj['cwaptitude'] += "<span class='cwspan cwkxd resist'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "polar":
                                    var polar_num = gy.getxmlnodeText(nowNode);
                                    if (polar_num == 1) {
                                        obj['cwaptitude'] += '@<span class="cwpolarpic cwpolar1 zizhi samedetail"><span class="cwpolarpic_descriptions" style="display: none;"><span class="petpolar petcwpolar1 petpolardes"></span><br><span>对木相性攻击提升40%</span><br><span>受火相性攻击提升40%</span></span></span>@!';
                                    } else if (polar_num == 2) {
                                        obj['cwaptitude'] += '@<span class="cwpolarpic cwpolar2 zizhi samedetail"><span class="cwpolarpic_descriptions" style="display: none;"><span class="petpolar petcwpolar2 petpolardes"></span><br><span>对土相性攻击提升40%</span><br><span>受金相性攻击提升40%</span></span></span>@!';
                                    } else if (polar_num == 3) {
                                        obj['cwaptitude'] += '@<span class="cwpolarpic cwpolar3 zizhi samedetail"><span class="cwpolarpic_descriptions" style="display: none;"><span class="petpolar petcwpolar3 petpolardes"></span><br><span>对火相性攻击提升40%</span><br><span>受土相性攻击提升40%</span></span></span>@!';
                                    } else if (polar_num == 4) {
                                        obj['cwaptitude'] += '@<span class="cwpolarpic cwpolar4 zizhi samedetail"><span class="cwpolarpic_descriptions" style="display: none;"><span class="petpolar petcwpolar4 petpolardes"></span><br><span>对金相性攻击提升40%</span><br><span>受水相性攻击提升40%</span></span></span>@!';
                                    } else if (polar_num == 5) {
                                        obj['cwaptitude'] += '@<span class="cwpolarpic cwpolar5 zizhi samedetail"><span class="cwpolarpic_descriptions" style="display: none;"><span class="petpolar petcwpolar5 petpolardes"></span><br><span>对水相性攻击提升40%</span><br><span>受木相性攻击提升40%</span></span></span>@!';
                                    } else {
                                        obj['cwaptitude'] += '@<span class="cwpolarpic cwpolar6 zizhi samedetail"><span class="cwpolarpic_descriptions" style="display: none;"><span class="petpolar petcwpolar6 petpolardes"></span><br><span>不受五行相性影响</span><br><span>物理宠物之间的攻击提升40%</span></span></span>@!';
                                    }
                                    cwpolarnone = 1;
                                    cwpolar = "<span class='cwonspan polar'>相性：" + polarArr[gy.getxmlnodeText(nowNode)] + "</span>";
                                    break;
                                case "eclosion":
                                    cwyh += "<span class='cwonspan'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    if (gy.getxmlnodeText(nowNode) == "羽化完成") {
                                        obj['cwaptitude'] += '@<span class="cweclosionpic cweclosion zizhi samedetail"><span class="cweclosion_descriptions" style="display: none;"><span class="peteclosion peteclo peteclosiondes"></span><br><span>阴滓落而形超，阳灵全而羽化。</span><br><span>羽化可以大幅度提高宠物的各项成长，</span><br><span>亦可打入精魄更换形象。</span></span></span>@!';
                                    }
                                    break;
                                case "phy_rebuild_level":
                                    if (gy.getxmlnodeText(nowNode) == 0) {
                                        cwqhwg += "";
                                        qianghuaTimes += parseInt(0);
                                    } else {
                                        cwqhwg += "<span class='cwonspan rebuild'>强化：物攻" + gy.getxmlnodeText(nowNode) + "次";
                                        qianghuaTimes += parseInt(gy.getxmlnodeText(nowNode));
                                    }
                                    break;
                                case "mag_rebuild_level":
                                    if (gy.getxmlnodeText(nowNode) == 0) {
                                        cwqhfg += "";
                                        qianghuaTimes += parseInt(0);
                                    } else {
                                        cwqhfg += "  法攻" + gy.getxmlnodeText(nowNode) + "次</span>";
                                        qianghuaTimes += parseInt(gy.getxmlnodeText(nowNode));
                                    }
                                    break;
                                case "default_capacity_level":
                                    if (calv - gy.getxmlnodeText(nowNode) == 0) {
                                        cwjw += "<span class='cwonspan'>能力阶位：<b class='poalrsb'>" + gy.getxmlnodeText(nowNode) + " 阶</b></span>";
                                    } else {
                                        cwjw += "<span class='cwonspan'>能力阶位：<b class='poalrsb'>" + gy.getxmlnodeText(nowNode) + '+' + (calv - gy.getxmlnodeText(nowNode) + " 阶") + "</b></span>";
                                    }
                                    break;
                                case "dunwu_left_times":
                                    cwdwsy += "<span class='cwonspan'>剩余顿悟次数：" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "dunwu_total_times":
                                    cwdwsy += "<span class='cwonspan'>已免费获得顿悟次数：" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "evolve":
                                    cwhp += "<span class='cwonspan'>魂魄：<span class='polars'>" + gy.getxmlnodeText(nowNode) + "</span></span>";
                                    break;
                                case "morph_life_times":
                                    if (gy.getxmlnodeText(nowNode) == 0) {
                                        cwhhqx += "";
                                        huanhuaTimes += parseInt(0);
                                    } else {
                                        cwhhqx += "<span style='width:100%;'>血量成长：幻化" + gy.getxmlnodeText(nowNode) + "次<br /></span>";
                                        huanhuaTimes += parseInt(gy.getxmlnodeText(nowNode));
                                    }
                                    break;
                                case "morph_mag_times":
                                    if (gy.getxmlnodeText(nowNode) == 0) {
                                        cwhhfg += "";
                                        huanhuaTimes += parseInt(0);
                                    } else {
                                        cwhhfg += "<span style='width:100%;'>法功成长：幻化" + gy.getxmlnodeText(nowNode) + "次<br /></span>";
                                        huanhuaTimes += parseInt(gy.getxmlnodeText(nowNode));
                                    }
                                    break;
                                case "morph_speed_times":
                                    if (gy.getxmlnodeText(nowNode) == 0) {
                                        cwhhsd += "";
                                        huanhuaTimes += parseInt(0);
                                    } else {
                                        cwhhsd += "<span style='width:100%;'>速度成长：幻化" + gy.getxmlnodeText(nowNode) + "次<br /></span>";
                                        huanhuaTimes += parseInt(gy.getxmlnodeText(nowNode));
                                    }
                                    break;
                                case "morph_mana_times":
                                    if (gy.getxmlnodeText(nowNode) == 0) {
                                        cwhhfl += "";
                                        huanhuaTimes += parseInt(0);
                                    } else {
                                        cwhhfl += "<span style='width:100%;'>法力成长：幻化" + gy.getxmlnodeText(nowNode) + "次<br /></span>";
                                        huanhuaTimes += parseInt(gy.getxmlnodeText(nowNode));
                                    }
                                    break;
                                case "morph_phy_times":
                                    if (gy.getxmlnodeText(nowNode) == 0) {
                                        cwhhwg += "";
                                        huanhuaTimes += parseInt(0);
                                    } else {
                                        cwhhwg += "<span style='width:100%;'>物攻成长：幻化" + gy.getxmlnodeText(nowNode) + "次<br /></span>";
                                        huanhuaTimes += parseInt(gy.getxmlnodeText(nowNode));
                                    }
                                    break;
                                case "important_item":
                                    if (gy.getxmlnodeText(nowNode) == 1) {
                                        iptico = '<img width="22" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/iptitem.png" class="petimgipt">';
                                    }
                                    break;
                                case "zhanli_lv":
                                    obj['cwattr'] += '<span class="petimgzl"><img src="/img.gyyxcdn.cn/qibao/Images/FlashImages/' + zhanliArr[gy.getxmlnodeText(nowNode)] + '.png"></span>';
                                    break;
                                //添加宠物宝宝，野生,鬼宠信息
                                case "raw_rank":
                                    var raw_rankTxts = gy.getxmlnodeText(nowNode);
                                    if (raw_rankTxts == 1) {
                                        obj['cwaptitude'] += '@<span class="cwprimarypro cwwild zizhi samedetail"><span class="cwbaby_descriptions" style="display: none;"><span class="petprimarypro petwild petwilddes"></span><br><span></span><span>野生谓之兽</span></span></span>@!';
                                    } else if (raw_rankTxts == 8) {
                                        obj['cwaptitude'] += '@<span class="cwprimarypro cwghost zizhi samedetail"><span class="cwghost_descriptions" style="display: none;"><span class="petprimarypro petghost petgohstdes"></span><br><span>七魄有缘归地府，三魂无分上青天。</span><br><span>来自阴曹地府的宠物拥有独特的技能。</span></span></span>@!';
                                    }
                                    break;

                            }
                        }
                        //处理没有polar属性节点
                        if (dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("polar").length == 0) {
                            obj['cwaptitude'] += '@<span class="cwpolarpic cwpolar6 zizhi samedetail"><span class="cwpolarpic_descriptions" id="cwattrs6" style="display: none;"><span class="petpolar petcwpolar6 petpolardes"></span><br><span>不受五行相性影响</span><br><span>物理宠物之间的攻击提升40%</span></span></span>@!';
                        }
                        if (huanhuaTimes > 0) {
                            var morph_lifelen = dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("morph_life_times").length;
                            var morph_manalen = dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("morph_mana_times").length;
                            var morph_maglen = dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("morph_mag_times").length;
                            var morph_phylen = dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("morph_phy_times").length;
                            var morph_speedlen = dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("morph_speed_times").length;
                            var morph_lifetxt = "", morph_manatxt = "", morph_magtxt = "", morph_phytxt = "", morph_speedtxt = "";
                            var morph_lifetimes = "", morph_manatimes = "", morph_magtimes = "", morph_phytimes = "", morph_speedtimes = "";

                            if (morph_phylen > 0) {
                                morph_phytxt = $(dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("morph_phy_times")[0]).text();
                                if (morph_phytxt > 0) {
                                    morph_phytimes = '<span style="color:#00ff00" class="huanhuastyle">幻化物攻成长：' + morph_phytxt + '/3</span>';
                                } else {
                                    morph_phytimes = '<span class="huanhuastyle">幻化物攻成长：' + morph_phytxt + '/3</span>';
                                }
                            } else {
                                if (morph_phylen == 0) {
                                    morph_phytimes = '<span class="huanhuastyle">幻化物攻成长：0/3</span>';
                                }

                            }
                            if (morph_maglen > 0) {
                                morph_magtxt = $(dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("morph_mag_times")[0]).text();
                                if (morph_magtxt > 0) {
                                    morph_magtimes = '<span style="color:#00ff00" class="huanhuastyle">幻化法攻成长：' + morph_magtxt + '/3</span><br>';
                                } else {
                                    morph_magtimes = '<span class="huanhuastyle">幻化法攻成长：' + morph_magtxt + '/3</span><br>';
                                }
                            } else {
                                if (morph_maglen == 0) {
                                    morph_magtimes = '<span class="huanhuastyle">幻化法攻成长：0/3</span><br>';
                                }
                            }
                            if (morph_lifelen > 0) {
                                morph_lifetxt = $(dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("morph_life_times")[0]).text();
                                if (morph_lifetxt > 0) {
                                    morph_lifetimes = '<span style="color:#00ff00" class="huanhuastyle">幻化血量成长：' + morph_lifetxt + '/3</span>';
                                } else {
                                    morph_lifetimes = '<span class="huanhuastyle">幻化血量成长：' + morph_lifetxt + '/3</span>';
                                }
                            } else {
                                if (morph_lifelen == 0) {
                                    morph_lifetimes = '<span class="huanhuastyle">幻化血量成长：0/3</span>';
                                }
                            }
                            if (morph_speedlen > 0) {
                                morph_speedtxt = $(dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("morph_speed_times")[0]).text();
                                if (morph_speedtxt > 0) {
                                    morph_speedtimes = '<span style="color:#00ff00" class="huanhuastyle">幻化速度成长：' + morph_speedtxt + '/3</span><br>';
                                } else {
                                    morph_speedtimes = '<span class="huanhuastyle">幻化速度成长：' + morph_speedtxt + '/3</span><br>';
                                }
                            } else {
                                if (morph_speedlen == 0) {
                                    morph_speedtimes = '<span class="huanhuastyle">幻化速度成长：0/3</span><br>';
                                }
                            }
                            if (morph_manalen > 0) {
                                morph_manatxt = $(dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("morph_mana_times")[0]).text();
                                if (morph_manatxt > 0) {
                                    morph_manatimes = '<span style="color:#00ff00" class="huanhuastyle">幻化法力成长：' + morph_manatxt + '/3</span>';
                                } else {
                                    morph_manatimes = '<span class="huanhuastyle">幻化法力成长：' + morph_manatxt + '/3</span>';
                                }
                            } else {
                                if (morph_manalen == 0) {
                                    morph_manatimes = '<span class="huanhuastyle  morph_manastyle">幻化法力成长：0/3</span>';
                                }
                            }
                            obj['cwaptitude'] += '@<span class="cwhuanhuapic cwhuanhua zizhi samedetail"><span class="cwhuanhua_descriptions" style="display: none;"><span class="pethuanhua pethuan pethuanhuades"></span><br><span>打到玄通凭幻化，静观原不涉声尘。</span><br><span>以特定宠物进行融合来改变宠物的各项成长。</span><br>' + morph_phytimes + '' +
                                '' + morph_magtimes + morph_lifetimes + morph_speedtimes + morph_manatimes + '</span></span>@!';
                        }
                        if (qianghuaTimes > 0) {
                            var phy_levelen = dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("phy_rebuild_level").length;
                            var mag_rebuilen = dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("mag_rebuild_level").length;
                            var phy_levetxt = ""; var mag_rebuitxt = "";
                            if (phy_levelen > 0) {
                                phy_levetxt = $(dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("phy_rebuild_level")[0]).text();
                            }
                            if (mag_rebuilen > 0) {
                                mag_rebuitxt = $(dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("mag_rebuild_level")[0]).text();
                            }
                            obj['cwaptitude'] += '@<span class="cwqianghuapic cwqianghua zizhi samedetail"><span class="cwqianghua_descriptions" style="display: none;"><span class="petqianghua petqiang petqianghuades"></span><br><span>强化物理攻击<span>' + phy_levetxt + '</span>次</span><br><span>强化法术攻击<span>' + mag_rebuitxt + '</span>次</span></span></span>@!';
                        }
                        //单独处理宝宝原始类型
                        var babay_ranklen = dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("rank").length;
                        var baby_mount_typelen = dom[i].getElementsByTagName("attribs")[0].getElementsByTagName('mount_type').length;
                        var raw_ranklen = dom[i].getElementsByTagName("attribs")[0].getElementsByTagName('raw_rank').length;
                        if (babay_ranklen > 0 && baby_mount_typelen == 0 && raw_ranklen > 0) {
                            var babay_rank = $(dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("rank")[0]).text();
                            var raw_rankTxt = $(dom[i].getElementsByTagName("attribs")[0].getElementsByTagName('raw_rank')[0]).text();
                            if (babay_rank.indexOf("普通") > -1) {
                                if (raw_rankTxt == 2 || raw_rankTxt == 3 || raw_rankTxt == 4 || raw_rankTxt == 5 || raw_rankTxt == 6 || raw_rankTxt == 7 || raw_rankTxt == 9 || raw_rankTxt == 10 || raw_rankTxt == 11) {
                                    obj['cwaptitude'] += '@<span class="cwprimarypro cwbaby zizhi samedetail"><span class="cwbaby_descriptions" style="display: none;"><span class="petprimarypro petbaby petbabydes"></span><br><span>从1级开始培养的普通宠物</span></span></span>@!';
                                }
                            }
                        }

                        //当其中某一项技能为空的时候 就直接删除当前技能选项
                        if (obj['cwname'] == "") delete obj['cwname'];
                        if (obj['cwattr'] == "") delete obj['cwattr'];
                        if (obj['cwaptitude'] == "") delete obj['cwaptitude'];
                    }
                    //宠物同源信息显示在资质面板内
                    if (dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("tongyuan_label")[0] != undefined) {
                        var tongyuan_labelText = gy.getxmlnodeText(dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("tongyuan_label")[0]);
                        var tynowNodeClass = "cwty";
                        var tynowNodeDesClass = "tongyuangray";
                        var typetdes = "typetdes";
                        var tytextdes = "<dt>同&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;源：</dt><dd>";
                        var raw_wildTxt = $(dom[i].getElementsByTagName("attribs")[0].getElementsByTagName('raw_rank')[0]).text();
                        if (dom[i].getElementsByTagName("pet_tongyuan")[0] != undefined && gy.getChildren(dom[i].getElementsByTagName("pet_tongyuan")[0]).length > 0) {
                            var childrenNodetongyuan = gy.getChildren(dom[i].getElementsByTagName("pet_tongyuan")[0]);
                            for (var p = 0, len = childrenNodetongyuan.length; p < len; p++) {
                                var tynowNode = childrenNodetongyuan[p];
                                var color = tynowNode.getAttribute('color');
                                var fontcolor = gy.getColor(tynowNode.getAttribute('color'));
                                tynowNode.getAttribute('type') ? tytextdes += "<span style=color:" + fontcolor + ">" + tynowNode.getAttribute('type').replace(/%s%|%s/, gy.getxmlnodeText(tynowNode)) + "</span></br>" : tytextdes += "";

                                if (color == "green") {
                                    tynowNodeClass = "cwtygreen";
                                    tynowNodeDesClass = "tongyuan";
                                    typetdes = "typet";
                                }
                            }
                            tytextdes += "</dd>";
                        } else {
                            if (raw_wildTxt == 1) {
                                tytextdes = "<span><span class='fontwild'>野生</span>宠物无法激活同源属性。</span>";
                            }
                        }
                        if (tongyuan_labelText == 1) {
                            obj['cwaptitude'] += '@<span class="cwtongyuan ' + tynowNodeClass + '1 zizhi samedetail"><span class="cwtongyuan_descriptions" style="display: none;"><span class="cwspan ' + typetdes + ' ' + tynowNodeDesClass + '1 pettydes"></span><br><span>道混成而自然，木同源而分流。</span><br>' + tytextdes + '</span></span>@!';
                        } else if (tongyuan_labelText == 2) {
                            obj['cwaptitude'] += '@<span class="cwtongyuan ' + tynowNodeClass + '2 zizhi samedetail"><span class="cwtongyuan_descriptions" style="display: none;"><span class="cwspan ' + typetdes + ' ' + tynowNodeDesClass + '2 pettydes"></span><br><span>道混成而自然，木同源而分流。</span><br>' + tytextdes + '</span></span>@!';
                        } else if (tongyuan_labelText == 3) {
                            obj['cwaptitude'] += '@<span class="cwtongyuan ' + tynowNodeClass + '3 zizhi samedetail"><span class="cwtongyuan_descriptions" style="display: none;"><span class="cwspan ' + typetdes + ' ' + tynowNodeDesClass + '3 pettydes"></span><br><span>道混成而自然，木同源而分流。</span><br>' + tytextdes + '</span></span>@!';
                        } else if (tongyuan_labelText == 4) {
                            obj['cwaptitude'] += '@<span class="cwtongyuan ' + tynowNodeClass + '4 zizhi samedetail"><span class="cwtongyuan_descriptions" style="display: none;"><span class="cwspan ' + typetdes + ' ' + tynowNodeDesClass + '4 pettydes"></span><br><span>道混成而自然，木同源而分流。</span><br>' + tytextdes + '</span></span>@!';
                        } else if (tongyuan_labelText == 5) {
                            obj['cwaptitude'] += '@<span class="cwtongyuan ' + tynowNodeClass + '5 zizhi samedetail"><span class="cwtongyuan_descriptions" style="display: none;"><span class="cwspan ' + typetdes + ' ' + tynowNodeDesClass + '5 pettydes"></span><br><span>道混成而自然，木同源而分流。</span><br>' + tytextdes + '</span></span>@!';
                        } else if (tongyuan_labelText == 6) {
                            obj['cwaptitude'] += '@<span class="cwtongyuan ' + tynowNodeClass + '6 zizhi samedetail"><span class="cwtongyuan_descriptions" style="display: none;"><span class="cwspan ' + typetdes + ' ' + tynowNodeDesClass + '6 pettydes"></span><br><span>道混成而自然，木同源而分流。</span><br>' + tytextdes + '</span></span>@!';
                        } else if (tongyuan_labelText == 7) {
                            obj['cwaptitude'] += '@<span class="cwtongyuan ' + tynowNodeClass + '7 zizhi samedetail"><span class="cwtongyuan_descriptions" style="display: none;"><span class="cwspan ' + typetdes + ' ' + tynowNodeDesClass + '7 pettydes"></span><br><span>道混成而自然，木同源而分流。</span><br>' + tytextdes + '</span></span>@!';
                        } else if (tongyuan_labelText == 8) {
                            obj['cwaptitude'] += '@<span class="cwtongyuan ' + tynowNodeClass + '8 zizhi samedetail"><span class="cwtongyuan_descriptions" style="display: none;"><span class="cwspan ' + typetdes + ' ' + tynowNodeDesClass + '8 pettydes"></span><br><span>道混成而自然，木同源而分流。</span><br>' + tytextdes + '</span></span>@!';
                        } else if (tongyuan_labelText == 9) {
                            obj['cwaptitude'] += '@<span class="cwtongyuan ' + tynowNodeClass + '9 zizhi samedetail"><span class="cwtongyuan_descriptions" style="display: none;"><span class="cwspan ' + typetdes + ' ' + tynowNodeDesClass + '9 pettydes"></span><br><span>道混成而自然，木同源而分流。</span><br>' + tytextdes + '</span></span>@!';
                        } else if (tongyuan_labelText == 10) {
                            obj['cwaptitude'] += '@<span class="cwtongyuan ' + tynowNodeClass + '10 zizhi samedetail"><span class="cwtongyuan_descriptions" style="display: none;"><span class="cwspan ' + typetdes + ' ' + tynowNodeDesClass + '10 pettydes"></span><br><span>道混成而自然，木同源而分流。</span><br>' + tytextdes + '</span></span>@!';
                        } else if (tongyuan_labelText == 11) {
                            obj['cwaptitude'] += '@<span class="cwtongyuan ' + tynowNodeClass + '11 zizhi samedetail"><span class="cwtongyuan_descriptions" style="display: none;"><span class="cwspan ' + typetdes + ' ' + tynowNodeDesClass + '11 pettydes"></span><br><span>道混成而自然，木同源而分流。</span><br>' + tytextdes + '</span></span>@!';
                        }


                    }
                    //处理页面宠物资质中相性等标签的按照顺序的显示问题
                    var regPetboxSort = ["cwpolarpic", "mount_type", "cwqianghuapic", "cwenchantpic", "cweclosionpic", "cwhuanhuapic", "cwprimarypro", "cwtongyuan"];//要显示的规则
                    var swapPetboxSpan = [];//要放入的内容
                    var replaceHtml = '<span class="petbox">';
                    obj['cwaptitude'] = obj['cwaptitude'].replace(/@([\w\s\'\"<>\/=:%,，。.#;：&[\u4e00-\u9fa5]*]*)@!/g, function (a, b) {
                        //    replaceHtml+=b;
                        swapPetboxSpan.push(b);
                        return "";
                    });
                    for (var n = 0; n < regPetboxSort.length; n++) {
                        for (var m = 0, len = swapPetboxSpan.length; m < len; m++) {
                            if (swapPetboxSpan[m].indexOf(regPetboxSort[n]) > 0) {
                                replaceHtml += swapPetboxSpan[m];
                            }
                        }
                    }
                    replaceHtml += '</span>';
                    obj['cwaptitude'] += replaceHtml + "</div>";
                    obj['cwattr'] += "</div>";
                }
                obj['cwaptitude'] += "</div></span>";
                return obj;
            }
            //获取经典宠物详情的数据
            function classicchongwuXMLToJSON(dom, obj) {
                obj['cwname'] = ""; //宠物名称
                obj['cwattr'] = ""; //宠物属性详情
                obj['cwaptitude'] = "";//宠物资质详情
                cwys = "", cwyslv = "", cwmxlift = "", cwnimbus = "", cwnamet = "", cwnet = "", cwdef = "", cwmxma = "";//宠物妖石
                obj['cwaptitude'] += "<div class='cwzizhibg_classic' id='cwzizhibg' style='display: block; top: 0px; left: 653px; '><span id='zizhiclose' class='zizhiclose_classic'>&nbsp;</span>";
                //先遍宠物护的个数，在添加属性
                for (var i = 0; i < dom.length; i++) {
                    obj['cwattr'] += "<div class='tag2'>";
                    obj['cwaptitude'] += "<div style=' display: block;'>";
                    var childrenNode = gy.getChildren(dom[i].getElementsByTagName("attribs")[0]);
                    var childrenNodeLength = childrenNode.length;
                    var lefthp = 0, expbsh = 0, exphp = "", names = "", col = "", mana = 0, maxmana = 0, manapar = "", expcw = 0, expnextcw = 0, exppar = "", enchants = "", prbidib = "", cwnames = "", cwpolar = "", cwpolarnone = 0, cwicon = "", cwwg = "", cwfg = "", cwqhwg = "", cwqhfg = "", cwdwsy = "", cwhp = "", cwdh = "", cwyh = "", cwjw = "", cwhhqx = "", cwhhfg = "", cwhhsd = "", cwhhfl = "", cwhhwg = "", iptico = "", zlico = "";
                    var petseal = ""; var calv = "";//把默认阶位传递给阶位
                    //宠物妖石
                    if (dom[i].getElementsByTagName("extra_attribs")[0] == undefined && dom[i].getElementsByTagName("extra_attrib")[0] != undefined) {
                        var childrenNodebook = gy.getChildren(dom[i].getElementsByTagName("extra_attrib")[0]);
                        var childrenNodebookLength = childrenNodebook.length;
                        if (childrenNodebookLength > 0) {
                            cwys = "妖石：<br/>";//宠物妖石
                            for (var j = 0; j < childrenNodebookLength; j++) {
                                //nowEle 遍历中当前的节点
                                var nowEle = childrenNodebook[j];
                                //当前节点的子节点长度
                                var cwElename = nowEle.nodeName.toLowerCase();
                                var cwElenlv = gy.getxmlnodeText(nowEle);
                                cwys += "<span class='ystone'>" + cwElename + "(" + cwElenlv + ") " + "</span>";
                            }
                        }
                    } else if (dom[i].getElementsByTagName("extra_attribs")[0] != undefined) {
                        var childrenexzts = gy.getChildren(dom[i].getElementsByTagName("extra_attribs")[0]);
                        cwys = "妖石：<br/>";//宠物妖石
                        for (var k = 0; k < childrenexzts.length; k++) {
                            for (var o = 0; o < childrenexzts[k].childNodes.length; o++) {
                                var cex = childrenexzts[k].childNodes[o];
                                var cexN = childrenexzts[k].childNodes[o].nodeName.toLowerCase();
                                switch (cexN) {
                                    case "level":
                                        cwyslv += "&nbsp;<span style='color:#fff'>等级：" + gy.getxmlnodeText(cex) + "&nbsp;&nbsp;&nbsp;&nbsp;";
                                        break
                                    case "name":
                                        if (gy.getxmlnodeText(cex) == "凝香幻彩") {
                                            cwnamet = gy.getxmlnodeText(cex);
                                            cwnet += "<span class='ystone'>" + gy.getxmlnodeText(cex) + "<br />" + cwyslv;
                                        } else if (gy.getxmlnodeText(cex) == "风寂云清") {
                                            cwnamet = gy.getxmlnodeText(cex);
                                            cwnet += "<span class='ystone'>" + gy.getxmlnodeText(cex) + "<br />" + cwyslv;
                                        } else if (gy.getxmlnodeText(cex) == "冰落残阳") {
                                            cwnamet = gy.getxmlnodeText(cex);
                                            cwnet += "<span class='ystone'>" + gy.getxmlnodeText(cex) + "<br />" + cwyslv;
                                        } else {
                                            cwys += "<span class='ystone'>" + gy.getxmlnodeText(cex) + "<br />" + cwyslv;
                                        }
                                        cwyslv = "";
                                        break
                                    case "nimbus":
                                        if (cwnamet == "凝香幻彩") {
                                            cwys += cwnet + "灵气：" + gy.getxmlnodeText(cex) + "</span></span><br />" + cwmxlift;
                                        } else if (cwnamet == "冰落残阳") {
                                            cwys += cwnet + "灵气：" + gy.getxmlnodeText(cex) + "</span></span><br />" + cwmxlift + cwmxma;
                                        } else if (cwnamet == "风寂云清") {
                                            cwys += cwnet + "灵气：" + gy.getxmlnodeText(cex) + "</span></span><br />" + cwmxlift + cwdef;
                                        } else {
                                            cwys += "灵气：" + gy.getxmlnodeText(cex) + "</span></span><br />";
                                        }
                                        cwmxlift = "";
                                        cwnamet = "";
                                        cwnet = "";
                                        cwdef = "";
                                        cwmxma = "";
                                        break
                                    case "max_life":
                                        cwmxlift += "<span style='color:#9090ff'>增加宠物气血：" + gy.getxmlnodeText(cex) + "</span><br />";
                                        break
                                    case "speed":
                                        cwys += "<span style='color:#9090ff'>增加宠物速度：" + gy.getxmlnodeText(cex) + "</span><br />";
                                        break
                                    case "power":
                                        cwys += "<span style='color:#9090ff'>增加宠物伤害：" + gy.getxmlnodeText(cex) + "</span><br />";
                                        break
                                    case "max_mana":
                                        cwmxma += "<span style='color:#9090ff'>增加宠物法力：" + gy.getxmlnodeText(cex) + "</span><br />";
                                        break
                                    case "def":
                                        cwdef += "<span style='color:#9090ff'>增加宠物防御：" + gy.getxmlnodeText(cex) + "</span><br />";
                                        break
                                }
                            }
                        }
                    } else {
                        cwys = "";
                    }
                    var petsealCont = ""; var polarTxts = "";
                    if (dom[i].getElementsByTagName("seal")[0] != undefined) {
                        petsealCont = "封印法宝<br/>";
                        petseal += '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/4575.png" style="left: 238px; top: -65px; position: absolute;">';
                        var childrenNodeSeal = gy.getChildren(dom[i].getElementsByTagName("seal")[0]);

                        var childrenNodesealLength = childrenNodeSeal.length;
                        for (var o = 0; o < childrenNodesealLength; o++) {
                            var nowEle = childrenNodeSeal[o];
                            var petsealNodeName = nowEle.nodeName.toLowerCase();
                            var cwseal = gy.getxmlnodeText(nowEle);
                            switch (petsealNodeName) {
                                case "name":
                                    petsealCont += "<span style='color:#9090ff;left:0;'>" + gy.getxmlnodeText(nowEle) + "</span>";
                                    break;
                                case "level":
                                    petsealCont += "<span style='color:#9090ff;position: absolute;left: 47%;'>" + gy.getxmlnodeText(nowEle) + "级</span>";
                                    break;
                                case "polar":
                                    var polar_num = gy.getxmlnodeText(nowEle);
                                    if (polar_num == 1) {
                                        polarTxts = "金相性";
                                    } else if (polar_num == 2) {
                                        polarTxts = "木相性";
                                    } else if (polar_num == 3) {
                                        polarTxts = "水相性";
                                    } else if (polar_num == 4) {
                                        polarTxts = "火相性";
                                    } else if (polar_num == 5) {
                                        polarTxts = "土相性";
                                    } else if (polar_num == 6) {
                                        polarTxts = "物理相性";
                                    }
                                    petsealCont += "<span style='color:#9090ff;right:0;'>" + polarTxts + "</span>";
                                    break;
                            }
                        }
                    }
                    if (childrenNodeLength > 0) {
                        for (var j = 0; j < childrenNodeLength; j++) {
                            var nowNode = childrenNode[j];
                            var nowNodeName = childrenNode[j].nodeName.toLowerCase();
                            var color = nowNode.getAttribute('color');
                            switch (nowNodeName) {
                                case "life":
                                    lefthp = gy.getxmlnodeText(nowNode);
                                    break;
                                case "max_life":
                                    expbsh = gy.getxmlnodeText(nowNode);
                                    exphp = (lefthp * 100 / expbsh).toFixed(1) + "%";//计算宠物气血进度条长度
                                    obj['cwattr'] += "<span class='lifeexphp'style='width:94px;'><span id='perrdcwhp' style='width:" + exphp + "'>&nbsp;</span></span><span class='lifehp'>" + lefthp + "/" + expbsh + "</span>";
                                    break;
                                case "mana":
                                    mana = gy.getxmlnodeText(nowNode);
                                    break;
                                case "max_mana":
                                    maxmana = gy.getxmlnodeText(nowNode);
                                    manapar = (mana * 100 / maxmana).toFixed(1) + "%";//计算宠物法力进度条长度
                                    obj['cwattr'] += "<span class='lifeexpmn'style='width:94px;'><span id='perrdcwmn' style='width:" + manapar + "'>&nbsp;</span></span><span class='lifemn'>" + mana + "/" + maxmana + "</span>";
                                    break;
                                case "name":
                                    col = gy.getColor(color);
                                    names = "<span class='cwname' style='color:" + col + "'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "rank":
                                    obj['cwname'] += "<li><a href='javascript:;'>" + names + "<span class='klv' style='color:" + col + "'>(" + gy.getxmlnodeText(nowNode) + ")</span></a></li>";
                                    break;
                                case "raw_name":
                                    obj['cwattr'] += cwnames + enchants + iptico;
                                    break;
                                case "phy_power":
                                    obj['cwattr'] += "<span class='cwspan cwws'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "mag_power":
                                    obj['cwattr'] += "<span class='cwspan cwfs'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "speed":
                                    obj['cwattr'] += "<span class='cwspan cwsd'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "def":
                                    obj['cwattr'] += "<span class='cwspan cwfy'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "con":
                                    obj['cwattr'] += "<span class='cwspan cwtz'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "wiz":
                                    if (cwpolarnone == 0) {
                                        cwpolar = "<span class='cwonspan polar'>相性：无</span>";
                                    }
                                    var cwwgfg = "";
                                    if (cwqhwg != "" && cwqhfg == "") {
                                        cwwgfg = cwqhwg + "</span>";
                                    } else if (cwqhwg == "" && cwqhfg != "") {
                                        cwwgfg = "<span class='cwonspan rebuild'>强化：" + cwqhfg;
                                    } else if (cwqhwg != "" && cwqhfg != "") {
                                        cwwgfg = cwqhwg + cwqhfg;
                                    }

                                    var cwhhlt = "";
                                    if (cwhhqx != "" || cwhhfg != "" || cwhhsd != "" || cwhhfl != "" || cwhhwg != "") {
                                        cwhhlt = "<span class='cwonspan rebuild' style='height:auto;'>" + cwhhqx + cwhhfg + cwhhsd + cwhhfl + cwhhwg + "</span>";
                                    }
                                    obj['cwattr'] += "<span class='cwspan cwll'>" + gy.getxmlnodeText(nowNode) + "</span>" + prbidib + petseal;
                                    obj['cwattr'] += "<span class='cwattrs' id='cwattrs" + i + "'><span class='cwsmallimg'><img src='" + cwicon + "' style='height:127px;'></span><span class='heinone'>&nbsp;</span>" + cwpolar + "" + cwwgfg + "" + cwhhlt + "" + cwjw + "" + cwdwsy + "" + cwhp + "<span class='cwonspanst'>" + cwys + "</span>" + cwdh + "" + cwyh + "<span class='petseal' style='color: #ecf73b;'>" + petsealCont + "</span></span>";

                                    break;
                                case "str":
                                    obj['cwattr'] += "<span class='cwspan cwlil'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "dex":
                                    obj['cwattr'] += "<span class='cwspan cwmj'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "attrib_point":
                                    obj['cwattr'] += "<span class='cwspan cwsxd'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "martial":
                                    obj['cwattr'] += "<span class='cwspan cwwx'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "capacity_level":
                                    stoneslot.push(i + ":" + gy.getxmlnodeText(nowNode));
                                    calv = gy.getxmlnodeText(nowNode);
                                    break;
                                case "exp":
                                    expcw = gy.getxmlnodeText(nowNode);
                                    break;
                                case "enchant":
                                    enchants = "<img width='16' src='/img.gyyxcdn.cn/qibao/Images/FlashImages/6110.png' class='petenchaipt'>";
                                    cwdh += "<span class='cwonspan'><img width='16' src='/img.gyyxcdn.cn/qibao/Images/FlashImages/6110.png' style=' left: 98px; top:96px; position: absolute;'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "eclosion":
                                    if (dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("eclosion_blocked").length > 0) {
                                        var eclosion_blockedTxt = gy.getxmlnodeText(dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("eclosion_blocked")[0]);
                                        var eclosion_text = gy.getxmlnodeText(dom[i].getElementsByTagName("attribs")[0].getElementsByTagName("eclosion")[0]);
                                        if (eclosion_blockedTxt == 1) {
                                            cwyh += "<span class='cwonspan' style='color:#666'>" + eclosion_text + " · 冻结</span>";
                                        }
                                    }else{
                                         cwyh += "<span class='cwonspan rtx'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    }
                                    break;
                                case "property_bind_attrib":
                                    //宠物绑定属性(1、认主绑定 2、解绑中 3、临时解绑 4、永久绑定)
                                    if (gy.getxmlnodeText(nowNode) == "1") {
                                        prbidib = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6117.png" style="left: 255px; top: -65px; position: absolute;">';
                                    } else if (gy.getxmlnodeText(nowNode) == "2") {
                                        prbidib = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6115.png" style="left: 255px; top: -65px; position: absolute;">';
                                    } else if (gy.getxmlnodeText(nowNode) == "3") {
                                        prbidib = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6113.png" style="left: 255px; top: -65px; position: absolute;">';
                                    } else if (gy.getxmlnodeText(nowNode) == "4") {
                                        prbidib = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6111.png" style="left: 255px; top: -65px; position: absolute;"><span class="cwspan yjbd">永久绑定</span>';
                                    }
                                    break;
                                case "recognize_recognized":
                                    //宠物认主属性(0、尚未认主 1、认主中 2、正在清除认主)
                                    if (gy.getxmlnodeText(nowNode) == "0") {
                                        prbidib = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6115.png" style="left: 255px; top: -65px; position: absolute;">';
                                    } else if (gy.getxmlnodeText(nowNode) == "1") {
                                        prbidib = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6117.png" style="left: 255px; top: -65px; position: absolute;">';
                                    } else if (gy.getxmlnodeText(nowNode) == "2") {
                                        prbidib = '<img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6113.png" style="left: 255px; top: -65px; position: absolute;">';
                                    }
                                    break;
                                case "icon":
                                    cwicon = "/img.gyyxcdn.cn/qibao/Images/bigItemImages/" + gy.getxmlnodeText(nowNode) + ".jpg";
                                    cwnames += "<span class='cwspan shic' id='cwimgshow" + i + "'><img src='/img.gyyxcdn.cn/qibao/Images/bigItemImages/" + gy.getxmlnodeText(nowNode) + ".jpg' style='width:103px!important;height:120px;'></span>";
                                    break;
                                case "level":
                                    obj['cwattr'] += "<span class='cwspan cwdj'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "intimacy":
                                    obj['cwattr'] += "<span class='cwspan cwqm'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "exp_to_next_level":
                                    expnextcw = gy.getxmlnodeText(nowNode);
                                    if (expcw >= 0) {
                                        exppar = (expcw * 100 / expnextcw).toFixed(1) + "%";//计算宠物经验进度条长度
                                        if ((expcw * 100 / expnextcw).toFixed(1) > 100) {
                                            exppar = "100%";
                                        }
                                        obj['cwattr'] += "<span class='maxexpmn'style='width:238px;'><span id='perrdcwexp' style='width:" + exppar + "'>&nbsp;</span></span><span class='lifemax'>" + expcw + "/" + expnextcw + " (" + (expcw * 100 / expnextcw).toFixed(1) + "%)</span>";
                                    }
                                    break;
                                case "longevity":
                                    obj['cwaptitude'] += "<span class='cwspan cwsm_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "pet_life_shape":
                                    obj['cwaptitude'] += "<span class='cwspan cwxlcz_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "shape":
                                    obj['cwaptitude'] += "<span class='cwspan cwzcz_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "pet_mana_shape":
                                    obj['cwaptitude'] += "<span class='cwspan cwflcz_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "pet_speed_shape":
                                    obj['cwaptitude'] += "<span class='cwspan cwsdcz_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "pet_phy_shape":
                                    obj['cwaptitude'] += "<span class='cwspan cwwgcz_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "pet_mag_shape":
                                    obj['cwaptitude'] += "<span class='cwspan cwfgcz_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_forgotten":
                                    obj['cwaptitude'] += "<span class='cwspan cwkyw_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_poison":
                                    obj['cwaptitude'] += "<span class='cwspan cwkzd_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_frozen":
                                    obj['cwaptitude'] += "<span class='cwspan cwkbd_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_sleep":
                                    obj['cwaptitude'] += "<span class='cwspan cwkhs_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_confusion":
                                    obj['cwaptitude'] += "<span class='cwspan cwkhl_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_repress":
                                    obj['cwaptitude'] += "<span class='cwspan cwkzh_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_melt":
                                    obj['cwaptitude'] += "<span class='cwspan cwkhg_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_cage":
                                    obj['cwaptitude'] += "<span class='cwspan cwksl_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_lock":
                                    obj['cwaptitude'] += "<span class='cwspan cwksul_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_lost":
                                    obj['cwaptitude'] += "<span class='cwspan cwkmx_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_metal":
                                    obj['cwaptitude'] += "<span class='cwspan cwkj_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_wood":
                                    obj['cwaptitude'] += "<span class='cwspan cwkm_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_water":
                                    obj['cwaptitude'] += "<span class='cwspan cwks_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_fire":
                                    obj['cwaptitude'] += "<span class='cwspan cwkh_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_earth":
                                    obj['cwaptitude'] += "<span class='cwspan cwkt_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "resist_point":
                                    obj['cwaptitude'] += "<span class='cwspan cwkxd_classic'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "polar":
                                    cwpolarnone = 1;
                                    cwpolar = "<span class='cwonspan polar'>相性：" + polarArr[gy.getxmlnodeText(nowNode)] + "</span>";
                                    break;
                                case "phy_rebuild_level":
                                    if (gy.getxmlnodeText(nowNode) == 0) {
                                        cwqhwg += "";
                                    } else {
                                        cwqhwg += "<span class='cwonspan rebuild'>强化：物攻" + gy.getxmlnodeText(nowNode) + "次";
                                    }
                                    break;
                                case "mag_rebuild_level":
                                    if (gy.getxmlnodeText(nowNode) == 0) {
                                        cwqhfg += "";
                                    } else {
                                        cwqhfg += "  法攻" + gy.getxmlnodeText(nowNode) + "次</span>";
                                    }
                                    break;
                                case "default_capacity_level":
                                    if (calv - gy.getxmlnodeText(nowNode) == 0) {
                                        cwjw += "<span class='cwonspan'>能力阶位：<b class='poalrsb'>" + gy.getxmlnodeText(nowNode) + " 阶</b></span>";
                                    } else {
                                        cwjw += "<span class='cwonspan'>能力阶位：<b class='poalrsb'>" + gy.getxmlnodeText(nowNode) + '+' + (calv - gy.getxmlnodeText(nowNode) + " 阶") + "</b></span>";
                                    }
                                    break;
                                case "dunwu_left_times":
                                    cwdwsy += "<span class='cwonspan'>剩余顿悟次数：" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "dunwu_total_times":
                                    cwdwsy += "<span class='cwonspan'>已免费获得顿悟次数：" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "evolve":
                                    cwhp += "<span class='cwonspan'>魂魄：<span class='polars'>" + gy.getxmlnodeText(nowNode) + "</span></span>";
                                    break;
                                case "morph_life_times":
                                    if (gy.getxmlnodeText(nowNode) == 0) {
                                        cwhhqx += "";
                                    } else {
                                        cwhhqx += "<span style='width:100%;'>血量成长：幻化" + gy.getxmlnodeText(nowNode) + "次<br /></span>";
                                    }
                                    break;
                                case "morph_mag_times":
                                    if (gy.getxmlnodeText(nowNode) == 0) {
                                        cwhhfg += "";
                                    } else {
                                        cwhhfg += "<span style='width:100%;'>法功成长：幻化" + gy.getxmlnodeText(nowNode) + "次<br /></span>";
                                    }
                                    break;
                                case "morph_speed_times":
                                    if (gy.getxmlnodeText(nowNode) == 0) {
                                        cwhhsd += "";
                                    } else {
                                        cwhhsd += "<span style='width:100%;'>速度成长：幻化" + gy.getxmlnodeText(nowNode) + "次<br /></span>";
                                    }
                                    break;
                                case "morph_mana_times":
                                    if (gy.getxmlnodeText(nowNode) == 0) {
                                        cwhhfl += "";
                                    } else {
                                        cwhhfl += "<span style='width:100%;'>法力成长：幻化" + gy.getxmlnodeText(nowNode) + "次<br /></span>";
                                    }
                                    break;
                                case "morph_phy_times":
                                    if (gy.getxmlnodeText(nowNode) == 0) {
                                        cwhhwg += "";
                                    } else {
                                        cwhhwg += "<span style='width:100%;'>物攻成长：幻化" + gy.getxmlnodeText(nowNode) + "次<br /></span>";
                                    }
                                    break;
                                case "important_item":
                                    if (gy.getxmlnodeText(nowNode) == 1) {
                                        iptico = '<img width="22" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/iptitem.png" class="petimgipt">';
                                    }
                                    break;
                                case "zhanli_lv":
                                    obj['cwattr'] += '<span class="petimgzl"><img src="/img.gyyxcdn.cn/qibao/Images/FlashImages/' + zhanliArr[gy.getxmlnodeText(nowNode)] + '.png"></span>';
                                    break;
                            }
                        }
                        //当其中某一项技能为空的时候 就直接删除当前技能选项
                        if (obj['cwname'] == "") delete obj['cwname'];
                        if (obj['cwattr'] == "") delete obj['cwattr'];
                        if (obj['cwaptitude'] == "") delete obj['cwaptitude'];
                    }
                    obj['cwaptitude'] += "</div>";
                    obj['cwattr'] += "</div>";
                }
                obj['cwaptitude'] += "</div>";
                return obj;
            }
            $(".samedetail").on("mouseover", function (e) {
                $(e.currentTarget.children[0]).css("display", "block")
            });
            $(".samedetail").on("mouseout", function (e) {
                $(e.currentTarget.children[0]).css("display", "none")
            })
            //获取守护的数据
            function shouhuXMLToJSON(dom, obj) {
                obj['shname'] = ""; //守护名称
                obj['shattr'] = ""; //守护属性详情
                //先遍历守护的个数，在添加属性
                for (var i = 0; i < dom.length; i++) {
                    obj['shattr'] += "<div class='tag1'>";
                    var childrenNode = gy.getChildren(dom[i].getElementsByTagName("attribs")[0]);
                    var childrenNodeLength = childrenNode.length;
                    var lefthp = 0, expbsh = 0, exphp = "", leftvr = 0, expbvr = 0, expvr = "", isvr = 0;
                    if (childrenNodeLength > 0) {
                        for (var j = 0; j < childrenNodeLength; j++) {
                            var nowNode = childrenNode[j];
                            var nowNodeName = childrenNode[j].nodeName.toLowerCase();
                            var si = gy.getxmlnodeText(nowNode);
                            switch (nowNodeName) {
                                case "life":
                                    lefthp = gy.getxmlnodeText(nowNode);
                                    break;
                                case "max_life":
                                    expbsh = gy.getxmlnodeText(nowNode);
                                    if ((lefthp * 100 / expbsh).toFixed(1) > 0) {
                                        exphp = 100;
                                    } else if ((lefthp * 100 / expbsh).toFixed(1) < 0) {
                                        exphp = 0;
                                    } else {
                                        exphp = (lefthp * 100 / expbsh).toFixed(1) + "%";//计算守护元气进度条长度
                                    }
                                    obj['shattr'] += "<span class='lifeexphp'style='width:237px;'><span id='perrdshhp' style='width:" + exphp + "'>&nbsp;</span></span><span class='lifehp'>" + lefthp + "/" + expbsh + "</span>";
                                    break;
                                case "max_vigour":
                                    leftvr = gy.getxmlnodeText(nowNode);
                                    isvr = 1;
                                    break;
                                case "vigour":
                                    expbvr = gy.getxmlnodeText(nowNode);
                                    if ((expbvr * 100 / leftvr).toFixed(1) > 100) {
                                        expvr = 100;
                                    } else if ((expbvr * 100 / leftvr).toFixed(1) < 0) {
                                        expvr = 0;
                                    } else {
                                        expvr = (expbvr * 100 / leftvr).toFixed(1) + "%";//计算守护气血进度条长度
                                    }
                                    obj['shattr'] += "<span class='lifeexpvr'style='width:237px;'><span id='perrdshvr' style='width:" + expvr + "'>&nbsp;</span></span><span class='lifevr'>" + expbvr + "/" + leftvr + "</span>";
                                    break;
                                case "phy_effect":
                                    obj['shattr'] += "<span class='shspan shwl'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "phy_power":
                                    obj['shattr'] += "<span class='shspan shws'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "mag_power":
                                    obj['shattr'] += "<span class='shspan shfs'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "mag_effect":
                                    obj['shattr'] += "<span class='shspan shxs'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "speed":
                                    obj['shattr'] += "<span class='shspan shsd'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "speed_effect":
                                    obj['shattr'] += "<span class='shspan shsf'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "def":
                                    obj['shattr'] += "<span class='shspan shfy'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "def_effect":
                                    obj['shattr'] += "<span class='shspan shfh'>" + gy.getxmlnodeText(nowNode) + "</span>";
                                    break;
                                case "icon":
                                    obj['shattr'] += "<span class='shspan shic'><img src='/img.gyyxcdn.cn/qibao/Images/bigItemImages/" + gy.getxmlnodeText(nowNode) + ".jpg' style='width:103px!important;height:120px;'></span>";
                                    break;
                                case "suit_icon":
                                    if (si != "861401" && si != "861403" && si != "861405" && si != "861503" && si != "861505" && si != "871401" && si != "871402" && si != "871404" && si != "871405" && si != "861403" && si != "871501" && si != "871505") {
                                        obj['shattr'] += "<span class='shspan shic'><img src='/img.gyyxcdn.cn/qibao/Images/bigItemImages/" + gy.getxmlnodeText(nowNode) + ".png' class='widic'></span>";
                                    } else {
                                        obj['shattr'] += "<span class='shspan shic'><img src='/img.gyyxcdn.cn/qibao/Images/bigItemImages/" + gy.getxmlnodeText(nowNode) + ".png' class='widic'  style='height:150px; position:absolute; top:-12px;left:-27px;'></span>";
                                    }
                                    break;
                                case "polar":
                                    obj['shattr'] += "<span class='shspan shxx'>" + polarArr[gy.getxmlnodeText(nowNode)] + "</span>";
                                    break;
                                case "name":
                                    obj['shname'] += "<li><a href='javascript:;'><span class='shname'>" + gy.getxmlnodeText(nowNode) + "</span><span class='klv'>(" + gy.getxmlnodeText(nowNode) + ")</span></a></li>";
                                    if (isvr == "0") {
                                        if ((lefthp * 100 / expbsh).toFixed(1) > 100) {
                                            exphp = 100;
                                        } else if ((lefthp * 100 / expbsh).toFixed(1) < 0) {
                                            exphp = 0;
                                        } else {
                                            exphp = (lefthp * 100 / expbsh).toFixed(1) + "%";//计算守护元气进度条长度
                                        }
                                        obj['shattr'] += "<span class='lifeexpvr'style='width:237px;'><span id='perrdshvr' style='width:" + exphp + "'>&nbsp;</span></span><span class='lifevr'>" + lefthp + "/" + expbsh + "</span>";
                                    }
                                    isvr = 0;
                                    break;
                            }
                        }
                        //当其中某一项技能为空的时候 就直接删除当前技能选项
                        if (obj['shname'] == "") delete obj['shname'];
                        if (obj['shattr'] == "") delete obj['shattr'];
                    }
                    obj['shattr'] += "</div>";
                }
                return obj;
            }

            //获取角色技能的数据
            function skillsXMLToJSON(dom, obj) {
                var childrenNode = gy.getChildren(dom);
                var childrenNodeLength = childrenNode.length;
                if (childrenNodeLength > 0) {
                    //技能里面分五大技能类别 分别定义技能对象下面的5个技能属性
                    obj['innateskills'] = ""; //师门技能
                    obj['talentskills'] = ""; //生活技能
                    obj['reincarnationskills'] = "";//其它技能
                    obj['yinlingfanskills'] = "";//引灵幡技能
                    obj['fuxizhenxing'] = "";//伏羲经验值
                    for (var i = 0; i < childrenNodeLength; i++) {
                        var nowNode = childrenNode[i];
                        var nowNodeName = childrenNode[i].nodeName.toLowerCase();
                        var nowNodeType = nowNode.getAttribute('type');
                        var firText = "", secText = "", thrText = "", fouText = "", fivText = "", sixText = "";

                        //根据节点的type属性判断当前是那一个技能类别
                        var color = nowNode.getAttribute('color');
                        switch (nowNodeType) {
                            case "师门技能":
                                obj['innateskills'] += "<li><a href='javascript:;' class=''><span class='kname'>" + nowNodeName + "</span><span class='klv'>" + gy.getxmlnodeText(nowNode) + "</span></a></li>";
                                break;
                            case "生活技能":
                                obj['talentskills'] += "<li><a href='javascript:;' class=''><span class='kname'>" + nowNodeName + "</span><span class='klv'>" + gy.getxmlnodeText(nowNode) + "</span></a></li>";
                                break;
                            case "其他技能":
                                obj['reincarnationskills'] += "<li><a href='javascript:;' class=''><span class='kname'>" + nowNodeName + "</span><span class='klv'>" + gy.getxmlnodeText(nowNode) + "</span></a></li>";
                                break;
                            case "天生技能":
                                obj['reincarnationskills'] += "<li><a href='javascript:;' class=''><span class='kname'>" + nowNodeName + "</span><span class='klv'>" + gy.getxmlnodeText(nowNode) + "</span></a></li>";
                                break;
                            case "引灵幡技能":
                                obj['yinlingfanskills'] += gy.ylfskill(nowNodeName, gy.getxmlnodeText(nowNode));
                                break;
                            case "伏羲技能":
                                if (nowNodeName == "伏羲·开门") {
                                    firText = "伏羲铭文之一，在阵型生效的战斗中，</br>主动攻击时，有几率对主目标附带神圣</br>之光效果，最高30%几率。可匹配的阵</br>型有：";
                                    secText = "混元一气阵</br>七曜冲煞阵</br>天地三才阵</br>五行本源阵</br>阴阳两仪阵";
                                } else if (nowNodeName == "伏羲·休门") {
                                    firText = "伏羲铭文之一，在阵型生效的战斗中，</br>主动攻击时，有几率无视主目标的闪避</br>效果，最高30%几率。可匹配的阵型</br>有："
                                    secText = "混元一气阵</br>乾坤六合阵</br>四象玄黄阵</br>太极八卦阵</br>阴阳两仪阵";
                                } else if (nowNodeName == "伏羲·生门") {
                                    firText = "伏羲铭文之一，在阵型生效的战斗中，</br>使用辅助技能时，辅助技能的目标有几</br>率增加1个，最高30%几率。如果辅助</br>技能的目标数已达到10个，则所有目标</br>辅助技能效果提升10% 。可匹配的阵型</br>有："
                                    secText = "混元一气阵</br>七曜冲煞阵</br>四象玄黄阵</br>天地三才阵</br>五行本源阵";
                                } else if (nowNodeName == "伏羲·死门") {
                                    firText = "伏羲铭文之一，在阵型生效的战斗中，</br>使用辅助技能时，有几率随机解除一个</br>己方被障碍的宠物或角色，最高30%几</br>率。可匹配的阵型有："
                                    secText = "乾坤六合阵</br>四象玄黄阵</br>太极八卦阵</br>天地三才阵</br>阴阳两仪阵";
                                } else if (nowNodeName == "伏羲·惊门") {
                                    firText = "伏羲铭文之一，在阵型生效的战斗中，</br>作为主目标被攻击时，攻击者有几率被</br>障碍，最高30%几率，是否障碍成功需</br>根据双方的道行计算。可匹配的阵型</br>有："
                                    secText = "混元一气阵</br>七曜冲煞阵</br>乾坤六合阵</br>天地三才阵</br>五行本源阵";
                                } else if (nowNodeName == "伏羲·伤门") {
                                    firText = "伏羲铭文之一，在阵型生效的战斗中，</br>被使用障碍技能时，有几率闪避障碍技</br>能，最高30%几率。可匹配的阵型有："
                                    secText = "乾坤六合阵</br>四象玄黄阵</br>太极八卦阵</br>五行本源阵</br>阴阳两仪阵";
                                } else if (nowNodeName == "伏羲·杜门") {
                                    firText = "伏羲铭文之一，在阵型生效的战斗中，</br>使用障碍技能时，有几率随机选择一个</br>敌方宠物或角色额外触发一次B4技能</br>伤害，最高30%几率。可匹配的阵型</br>有："
                                    secText = "混元一气阵</br>七曜冲煞阵</br>太极八卦阵</br>天地三才阵</br>五行本源阵";
                                } else if (nowNodeName == "伏羲·景门") {
                                    firText = "伏羲铭文之一，在阵型生效的战斗中，</br>使用障碍技能时，障碍技能的目标数有</br>几率增加1，最高30%几率。可匹配的</br>阵型有："
                                    secText = "七曜冲煞阵</br>乾坤六合阵</br>四象玄黄阵</br>太极八卦阵</br>阴阳两仪阵";
                                }
                                obj['fuxizhenxing'] += "<li><a href='javascript:;' class=''><span class='kname'>" + nowNodeName + "</span><span class='klv FXklv'>" + gy.getxmlnodeText(nowNode) + "</span><span class='FXnum'>5</span></a>" +
                                    "<p class='FXcontent' style='display:none'><span>" + firText + "</span><span>" + secText + "</span></p></li>";
                                break;

                        }
                    }
                    //当其中某一项技能为空的时候 就直接删除当前技能选项
                    if (obj['innateskills'] == "") delete obj['innateskills'];
                    if (obj['talentskills'] == "") delete obj['talentskills'];
                    if (obj['reincarnationskills'] == "") delete obj['reincarnationskills'];
                    if (obj['yinlingfanskills'] == "") delete obj['yinlingfanskills'];
                    if (obj['fuxizhenxing'] == "") delete obj['fuxizhenxing'];
                }
                return obj;
            }

            //获取阵型的数据
            function zhenxingXMLToJSON(dom, obj) {
                var childrenNode = gy.getChildren(dom);
                var childrenNodeLength = childrenNode.length;
                if (childrenNodeLength > 0) {
                    obj['zhenxing'] = "";
                    for (var i = 0; i < childrenNodeLength; i++) {
                        var nowNode = childrenNode[i];
                        var nowNodeName = childrenNode[i].nodeName.toLowerCase();
                        var FirNum = "";
                        var SecNum = "";
                        var liFir = "";
                        var liSec = "";
                        var liThr = "";
                        var liFor = "";
                        var liFiv = "";
                        var stringImgName = "";
                        if (nowNodeName == "混元一气阵") {
                            FirNum = "攻击<b style='color:#40fc40;font-weight:normal'>+20%</b>基础数值，";
                            SecNum = "速度<b style='color:#ad2028;font-weight:normal'>-10%</b>基础数值。";
                            liFir = "1号位：伏羲•开门";
                            liSec = "2号位：伏羲•休门";
                            liThr = "3号位：伏羲•生门";
                            liFor = "4号位：伏羲•惊门";
                            liFiv = "5号位：伏羲•杜门";
                            stringImgName = "hunyuan";

                        } else if (nowNodeName == "阴阳两仪阵") {
                            FirNum = "速度<b style='color:#40fc40;font-weight:normal'>+20%</b>基础数值，";
                            SecNum = "攻击<b style='color:#ad2028;font-weight:normal'>-10%</b>基础数值。";
                            liFir = "1号位：伏羲•开门";
                            liSec = "2号位：伏羲•休门";
                            liThr = "3号位：伏羲•死门";
                            liFor = "4号位：伏羲•伤门";
                            liFiv = "5号位：伏羲•景门";
                            stringImgName = "yinyang";

                        } else if (nowNodeName == "天地三才阵") {
                            FirNum = "准确<b style='color:#40fc40;font-weight:normal'>+20%</b>基础数值，";
                            SecNum = "防御<b style='color:#40fc40;font-weight:normal'>+20%</b>基础数值。";
                            liFir = "1号位：伏羲•开门";
                            liSec = "2号位：伏羲•生门";
                            liThr = "3号位：伏羲•死门";
                            liFor = "4号位：伏羲•惊门";
                            liFiv = "5号位：伏羲•杜门";
                            stringImgName = "tiandi";

                        } else if (nowNodeName == "四象玄黄阵") {
                            FirNum = "防御<b style='color:#40fc40;font-weight:normal'>+25%</b>基础数值，";
                            SecNum = "闪避<b style='color:#40fc40;font-weight:normal'>+15%</b>基础数值。";
                            liFir = "1号位：伏羲•休门";
                            liSec = "2号位：伏羲•生门";
                            liThr = "3号位：伏羲•死门";
                            liFor = "4号位：伏羲•伤门";
                            liFiv = "5号位：伏羲•景门";
                            stringImgName = "sixiang";

                        } else if (nowNodeName == "五行本源阵") {
                            FirNum = "攻击<b style='color:#40fc40;font-weight:normal'>+5%</b>基础数值，";
                            SecNum = "速度<b style='color:#40fc40;font-weight:normal'>+5%</b>基础数值。";
                            liFir = "1号位：伏羲•开门";
                            liSec = "2号位：伏羲•生门";
                            liThr = "3号位：伏羲•惊门";
                            liFor = "4号位：伏羲•伤门";
                            liFiv = "5号位：伏羲•杜门";
                            stringImgName = "wuxing";

                        } else if (nowNodeName == "乾坤六合阵") {
                            FirNum = "攻击<b style='color:#40fc40;font-weight:normal'>+5%</b>基础数值，";
                            SecNum = "防御<b style='color:#40fc40;font-weight:normal'>+25%</b>基础数值。";
                            liFir = "1号位：伏羲•休门";
                            liSec = "2号位：伏羲•死门";
                            liThr = "3号位：伏羲•惊门";
                            liFor = "4号位：伏羲•伤门";
                            liFiv = "5号位：伏羲•景门";
                            stringImgName = "qiankun";

                        } else if (nowNodeName == "七曜冲煞阵") {
                            FirNum = "防御<b style='color:#40fc40;font-weight:normal'>+50%</b>基础数值，";
                            SecNum = "攻击<b style='color:#ad2028;font-weight:normal'>-10%</b>基础数值。";
                            liFir = "1号位：伏羲•开门";
                            liSec = "2号位：伏羲•生门";
                            liThr = "3号位：伏羲•惊门";
                            liFor = "4号位：伏羲•杜门";
                            liFiv = "5号位：伏羲•景门";
                            stringImgName = "qiyao";

                        } else if (nowNodeName == "太极八卦阵") {
                            FirNum = "攻击<b style='color:#40fc40;font-weight:normal'>+5%</b>基础数值，";
                            SecNum = "准确<b style='color:#40fc40;font-weight:normal'>+10%</b>基础数值。";
                            liFir = "1号位：伏羲•休门";
                            liSec = "2号位：伏羲•死门";
                            liThr = "3号位：伏羲•伤门";
                            liFor = "4号位：伏羲•杜门";
                            liFiv = "5号位：伏羲•景门";
                            stringImgName = "taiji";

                        }
                        obj['zhenxing'] += '<li ><span class="formationImg ' + stringImgName + '"></span><span class="formationName">' + nowNodeName + '</span><p class="hidhtml"><span>' + FirNum + '</span><span>' + SecNum + '</span></p><ul class="HidArea" style="display:none"><li>' + liFir + '</li><li>' + liSec + '</li><li>' + liThr + '</li><li>' + liFor + '</li><li>' + liFiv + '</li></ul></li>';

                    }
                    //当其中某一项技能为空的时候 就直接删除当前技能选项
                    if (obj['zhenxing'] == "") delete obj['zhenxing'];
                }
                return obj;
            }

            //获取元婴技能的数据
            function skillsyyXMLToJSON(dom, obj) {
                var childrenNode = gy.getChildren(dom);
                var childrenNodeLength = childrenNode.length;
                if (childrenNodeLength > 0) {
                    //技能里面分五大技能类别 分别定义技能对象下面的5个技能属性
                    obj['innateskillsyy'] = ""; //师门技能
                    obj['talentskillsyy'] = ""; //生活技能
                    obj['reincarnationskillsyy'] = "";//其它技能
                    for (var i = 0; i < childrenNodeLength; i++) {
                        var nowNode = childrenNode[i];
                        var nowNodeName = childrenNode[i].nodeName.toLowerCase();
                        var nowNodeType = nowNode.getAttribute('type');
                        //根据节点的type属性判断当前是那一个技能类别
                        var color = nowNode.getAttribute('color');
                        switch (nowNodeType) {
                            case "师门技能":
                                obj['innateskillsyy'] += "<li><a href='javascript:;' class=''><span class='kname'>" + nowNodeName + "</span><span class='klv'>" + gy.getxmlnodeText(nowNode) + "</span></a></li>";
                                break;
                            case "生活技能":
                                obj['talentskillsyy'] += "<li><a href='javascript:;' class=''><span class='kname'>" + nowNodeName + "</span><span class='klv'>" + gy.getxmlnodeText(nowNode) + "</span></a></li>";
                                break;
                            case "其他技能":
                                obj['reincarnationskillsyy'] += "<li><a href='javascript:;' class=''><span class='kname'>" + nowNodeName + "</span><span class='klv'>" + gy.getxmlnodeText(nowNode) + "</span></a></li>";
                                break;
                            case "天生技能":
                                obj['reincarnationskillsyy'] += "<li><a href='javascript:;' class=''><span class='kname'>" + nowNodeName + "</span><span class='klv'>" + gy.getxmlnodeText(nowNode) + "</span></a></li>";
                                break;
                        }
                    }
                    //当其中某一项技能为空的时候 就直接删除当前技能选项
                    if (obj['innateskillsyy'] == "") delete obj['innateskills'];
                    if (obj['talentskillsyy'] == "") delete obj['talentskills'];
                    if (obj['reincarnationskillsyy'] == "") delete obj['reincarnationskills'];
                }
                return obj;
            }
            //引藏经典服中战力
            if ($("#hidclassicOrderType").val() == "经典区") {
                $("#lwbombtn,#understandbtn,#formationbtn,.rd2zllv,.fuxizhenxing,.petimgzl,.ty,#talentbtn,#stonebtn,.skillleft_tabcw .othertab,.skillleft_tabcw .heartmethod,.pet_capictity").hide();
                $(".rd2zlscore").hide();//隐藏经典服中战力的数据
                $(".classicpotential").show();//显示经典区服中潜能图标
                $(".classicpot").show();//显示经典区服中潜能的数据
                $("#skillcwbtn").css("marginLeft", "45px")
                $("#aptitudebtn").css("marginLeft", "55px")
            }
            //传入两个参数 ①一个json数据 ②一个html模板结构  绑定json数据到模板上然后返回一个jquery对象
            function compiled(JSONdata, overdata) {

                var hasNoneArr = [];
                var expa = 0, expb = 0, expc = 0, expayy = 0, expbyy = 0, iconnone = 0, curattribplan = 0;
                //匹配模板
                var tempString = templateString.roleview;
                var compiledString = tempString.replace(/@([\w_-]*)@/g, function (a, b) {
                    //如果json存在当前数据就返回这个数据，没有就返回空值并且把这个值放进数组
                    if (JSONdata.hasOwnProperty(b)) {
                        //阵型
                        if (b == "zhenxing") {
                            if (JSONdata["zhenxing"][b]) return JSONdata["zhenxing"][b];
                            hasNoneArr.push(b);
                            return "";
                        }
                        //当值是道行的时候换算为××××年××××天。这里居然是360天一年；
                        if (b == "tao") {
                            return parseInt(JSONdata[b] / 360) + "年" + JSONdata[b] % 360 + "天";
                        } else if (b == "taoyy") {
                            //当值是道行的时候换算为××××年××××天。这里居然是360天一年；
                            return parseInt(JSONdata[b] / 360) + "年" + JSONdata[b] % 360 + "天";
                        } else if (b == "exp") {
                            expa = parseInt(JSONdata[b]);
                        } else if (b == "exp_to_next_level") {
                            expb = parseInt(JSONdata[b]);
                        } else if (b == "exp_to_next_level_ex") {
                            expc = parseInt(JSONdata[b]);
                        } else if (b == "expyy") {
                            expayy = parseInt(JSONdata[b]);
                        } else if (b == "exp_to_next_levelyy") {
                            if (expayy > 0) {
                                expbyy = parseInt(JSONdata[b]);
                                return "/" + parseInt(JSONdata[b]) + " (" + (expayy * 100 / expbyy).toFixed(1) + "%)";//元婴经验百分比
                            } else {
                                expbyy = parseInt(JSONdata[b]);
                                return "/" + parseInt(JSONdata[b]) + " (0.0%)";//如果经验为负数，显示0.0%
                            }

                        } else if (b == "staminayy") {
                            return parseInt(JSONdata[b]) + "/"
                        } else if (b == "cash") {
                            var moneyLength = String(JSONdata[b]).length;
                            var color = "";
                            switch (true) {
                                case moneyLength < 6:
                                    color = "#F5F5F5";
                                    break;
                                case moneyLength == 6:
                                    color = "#40FF40";
                                    break;
                                case moneyLength == 7:
                                    color = "#FF00FF";
                                    break;
                                case moneyLength == 8:
                                    color = "#FFFF00";
                                    break;
                                case moneyLength == 9:
                                    color = "#FF2020";
                                    break;
                                case moneyLength > 9:
                                    color = "#00FFFF";
                                    break;
                            }

                            /***
                             格式化
                             *@params money {Number or String} 金额
                             *@params digit {Number} 小数点的位数，不够补0
                             *@returns {String} 格式化后的金额
                             **/
                            function formatMoney(money, digit) {
                                var tpMoney = '0.00';
                                if (undefined != money) {
                                    tpMoney = money;
                                }
                                tpMoney = new Number(tpMoney);
                                if (isNaN(tpMoney)) {
                                    return '0.00';
                                }
                                tpMoney = tpMoney.toFixed(digit) + '';
                                var re = /^(-?\d+)(\d{3})(\.?\d*)/;
                                while (re.test(tpMoney)) {
                                    tpMoney = tpMoney.replace(re, "$1,$2$3")
                                }
                                return tpMoney;
                            }
                            JSONdata[b] = '<span class="cashNum" style="color:' + color + ';white-space: nowrap">' + formatMoney(JSONdata[b]) + '</span>';

                        }

                        if (b == "cur_attrib_plan") {
                            curattribplan = JSONdata[b]
                        }
                        return JSONdata[b];
                    } else {
                        //角色师门技能、生活技能、其他技能、引灵幡技能
                        if (b == "innateskills" || b == "talentskills" || b == "reincarnationskills" || b == "yinlingfanskills" || b == "fuxizhenxing") {
                            if (JSONdata["skills"][b]) return JSONdata["skills"][b];
                            hasNoneArr.push(b);
                            return "";
                        }
                        //元婴师门技能、生活技能、其他技能
                        if (b == "innateskillsyy" || b == "talentskillsyy" || b == "reincarnationskillsyy") {
                            if (JSONdata["skillsyy"][b]) return JSONdata["skillsyy"][b];
                            hasNoneArr.push(b);
                            return "";
                        }
                        //守护基础信息
                        if (b == "shname" || b == "shattr") {
                            if (JSONdata["sh"][b]) return JSONdata["sh"][b];
                            hasNoneArr.push(b);
                            return "";
                        }
                        //宠物基础信息
                        if (b == "cwname" || b == "cwattr" || b == "cwaptitude" || b == "cwcapctity") {
                            if (JSONdata["cw"][b]) return JSONdata["cw"][b];
                            hasNoneArr.push(b);
                            return "";
                        }
                        //背包信息
                        if (b == "bgs") {
                            if (JSONdata["bg"][b]) return JSONdata["bg"][b];
                            hasNoneArr.push(b);
                            return "";
                        }
                        //装备背包信息
                        if (b == "eps" || b == "epss" || b == "epsyy" || b == "epssyy") {
                            if (JSONdata["ep"][b]) return JSONdata["ep"][b];
                            hasNoneArr.push(b);
                            return "";
                        }
                        //娃娃基础信息、技能信息
                        if (b == "wwname" || b == "wwattr" || b == "wwaptitude" || b == "wwcheats") {
                            if (JSONdata["ww"][b]) return JSONdata["ww"][b];
                            hasNoneArr.push(b);
                            return "";
                        }
                        //宠物技能信息
                        if (b == "cwskills" || b == "cwtalent") {
                            if (JSONdata["cwskill"][b]) return JSONdata["cwskill"][b];
                            hasNoneArr.push(b);
                            return "";
                        }
                        //娃娃技能信息
                        if (b == "wwskills") {
                            if (JSONdata["wwskill"][b]) return JSONdata["wwskill"][b];
                            hasNoneArr.push(b);
                            return "";
                        }


                        //角色悟道属性默认为0
                        else if (b == "upgrade_magic" || b == "upgrade_immortal" || b == "upgrade_total" || b == "wudao_stage" || b == "power" || b == "extra_attrib") {
                            return "0";
                        }
                        //角色或者元婴魔道点、修道点、仙道点默认为0
                        else if (b == "upgrade_magicyy" || b == "upgrade_immortalyy" || b == "upgrade_totalyy") {
                            if (iconnone == 1) {//如果没有元婴，就不显示0
                                hasNoneArr.push(b);
                            } else {
                                return "0";
                            }
                        }
                        if (b == "color" || b == "icon" || b == "exp_to_next_level" || b == "max_durability" || b == "polar" || b == "zhanli_lv" || b == "zhanli_lv_backup" || b == "max_mana" || b == "phy_power" || b == "mag_power" || b == "mag_power" || b == "zhanli_score" || b == "speed" || b == "max_life" || b == "def" || b == "intimacy") {
                            return "";
                        }
                        //元婴头像
                        if (b == "iconyy") {
                            iconnone = 1;
                            hasNoneArr.push(b);
                            return "undefined";
                        }
                        //没有门派的时候返回无
                        if (b == "polar" || b == "party_name") {
                            return "无";
                        }
                        hasNoneArr.push(b);
                        return "";
                    }
                });

                //调用gy.parseHTML方法，将匹配好的html字符串转换为html文档对象
                var domCompiledString = gy.parseHTML(compiledString);


                //然后遍历数组 删除没有数据的标签
                var i = 0, aLength = hasNoneArr.length;
                for (i; i < aLength; i++) {
                    if (hasNoneArr[i] == "iconyy") {//如果没有元婴，删除头像
                        var nowEle = gy.getByClass(hasNoneArr[i], domCompiledString)[0];
                        nowEle.parentNode.removeChild(nowEle);
                    } else if (hasNoneArr[i] == "medicine_polar_point") {//删除角色相性药增加总量
                        var nowEle = gy.getByClass(hasNoneArr[i], domCompiledString)[0];
                        nowEle.parentNode.removeChild(nowEle);
                    } else if (hasNoneArr[i] == "medicine_used_jiuzhuan-xianlinglu") {//删除角色九转仙灵露
                        var nowEle = gy.getByClass(hasNoneArr[i], domCompiledString)[0];
                        nowEle.parentNode.removeChild(nowEle);
                    } else if (hasNoneArr[i] == "medicine_used_baohua-yuluwan") {//删除角色宝花玉露丸
                        var nowEle = gy.getByClass(hasNoneArr[i], domCompiledString)[0];
                        nowEle.parentNode.removeChild(nowEle);
                    } else if (hasNoneArr[i] == "medicine_used_sanqingwan") {//删除角色三清丸
                        var nowEle = gy.getByClass(hasNoneArr[i], domCompiledString)[0];
                        nowEle.parentNode.removeChild(nowEle);
                    }
                }


                daojuShowDetailInfo.appendChild(domCompiledString); //添加到dom中
                par.setAttribute("isGetXmlAjax", "true");//加载成功后 给他一个自定义属性，根据这个属性判断第二次就不需要加载ajax了


                //找到人物详情xml中的equip下面的item，单独为遍历装备使用
                eqarrda = data.getElementsByTagName("equip")[0].getElementsByTagName("item");
                //找到人物详情xml中的equip下面的item，单独为遍历装备使用
                bagarrda = data.getElementsByTagName("bag")[0].getElementsByTagName("item");
                //找到人物详情xml中的children下面的item，单独为遍历娃娃装备使用
                wwequipda = data.getElementsByTagName("children")[0].getElementsByTagName("item");

                //绑定装备详情的鼠标经过事件，要单独遍历人物详情中equip中的item标签
                var bDiv = gy.getByClass("js_eqsp");
                var bDivlength = bDiv.length;
                for (var i = 0; i < bDivlength; i++) {
                    var addDivDom = document.createElement('div');
                    addDivDom.className = "daojuShowDetailInfos";
                    addDivDom.style.display = "none";
                    bDiv[i].appendChild(addDivDom);
                    var daojuShowDetailInfos = gy.getByClass("daojuShowDetailInfos", bDiv[i])[0];
                    //鼠标经过时根据data-idx（item标签索引）和data-id（物品分类）显示当前物品信息
                    bDiv[i].onmouseover = function () {
                        var eqdata = eqarrda[this.getAttribute("data-idx")];
                        var chillen = this.children.length - 1;//最后一个元素
                        //1、武器；2、头盔；3、衣服；4、项链；5、玉佩；6、左手镯；7、右手镯；9、技能法宝；10、飞行法宝；51、腰带；31、婚礼礼服；32、婚礼玉佩；
                        switch (this.getAttribute("data-id")) {
                            case "1": case "2": case "3": case "10": case "51": case "11": case "12": case "13": case "14": case "52":
                                Xmlequip.equipCallBack(eqdata, par, suitpolarArr, polarArr);
                                break;
                            case "4": case "5": case "6": case "7": case "9": case "19": case "15": case "16": case "17": case "18":
                                XmlequipOther.XmlepOtherCallBack(eqdata, par, polarArr);
                                break;
                        }
                        this.children[chillen].style.display = "block";
                        this.children[chillen].appendChild(eqdatalist);
                    };
                    bDiv[i].onmouseout = function () {
                        var chillen = this.children.length - 1;//最后一个元素
                        this.children[chillen].innerHTML = "";
                        this.children[chillen].style.display = "none";
                    };
                }

                //绑定包裹详情的鼠标经过事件，要单独遍历人物详情中bag中的item标签
                var bagDiv = gy.getByClass("js_bag");
                var bagDivlength = bagDiv.length;
                for (var i = 0; i < bagDivlength; i++) {
                    var addDivDom = document.createElement('div');
                    addDivDom.className = "daojuShowDetailInfos";
                    addDivDom.style.display = "none";
                    bagDiv[i].appendChild(addDivDom);
                    var daojuShowDetailInfos = gy.getByClass("daojuShowDetailInfos", bagDiv[i])[0];
                    //鼠标经过时根据data-bagidx（item标签索引）和data-id（物品分类）显示当前物品信息
                    bagDiv[i].onmouseover = function () {
                        var bagdata = bagarrda[this.getAttribute("data-bagidx")];
                        var chillen = this.children.length - 1;//最后一个元素
                        var imgnone = this.getAttribute("data-bagidx");
                        if (imgnone != "000") {
                            Xmlbag.bagCallBack(bagdata, par, suitpolarArr, polarArr);
                            this.children[chillen].style.display = "block";
                            this.children[chillen].appendChild(eqdatalist);
                        }
                    };
                    bagDiv[i].onmouseout = function () {
                        var chillen = this.children.length - 1;//最后一个元素
                        var imgnone = this.getAttribute("data-bagidx");
                        if (imgnone != "000") {
                            this.children[chillen].innerHTML = "";
                            this.children[chillen].style.display = "none";
                        }
                    };
                }

                //绑定装备详情的鼠标经过事件，要单独遍历人物详情中children中的item标签
                var chDiv = gy.getByClass("js_wwep");
                var chDivlength = chDiv.length;
                for (var i = 0; i < chDivlength; i++) {
                    var addDivDom = document.createElement('span');
                    addDivDom.className = "daojuShowDetailInfos";
                    addDivDom.style.display = "none";
                    chDiv[i].appendChild(addDivDom);
                    var daojuShowDetailInfos = gy.getByClass("daojuShowDetailInfos", chDiv[i])[0];
                    //鼠标经过时根据data - wwidx（item标签索引）和data - id（物品分类）显示当前物品信息
                    chDiv[i].onmouseover = function () {
                        var wweqdata = wwequipda[this.getAttribute("data-wwidx")];
                        var wwchillen = this.children.length - 1;//最后一个元素
                        //9、娃娃手镯；10、娃娃肚兜；11、娃娃左脚环；12、娃娃右脚环；50、绝技；51-55秘籍；
                        switch (this.getAttribute("data-id")) {
                            case "9": case "10": case "11": case "12":
                                Xmlequip.equipCallBack(wweqdata, par, suitpolarArr, polarArr);
                                break;
                            case "50": case "51": case "52": case "53": case "54": case "55":
                                XmlequipOther.XmlepOtherCallBack(wweqdata, par, polarArr);
                                break;
                        }
                        this.children[wwchillen].style.display = "block";
                        this.children[wwchillen].style.left = "0px";
                        this.children[wwchillen].style.top = "60px";
                        this.children[wwchillen].appendChild(eqdatalist);
                    };
                    chDiv[i].onmouseout = function () {
                        var wwchillen = this.children.length - 1;//最后一个元素
                        this.children[wwchillen].innerHTML = "";
                        this.children[wwchillen].style.display = "none";
                    };
                }

                gy.stonenone(stoneslot);//宠物魂兽石空槽位

                //滚动条初始化
                new ScrollBar('d1', 'c1', 'a1', 'b1');//角色师门技能
                new ScrollBar('d2', 'c2', 'a2', 'b2');//角色生活技能
                new ScrollBar('d4', 'c4', 'a4', 'b4');//元婴师门技能滚动条
                new ScrollBar('d5', 'c5', 'a5', 'b5');//元婴生活技能滚动条
                //选项卡初始化
                gy.gettab("rolenav", "menu_con", "tag")//执行角色tab
                //进度条
                if (expc != 0) {
                    expb = expc * 2100000000 + parseInt(expb);
                }
                if (expa > 0) {
                    if ((expa * 100 / expb).toFixed(1) > 100) {
                        document.getElementById("perrd").style.width = "100%";//经验条超过100%时只显示100%
                        document.getElementById("perrds").style.width = "100%";//经验条超过100%时只显示100%
                    } else {
                        document.getElementById("perrd").style.width = (expa * 100 / expb).toFixed(1) + "%";//计算角色经验条长度
                        document.getElementById("perrds").style.width = (expa * 100 / expb).toFixed(1) + "%";//计算角色经验条长度
                    }
                } else {
                    document.getElementById("perrd").style.width = 0;
                    document.getElementById("perrds").style.width = 0;
                }
                if (expayy > 0) {
                    document.getElementById("perrdyy").style.width = (expayy * 100 / expbyy).toFixed(1) + "%";//计算角色经验条长度
                } else {
                    document.getElementById("perrdyy").style.width = 0;
                }
                if ($(".wudaoattr_list li span").html() == "") {
                    $(".understand").removeClass("on");
                } else {
                    $(".understand").addClass("on")
                }
                if ($(".understand").hasClass("on")) {
                    gy.showdiv("understandbtn", "wudaoleftbg");//点击控制角色悟道面板隐藏显示
                }
                gy.mouselist("ylflist");//显示引灵幡技能说明
                gy.mouseattr("rdicon", "rdattr");//显示人物相性药属性
                gy.showdiv("skillbtn", "skillcenterbg");//点击控制角色技能面板隐藏显示
                gy.showdiv("skillclose", "skillcenterbg"); //关闭角色技能面板
                gy.showdiv("wudaoclose", "wudaoleftbg");//关闭角色悟道面板
                gy.showdiv("lwbombtn", "ylfleftbg");//点击控制角色引灵幡面板隐藏显示
                gy.showdiv("ylfclose", "ylfleftbg");//关闭角色引灵幡面板
                gy.showdiv("yyskillbtn", "yyskillcenterbg");//点击控制元婴技能面板隐藏显示
                gy.showdiv("yyskillclose", "yyskillcenterbg"); //关闭元婴技能面板
                gy.showdiv("zizhiclose", "zizhiResit");//关闭宠物资质面板
                gy.showdiv("aptitudebtn", "zizhiResit");//点击控制宠物资质面板隐藏显示
                gy.showdiv("wwclose", "wwequipbg");//关闭娃娃装备面板
                gy.showdiv("equipbtn", "wwequipbg");//点击控制娃娃装备面板隐藏显示
                gy.showdiv("cwskillclose", "cwskillbg");//关闭宠物资质面板
                gy.showdiv("skillcwbtn", "cwskillbg");//点击控制宠物资质面板隐藏显示
                gy.showdiv("wwskillclose", "wwskillbg");//关闭娃娃技能面板
                gy.showdiv("wwskillbtn", "wwskillbg");//点击控制娃娃技能面板隐藏显示
                gy.showdiv("wwcheatclose", "wwcheatsbg");//关闭娃娃秘籍面板
                gy.showdiv("cheatsbtn", "wwcheatsbg");//点击控制娃娃秘籍面板隐藏显示
                gy.showdiv("formationbtn", "formationleftbg");//点击阵型面板隐藏显示
                gy.showdiv("formationclose", "formationleftbg");//关闭阵型面板
                if ($("#hidclassicOrderType").val() == "经典区") {
                    gy.showdiv("zizhiclose", "cwzizhibg");//关闭宠物资质面板
                    gy.showdiv("aptitudebtn", "cwzizhibg");//点击控制宠物资质面板隐藏显示
                }
                var drag = new Drag("skillcenterbg", { mxContainer: "flashItmeShow", Handle: "skillcenterbg", Limit: true });//拖动角色技能面板
                var drag = new Drag("ylfleftbg", { mxContainer: "flashItmeShow", Handle: "ylfleftbg", Limit: true });//拖动角色引灵幡面板
                var drag = new Drag("wudaoleftbg", { mxContainer: "flashItmeShow", Handle: "wudaoleftbg", Limit: true });//拖动角色悟道面板
                var drag = new Drag("formationleftbg", { mxContainer: "flashItmeShow", Handle: "formationleftbg", Limit: true });//拖动角色阵型面板

                var drag = new Drag("cwzizhibg", { mxContainer: "flashItmeShow", Handle: "cwzizhibg", Limit: true });//拖动宠物资质面板
                var drag = new Drag("cwskillbg", { mxContainer: "flashItmeShow", Handle: "cwskillbg", Limit: true });//拖动宠物技能面板
                var drag = new Drag("cwtalentbg", { mxContainer: "flashItmeShow", Handle: "cwtalentbg", Limit: true });//拖动宠物天赋技面板
                var drag = new Drag("cwtstonebg", { mxContainer: "flashItmeShow", Handle: "cwtstonebg", Limit: true });//拖动宠物魂兽石面板
                var drag = new Drag("yyskillcenterbg", { mxContainer: "flashItmeShow", Handle: "yyskillcenterbg", Limit: true });//拖动宠物技能面板
                var drag = new Drag("wwskillbg", { mxContainer: "flashItmeShow", Handle: "wwskillbg", Limit: true });//拖动娃娃技能面板
                var drag = new Drag("wwequipbg", { mxContainer: "flashItmeShow", Handle: "wwequipbg", Limit: true });//拖动娃娃装备面板
                var drag = new Drag("wwcheatsbg", { mxContainer: "flashItmeShow", Handle: "wwcheatsbg", Limit: true });//拖动娃娃秘籍面板
                gy.skilllist("b1");//角色师门技能选中状态
                gy.skilllist("b2");//角色生活技能选中状态
                gy.skilllist("b3");//角色其他技能选中状态
                gy.skilllist("b4");//元婴师门技能选中状态
                gy.skilllist("b5");//元婴生活技能选中状态
                gy.skilllist("b6");//元婴其他技能选中状态

                var cwsk = gy.tag("li", gy.id("b8"));
                var cwskNum = cwsk.length;
                var petskilltab = gy.tag("div", gy.id("cwskillbg"));
                var listpetskilltabNum = petskilltab.length;

                //宠物技能滚动条绑定
                for (var v = 0; v < cwskNum; v++) {
                    gy.skilllist('cwtb' + v);//宠物顿悟选中状态
                    gy.gettabspan("cwskillnav" + v + "", "cwskill_con" + v + "", "cwtag" + v + "")//执行宠物技能tab
                    gy.mousewwattr("cwimgshow" + v + "", "cwattrs" + v + "");//显示人物相性药属性
                    if (document.getElementById("cwstone" + v) && document.getElementById("cwstone" + v).innerHTML != "") {//宠物没有魂兽石，取消魂兽石按钮高亮
                        document.getElementById("stonebtn").className = "rd4sp stone on";
                        gy.showdiv("cwtstoneclose", "cwtstonebg");//关闭宠物魂兽石面板
                        gy.showdiv("stonebtn", "cwtstonebg");//点击控制宠物魂兽石面板隐藏显示
                    } else {
                        document.getElementById("stonebtn").className = "rd4sp stone";
                        document.getElementById("cwtstonebg").style.display = "none";//隐藏宠物天赋技面板
                    }
                    for (var j1 = 0; j1 < listpetskilltabNum; j1++) {
                        if (v == j1) {
                            petskilltab[j1].style.display = "block";//宠物技能面板显示
                        } else {
                            petskilltab[j1].style.display = "none";//宠物技能面板显示
                        }
                    }
                    gy.skilllist('cwb' + v);//宠物技能选中状态
                    gy.skilllist('cwbooka' + v);//宠物天书选中状态
                    gy.skilllist('cwdwb' + v);//宠物顿悟选中状态
                    gy.skilllist('cwheartmethodb' + v)//宠物心法选中状态
                }
                //如果角色有套装，隐藏普通的图标，显示套装的，根据套装图片宽度调整图片位置,如果角色有变身卡，隐藏普通及套装，显示变身卡头像
                var suitcon = document.getElementById("rdicon").getElementsByTagName("img");
                if (suitcon.length > 2 && suitcon.length < 5) {
                    suitcon[0].style.display = "none";
                    suitcon[2].style.display = "none";
                } else if (suitcon.length > 4) {
                    suitcon[0].style.display = "none";
                    suitcon[1].style.display = "none";
                    suitcon[3].style.display = "none";
                    suitcon[4].style.display = "none";
                }
                //如果守护有套装，隐藏普通的图标，显示套装的，根据套装图片宽度调整图片位置
                var shsuitcon = document.getElementById("menu_sh").getElementsByTagName("div");
                for (var i = 0; i < shsuitcon.length; i++) {
                    if (shsuitcon[i].getElementsByTagName("img").length > 1) {
                        shsuitcon[i].getElementsByTagName("img")[0].style.display = "none";
                    }
                }
                if (curattribplan == 0) {
                    gy.getById("curattrplan2").style.display = "none";
                } else {
                    gy.getById("curattrplan2").style.display = "block";
                }
                gy.getById("curattrplan1").onclick = function () {
                    this.className = "on";
                    gy.getById("curattrplan2").className = "";
                    gy.getById("backuprd2").style.display = "none";
                    gy.getById("backuprd3").style.display = "none";
                    gy.getById("rd2").style.display = "block";
                    gy.getById("rd3").style.display = "block";
                };
                gy.getById("curattrplan2").onclick = function () {
                    this.className = "on";
                    gy.getById("curattrplan1").className = "";
                    gy.getById("backuprd2").style.display = "block";
                    gy.getById("backuprd3").style.display = "block";
                    gy.getById("rd2").style.display = "none";
                    gy.getById("rd3").style.display = "none";
                };
                //抗性资质显示

                $(".cwzizhi_nav span").eq(0).addClass("on");
                if ($(".cwzizhibtn").hasClass("on")) {
                    $(".resist").css("display", "none");
                }
                $(".cwzizhi_nav span").click(function () {
                    var idx = $(this).index();
                    $(this).addClass("on").siblings("span").removeClass("on");
                    if (idx == 1) {
                        $(".cwzizhibg").attr("class", "cwresistancebg").attr("id", "cwresistancebg");
                        $(".zizhi").css("display", "none");
                        $(".resist").css("display", "block");
                    } else {
                        $(".cwresistancebg").attr("class", "cwzizhibg").attr("id", "cwzizhibg");
                        $(".resist").css("display", "none");
                        $(".zizhi").css("display", "block");
                    }

                });
                $(".zizhiclose").click(function () {
                    $(".zizhiResit").css("display", "none");

                })

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
