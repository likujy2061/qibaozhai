<%if request.querystring="v=1.0.0" then    server.transfer("Xmldaoju.js_v=1.0.0") %>﻿/*-------------------------------------------------------------------------
 * 2017-2-27 by ligen
 * 独立道具xml解析
 -------------------------------------------------------------------------*/

(function () {
    window.Xmldaoju = {
        daojuCallBack: function (data, par) {
            var addDivDom = document.createElement('div');
            addDivDom.className = "daojuShowDetailInfo";
            addDivDom.style.display = "none";
            par.appendChild(addDivDom);
            var daojuShowDetailInfo = gy.getByClass("daojuShowDetailInfo", par)[0];
            //1：道具 执行ajax请求xml成功后的回调函数
            //data为请求成功后返回的xml文档
            //执行getInnerNodeText方法 取得xml信息并返回json对象
            var JSONdata = getInnerNodeText(data);
            //执行compiled方法 传入json以及模板 执行拼接字符串方法
            compiled(JSONdata);

            //传一个参数最外层dom节点对象main，获取文档中所有节点的值 返回一个JSON对象
            function getInnerNodeText(main) {
                var obj = {};
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
                var maxminlv = "";//镶嵌令可镶嵌等级
                //遍历所有的子代元素，看其还有没有子代，如果有的话继续遍历子代，没有的话就返回当前元素的innerHTML
                for (i; i < aLength; i++) {
                    //nowEle 遍历中当前的节点
                    var nowEle = main_children[i];

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
                        } else if (nowEleNodeName == "important_item") {
                            if (gy.getxmlnodeText(nowEle) == 1) {
                                obj[nowEle.nodeName.toLowerCase()] = '<img width="22" src="/img.gyyxcdn.cn/qibao/Images/FlashImages/iptitem.png" class="iptimgs">';
                            }
                        } else if (nowEleNodeName == "max_req_level") {
                            maxminlv = gy.getxmlnodeText(nowEle);
                        } else if (nowEleNodeName == "min_req_level") {
                            obj[nowEle.nodeName.toLowerCase()] = "可镶嵌装备等级:" + gy.getxmlnodeText(nowEle) + "-" + maxminlv + "级";
                        } else {
                            //标签里面存在颜色信息的时候 给他套上一个标签定义样式
                            if (nowEle.getAttribute('color') && nowEle.getAttribute('color') != "") {

                                var color = gy.getColor(nowEle.getAttribute('color'));

                                if (obj.hasOwnProperty(nowEleNodeName)) {

                                    //nowEle.getAttribute('type') 看有没有type属性，部分存在type属性，其中存放的文字信息

                                    nowEle.getAttribute('type') ? obj[nowEle.nodeName.toLowerCase()] += "<br/><span style=color:" + color + ">" + nowEle.getAttribute('type').replace(/%s%|%s/, gy.getxmlnodeText(nowEle)) + "</span>" : obj[nowEle.nodeName.toLowerCase()] += "<span style=color:" + color + ">" + gy.getxmlnodeText(nowEle) + "</span>";
                                } else {
                                    nowEle.getAttribute('type') ? obj[nowEle.nodeName.toLowerCase()] = "<span style=color:" + color + ">" + nowEle.getAttribute('type').replace(/%s%|%s/, gy.getxmlnodeText(nowEle)) + "</span>" : obj[nowEle.nodeName.toLowerCase()] = "<span style=color:" + color + ">" + gy.getxmlnodeText(nowEle) + "</span>";

                                }
                            } else { //不存在的时候
                                if (obj.hasOwnProperty(nowEleNodeName)) {
                                    //nowEle.getAttribute('type') 看有没有type属性，部分存在type属性，其中存放的文字信息

                                    nowEle.getAttribute('type') ? obj[nowEle.nodeName.toLowerCase()] += "<br/>" + nowEle.getAttribute('type').replace(/%s%|%s/, gy.getxmlnodeText(nowEle)) : obj[nowEle.nodeName.toLowerCase()] += gy.getxmlnodeText(nowEle);
                                } else {
                                    if (gy.getxmlnodeText(nowEle) == "九转仙灵露" || gy.getxmlnodeText(nowEle) == "工匠斧" || gy.getxmlnodeText(nowEle) == "道风散") {//当道具为“九转仙灵露、工匠斧、道风散”需要单独把名称颜色变成金色
                                        obj[nowEle.nodeName.toLowerCase()] = "<span style=color:#ffff00>" + gy.getxmlnodeText(nowEle) + "</span>";
                                    } else {
                                        nowEle.getAttribute('type') ? obj[nowEle.nodeName.toLowerCase()] = nowEle.getAttribute('type').replace(/%s%|%s/, gy.getxmlnodeText(nowEle)) : obj[nowEle.nodeName.toLowerCase()] = gy.getxmlnodeText(nowEle);
                                    }
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
                var tempString = templateString.daoju;
                var compiledString = tempString.replace(/@([\w_-]*)@/g, function (a, b) {
                    //如果json存在当前数据就返回这个数据，没有就返回空值并且把这个值放进数组
                    if (JSONdata.hasOwnProperty(b)) {
                        if (b == "item_polar" || b == "seal_polar") return polarArr[JSONdata[b]];
                        if (b == "upgrade_type") return upgradetypeArr[JSONdata[b]];
                        return JSONdata[b];
                    } else {
                        if (b == "color" || b == "icon" || b == "exp_to_next_level" || b == "max_durability" || b == "important_item" || b == "max_req_level" || b == "min_req_level") {
                            return "";
                        }
                        hasNoneArr.push(b);
                        return "";
                    }
                });

                //调用gy.parseHTML方法，将匹配好的html字符串转换为html文档对象
                var domCompiledString = gy.parseHTML(compiledString);
                /*var oDiv = document.createElement('div'); //创建div
                 oDiv.innerHTML = compiledString; //给div赋值
                 var domCompiledString = oDiv.children[0]; //间接得到dom对象*/

                //魂兽石PVE属性描述 魂兽石PVP属性描述 这两个属性要显示在一个标签(这个标签的类名定义为了skill_description)里面，如果两个属性都不存在的话就移除这个标签
                if (hasNoneArr.indexOf("inborn_stone_attrib_pve") != -1 && hasNoneArr.indexOf("inborn_stone_attrib_pvp") != -1 && hasNoneArr.indexOf("prop_desc") != -1) {
                    var nowNodeinborn_stone = gy.getByClass("skill_description", domCompiledString)[0];
                    nowNodeinborn_stone.parentNode.removeChild(nowNodeinborn_stone);
                }

                //从数组中删除这两项
                hasNoneArr.removeFromArr("inborn_stone_attrib_pve");
                hasNoneArr.removeFromArr("inborn_stone_attrib_pvp");
                hasNoneArr.removeFromArr("prop_desc");

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
