<%if request.querystring="v=1.0.0" then    server.transfer("XmlepOther.js_v=1.0.0") %>﻿/*-------------------------------------------------------------------------
 * 2017-2-27 by ligen
 * 独立道具xml解析
 -------------------------------------------------------------------------*/

(function () {
    window.XmlequipOther = {
        XmlepOtherCallBack: function (data, par, polarArr) {
            var addDivDom = document.createElement('div');
            addDivDom.className = "daojuShowDetailInfo";
            addDivDom.style.display = "none";
            par.appendChild(addDivDom);
            var daojuShowDetailInfo = gy.getByClass("daojuShowDetailInfo", par)[0];
            //5：装备(法宝 娃娃 首饰)  执行ajax请求xml成功后的回调函数
            //data为请求成功后返回的xml文档
            //执行getInnerNodeText方法 取得xml信息并返回json对象
            var JSONdata = getInnerNodeText(data);
            var isseals = 0;
            //执行compiled方法 传入json以及模板 执行拼接字符串方法
            compiled(JSONdata);

            //传一个参数最外层dom节点对象main，获取文档中所有节点的值 返回一个JSON对象
            function getInnerNodeText(main) {
                var obj = {};

                //seals为法宝中的才有的属性 这里先拿出来单独处理掉
                var seals = main.getElementsByTagName("seal")[0];
                if (seals) {
                    var sealchildren = gy.getChildren(seals);
                    var sealchildrenLength = sealchildren.length;
                    isseals = 1;
                    for (var k = 0; k < sealchildrenLength; k++) {

                        var nowSealNode = sealchildren[k];
                        var nowSealNodename = sealchildren[k].nodeName.toLowerCase();

                        if (nowSealNodename == "color") {
                            obj["seal_" + nowSealNodename] = gy.getColor(gy.getxmlnodeText(nowSealNode));
                        } else {
                            //标签里面存在颜色信息的时候 给他套上一个标签定义样式
                            if (nowSealNode.getAttribute('color') && nowSealNode.getAttribute('color') != "") {

                                var color = gy.getColor(nowSealNode.getAttribute('color'));

                                if (obj.hasOwnProperty("seal_" + nowSealNodename)) {

                                    //nowSealNode.getAttribute('type') 看有没有type属性，部分存在type属性，其中存放的文字信息

                                    nowSealNode.getAttribute('type') ? obj["seal_" + nowSealNodename] += "<br/><span style=color:" + color + ">" + nowSealNode.getAttribute('type').replace(/%s%|%s/, gy.getxmlnodeText(nowSealNode)) + "</span>" : obj["seal_" + nowSealNodename] += "<span style=color:" + color + ">" + gy.getxmlnodeText(nowSealNode) + "</span>";
                                } else {
                                    nowSealNode.getAttribute('type') ? obj["seal_" + nowSealNodename] = "<span style=color:" + color + ">" + nowSealNode.getAttribute('type').replace(/%s%|%s/, gy.getxmlnodeText(nowSealNode)) + "</span>" : obj["seal_" + nowSealNodename] = "<span style=color:" + color + ">" + gy.getxmlnodeText(nowSealNode) + "</span>";

                                }
                            } else { //不存在的时候
                                if (obj.hasOwnProperty("seal_" + nowSealNodename)) {
                                    //nowEle.getAttribute('type') 看有没有type属性，部分存在type属性，其中存放的文字信息

                                    nowSealNode.getAttribute('type') ? obj["seal_" + nowSealNodename] += "<br/>" + nowSealNode.getAttribute('type').replace(/%s%|%s/, gy.getxmlnodeText(nowSealNode)) : obj["seal_" + nowSealNodename] += gy.getxmlnodeText(nowSealNode);
                                } else {
                                    nowSealNode.getAttribute('type') ? obj["seal_" + nowSealNodename] = nowSealNode.getAttribute('type').replace(/%s%|%s/, gy.getxmlnodeText(nowSealNode)) : obj["seal_" + nowSealNodename] = gy.getxmlnodeText(nowSealNode);

                                }

                            }
                        }
                    }
                }
                eachInnerNode(arguments[0], obj);
                return obj;
            }

            //查找对象main下的所有元素节点对象
            //参数①：最外层节点对象main1
            //参数②：一个空对象，用来存放innerHTML
            function eachInnerNode(main1, obj1) {
                var main = arguments[0]; //保存第一个参数
                var obj = arguments[1];  //保存第二个参数
                var main_children = gy.getChildren(main); //获取最外层节点的所有子节点
                var aLength = main_children.length; //当前子节点的长度
                var i = 0;
                var color = ""; //保存单独的颜色值(比如：描述性文字中部分颜色和name的颜色不一样需要单独处理)
                var corties = "", magabsorb = "", defeffect = "", jjname = "";
                var wwtext = '<div class="clearfix" style="text-align: left;">娃娃参与战斗后创造出的神奇秘笈，携<br/>带娃娃后，右键点击可以给娃娃装备上</div>';
                var wwjstext = '<div class="clearfix" style="color:#fff; text-align: left;">娃娃参与战斗后领悟出的传说之绝技，<br/>携带娃娃后，右键点击可以给娃娃装备<br/>上，战斗中积攒足够怒气即可使用</div>';
                var wwbsjstext = '<div class="clearfix" style="color:#fff; text-align: left;">娃娃参与战斗后领悟出的<span style="color:#ff2020">变身绝技</span>，<br/>携带娃娃后，右键点击可以给娃娃装<br/>备上，战斗中积攒足够怒气即可使用</div>';
                //遍历所有的子代元素，看其还有没有子代，如果有的话继续遍历子代，没有的话就返回当前元素的innerHTML

                var retainintimacy = -1;
                for (i; i < aLength; i++) {
                    //nowEle 遍历中当前的节点
                    var nowEle = main_children[i];
                    //if (nowEle.nodeName.toLowerCase() == "item_type_id") {
                    //    alert(nowEle.getAttribute('id'))
                    //}
                    if (nowEle.nodeName.toLowerCase() == "seal") {
                        continue;
                    }
                    //当前节点的子节点长度
                    var bLength = gy.getChildren(nowEle).length;
                    //根据当前节点的子节点长度判断，如果子节点长度大于0 就继续遍历，没有子节点的话 就获取他的innerHTML
                    if (bLength > 0) {
                        arguments.callee(nowEle, obj); //继续执行当前函数
                    } else {
                        //nowEleNodeName 当前节点的名称
                        var nowEleNodeName = nowEle.nodeName.toLowerCase();
                        if (nowEleNodeName == "color") {
                            obj[nowEle.nodeName.toLowerCase()] = gy.getColor(gy.getxmlnodeText(nowEle));
                        } else if (nowEleNodeName == "name") {
                            if (isseals == "1") {
                                obj[nowEle.nodeName.toLowerCase()] = "&nbsp;<img src='/img.gyyxcdn.cn/qibao/Images/FlashImages/4575.png' alt=''/><span style=color:" + color + ">" + gy.getxmlnodeText(nowEle) + "</span>";
                            } else {
                                jjname = gy.getxmlnodeText(nowEle);
                                if (gy.getxmlnodeText(nowEle) == "绝技·回生") {
                                    obj[nowEle.nodeName.toLowerCase()] = "<span style=color:" + color + ">" + gy.getxmlnodeText(nowEle) + "</span>" + wwjstext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：使用后，玩家的宠物在接下来3<br />回合内如果死亡会立即复活，气血保留<br />1点，生效一次后效果消失</div>';
                                } else if (gy.getxmlnodeText(nowEle) == "绝技·销声匿迹") {
                                    obj[nowEle.nodeName.toLowerCase()] = "<span style=color:" + color + ">" + gy.getxmlnodeText(nowEle) + "</span>" + wwjstext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：使用后，玩家本回合进入隐身状态，<br />隐身状态下敌方对本人任何操作均失效，<br />玩家施放任何法术或进行物理攻击均会<br />打破该隐身状态</div>';
                                } else if (gy.getxmlnodeText(nowEle) == "绝技·中流砥柱") {
                                    obj[nowEle.nodeName.toLowerCase()] = "<span style=color:" + color + ">" + gy.getxmlnodeText(nowEle) + "</span>" + wwjstext + "<div class='clearfix' style='color:#ffff00; text-align: left;'>作用：使用后，自身伤害吸收提升<span style='color:#ff2020'>" + magabsorb + "%</span>，<br />且在本回合内，被宠物攻击时防御增加<br /><span style='color:#ff2020'>" + defeffect + "%</span></div>";
                                } else {
                                    obj[nowEle.nodeName.toLowerCase()] = "<span style=color:" + color + ">" + gy.getxmlnodeText(nowEle) + "</span>";
                                }
                            }
                            isseals = 0;
                        } else if (nowEleNodeName == "friend_score") {
							retainintimacy = gy.getxmlnodeText(nowEle);
                        }else if (nowEleNodeName == "retain_intimacy") {
                        	if(retainintimacy==-1){
                        		obj[nowEle.nodeName.toLowerCase()]="";
                        	}else if (gy.getxmlnodeText(nowEle) == 1) {
                                obj[nowEle.nodeName.toLowerCase()] = retainintimacy + "<span style='color:#00ff00'>（保留）</span>"
                            } else {
                                obj[nowEle.nodeName.toLowerCase()] = retainintimacy + "<span style='color:#ff2020'>（不保留）</span>"
                            };
                        }  else if (nowEleNodeName == "child_phy_stunt") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：物理必杀率<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span>增加</div>';
                        } else if (nowEleNodeName == "child_mag_stunt") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：法术必杀率<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span>增加</div>';
                        } else if (nowEleNodeName == "child_ir_water") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：忽视目标抗水<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span>增加</div>';
                        } else if (nowEleNodeName == "child_ir_earth") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：忽视目标抗土<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span>增加</div>';
                        } else if (nowEleNodeName == "child_ir_wood") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：忽视目标抗木<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span>增加</div>';
                        } else if (nowEleNodeName == "child_ir_fire") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：忽视目标抗火<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span>增加</div>';
                        } else if (nowEleNodeName == "child_ir_metal") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：忽视目标抗金<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span>增加</div>';
                        } else if (nowEleNodeName == "child_ignore_def") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：忽视防御<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span>增加</div>';
                        } else if (nowEleNodeName == "child_rd_water") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：化解水系伤害<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span>增加</div>';
                        } else if (nowEleNodeName == "child_rd_earth") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：化解土系伤害<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span>增加</div>';
                        } else if (nowEleNodeName == "child_rd_wood") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：化解木系伤害<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span>增加</div>';
                        } else if (nowEleNodeName == "child_rd_fire") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：化解火系伤害<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span>增加</div>';
                        } else if (nowEleNodeName == "child_rd_metal") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：化解金系伤害<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span>增加</div>';
                        } else if (nowEleNodeName == "child_reduce_mag") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：化解法术伤害<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span>增加</div>';
                        } else if (nowEleNodeName == "child_reduce_phy") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：化解物理伤害<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span>增加</div>';
                        } else if (nowEleNodeName == "child_damage_reduce") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：化解伤害<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span>增加</div>';
                        } else if (nowEleNodeName == "child_physique") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：体魄<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span>增加</div>';
                        } else if (nowEleNodeName == "child_str") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：力气<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span>增加</div>';
                        } else if (nowEleNodeName == "child_wisdom") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：智慧<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span>增加</div>';
                        } else if (nowEleNodeName == "child_dex") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：灵敏<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span>增加</div>';
                        } else if (nowEleNodeName == "child_rr_anger") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：娃娃施展绝技所需怒气减少<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '</span>点</div>';
                        } else if (nowEleNodeName == "child_ig_anger") {
                            obj[nowEle.nodeName.toLowerCase()] = wwtext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：战斗中每回合额外获得怒气<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '</span>点</div>';
                        } else if (nowEleNodeName == "phy_effect") {
                            obj[nowEle.nodeName.toLowerCase()] = wwjstext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：使用后，玩家本回合物理攻击提升<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span></div>';
                        } else if (nowEleNodeName == "mag_effect") {
                            obj[nowEle.nodeName.toLowerCase()] = wwjstext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：使用后，玩家本回合法术攻击提升<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '%</span></div>';
                        } else if (nowEleNodeName == "stun_impr") {
                            if (jjname == "变身绝技·急速舍身") {
                                obj[nowEle.nodeName.toLowerCase()] = wwbsjstext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：使用后，玩家本回合气血降低<br />至1点，下回合角色速度增加，增加<br />的百分比为娃娃评分数值的千分之<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '</span></div>';
                            } else if (jjname == "变身绝技·天道合一") {
                                obj[nowEle.nodeName.toLowerCase()] = wwbsjstext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：使用后，玩家本回合法术攻击提升<br />并无视对方如意圈、五色光环、如幻似梦<br />和金身不灭技能效果，法术攻击提升的百<br />分比为娃娃评分数值的千分之<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '</span></div>';
                            } else if (jjname == "变身绝技·合力破敌") {
                                obj[nowEle.nodeName.toLowerCase()] = wwbsjstext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：使用后，玩家本回合物理攻击提升<br />并无视对方神龙罩、乾坤罩、如幻似梦和<br />金身不灭技能效果，物理攻击提升的百分<br />比为娃娃评分数值的千分之<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '</span></div>';
                            } else if (jjname == "变身绝技·以己渡人") {
                                obj[nowEle.nodeName.toLowerCase()] = wwbsjstext + '<div class="clearfix" style="color:#ffff00; text-align: left;">作用：使用后，玩家气血降低至0点，其<br />中30%平均分配给所有队友（死亡的<br />队友可复活），同时额外恢复百分比为<br />娃娃评分数值的千分之<span style="color:#ff2020">' + gy.getxmlnodeText(nowEle) + '</span>的气血，玩家<br />自身本回合不能被加血</div>';
                            }
                        } else if (nowEleNodeName == "def_effect") {
                            defeffect = gy.getxmlnodeText(nowEle);
                        } else if (nowEleNodeName == "mag_absorb") {
                            magabsorb = gy.getxmlnodeText(nowEle);
                        } else if (nowEleNodeName == "property_bind_attrib") {
                            //装备专有图标(1、认主绑定 2、解绑中 3、临时解绑 4、永久绑定)
                            if (gy.getxmlnodeText(nowEle) == "1") {
                                obj[nowEle.nodeName.toLowerCase()] = '<br/><img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6117.png" style="margin-left:100px; width:16px;">';
                            } else if (gy.getxmlnodeText(nowEle) == "2") {
                                obj[nowEle.nodeName.toLowerCase()] = '<br/><img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6115.png" style="margin-left:100px; width:16px;">';
                            } else if (gy.getxmlnodeText(nowEle) == "3") {
                                obj[nowEle.nodeName.toLowerCase()] = '<br/><img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6113.jpg" style="margin-left:100px; width:16px;">';
                            } else if (gy.getxmlnodeText(nowEle) == "4") {
                                obj[nowEle.nodeName.toLowerCase()] = '<br/><img width="16" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/6111.png" style="margin-left:100px; width:16px;">';
                            }

                        } else if (nowEleNodeName == "important_item") {
                            if (gy.getxmlnodeText(nowEle) == 1) {
                                obj[nowEle.nodeName.toLowerCase()] = '<img width="22" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/iptitem.png" class="iptimgs">';
                            }
                        } else if (nowEleNodeName == "convert_times") {
                            corties = gy.getxmlnodeText(nowEle);
                        } else if (nowEleNodeName == "max_convert_times") {
                            if (corties == 0 && gy.getxmlnodeText(nowEle) == 0) {
                                obj[nowEle.nodeName.toLowerCase()] = "";
                            } else {
                                obj[nowEle.nodeName.toLowerCase()] = "可转换次数：" + (gy.getxmlnodeText(nowEle) - corties) + "/" + gy.getxmlnodeText(nowEle)
                            }
                        } else {
                            //标签里面存在颜色信息的时候 给他套上一个标签定义样式
                            if (nowEle.getAttribute('color') && nowEle.getAttribute('color') != "") {

                                var color = gy.getColor(nowEle.getAttribute('color'));

                                if (obj.hasOwnProperty(nowEleNodeName)) {
                                    //nowEle.getAttribute('type') 看有没有type属性，部分存在type属性，其中存放的文字信息
                                    nowEle.getAttribute('type') ? obj[nowEle.nodeName.toLowerCase()] += "<br/><span style=color:" + color + ">" + nowEle.getAttribute('type').replace(/%s%|%s/, gy.getxmlnodeText(nowEle)) + "</span>" : obj[nowEle.nodeName.toLowerCase()] += "<span style=color:" + color + ">" + gy.getxmlnodeText(nowEle) + "</span>";
                                } else {
                                    if (nowEleNodeName == "basic_attrib") {
                                        var index = nowEle.getAttribute('type').lastIndexOf('：');
                                        obj[nowEle.nodeName.toLowerCase()] = "<span>" + nowEle.getAttribute('type').substring(0, (index + 1)) + "</span>" + "<span style=color:" + color + ">" + nowEle.getAttribute('type').substring((index + 1), gy.getxmlnodeText(nowEle)).replace(/%s%|%s/, gy.getxmlnodeText(nowEle)) + "</span>";
                                    } else {
                                        nowEle.getAttribute('type') ? obj[nowEle.nodeName.toLowerCase()] = "<span style=color:" + color + ">" + nowEle.getAttribute('type').replace(/%s%|%s/, gy.getxmlnodeText(nowEle)) + "</span>" : obj[nowEle.nodeName.toLowerCase()] = "<span style=color:" + color + ">" + gy.getxmlnodeText(nowEle) + "</span>";
                                    }
                                }
                            } else { //不存在的时候
                                if (obj.hasOwnProperty(nowEleNodeName)) {
                                    //nowEle.getAttribute('type') 看有没有type属性，部分存在type属性，其中存放的文字信息

                                    nowEle.getAttribute('type') ? obj[nowEle.nodeName.toLowerCase()] += "<br/>" + nowEle.getAttribute('type').replace(/%s%|%s/, gy.getxmlnodeText(nowEle)) : obj[nowEle.nodeName.toLowerCase()] += gy.getxmlnodeText(nowEle);
                                } else {
                                    nowEle.getAttribute('type') ? obj[nowEle.nodeName.toLowerCase()] = nowEle.getAttribute('type').replace(/%s%|%s/, gy.getxmlnodeText(nowEle)) : obj[nowEle.nodeName.toLowerCase()] = gy.getxmlnodeText(nowEle);

                                }

                            }
                        }
                    }
                }
            }

            //传入两个参数 ①一个json数据 ②一个html模板结构  绑定json数据到模板上然后返回一个jquery对象
            function compiled(JSONdata) {
                //console.log(JSONdata);

                var hasNoneArr = []; //保存模板中有的标签 而json中没有的数据

                /*  //让图片加载完成之后在绑定数据添加DOM
                 //创建image对象
                 var image = new Image();
                 //定义图片地址
                 image.src = "/Images/BigItemImages/"+JSONdata.icon+".jpg";
                 //图片加载完毕之后匹配模版
                 image.onload = function(){*/
                //匹配模板
                var tempString = templateString.equipOther;
                var compiledString = tempString.replace(/@([\w_-]*)@/g, function (a, b) {
                    //如果json存在当前数据就返回这个数据，没有就返回空值并且把这个值放进数组
                    if (JSONdata.hasOwnProperty(b)) {
                    	if (b == "retain_intimacy") {
                    		if (JSONdata[b]=="") {
                            hasNoneArr.push(b);
                        	return "";
                       		}
                    	}
                	
                        if (b == "attrib") {
                            if (JSONdata[b].indexOf("雪象") != -1) {
                                return JSONdata[b] + '<img src="/img.gyyxcdn.cn/qibao/Images/FlashImages/8563.png" style=" height: 14px; position: absolute; top: 22px; left: 306px;">';
                            } else if (JSONdata[b].indexOf("炎象") != -1) {
                                return JSONdata[b] + '<img src="/img.gyyxcdn.cn/qibao/Images/FlashImages/9941.png" style=" height: 14px; position: absolute; top: 22px; left: 306px;">';
                            } else if (JSONdata[b].indexOf("风象") != -1) {
                                return JSONdata[b] + '<img src="/img.gyyxcdn.cn/qibao/Images/FlashImages/8561.png" style=" height: 13px; position: absolute; top: 22px; left: 306px;">';
                            } else if (JSONdata[b].indexOf("雾象") != -1) {
                                return JSONdata[b] + '<img src="/img.gyyxcdn.cn/qibao/Images/FlashImages/8564.png" style=" height: 14px; position: absolute; top: 22px; left: 306px;">';
                            } else if (JSONdata[b].indexOf("雨象") != -1) {
                                return JSONdata[b] + '<img src="/img.gyyxcdn.cn/qibao/Images/FlashImages/8562.png" style=" height: 13px; position: absolute; top: 22px; left: 306px;">';
                            }
                        }
                        if (b == "item_polar" || b == "seal_polar") return polarArr[JSONdata[b]];
                       
                        return JSONdata[b];
                    } else {
                        if (b == "child_phy_stunt" || b == "child_mag_stunt" || b == "child_ir_water" || b == "child_ir_earth" || b == "child_ir_wood" || b == "child_ir_fire" || b == "child_ir_metal" || b == "child_rd_water" || b == "child_rd_earth" || b == "child_rd_wood" || b == "child_rd_fire" || b == "child_rd_metal" || b == "child_reduce_mag" || b == "child_reduce_phy" || b == "child_damage_reduce" || b == "child_physique" || b == "child_str" || b == "child_wisdom" || b == "child_dex" || b == "child_rr_anger" || b == "child_ig_anger" || b == "child_ignore_def") {
                            hasNoneArr.push(b);
                            return "";
                        } else if (b == "color" || b == "icon" || b == "exp_to_next_level" || b == "max_durability" || b == "important_item" || b == "property_bind_attrib" || b == "property_left_time" || b == "max_convert_times" || b == "phy_effect" || b == "mag_effect" || b == "stun_impr" ) {
                            return "";
                        }
                        hasNoneArr.push(b);
                        return "";
                    }
                });

                //调用gy.parseHTML方法，将匹配好的html字符串转换为html文档对象
                var domCompiledString = gy.parseHTML(compiledString);
                eqdatalist = domCompiledString;
                /*var oDiv = document.createElement('div'); //创建div
                 oDiv.innerHTML = compiledString; //给div赋值
                 var domCompiledString = oDiv.children[0]; //间接得到dom对象*/

                //魂兽石PVE属性描述 魂兽石PVP属性描述 这两个属性要显示在一个标签(这个标签的类名定义为了skill_description)里面，如果两个属性都不存在的话就移除这个标签
                if (hasNoneArr.indexOf("inborn_stone_attrib_pve") != -1 && hasNoneArr.indexOf("inborn_stone_attrib_pvp") != -1) {
                    var nowNodeinborn_stone = gy.getByClass("skill_description", domCompiledString)[0];
                    nowNodeinborn_stone.parentNode.removeChild(nowNodeinborn_stone);
                }

                //从数组中删除这两项
                hasNoneArr.removeFromArr("inborn_stone_attrib_pve");
                hasNoneArr.removeFromArr("inborn_stone_attrib_pvp");

                //然后遍历数组 删除没有数据的标签
                var i = 0, aLength = hasNoneArr.length;
                for (i; i < aLength; i++) {
                    var nowEle = gy.getByClass(hasNoneArr[i], domCompiledString)[0];
                    nowEle.parentNode.removeChild(nowEle);
                }

                daojuShowDetailInfo.appendChild(domCompiledString); //添加到dom中
                par.setAttribute("isGetXmlAjax", "true");//加载成功后 给他一个自定义属性，根据这个属性判断第二次就不需要加载ajax了
                // }

            }
        }
    }
})();
