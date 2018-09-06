<%if request.querystring="v=1.0.0" then    server.transfer("XmlMoney.js_v=1.0.0") %>﻿/*-------------------------------------------------------------------------
 * 2017-2-27 by ligen
 * 独立角色xml解析
 -------------------------------------------------------------------------*/

(function () {
    window.XmlMoney = {
        wendaoMoneyCallBack: function (data, par) {
            var addDivDom = document.createElement('div');
            addDivDom.className = "daojuShowDetailInfo";
            addDivDom.style.display = "none";
            par.appendChild(addDivDom);
            var daojuShowDetailInfo = gy.getByClass("daojuShowDetailInfo", par)[0];
            //6：问道币 执行ajax请求xml成功后的回调函数
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

                var moneyNum = gy.getxmlnodeText(main.getElementsByTagName("cash")[0]);
                var moneyLength = String(moneyNum).length;

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
                obj["moneyNum"] = formatMoney(moneyNum);
                obj["moneyColor"] = color;

            }

            //传入两个参数 ①一个json数据 ②一个html模板结构  绑定json数据到模板上然后返回一个jquery对象
            function compiled(JSONdata) {


                //匹配模板
                var tempString = templateString.wendaoMoney;
                var compiledString = tempString.replace(/@([\w_-]*)@/g, function (a, b) {
                    //如果json存在当前数据就返回这个数据，没有就返回空值并且把这个值放进数组
                    if (JSONdata.hasOwnProperty(b)) {
                        return JSONdata[b];
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
