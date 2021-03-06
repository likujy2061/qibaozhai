<%if request.querystring="v=1.0.0" then    server.transfer("XmlRole.js_v=1.0.0") %>﻿/*-------------------------------------------------------------------------
 * 2017-2-27 by ligen
 * 独立角色xml解析
 -------------------------------------------------------------------------*/

(function () {
    window.Xmlrole = {
        roleCallBack: function (data, par) {
            var addDivDom = document.createElement('div');
            addDivDom.className = "daojuShowDetailInfo";
            addDivDom.style.display = "none";
            par.appendChild(addDivDom);
            var daojuShowDetailInfo = gy.getByClass("daojuShowDetailInfo", par)[0];
            //2：人物  执行ajax请求xml成功后的回调函数
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
                var roleInfo = main.getElementsByTagName("role")[0].getElementsByTagName("attribs")[0];

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
                        var nowEleNodeName = nowEle.nodeName.toLowerCase();

                        if (nowEleNodeName == "color") {
                            obj[nowEle.nodeName.toLowerCase()] = gy.getColor(gy.getxmlnodeText(nowEle));
                        } else if (nowEleNodeName == "polar") {
                            if (gy.getxmlnodeText(nowEle) == "1") {
                                obj[nowEle.nodeName.toLowerCase()] = "金";
                            } else if (gy.getxmlnodeText(nowEle) == "2") {
                                obj[nowEle.nodeName.toLowerCase()] = "木";
                            } else if (gy.getxmlnodeText(nowEle) == "3") {
                                obj[nowEle.nodeName.toLowerCase()] = "水";
                            } else if (gy.getxmlnodeText(nowEle) == "4") {
                                obj[nowEle.nodeName.toLowerCase()] = "火";
                            } else if (gy.getxmlnodeText(nowEle) == "5") {
                                obj[nowEle.nodeName.toLowerCase()] = "土";
                            }
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
                                    nowEle.getAttribute('type') ? obj[nowEle.nodeName.toLowerCase()] = nowEle.getAttribute('type').replace(/%s%|%s/, gy.getxmlnodeText(nowEle)) : obj[nowEle.nodeName.toLowerCase()] = gy.getxmlnodeText(nowEle);

                                }

                            }
                        }
                    }
                }



            }

            //传入两个参数 ①一个json数据 ②一个html模板结构  绑定json数据到模板上然后返回一个jquery对象
            function compiled(JSONdata) {
                var hasNoneArr = [];
                //匹配模板
                var tempString = templateString.role;
                var compiledString = tempString.replace(/@([\w_-]*)@/g, function (a, b) {
                    //如果json存在当前数据就返回这个数据，没有就返回空值并且把这个值放进数组
                    if (JSONdata.hasOwnProperty(b)) {
                        //当值是道行的时候换算为××××年××××天。这里居然是360天一年；
                        if (b == "tao") return parseInt(JSONdata[b] / 360) + "年" + JSONdata[b] % 360 + "天";
                        return JSONdata[b];
                    } else {
                        if (b == "color" || b == "icon" || b == "exp_to_next_level" || b == "max_durability") {
                            return "";
                        }
                        if (b == "polar") {
                            //没有门派的时候返回无
                            return "无";
                        }
                        hasNoneArr.push(b);
                        return "";
                    }
                });

                //调用gy.parseHTML方法，将匹配好的html字符串转换为html文档对象
                var domCompiledString = gy.parseHTML(compiledString);

                daojuShowDetailInfo.appendChild(domCompiledString); //添加到dom中
                par.setAttribute("isGetXmlAjax", "true");//加载成功后 给他一个自定义属性，根据这个属性判断第二次就不需要加载ajax了
                // }

            }
        }
    }
})();
