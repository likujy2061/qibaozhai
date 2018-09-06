<%if request.querystring="v=1.0.0" then    server.transfer("popFn.js_v=1.0.0") %>﻿/*
by xuyan 2014/12/2
Version:v1.0
奇宝斋 通用登录层，选择角色层
 * init  给特定class名的元素加载事件 
 * getUserStatus 判断用户登录状态
 * showLogindiv 登录层
 * showChooseRolediv 选择角色层
 * countDown 短信定时器倒计时
 * getLogoutToServerList 退出，跳到重选服务器
 * Goto 跳转链接
 * ShowMessageDiv 弹出提示层
 * TimeOutDiv 登陆超时弹层
 * IsHasProtection 判断是否有绑定密保
 * NoHasProtectionDiv 没有绑定密保弹层
 * HasProtectionDiv 密保验证弹层

 * ChangePriceDiv 修改价格弹层
 * CancelConsignedDiv 取消寄售弹层
===============Upload log===================

by tianhaiting 2015/2/2
Version:v1.1

购买商品详细页   判断登录后商品的收藏状态
 * collectState  登录后判断商品收藏状态
弹层登录选择角色后登录函数（包括用户名下只有一个角色时直接登录时同样要走这个函数）
 * ChooseRoleLogin 
 ===============Upload log===================
 by tianhaiting 2015/3/22
 Version:v1.2

 * showLoginCrossdiv 跨服登录层
 * ChooseRoleCrossLogin 跨服选择角色层
 * ShowMessageCrossDiv 跨服弹出提示层
 * showServerCrossDiv 跨服列表层

  ===============Upload log===================
 by ligen 2015/9/7
 Version:v1.3
 * BargainDiv 我要还价弹层
 * ReplyDiv 回复买家弹层

===============Upload log===================
 by wangaidi 2015/9/7
 Version:v1.4
 *密码登录、短信登录 弹层更新验证码
*/
//验证码
var codestring = '<p class="spacon">' +
                '<span class="ipt" style="width:115px;">' +
                '<span class="icon2">&nbsp;</span>' +
                '<span class="word" style="display: none;">验证码</span>' +
                '<input type="text" class="mm" value="" name="js_configCaptchaValue" style="padding-left:5px;margin-left:-3px;width:100px;height:30px;line-height:30px;border:1px #b5b5b5 solid;background-color:#f7f7f7;border-radius:3px" placeholder="验证码" />' +
                '<input type="hidden" name="js_cookieCaptchaValue"/>' +
                '<img src="" class="js_configCaptchaImg js_refreshConfigCaptcha" style="position: relative;display:block;left: 108px;width:77px;margin-top:-30px"/>' +
                '<a class="js_refreshConfigCaptcha" style="position: absolute;width: 65px;color:blue;text-decoration:underline;font-size:10px;cursor:pointer;margin-top:-20px;margin-left:185px">看不清？</a>' +
                '</span>' +
                '</p>';
var LoginPopHtml = '<div class="public_login_div">' +
                    '   <div class="popuplayer" id="public_login_divTip">' +
                    '        <div class="pop">' +
                    '           <ul class="pop_title js_tab">' +
                    '               <li alt="0" data-id="js_ewm" data-form="formewm" class="curr">扫码登录</li>' +
                    '               <li alt="1" data-id="js_mima" data-form="formmima">密码登录</li>' +
                    '               <li alt="2" data-id="js_sms" data-form="formsms">短信登录</li>' +
                    '           </ul>' +
                    '           <div class="pop_slide"></div><a href="javascript:" class="icon pop_close js_publog_popclose"></a>' +
                    '           <div class="pop_body login_box">' +
                    '               <div class="js_tabdiv">' +
                    '                   <div class="login_ser">当前区组：<span class="js_areaName"></span>>><span class="js_serverName"></span></div>' +
                    '                   <form id="formewm" method="post"><input type="hidden" class="js_login_type" value="">' +
                    '                       <div class="errorbox js_pass_err"></div>' +
                    '                       <ul id="js_ewm">' +
                    '                           <li><div id="js_ewm_box" data-status="0"></div><div class="ewmOverDue_box"><p class="ewmOverDue"></p><p class="ewmtxt"></p></div></li>' +
                    '                           <li class="mar_b_0 ">使用<a style="color:#2783ea;" href="/wd.gyyx.cn/News/NewsDetail_New.aspx?NewsID=78899" target="_blank">光宇游戏APP</a>扫描二维码安全登录</li>' +
                    '                       </ul>' +
                    '                   </form>' +
                    '                   <form id="formmima" method="post"><input type="hidden" class="js_login_type" value="">' +
                    '                       <div class="errorbox js_pass_err"></div>' +
                    '                       <ul id="js_mima" class="dn">' +
                    '                           <li><input id="test" data-id="txtUserName" name="Account" class="login_input js_tip" type="text" autocomplete="off" maxlength="16"><span class="word js_tipword">请输入账号</span></li>' +
                    '                           <li><input data-id="txtUserPassword" name="Password" class="login_input js_tip" type="password" autocomplete="off" maxlength="16"><span class="word js_tipword">请输入密码</span></li>' +
                    '                           <li><div id="configCaptchaWrap"></div></li>' +//隐藏域
                    //'                           <li class="js_captcha" style="display: inline-block;">' +
                    //'                               <input style="width: 105px;" class="login_input left js_tip" type="text" data-id="txtCaptchaCode" name="CaptchaCode" autocomplete="off" maxlength="5" id="Captcha"><span class="word js_tipword">请输入验证码</span>' +
                    //'                               <a class="yzm" href="javascript:"><img id="captcha_image" class="flash_pagecode js_captchaimg" alt="验证码" style="cursor: pointer;" title="点击刷新" width="95" height="40" src=""/></a>' +
                    //'                           </li>' +
                    '                           <li class="mar_b_0 "><a class="forget_pass"  href="/account.gyyx.cn/Member/Register" target="_blank">注册账号</a> | <a class="forget_pass"  href="/account.gyyx.cn/Member/ForgetPassword" target="_blank">忘记密码</a></li>' +
                    '                           <li class="pop_btn"><a href="javascript:;"><input type="submit" class="icon loginbtn" value="登  录" /><i class="icon"></i></a></li>' +
                    '                       </ul>' +
                    '                   </form>' +
                    '                    <form id="formsms" method="post">' +
                    '                       <div class="errorbox js_phone_err"></div>' +
                    '                       <ul id="js_sms" class="dn">' +
                    '                           <li><input data-id="txtSmsUserName" name="Account" class="login_input js_tip" type="text"><span class="word js_tipword">请输入账号</span></li>' +
                    '                           <li><div id="configCaptchaWrap01"></div></li>' +//隐藏域
                    '                           <li><input data-id="txtSms" name="DynamicKey" class="login_input  js_tip" type="text" autocomplete="off" maxlength="5"><span class="word js_tipword">请输入短信验证码</span></li>' +
                    '                           <li><a id="dxyzm" class="dxyzm formBtn01" href="javascript:">免费获取短信验证码</a> </li>' +
                    '                           <li class="pop_btn" style=" padding-top: 5px;"><input type="submit" class="icon loginbtn" value="登  录" /><i class="icon"></i></li>' +
                    '                       </ul>' +
                    '                   </form>' +
                    '               </div>' +
                    '            </div>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div id="mark" class="markdiv" style="height: 100%;"></div>' +
                    '</div>';

var LoginCrossPopHtml = '<div class="public_loginCross_div">' +
                    '   <div class="popuplayer" id="public_loginCross_divTip">' +
                    '        <div class="pop">' +
                    '           <ul class="pop_title js_tab">' +
                    '               <li alt="0" data-id="js_ewm" data-form="formewm" class="curr">扫码登录</li>' +
                    '               <li alt="1" data-id="js_mima" data-form="formmima">密码登录</li>' +
                    '               <li alt="2" data-id="js_sms" data-form="formsms">短信登录</li>' +
                    '           </ul>' +
                    '           <div class="pop_slide"></div><a href="javascript:" class="icon pop_close js_publogCross_popclose"></a>' +
                    '           <div class="pop_body login_box">' +
                    '               <div class="js_tabdiv">' +
                    '                   <div class="login_ser">当前区组：<span class="js_areaName"></span>>><span class="js_serverName"></span>&nbsp;&nbsp;' +
                    '                       <a href="javascript:;" class="js_chooseServer">重选区组</a>' +
                    '                   </div>' +
                    '                   <form id="formewm" method="post"><input type="hidden" class="js_login_type" value="">' +
                    '                       <div class="errorbox js_pass_err"></div>' +
                    '                       <ul id="js_ewm">' +
                    '                           <li><div id="js_ewm_box"></div><div class="ewmOverDue_box"><p class="ewmOverDue"></p><p class="ewmtxt"></p></div></li>' +
                    '                           <li class="mar_b_0 ">使用<a style="color:#2783ea;" href="/wd.gyyx.cn/News/NewsDetail_New.aspx?NewsID=78899" target="_blank">光宇游戏APP</a>扫描二维码安全登录</li>' +
                    '                       </ul>' +
                    '                   </form>' +
                    '                   <form id="formmima" method="post"><input type="hidden" class="js_login_type" value="">' +
                    '                       <div class="errorbox js_pass_err"></div>' +
                    '                       <ul id="js_mima" class="dn">' +
                    '                           <li><input id="test" data-id="txtUserName" name="Account" class="login_input js_tip" type="text" autocomplete="off" maxlength="16"><span class="word js_tipword">请输入账号</span></li>' +
                    '                           <li><input data-id="txtUserPassword" name="Password" class="login_input js_tip" type="password" autocomplete="off" maxlength="16"><span class="word js_tipword">请输入密码</span></li>' +
                    '                           <li><div id="configCaptchaWrap"></div></li>' +//隐藏域
                    //'                           <li  class="js_captcha"  style="display: inline-block;">' +
                    //'                               <input style="width: 105px;" class="login_input left js_tip" type="text" data-id="txtCaptchaCode" name="CaptchaCode" autocomplete="off" maxlength="5"  id="Captcha" ><span class="word js_tipword">请输入验证码</span>' +
                    //'                               <a class="yzm" href="javascript:"><img id="captcha_image" class="flash_pagecode  js_captchaimg" alt="验证码" style="cursor: pointer;" title="点击刷新" width="95" height="40" src=""/></a>' +
                    //'                           </li>' +
                    '                           <li class="mar_b_0 "><a class="forget_pass"  href="/account.gyyx.cn/Member/Register" target="_blank">注册账号</a> | <a class="forget_pass"  href="/account.gyyx.cn/Member/ForgetPassword" target="_blank">忘记密码</a></li>' +
                    '                           <li class="pop_btn"><a href="javascript:;"><input type="submit" class="icon loginbtn" value="登  录" /><i class="icon"></i></a></li>' +
                    '                       </ul>' +
                    '                   </form>' +
                    '                    <form id="formsms" method="post">' +
                    '                       <div class="errorbox js_phone_err"></div>' +
                    '                       <ul id="js_sms" class="dn">' +
                    '                           <li><input data-id="txtSmsUserName" name="Account" class="login_input js_tip" type="text"><span class="word js_tipword">请输入账号</span></li>' +
                    '                           <li><div id="configCaptchaWrap01"></div></li>' +//隐藏域      
                    '                           <li><input data-id="txtSms" name="DynamicKey" class="login_input  js_tip" type="text" autocomplete="off" maxlength="5"><span class="word js_tipword">请输入短信验证码</span></li>' +
                    '                           <li><a id="dxyzm" class="dxyzm formBtn01" href="javascript:">免费获取短信验证码</a> </li>' +
                    '                           <li class="pop_btn" style=" padding-top: 5px;"><input type="submit" class="icon loginbtn" value="登  录" /><i class="icon"></i></li>' +
                    '                       </ul>' +
                    '                   </form>' +
                    '               </div>' +
                    '            </div>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div id="mark" class="markdiv" style="height: 100%;"></div>' +
                    '</div>';

var ChooseRoleHtml = '<div class="public_ChooseRole_div">' +
                    '   <div class="popuplayer" id="public_ChooseRole_divTip">' +
                    '       <div class="pop" style="width:382px;">' +
                    '           <ul class="pop_title select_role_title"><li class="curr">选择角色</li><span class="select_role"></span></ul>' +
                    '           <a href="javascript:" class="icon pop_close js_chooseRBox_popclose"></a>' +
                    '           <div style="width:82px; left:30px;" class="pop_slide"></div><div class="puberror_pop">提示</div>' +
                    '           <div class="pop_body select_role_body">' +
                    '               <ul class="sel_role_list clear">' +
                    '               </ul>' +
                    '               <ul style="text-align:center;width: 342px;">' +
                    '                   <li class="pop_btn">' +
                   // '                       <a href="javascript:" class="js_chooserole_pop_btn" style="float:left;margin-left:10px;"><span class="icon" style="width: 144px;">确认</span><i class="icon"></i></a>' +
                     '                       <a href="javascript:" class="js_backtologin_btn"><span class="icon" style="width: 144px;">重新登录</span><i class="icon"></i></a>' +
                    //'                       <a class="btn_back_chooser js_backtologin_btn" href="javascript:;"  style="margin-right:10px;">重新登录</a>' +
                    '                   </li>' +
                    '               </ul>' +
                    '           </div>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div id="mark" class="markdiv" style="height: 100%;"></div>' +
                    '</div>';

var ChooseRoleCrossHtml = '<div class="public_ChooseRoleCross_div">' +
                    '   <div class="popuplayer" id="public_ChooseRoleCross_divTip">' +
                    '       <div class="pop" style="width:382px;">' +
                    '           <ul class="pop_title select_role_title"><li class="curr">选择角色</li><span class="select_role"></span></ul>' +
                    '           <a href="javascript:" class="icon pop_close js_chooseRBox_popclose"></a>' +
                    '           <div style="width:82px; left:30px;" class="pop_slide"></div><div class="puberror_pop">提示</div>' +
                    '           <div class="pop_body select_role_body">' +
                    '               <ul class="sel_role_list clear">' +
                    '               </ul>' +
                    '               <ul style="text-align:center;width: 342px;">' +
                    '                   <li class="pop_cross_color">请确认好你购买商品的角色</li>' +
                    '                   <li class="pop_btn">' +
                   // '                       <a href="javascript:" class="js_chooserole_popCross_btn" style="float:left;margin-left:10px;"><span class="icon" style="width: 144px;">确认</span><i class="icon"></i></a>' +
                     '                       <a href="javascript:" class="js_backtologinCross_btn"><span class="icon" style="width: 144px;">重新登录</span><i class="icon"></i></a>' +
                    '                   </li>' +
                    '               </ul>' +
                    '           </div>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div id="mark" class="markdiv" style="height: 100%;"></div>' +
                    '</div>';

var MessageBoxDiv = '<div class="public_MessageBox_div">' +
                    '   <div class="popuplayer"  id="public_MessageBox_divTip">' +
                    '       <div class="pop">' +
                    '           <ul class="pop_title"></ul>' +
                    '           <div class="pop_slide"></div>' +
                    '           <a href="javascript:" class="icon pop_close js_pubMBox_popclose"></a>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div id="mark" class="markdiv" style="height: 100%;"></div>' +
                    '</div>';
var MessageDialogDiv = '<div class="public_MessageBox_div">' +
                    '   <div class="popuplayer"  id="public_MessageBox_divTip">' +
                    '       <div class="pop">' +
                    '           <ul class="pop_title"></ul>' +
                    '           <div class="pop_slide"></div>' +
                    '           <a href="javascript:" class="icon pop_close js_pubMBox_popclose"></a>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div id="mark" class="markdiv" style="height: 100%;"></div>' +
                    '</div>';
var MessageBoxCrossDiv = '<div class="public_MessageBoxCross_div">' +
                    '   <div class="popuplayer"  id="public_MessageBoxCross_divTip">' +
                    '       <div class="pop">' +
                    '           <ul class="pop_title"><li class="curr">跨服交易注意事项</li></ul>' +
                    '           <div class="pop_slide"></div>' +
                    '           <a href="javascript:" class="icon pop_close js_pubMBox_popclose"></a>' +
                    '           <div class="pop_body">' +
                    '               <p class="pop_cross_color01">跨服购买的宠物等级将会变为1级且所有附加属性包括精魄全部清除变为原始状态。</p>' +
                    '               <p class="pop_cross_rules">' +
                    '                   <input id="getIt" type="checkbox" checked="checked">' +
                    '                   <label for="getIt">了解且同意此交易规则</label>' +
                    '               </p>' +
                    '               <p class="pop_cross_color01 js_mustSelect" style="display:none;">请勾选了解且同意此交易规则</p>' +
                    '               <ul class="pop_sms_btnbox">' +
                    '                   <li class="pop_btn">' +
                    '                       <a class="js_crossOrder_btn" href="javascript:">' +
                    '                           <span class="icon">确认下订单</span>' +
                    '                           <i class="icon"></i>' +
                    '                       </a>' +
                    '                   </li>' +
                    '               </ul>' +
                    '           </div>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div id="mark" class="markdiv" style="height: 100%;"></div>' +
                    '</div>';

var TimeOutHtml = '<div class="public_TimeOut_div">' +
                   '   <div class="popuplayer"  id="public_TimeOut_divTip">' +
                   '       <div class="pop">' +
                   '            <ul class="pop_title"><li class="curr">登录超时</li></ul><div class="pop_slide"></div>' +
                   '            <a href="javascript:" class="icon pop_close js_pubTimeout_popclose"></a>' +
                   '            <div class="pop_body">' +
                   '                <p>您好，尊敬的用户：</p><p class="pop_sms">您已超过 <i>1小时</i> 未有任何操作，登录超时，请重新登录。</p>' +
                   '                <ul class="pop_sms_btnbox"><li class="pop_btn"><a href="/Navigation/ServerList/"><span class="icon">返回平台首页</span><i class="icon"></i></a></li></ul>' +
                   '            </div>' +
                   '       </div>' +
                   '   </div>' +
                   '   <div id="mark" class="markdiv" style="height: 100%;"></div>' +
                   '</div>';
var DisabledLogin = '<div class="public_TimeOut_div">' +
                   '   <div class="popuplayer"  id="public_TimeOut_divTip">' +
                   '       <div class="pop">' +
                   '            <ul class="pop_title"><li class="curr">频繁刷新</li></ul><div class="pop_slide"></div>' +
                   '            <a href="javascript:" class="icon pop_close js_dislogin_popclose"></a>' +
                   '            <div class="pop_body">' +
                   '                <p>您好，尊敬的用户：</p><p class="pop_sms">由于访问过于频繁，请休息10分钟再试</p>' +   
                   '            </div>' +
                   '       </div>' +
                   '   </div>' +
                   '   <div id="mark" class="markdiv" style="height: 100%;"></div>' +
                   '</div>';
var BargainHtml = '<div class="public_Bargain_div">' +
                   '   <div class="popuplayer"  id="public_Bargain_divTip">' +
                   '       <div class="pop">' +
                   '            <ul class="pop_title"><li class="curr js_pop_ban_tit">我要还价</li></ul><div class="pop_slide"></div>' +
                   '            <a href="javascript:" class="icon pop_close js_pubTimeout_popclose"></a>' +
                   '            <div class="pop_body"><div class="js_pop_ban_body">' +
                   '                <p class="pop_ban">还价商品：<span class="js_pop_ban_type">[角色]</span><span class="js_pop_ban_name"></span></p><p>物品编号：<span class="js_pop_ban_code"></span></p><p class="pop_ban">当前价格：<span class="js_pop_ban_price"></span></p><p>&nbsp;</p><p>还价价格：<span class="js_pop_ori_price"></span></p><p><input type="text" value="" class="banput js_pop_ban_couoff" /></p><p class="pop_bantip js_pop_ban_tip">提示：只能输入低于当前价格的正整数</p></div>' +
                   '                <ul class="pop_sms_btnbox"><li class="pop_btn"><a class="js_ban_submit"><span class="icon">确 定</span><i class="icon"></i></a></li></ul>' +
                   '            </div>' +
                   '       </div>' +
                   '   </div>' +
                   '   <div id="mark" class="markdiv" style="height: 100%;"></div>' +
                   '</div>';

var ReplyHtml = '<div class="public_Bargain_div">' +
                   '   <div class="popuplayer"  id="public_Bargain_divTip">' +
                   '       <div class="pop">' +
                   '            <ul class="pop_title"><li class="curr js_pop_ban_tit">回复买家</li></ul><div class="pop_slide"></div>' +
                   '            <a href="javascript:" class="icon pop_close js_pubTimeout_popclose"></a>' +
                   '            <div class="pop_body"><div class="js_pop_ban_body">' +
                   '                <p class="pop_ban">还价商品：<span class="js_pop_ban_type">[角色]</span><span class="js_pop_ban_name"></span></p><p>商品编号：<span class="js_pop_ban_code"></span></p><p>商品状态：<span class="js_pop_ban_itemtype"></span></p><p class="pop_ban">当前价格：<span class="js_pop_ban_price"></span></p><p class="pop_ban">还价价格：<span class="js_pop_ban_ban"></span></p><p>还价时间：<span class="js_pop_ban_bantime"></span></p><p>&nbsp;</p><p class="pop_ban js_rep on">回复买家：<span class="js_pop_ban_reply">亲,太低了~!</span></p><p class="pop_ban js_popnone js_rep">回复买家：<span class="js_pop_ban_reply">亲,有点为难啊~!</span></p><p class="pop_ban js_popnone js_rep">回复买家：<span class="js_pop_ban_reply">亲,等我降价吧~!</span></p><p class="pop_ban js_popnone js_rep">回复买家：<span class="js_pop_ban_reply">亲,已经卖啦~!</span></p></div>' +
                   '                <ul class="pop_sms_btnbox"><li class="pop_btn"><a class="js_ban_submit"><span class="icon">确 定</span><i class="icon"></i></a></li></ul>' +
                   '            </div>' +
                   '       </div>' +
                   '   </div>' +
                   '   <div id="mark" class="markdiv" style="height: 100%;"></div>' +
                   '</div>';

var OrderTipDivHtml = '<div class="public_Bargain_div">' +
                   '   <div class="popuplayer"  id="public_Bargain_divTip">' +
                   '       <div class="pop">' +
                   '            <ul class="pop_title"><li class="curr js_pop_ban_tit">支付金额提示</li></ul><div class="pop_slide"></div>' +
                   '            <a href="javascript:" class="icon pop_close js_pubTimeout_popclose js_ban_close"></a>' +
                   '            <div class="pop_body"><div class="js_pop_otd_body">' +
                   '                </div>' +
                   '                <ul class="pop_sms_btnbox"><li class="pop_btn"><a class="js_ban_subtn" style="margin:0 5px 0 0;" data-captchacode=""><span class="icon btntip redico">确认购买</span><i class="icon redico"></i></a><a class="js_ban_close"><span class="icon btntip">考虑一下</span><i class="icon"></i></a></li></ul>' +
                   '            </div>' +
                   '       </div>' +
                   '   </div>' +
                   '   <div id="mark" class="markdiv" style="height: 100%;"></div>' +
                   '</div>';

var NoHasProtectionHtml = '<div class="public_NoHasProtection_div"><div class="popuplayer" id="public_NoHasProtection_divTip"><div class="pop" style="width: 600px;">' +
                         '<a href="javascript:" class="icon pop_close"></a><div class="pop_body "><div class="no_serbox"><div class="no_ser"><a class="sericon ser_phone" href="/account.gyyx.cn/MobilePhone/VerifyRegisterInfo/" target="_blank"></a><span>手机认证</span></div><div class="no_ser js_unBindPhone"><a class="sericon ser_phones" href="/security.gyyx.cn/EkeyV2/GetPhoneEkey" target="_blank"></a><span>手机乾坤锁</span></div></div><ul class="no_ser_tip"><li><span class="dd">·</span><span>购买角色必须绑定手机，购买其他商品绑定手机或乾坤锁即可（无绑定天数要求）</span></li><li><span class="dd">·</span>为了您的交易安全，建议在交易过程中<span>至少绑定一种密保</span></li><li><span class="dd">·</span>若未绑定密保则无法对订单进行如取消订单和修改价格等任何敏感操作</li><li><span class="dd">·</span>账号交易只有在使用余额时才需要绑定乾坤锁 <span> 7天</span> 或手机认证  <span>30天</span></li><li><span class="dd">·</span>手机验证码的有实效时间为 <span>5</span> 分钟，请您在5分钟内使用</li></ul></div></div></div><div id="mark" class="markdiv"></div></div>';


var HasProtectionHtml = '<div class="public_HasProtection_div">' +
                         '   <div class="popuplayer"  id="public_HasProtection_divTip">' +
                         '       <div class="pop">' +
                         '          <ul class="pop_title js_tab">' +
                         '          </ul>' +
                         '          <div class="pop_slide"></div>' +
                         '            <a class="icon pop_close js_pubHasProtection_popclose" href="javascript:"></a>' +
                         '          <div class="pop_body">' +
                         '              <div class="js_tabdiv">' +
                         '              </div>' +
                         '          </div>' +
                         '      </div>' +
                         '   </div>' +
                         '   <div id="mark" class="markdiv" ></div>' +
                         '</div>';

var CancelConsignedHtml = '<div class="public_CancelConsigned_div">' +
                           '   <div class="popuplayer"  id="public_CancelConsigned_divTip">' +
                           '       <div class="pop">' +
                           '            <ul class="pop_title"><li class="curr">取消寄售</li></ul><div class="pop_slide"></div>' +
                           '            <a class="icon pop_close js_pubCancelConsigned_popclose" href="javascript:"></a><div class="puberror_pop">提示</div>' +
                           '            <div class="pop_body ">' +
                           '                <p class="">取消寄售后</p>' +
                           '                <ul class="jshou"><li><span>1、</span>若在游戏内未取出商品回到自己包裹则选择→继续寄售无需再经过公示期</li><li><span>2、</span>若在游戏内取出取消寄售商品回到自己包裹则再次寄售需要重新经过公示期（免公示期商品除外）</li><li><span></span>确认要取消寄售该件商品么？</li></ul>' +
                           '                <ul class="pop_sms_btnbox"><li class="pop_btn"><a href="javascript:"><input class="icon loginbtn js_pubCancelConsigned_btn" type="button" value="取消寄售"><i class="icon"></i></a></li></ul>' +
                           '            </div>' +
                           '       </div>' +
                           '   </div>' +
                           '   <div id="mark" class="markdiv" ></div>' +
                           '</div>';

var ChangePriceHtml = '<div class="public_ChangePrice_div">' +
                        '   <div class="popuplayer"  id="public_ChangePrice_divTip">' +
                        '       <div class="pop">' +
                        '           <ul class="pop_title"><li class="curr">修改价格</li></ul><div class="pop_slide"></div>' +
                        '           <a class="icon pop_close js_pubChangePrice_popclose" href="javascript:"></a><div class="puberror_pop">提示</div>' +
                        '           <div class="pop_body ">' +
                        '               <p>原始价格：<span class="original"></span></p>' +
                        '               <p>当前价格：<span class="current"></span></p>' +
                        '               <p>修改价格：</p>' +
                        '               <p><input type="text" class="modify_price_input"></p>' +
                        '               <p class="modify_price_tip">提示：每天只可修改价格2次<br/>修改价格需≥原始价格*80%</p>' +
                        '               <ul class="pop_sms_btnbox modify_price_btn"><li class="pop_btn"><a href="javascript:" ><input class="icon loginbtn js_pubChangePrice_btn" type="button" value="修改价格"><i class="icon"></i></a></li></ul>' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '   <div id="mark" class="markdiv" ></div>' +
                        '</div>';

var NoticeBoxDiv = '   <div class="popuplayer  noticebox"  id="public_NoticeBox_divTip">' +
                    '       <div class="pop">' +
                    '           <ul class="pop_title"></ul>' +
                    '           <div class="pop_slide"></div>' +
                    '           <a href="javascript:" class="icon pop_close js_pubMBox_popclose"></a>' +
                    '           <div class="pop_body"><p class="smscon" style="font-size:12px;"></p><ul class="pop_sms_btnbox"><li class="pop_btn"><a href="javascript:" target="_blank" class="js_pubmessbox_btn"><span class="icon">查看详情</span><i class="icon"></i></a></li></ul></div>' +
                    '       </div>';

var BanBoxDiv = '   <div class="popuplayer  noticebox"  id="public_NoticeBox_divTip">' +
                    '       <div class="pop">' +
                    '           <ul class="pop_title"></ul>' +
                    '           <div class="pop_slide"></div>' +
                    '           <a href="javascript:" class="icon pop_close js_pubMBox_popclose"></a>' +
                    '           <div class="pop_body"><p class="smscon" style="font-size:12px;"></p><ul class="pop_sms_btnbox"><li class="pop_btn"><a href="javascript:" target="_blank" class="js_pubmessbox_btn"><span class="icon">查看未读消息</span><i class="icon"></i></a></li></ul></div>' +
                    '       </div>';

var BusNotBoxDiv = '   <div class="popuplayer  noticebox"  id="public_NoticeBox_divTip">' +
                    '       <div class="pop">' +
                    '           <ul class="pop_title"></ul>' +
                    '           <div class="pop_slide"></div>' +
                    '           <a href="javascript:" class="icon pop_close js_pubMBox_popclose"></a>' +
                    '           <div class="pop_body"><p class="smscon" style="font-size:12px;"></p><ul class="pop_sms_btnbox"><li class="pop_btn"><a href="javascript:" target="_blank" class="js_pubmessbox_btn"><span class="icon">查看未读消息</span><i class="icon"></i></a></li></ul></div>' +
                    '       </div>';
var CodeDivHtml = '<div class="public_Code_div">' +
                    '   <div class="popuplayer" id="public_Code_divTip">' +
                    '        <div class="pop">' +
                    '           <ul class="pop_title js_tab">' +
                    '               <li  class="curr">验证码</li>' +
                    '           </ul>' +
                    '           <div class="pop_slide"></div><a href="javascript:" class="icon pop_close js_publog_popclose"></a>' +
                    '           <div class="pop_body login_box">' +
                    '               <div class="js_tabdiv">' +
                    '                   <form id="formmima" method="post">' +
                    '                       <div class="errorbox js_pass_err"></div>' +
                    '                       <ul id="js_mima">' +
                    '                           <li style="display: inline-block;">' +
                    '                               <input type="hidden" name="checkcode" class="" data-tip="验证码" data-type="checkcode" autocomplete="off" tabindex="8" />' +
                    '                               <em class="ipt_box ChinaCaptchaInput_container clearFix" style="">' +
                    '                                   <b class="ChinaCaptchaInput js_ChinaCaptchaInput"><i class="chinaCaptchaImg"></i></b>' +
                    '                                   <b class="ChinaCaptchaInput js_ChinaCaptchaInput"><i class="chinaCaptchaImg"></i></b>' +
                    '                                   <b class="ChinaCaptchaInput js_ChinaCaptchaInput"><i class="chinaCaptchaImg"></i></b>' +
                    '                                   <b class="ChinaCaptchaInput js_ChinaCaptchaInput"><i class="chinaCaptchaImg"></i></b>' +
                    '                                   <b class="ChinaCaptchaInput ChinaCaptcha_DeleteBtn js_deleteChinaCaptcha"></b>' +
                    '                               </em>' +
                    '                           </li>' +
                    '                           <li style="display: inline-block;">' +
                    '                               <div class="ChinaCaptchaYes">' +
                    '                                   <label class="lbn"></label>' +
                    '                                   <span class="chinaCaptchaImg chinaCaptchaImg_yes js_ChinaCaptchaYes"></span>' +
                    '                                   <a class="refreshChinaCaptcha js_refreshChinaCaptcha">看不清？</a>' +
                    '                               </div>' +
                    '                           </li>' +
                    '                           <li style="display: inline-block;">' +
                    '                               <p class="ChinaCaptcha_notice">点击框内文字输入上图中<b class="chinaNotice">汉字</b>对应汉字</p>' +
                    '                           </li>' +
                    '                           <li style="display: inline-block;">' +
                    '                               <div class="ChinaCaptchaYes">' +
                    '                                   <label class="lbn"></label>' +
                    '                                   <em class="ChinaCaptchaSelectCon clearFix js_ChinaCaptchaSelect">' +
                    '                                       <b class="chinaCaptchaImg chinaCaptchaImg_0 js_ChinaCaptchaSelect_img" data-code="0"></b>' +
                    '                                       <b class="chinaCaptchaImg chinaCaptchaImg_1 js_ChinaCaptchaSelect_img" data-code="1"></b>' +
                    '                                       <b class="chinaCaptchaImg chinaCaptchaImg_2 js_ChinaCaptchaSelect_img" data-code="2"></b>' +
                    '                                       <b class="chinaCaptchaImg chinaCaptchaImg_3 js_ChinaCaptchaSelect_img" data-code="3"></b>' +
                    '                                       <b class="chinaCaptchaImg chinaCaptchaImg_4 js_ChinaCaptchaSelect_img" data-code="4"></b>' +
                    '                                       <b class="chinaCaptchaImg chinaCaptchaImg_5 js_ChinaCaptchaSelect_img" data-code="5"></b>' +
                    '                                       <b class="chinaCaptchaImg chinaCaptchaImg_6 js_ChinaCaptchaSelect_img" data-code="6"></b>' +
                    '                                       <b class="chinaCaptchaImg chinaCaptchaImg_7 js_ChinaCaptchaSelect_img" data-code="7"></b>' +
                    '                                       <b class="chinaCaptchaImg chinaCaptchaImg_8 js_ChinaCaptchaSelect_img" data-code="8"></b>' +
                    '                                   </em>' +
                    '                               </div>' +
                    '                           </li>' +
                    '                           <li style="display: inline-block;">' +
                    '                               <input style="width: 105px;" class="login_input left js_tip" type="hidden" data-id="txtCaptchaCode" name="CaptchaCode" autocomplete="off" maxlength="5"   id="Captcha" ><!--<span class="word js_tipword">请输入验证码</span>' +
                    '                               <a class="yzm" href="javascript:"><img id="captcha_image" class="flash_pagecode js_captchaimg" alt="验证码" style="cursor: pointer;" title="点击刷新" width="95" height="40" src=""/></a>-->' +
                    '                           </li>' +
                    '                           <li class="pop_btn"><a href="javascript:;"><input type="submit" class="icon loginbtn js_Codediv_btn" value="确  定" /><i class="icon"></i></a></li>' +
                    '                       </ul>' +
                    '                   </form>' +
                    '               </div>' +
                    '            </div>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div id="mark" class="markdiv" style="height: 100%;"></div>' +
                    '</div>';

var selectServerHtml = '<div class="public_SelectServer_div">' +
                       '   <div class="popuplayer"  id="public_SelectServer_divTip">' +
                       '       <div class="pop pop_width">' +
                       '            <ul class="pop_title"><li class="curr">请选择区服</li></ul><div class="pop_slide"></div>' +
                       '            <a href="javascript:" class="icon pop_close js_SelectServer_popclose"></a>' +
                       '            <div class="pop_body">' +
                       '                    <div id="js_areaServer" class="tb_server">' +
                       '                        <div class="tb_th">' +
                       '                            <a class="curr">双线一区</a>' +
                       '                            <a class="">双线二区</a>' +
                       '                            <a class="">电信一区</a>' +
                       '                            <a class="">电信二区</a>' +
                       '                            <a class="">网通一区</a>' +
                       '                            <a class="">网通二区</a>' +
                       '                        </div>' +
                       '                        <div style="display: block;" class="tb_tbody js_sxOne">' +
                       '                        </div>' +
                       '                        <div style="display: none;" class="tb_tbody js_sxTwo">' +
                       '                        </div>' +
                       '                        <div style="display: none;" class="tb_tbody js_dxOne">' +
                       '                        </div>' +
                       '                        <div style="display: none;" class="tb_tbody js_dxTwo">' +
                       '                        </div>' +
                       '                        <div style="display: none;" class="tb_tbody js_wtOne">' +
                       '                        </div>' +
                       '                        <div style="display: none;" class="tb_tbody js_wtTwo">' +
                       '                        </div>' +
                       '                     </div>' +
                       '            </div>' +
                       '       </div>' +
                       '   </div>' +
                       '   <div id="mark" class="markdiv" style="height: 100%;"></div>' +
                       '</div>';
var searchLoadBoxDiv = '<div class="public_SearchLoadBox_div">' +
                        '   <div class="popuplayer"  id="public_SearchLoadBox_divTip">' +
                        '       <div class="pop">' +
                        '           <div class="pop_body">' +
                        '               <p class="search_load"><img src="/img.gyyxcdn.cn/qibao/Images/searchLoad.gif">臣妾正在努力中...</p>' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '   <div id="mark" class="markdiv" style="height: 100%;"></div>' +
                        '</div>';

/*验证码判断 start*/

/*-------------------------------------------------------------------------
* author:师亚伟
* date:2015-12-11
* desc:社区公用弹层添加中文验证码支持 
-------------------------------------------------------------------------*/
; (function () {
    var
        //中文验证码对象
        ChinaCaptcha,

        //是否需要验证码
        isNeedCatpchaUrl = '/login/getcaptcha',

        //中文验证码接口
        chinaCaptchaImgUrl = '/login/create';

    //中文验证码构造函数
    ChinaCaptcha = function ($Submit, Defaults) {
        this.$Submit = $Submit;
        this.isNeedCatpchaUrl = isNeedCatpchaUrl;
        this.chinaCaptchaImgUrl = chinaCaptchaImgUrl;
        this.bid = Defaults.bid;
        this.Defaults = Defaults;
    };

    ChinaCaptcha.prototype = {

        //主程序入口
        init: function () {
            this.isNeedCaptcha();
        },

        //是否需要验证码
        isNeedCaptcha: function () {
            var _this = this;
            $.ajax({
                url: isNeedCatpchaUrl,
                type: "GET",
                dataType: "json",
                data: {
                    bid: _this.bid,
                    r: Math.random()
                },
                success: function (data) {

                    if (data) {
                        $('.js_login_type').val(parseInt(data.type));
                        var
                            //普通验证码对象
                            $yzm_p = $(".js_captcha"),
                            $yzm_ipt = $("#Captcha"),
                            $yzm_img = $(".js_captchaimg"),
                            $submit = _this.$Submit;
                        switch (parseInt(data.type)) {

                            case -1://不需要验证码
                                //隐藏普通验证码项
                                $yzm_p.hide();
                                //移除普通验证码输入框
                                $yzm_ipt.remove();

                                break;
                            case 0://需要普通验证码（依旧）

                                $yzm_p.show();
                                var yzm_img_src = chinaCaptchaImgUrl + "?bid=" + _this.bid;

                                $yzm_img.attr("src", yzm_img_src + "&r=" + Math.random());
                                $yzm_img.unbind("click").bind("click", function () {
                                    $yzm_img.attr("src", yzm_img_src + "&r=" + Math.random());
                                });

                                break;
                            case 1://需要中文验证码

                                //隐藏普通验证码
                                $yzm_p.hide();
                                //移除普通验证码输入框
                                $yzm_ipt.remove();
                                //创建中文验证码隐藏域 
                                $submit.append('<input type="hidden" name="captcha" value="" data-id="txtCaptchaCode" autocomplete="off" maxlength="5" id="Captcha" />');
                                //引入中文验证码样式
                                $("head").append('<link href="/s.gyyx.cn/scgg/css/chinaCaptcha.css" rel="stylesheet" type="text/css">');

                                break;
                            default:
                                break;
                        }

                        //设置验证码类型
                        _this.captcahSwitchOpen = parseInt(data.type);
                    }
                },
                error: function () {
                    //alert(":( 程序出错！");
                }
            });
        },

        //生成验证码弹出层
        createCaptchaPop: function () {
            var
                _this = this,
                captchaHtml = '' +
                    '<div class="js_chinaCaptcha_Alert">' +
                    '   <div class="chinaCaptchaContainer js_chinaCaptchaContainer" style="z-index:29999;">' +
                    '       <h3 class="chinaCaptcha_Title clearFix">输入验证码' +
                    '           <a class="chinaCaptchaIcon captcha_close js_captcha_close"></a>' +
                    '       </h3>' +
                    '       <p class="chinaCaptcha_Tip01">请输入验证码完成登录</p>' +
                    '       <p class="chinaCaptchaContainer_p01">' +
                    '           <label class="chinaCaptcha_text">验证码：</label><span' +
                    '               class="ChinaCaptchaInput_container clearFix">' +
                    '               <em class="ChinaCaptchaInput js_ChinaCaptchaInput"><i class="chinaCaptchaImg"></i></em>' +
                    '               <em class="ChinaCaptchaInput js_ChinaCaptchaInput"><i class="chinaCaptchaImg"></i></em>' +
                    '               <em class="ChinaCaptchaInput js_ChinaCaptchaInput"><i class="chinaCaptchaImg"></i></em>' +
                    '               <em class="ChinaCaptchaInput js_ChinaCaptchaInput"><i class="chinaCaptchaImg"></i></em>' +
                    '               <em class="chinaCaptchaIcon ChinaCaptchaInput ChinaCaptcha_DeleteBtn js_deleteChinaCaptcha"></em>' +
                    '           </span><i' +
                    '           class="chinaCaptchaIcon chinaCaptcha_Tip02 js_checkChinaCaptchaTip default"></i>' +
                    '       </p>' +
                    '       <p class="chinaCaptchaContainer_p02">' +
                    '           <span class="chinaCaptchaImg chinaCaptchaImg_yes js_refreshChinaCaptcha"></span>' +
                    '           <a class="chinaCaptchaChange js_refreshChinaCaptcha">看不清？</a>' +
                    '       </p>' +
                    '       <p class="chinaCaptchaContainer_p03">点击框内文字输入上图中' +
                    '           <b class="chinaCaptcha_Tip03">汉字</b>相应文字' +
                    '       </p>' +
                    '       <div class="chinaCaptchaContainer_p02">' +
                    '           <ul class="ChinaCaptchaSelectCon clearFix js_ChinaCaptchaSelect">' +
                    '               <li class="chinaCaptchaImg chinaCaptchaImg_0 js_ChinaCaptchaSelect_img" data-code="0"></li>' +
                    '               <li class="chinaCaptchaImg chinaCaptchaImg_1 js_ChinaCaptchaSelect_img" data-code="1"></li>' +
                    '               <li class="chinaCaptchaImg chinaCaptchaImg_2 js_ChinaCaptchaSelect_img" data-code="2"></li>' +
                    '               <li class="chinaCaptchaImg chinaCaptchaImg_3 js_ChinaCaptchaSelect_img" data-code="3"></li>' +
                    '               <li class="chinaCaptchaImg chinaCaptchaImg_4 js_ChinaCaptchaSelect_img" data-code="4"></li>' +
                    '               <li class="chinaCaptchaImg chinaCaptchaImg_5 js_ChinaCaptchaSelect_img" data-code="5"></li>' +
                    '               <li class="chinaCaptchaImg chinaCaptchaImg_6 js_ChinaCaptchaSelect_img" data-code="6"></li>' +
                    '               <li class="chinaCaptchaImg chinaCaptchaImg_7 js_ChinaCaptchaSelect_img" data-code="7"></li>' +
                    '               <li class="chinaCaptchaImg chinaCaptchaImg_8 js_ChinaCaptchaSelect_img" data-code="8"></li>' +
                    '           </ul>' +
                    '       </div>' +
                    '       <p class="chinaCaptchaContainer_p04">' +
                    '           <span class="chinaCaptchaSubmit_Btn js_chinaCaptchaBtn">确定</span>' +
                    '       </p>' +
                    '   </div>' +
                    '   <div id="maskChinaCaptcha" class="maskChinaCaptcha_con" style="z-index:29998"></div>' +
                    '</div>';
            $("body").append(captchaHtml);

            //获取中文验证码
            this.addCSSByStyle(".chinaCaptchaContainer .chinaCaptchaImg  { background-image: url(" + chinaCaptchaImgUrl + "?bid=" + _this.bid + "&r=" + Math.random() + ".png) }");

            //添加事件
            this.addEventForPop();
        },

        //初始化弹出框位置
        initAlertPosition: function () {
            var winwidth = $(window).width();
            var thisleft = winwidth / 2 - $(".js_chinaCaptchaContainer").width() / 2;
            var thistop = $(window).height() / 2 - $(".js_chinaCaptchaContainer").height() / 2 + $(window).scrollTop();
            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
            $("#maskChinaCaptcha").css("height", bodyheight);
            $(".js_chinaCaptchaContainer").css({ 'left': thisleft, 'top': thistop });
        },

        //刷新验证码时，添加样式表到Head中
        addCSSByStyle: function (cssString) {
            var
                doc = document,
                style,
                heads = doc.getElementsByTagName("head"),
                _jsChina = doc.getElementById("JS_CHINA");

            if (_jsChina) {
                $(_jsChina).remove();
            }
            style = doc.createElement("style");
            style.setAttribute("type", "text/css");
            style.setAttribute("id", "JS_CHINA");
            heads[0].appendChild(style);

            if (style.styleSheet) {
                //IE
                style.styleSheet.cssText = cssString;
            } else {
                var cssText = doc.createTextNode(cssString);
                style.appendChild(cssText);
            }

        },

        //给弹层添加事件
        addEventForPop: function () {
            var _this = this;

            //设置弹层位置 
            this.initAlertPosition();

            //关闭弹层
            $(".js_captcha_close").unbind("click").bind("click", function () {
                $("input[name='captcha']").val("");
                $(".js_chinaCaptcha_Alert").remove();
                return false;
            });

            //选择验证码
            $(".js_ChinaCaptchaSelect_img").unbind("click").bind("click", function () {
                _this.selectCaptcha($(this));
                return false;
            });

            //删除验证码
            $(".js_deleteChinaCaptcha").unbind("click").bind("click", function () {
                _this.deleteCaptcha();
                return false;
            });

            //刷新验证码
            $(".js_refreshChinaCaptcha").unbind("click").bind("click", function () {
                _this.refreshCaptcha();
                return false;
            });

            //提交(如果验证码格式通过则提交)
            $(".js_chinaCaptchaBtn").unbind("click").bind("click", function () {

                if (_this.chinaCaptchaCheck($("input[name='captcha']"))) {
                    _this.subFn();
                }
                return false;
            });

        },

        //选择验证码
        selectCaptcha: function ($obj) {
            var
                    obj = $obj,
                    objAttrCode = obj.attr("data-code"),
                    codeLen = parseInt($("input[name='captcha']").val().length),
                    checkcodeStr = $("input[name='captcha']").val() + objAttrCode;

            if (codeLen < 4) {

                //验证码真实值
                $("input[name='captcha']").val(checkcodeStr);
                $(".js_chinaCaptcha_Alert").find(".js_ChinaCaptchaInput").eq(codeLen).find("i").addClass("chinaCaptchaImg_" + objAttrCode);
            }
            this.chinaCaptchaCheck($("input[name='captcha']"));
        },

        //删除验证码
        deleteCaptcha: function () {
            var
                    Len = parseInt($("input[name='captcha']").val().length),
                    checkcodeStr1 = $("input[name='captcha']").val();

            checkcodeStr1 = checkcodeStr1.substring(0, Len - 1);
            $("input[name='captcha']").val(checkcodeStr1);

            $(".js_ChinaCaptchaInput").eq(Len - 1).find("i").removeClass().attr("class", "chinaCaptchaImg");

            this.chinaCaptchaCheck($("input[name='captcha']"));
        },

        //刷新验证码
        refreshCaptcha: function () {
            var
                _this = this,
                Defaults = _this.Defaults;

            switch (_this.captcahSwitchOpen) {
                case 0:
                    break;
                case 1:
                    $(".js_checkChinaCaptchaTip").removeClass("error").removeClass("success");
                    $("input[name='captcha']").val("");
                    $(".js_ChinaCaptchaInput").find("i").attr("class", "chinaCaptchaImg");

                    //一定记得加随机数
                    this.addCSSByStyle(".chinaCaptchaContainer .chinaCaptchaImg  { background-image: url(" + chinaCaptchaImgUrl + "?bid=" + _this.bid + "&r=" + Math.random() + ".png) }");
                    break;
                default:
                    break;
            }

        },

        //验证验证码格式
        chinaCaptchaCheck: function (obj) {
            if (this.VerCheckChinaCaptcha(obj) == true) {
                this.VerChinaCaptchaOK(obj);
                return true;
            } else {
                return false;
            }
        },

        //验证复杂验证码格式
        VerCheckChinaCaptcha: function (obj) {
            var exp = new RegExp("^\\d{4}$");
            if (!exp.test(obj.val())) {
                $(".js_checkChinaCaptchaTip").addClass("error");
                return false;
            } else {
                return true;
            }
        },

        //复杂验证码格式正确
        VerChinaCaptchaOK: function (obj) {
            $(".js_checkChinaCaptchaTip").removeClass("error").addClass("success");
            return true;
        }
    }

    window.ChinaCaptcha = ChinaCaptcha;
})();

///*验证码半段 end*/

(function () {
    var crossUrl = location.href, checkCross = /OrderForCrossServer/g;  //用来判断是否为跨服的页面然后刷新页面
    var timer;
    var Defaults = {
        /*==================参数说明=========================*/
        /* LoginStatusAjaxUrl 判断是否登录接口               */
        /* SenderMessage 发送短信验证码                      */
        /* AsynUrl    登陆接口                               */
        /* AsynLayerLoginUrl    弹层登陆接口                 */
        /* LayerChooseRole 角色层角色列表                    */
        /* CrossServerLayerChooseRole 跨服角色层角色列表     */
        /* LayerChooseRoleByRoleId 角色层选择角色            */
        /* LayerChooseRoleCrossByRoleId 跨服角色层选择角色   */
        /* LogoutToServerList 退出登录，重新选取服务器       */
        /* getLogoutToItemList 退出登录，并返回登录页        */
        /* SimpleUserInfo 显示简单用户信息                   */
        /* IsHasProtectionUrl 验证是否有密保                 */
        /* ProtectionUrl 密保验证                            */
        /* CancelConsigneUrl 取消寄售                        */
        /* ChangePriceUrl 修改价格                           */
        /* GetCollectStateUrl 是否为收藏状态                 */
        /* DeleteCrossUserInfoCacheUrl 删除用户cache         */
        /* GetQRCode 获取奇宝斋二维码图片                    */
        /* QRCodeLogin 检查扫码登录状态                      */
        /*===================================================*/
        LoginStatus: "/Login/LoginStatus",
        SenderMessage: "/Login/SenderMessage",
        ValidCaptcha: "/Login/ValidCaptcha",
        AsynUrl: "/Login/Index",
        LayerChooseRole: "/Login/LayerChooseRole",
        CrossServerLayerChooseRole: "/Login/CrossServerLayerChooseRole",
        LayerChooseRoleByRoleId: "/Login/LayerChooseRoleByRoleId",
        LayerChooseRoleCrossByRoleId: "/Login/CrossServerLayerChooseRole",
        LogoutToServerList: "/Login/LogoutToServerList",
        getLogoutToItemList: "/Login/LogOutToLoginIndex",
        SimpleUserInfo: "/Buy/SimpleUserInfo",
        IsHasProtectionUrl: "/ItemSellOperate/Security",
        ProtectionUrl: "/ItemSellOperate/SecurityVerify",
        ProtectionSenderMessage: "/ItemSellOperate/SenderMessage",
        CancelConsigneUrl: "/ItemSellOperate/CancelSale",
        ChangePriceUrl: "/ItemSellOperate/MakePrice",
        AjaxGetChinaCaptcha: "/Buy/Create",
        bid: "dvonbserfu",
        GetCollectStateUrl: "/ItemSellOperate/CollectCheck",
        AsynLayerLoginUrl: "/Login/LayerLogin",
        DeleteCrossUserInfoCacheUrl: "/Login/DeleteCrossUserInfoCache",
        GetQRCode: "/QRCode/GetQRCode",
        QRCodeLogin: "/QRCode/QRCodeLogin"
    };
    var yzmType = function () {

        //IE6下默认不缓存背景图片，CSS里每次更改图片的位置时都会重新发起请求，用这个方法告诉IE6缓存背景图片 
        var isIE6 = /msie 6/i.test(navigator.userAgent);
        if (isIE6) {
            try { document.execCommand('BackgroundImageCache', false, true); } catch (e) { }
        }

        window.chinaCaptcha = new ChinaCaptcha($("#formmima"), {
            bid: "ybtvat"
        });
        chinaCaptcha.init();
    }
    window.QiBao = {
        init: function () {
            $(".js_cl_login").die("click").live("click", function () {

                var callbackname = $(this).attr("data-callback");
                QiBao.getUserStatus(callbackname);

                yzmType();//验证码类型；

            });
            $(".js_myhj").die("click").live("click", function () {
                var callbackname = $(this).attr("data-callback");
                var $this = $(this);
                QiBao.getBargainStatus(callbackname, $this);
            });
            $(".js_reply").die("click").live("click", function () {
                var $this = $(this);
                var isban = $(this).parent().parent().find(".js_datainfo").attr("data-bar");
                var ispir = $(this).parent().parent().find(".js_datainfo").attr("data-pir");
                var isname = $(this).parent().parent().find(".js_datainfo").attr("data-name");
                var isconde = $(this).parent().parent().find(".js_ckb").attr("data-code");
                var isitemcode = $(this).parent().parent().find(".js_datainfo").attr("data-id");
                var isid = $(this).parent().parent().find(".js_datainfo").attr("data-id");
                var istime = $(this).parent().parent().find(".js_bantime").html();
                $.ajax({
                    url: '/Bargain/Recovery',
                    type: "post",
                    data: {
                        recoveryMsg: "",
                        code: isconde,
                        itemCode: isitemcode,
                        r: Math.random()
                    },
                    dataType: "json",
                    success: function (d) {
                        if (d.IsSuccess) {
                            $this.parent().parent().find(".icon_noready").removeClass("icon_noready").addClass("icon_ready");
                        } else {
                            alert(d.Message);
                        }
                    }
                });
                QiBao.ReplyDiv(isban, isconde, ispir, isname, isid, istime);
            });
            $(".js_isread3,.js_isread2").die("click").live("click", function () {
                var $this = $(this);
                var isconde = $(this).parent().parent().find(".js_ckb").attr("data-code");
                $.ajax({
                    url: '/BusinessNotice/ReadDetail',
                    type: "post",
                    data: {
                        code: isconde,
                        r: Math.random()
                    },
                    dataType: "json",
                    success: function (d) {
                        if (d.IsSuccess) {
                            $this.parent().parent().find(".icon_noready").removeClass("icon_noready").addClass("icon_ready");
                        } else {
                            alert(d.Message);
                        }
                    }
                });
            });
            QiBao.ShowTopNav();
        },
        getUserStatus: function (callback) {
            $.ajax({
                url: Defaults.LoginStatus,
                type: "get",
                data: { r: Math.random() },
                success: function (d) {
                    if (d.IsSuccess) {
                        if (d.IsRoleChoosed && d.IsLogged) {
                            eval("(" + callback + ")");
                            callback;
                        } else {

                            QiBao.showLogindiv(d.AreaCode, d.AreaName, d.ServerCode, d.ServerName, callback);
                            yzmType();//验证类型。

                        }
                    } else {
                        if (d.Data == "unauthorized") {
                            QiBao.TimeOutDiv();
                        } else if (d.Data == "JsonException") {
                            window.location.href = d.ReturnUrl;
                        } else {

                            QiBao.getLogoutToServerList();

                        }
                    }

                }
            });
        },
        getBargainStatus: function (callback, thisbtn) {
            $.ajax({
                url: Defaults.LoginStatus,
                type: "get",
                data: { r: Math.random() },
                success: function (d) {
                    if (d.IsSuccess) {
                        if (d.IsRoleChoosed && d.IsLogged) {
                            QiBao.BargainDiv(thisbtn);
                        } else {
                            QiBao.showLogindiv(d.AreaCode, d.AreaName, d.ServerCode, d.ServerName, callback);
                            yzmType();//验证类型。
                        }
                    } else {
                        if (d.Data == "unauthorized") {
                            QiBao.TimeOutDiv();
                        } else if (d.Data == "JsonException") {
                            window.location.href = d.ReturnUrl;
                        } else {
                            QiBao.getLogoutToServerList();
                        }
                    }

                }
            });
        },
        showLogindiv: function (areaCode, areaName, serverCode, serverName, callback) {

            $(".public_login_div").remove();
            $("body").append(LoginPopHtml);

            $(".public_login_div .js_areaName").html(areaName).attr("data-areaCode", areaCode);
            $(".public_login_div .js_serverName").html(serverName).attr("data-serverCode", serverCode);

            var winwidth = $(window).width();
            var thisleft = winwidth / 2 - $("#public_login_divTip").width() / 2;
            var thistop = $(window).height() / 2 - $("#public_login_divTip").height() / 2 + $(window).scrollTop();
            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
            $(".public_login_div .markdiv").css("height", bodyheight);
            $("#public_login_divTip").css({ 'left': thisleft, 'top': thistop });

            // 注册页面提示 input输入框获取焦点和失去焦点
            $(".js_tip").focus(function () {
                var obj = $(this);
                var hstip = obj.next(".js_tipword");
                hstip.css('display', 'none');
            });
            $(".js_tip").blur(function () {
                var val = $(this).attr("value");
                var hstip = $(this).next(".js_tipword");
                if (val == "") {
                    hstip.css('display', 'block')
                }
            });
            $(".js_tipword").click(function () {
                $(this).prev("input").focus();
            });
            setTimeout(function () {
                $(".js_tip").val("");
            }, 100);
            //弹出短信验证码
            var chinaCaptcha = configCaptcha({
                captchaInWrap: "#configCaptchaWrap01",
                data: {
                    bid: "qbslsms"
                },
                inputName: "CaptchaSms",
                inputCookieName: "cookiesSms",
                simHtml: codestring
            });
            //弹出密码登录验证码
            var chinaCaptchapw = configCaptcha({
                captchaInWrap: "#configCaptchaWrap",
                data: {
                    bid: "qbpwsms"
                },
                inputName: "Captcha",
                inputCookieName: "cookies",
                simHtml: codestring
            });
            //选项卡切换
            $(".public_login_div .js_tab li").click(function (event) {
                //当短信登录的时候初始化验证码
                if ($(this).index() == 2) {
                    chinaCaptcha.init();
                }
                //当密码登录的时候初始化验证码
                if ($(this).index() == 1) {
                    chinaCaptchapw.init();
                }


                $(this).addClass('curr').siblings('li').removeClass('curr');
                var $slide = $(this).parent().next(".pop_slide");
                $(this).parent().next(".pop_slide").animate({ left: 40 + 78 * $(this).attr('alt') + "px" }, "50");
                $(".js_tabdiv ul").addClass('dn');
                $("#" + $(this).attr("data-id")).removeClass('dn');
                $(".errorbox").hide();
                //登录注册表单
                $("#" + $(this).attr("data-form")).removeClass('dn');
                $("#" + $(this).siblings("li").attr("data-form")).addClass('dn');
                if ($(this).attr("data-id") == "js_ewm") {
                    if ($("#js_ewm_box").attr("data-status") == "1") {
                        $("#js_ewm_box").attr('data-status', '0');
                        getqrcode($("#js_ewm_box"));
                    }
                }
                return false;
            });
            getqrcode($("#js_ewm_box"));
            function ewmLoginFn(oEwmbox) {
                var request = $.ajax({
                    url: Defaults.QRCodeLogin,
                    type: 'GET',
                    data: { r: Math.random() },
                    success: function (d) {
                        if (d.success) {
                            $(".public_login_div").remove();
                            QiBao.showChooseRolediv(callback);
                        } else {
                            $('.ewmOverDue_box').show();
                            $('.ewmtxt').html('二维码失效<br/>请点击刷新');
                            oEwmbox.attr('data-status', '1');
                        }
                    },
                    error: function () {
                        $('.ewmOverDue_box').show();
                        $('.ewmtxt').html('网络异常<br/>请点击刷新');
                        oEwmbox.attr('data-status', '1');
                    }
                });

                $(".js_publog_popclose").die("click").live("click", function () {
                    $(".public_login_div").remove();
                    request.abort();
                });
            }
            function getqrcode(oEwmbox) {
                if (oEwmbox.attr('data-status') == '1') {
                    oEwmbox.attr('data-status', '0');
                    $('.ewmOverDue_box').hide();
                    ajaxqrcode(oEwmbox)
                } else {
                    $('.ewmOverDue_box').hide();
                    ajaxqrcode(oEwmbox)
                }
            };
            function ajaxqrcode(oEwmbox) {
                $.ajax({
                    url: "/QRCode/GetQRCode",
                    type: 'GET',
                    data: { r: Math.random() },
                    success: function (d) {
                        if (d.success) {
                            $('#js_ewm_box').empty();
                            var qrcode = new QRCode('js_ewm_box', {
                                text: d.content,
                                width: 177,
                                height: 177,
                                colorDark: '#000',
                                colorLight: '#ffffff',
                                correctLevel: QRCode.CorrectLevel.H
                            });
                            if (oEwmbox.find('table').length == 1) {
                                ewmLoginFn(oEwmbox)
                            } else {
                                oEwmbox.find('img').unbind('load').bind('load', function () {
                                    ewmLoginFn(oEwmbox)
                                });
                            };
                            $('#js_ewm_box').attr("title", "");
                        }
                    },
                    error: function () {
                        $('.ewmOverDue_box').show();
                        $('.ewmtxt').html('获取二维码失败<br/>请点击刷新');
                        oEwmbox.attr('data-status', '1');
                    }
                })
            };
            $('.ewmOverDue_box').unbind('click').bind('click', function () {
                $(this).hide();
                getqrcode($("#js_ewm_box"));
            })

            /* 检查帐号是否绑定了手机认证、然后决定是否发送短信 */
            $("#dxyzm").die("click").live("click", function () {
                //判断验证码是否在倒计时中
                if ($(this).attr("disabled") == "disabled") {
                    return false;
                }
                $("#formsms").find(".js_phone_err").hide().html("");
                var exp = new RegExp("^[\u4e00-\u9fa5]{0,}$");
                var account = $(":input[data-id=txtSmsUserName]");

                if (account.val() == "") {
                    $("#formsms").find(".js_phone_err").show().html("账号不能为空");
                    account.parent(".d_iptw").addClass("d_iptw_err");
                    return false;
                } else if (exp.test(account.val())) {
                    $("#formsms").find(".js_phone_err").show().html("账号格式错误");
                    account.parent(".d_iptw").addClass("d_iptw_err");
                    return false;
                }

             //验证码结束
                if (chinaCaptcha.captcahSwitchOpen == 1) {
                    chinaCaptcha.openCaptchaPop(SenderMessage);
                } else if (chinaCaptcha.captcahSwitchOpen == 0) {
                    if ($('.mm').val() != "") {
                        SenderMessage();
                    } else {
                        $("#formsms").find(".js_phone_err").show().html("请输入验证码");
                    }
                } else if (chinaCaptcha.captcahSwitchOpen == -1) {
                    SenderMessage();
                }

                /* 发送短信验证码 */
                function SenderMessage() {
                    $.ajax({
                        url: Defaults.SenderMessage,
                        type: "post",
                        dataType: "json",
                        data: {
                            captchaCode: $('input[name="CaptchaSms"]').val(),
                            cookieValue: $('input[name="cookiesSms"]').val(),
                            captchaBid: "qbslsms",
                            Account: $(":input[data-id=txtSmsUserName]").val(),
                            r: Math.random()
                        },
                        beforeSend: function (d) {
                            $(".js_sendbtn").addClass("disb").attr("disabled", "disabled").val("发送中...");
                        },
                        success: function (data) {
                            //验证码消失
                            chinaCaptcha.closeCaptchaPop();
                            $("#formsms").find(".js_phone_err").hide().html("");
                            account.parent(".d_iptw").addClass("d_iptw_err");

                            if (data.IsSuccess && data.Message == "发送成功") {
                                $("#dxyzm").attr("disabled", "disabled").empty().html("重新获取（" + data.PushTime + "）");
                                QiBao.countDown($("#dxyzm"), data.PushTime);
                            } else {
                                //刷新验证码
                                chinaCaptcha.refreshCaptcha($("#configCaptchaWrap01"));
                                $("#formsms").find(".js_phone_err").show().html(data.Message);
                                $(".js_sendbtn").addClass("disb").removeClass("disb").removeAttr("disabled").val("免费获取短信验证码");
                                //验证码消失
                                chinaCaptcha.closeCaptchaPop();

                                if (data.Data == "unauthorized") {
                                    QiBao.TimeOutDiv();
                                } else if (data.Data == "JsonException") {
                                    window.location.href = data.ReturnUrl;
                                } else {
                                    $("#formsms").find(".js_phone_err").show().html(data.Message);
                                }
                            }
                        },
                        error: function () {
                            chinaCaptcha.refreshCaptcha($("#configCaptchaWrap01"));
                            $(":input[data-id=txtSmsUserName]").removeAttr("disabled");
                        }
                    });
                }
            });
            /* 检查帐号是否绑定了手机认证、然后决定是否发送短信 end */

            //短信登录 
            $(".js_phone").die("keyup").live("keyup", function () {
                if ($("#dxyzm").attr("disabled") == "disabled") {
                    $("#dxyzm").removeAttr("disabled");
                    clearInterval(timer);
                    $("#dxyzm").empty().html("免费获取短信验证码");
                }
            });

            /* 手机登录 */
            $("#formsms").submit(function () {

                $(".js_phone_err").hide().html("");

                var PhonePatt = /^[a-zA-Z0-9]{5}$/;
                var exp = new RegExp("^[\u4e00-\u9fa5]{0,}$");
                var account = $(":input[data-id=txtSmsUserName]");
                var auxiliaryInfo = $(":input[data-id=txtSms]");

                if (account.val() == "") {
                    $("#formsms").find(".js_phone_err").show().html("账号不能为空");
                    account.parent(".d_iptw").addClass("d_iptw_err");
                    return false;
                } else if (exp.test(account.val())) {
                    $("#formsms").find(".js_phone_err").show().html("账号格式错误");
                    account.parent(".d_iptw").addClass("d_iptw_err");
                    return false;
                } else if (auxiliaryInfo.val() == "") {
                    $("#formsms").find(".js_phone_err").show().html("手机验证码不能为空");
                    auxiliaryInfo.parent(".d_iptw").addClass("d_iptw_err");
                    return false;
                } else if (!PhonePatt.test(auxiliaryInfo.val())) {
                    $("#formsms").find(".js_phone_err").show().html("手机验证码错误");
                    auxiliaryInfo.parent(".d_iptw").addClass("d_iptw_err");
                    return false;
                }
                $.ajax({
                    url: Defaults.AsynUrl,
                    type: "post",
                    dataType: "json",
                    data: {
                        Account: account.val(),
                        AuxiliaryInfo: auxiliaryInfo.val(),
                        IsSmsCodeLogin: true,
                        r: Math.random()
                    },
                    beforeSend: function () {
                        $("#formsms").find(":submit").attr("disabled", "disabled").val("正在登录...");
                    },
                    success: function (d) {
                        $("#formsms").find(":submit").removeAttr("disabled").val("登  录");
                        if (d.IsSuccess) {

                            QiBao.showChooseRolediv(callback);

                        } else {
                            //刷新验证码
                            chinaCaptcha.refreshCaptcha($("#configCaptchaWrap01"));
                            if (d.Data == "unauthorized") {
                                QiBao.TimeOutDiv();
                            } else if (d.Data == "JsonException") {
                                window.location.href = d.ReturnUrl;
                            } else {
                                $("#formsms").find(".js_phone_err").show().html(d.Message);
                            }
                        }
                    },
                    error: function () {
                        //刷新验证码
                        chinaCaptcha.refreshCaptcha($("#configCaptchaWrap01"));
                        $("#formsms").find(":submit").removeAttr("disabled").val("登  录");
                        $("#formsms").find(".js_phone_err").show().html("登录失败，请稍后重试。");
                    }
                });
                return false;
            });
            /* 手机登录 end */

            /* 帐号密码登录2 */
            $("#formmima").submit(function () {
                $(".js_ekey_err").hide().html("");
                var exp = new RegExp("^[\u4e00-\u9fa5]{0,}$");

                var account = $(":input[data-id=txtUserName]");
                var auxiliaryInfo = $(":input[data-id=txtUserPassword]");
                var captchaCode = $("#Captcha");
                if (account.val() == "") {
                    $("#formmima").find(".js_pass_err").html("账号不能为空").show();
                    account.parent(".d_iptw").addClass("d_iptw_err");
                    return false;
                } else if (exp.test(account.val())) {
                    $("#formmima").find(".js_pass_err").show().html("账号格式错误");
                    account.parent(".d_iptw").addClass("d_iptw_err");
                    return false;
                } else if (auxiliaryInfo.val() == "") {
                    $("#formmima").find(".js_pass_err").show().html("密码不能为空");
                    auxiliaryInfo.parent(".d_iptw").addClass("d_iptw_err");
                    return false;
                }

                if (chinaCaptchapw.captcahSwitchOpen == 1) {
                    chinaCaptchapw.openCaptchaPop(loginAjax2);
                } else if (chinaCaptchapw.captcahSwitchOpen == 0) {
                    if ($('.mm').val() != "") {
                        loginAjax2()
                    } else {
                        $("#formmima").find(".errorbox").show().html("请输入验证码");
                    }
                } else if (chinaCaptchapw.captcahSwitchOpen == -1) {
                    loginAjax2();
                }
                //登录
                function loginAjax2() {
                    $.ajax({
                        url: Defaults.AsynUrl,
                        type: "post",
                        dataType: "json",
                        data: {
                            Account: account.val(),
                            AuxiliaryInfo: auxiliaryInfo.val(),
                            //Captcha: captchaCode.val(),
                            Captcha: $('input[name="Captcha"]').val(),
                            IsSmsCodeLogin: false,
                            serverCode: serverCode,
                            serverName: serverName,
                            areaCode: areaCode,
                            areaName: areaName,
                            CaptchaBid: "qbpwsms",
                            CookieValue: $('input[name="cookies"]').val(),
                            r: Math.random()
                        },
                        beforeSend: function () {
                            $("#formmima").find(":submit").attr("disabled", "disabled").val("正在登录...");
                        },
                        success: function (d) {
                            $("#formmima").find(":submit").removeAttr("disabled").val("登  录");
                            if (d.IsSuccess) {
                                //验证成功验证码消失
                                chinaCaptcha.closeCaptchaPop();
                                $('.js_chinaCaptchaContainer').remove();
                                $('.js_chinaCaptcha_Alert').hide();
                                $('.public_login_div').hide();
                                QiBao.showChooseRolediv(callback);
                            } else {
                                //验证码消失
                                chinaCaptcha.closeCaptchaPop();
                                chinaCaptchapw.refreshCaptcha($("#configCaptchaWrap"));
                                $("#formmima").find(".js_pass_err").show().html(d.Message);
                                //if ($('.js_login_type').val() == 0) {
                                //    $(".js_captchaimg ").attr("src", "/login/create?bid=ybtvat&r=" + Math.random() + ".png");
                                //    captchaCode.val(''); 
                                //}

                                //if ($('.js_login_type').val() == 1) {
                                //    chinaCaptchapw.refreshCaptcha();
                                //    //alert(d.Message);
                                //}

                                if (d.Data == "unauthorized") {
                                    QiBao.TimeOutDiv();
                                } else if (d.Data == "JsonException") {
                                    window.location.href = d.ReturnUrl;
                                } else {
                                    $("#formmima").find(".js_pass_err").show().html(d.Message);
                                }
                            }
                        },
                        error: function () {
                            //验证码消失
                            chinaCaptcha.closeCaptchaPop();
                            chinaCaptchapw.refreshCaptcha($("#configCaptchaWrap"));
                            $("#formsms").find(":submit").removeAttr("disabled").val("登  录");
                            $("#formsms").find(".errorbox").show().html("登录失败，请稍后重试。");
                        }
                    });
                }

                return false;
            });
            /* 帐号密码登录 end */

            $(".js_publog_popclose").die("click").live("click", function () {
                $(".public_login_div").remove();
            });
        },


        showChooseRolediv: function (callback) {
            $.ajax({
                url: Defaults.LayerChooseRole,
                type: "get",
                data: { r: Math.random() },
                beforeSend: function (d) {
                    $(".js_chooserole_pop_btn").find("span").html("确认中...");
                },
                success: function (d) {
                    if (d.IsSuccess) {
                        $(".public_login_div").remove();
                        $(".public_ChooseRole_div").remove();
                        //add by tianhaiting 2015-2-3 start
                        if (d.Value.length == 1 && d.Value != "") {
                            var roleId = d.Value[0].RoleId;
                            QiBao.ChooseRoleLogin(roleId);
                        } else {
                            $("body").append(ChooseRoleHtml);
                            $(".js_chooseRBox_popclose").die("click").live("click", function () {
                                $(".public_ChooseRole_div").remove();
                            });
                        }
                        if (d.Value.length > 1 && d.Value != "") {
                            $(".select_role").html('当前登录服务器:<i>' + d.ServerName + '</i>');
                            var str = "";
                            for (var i = 0; i < d.Value.length; i++) {
                                str += '<li data-rid="' + d.Value[i].RoleId + '"><img width="50" height="50" src="/img.gyyxcdn.cn/qibao/Images/layerRoleImages/' + d.Value[i].ImageNumber + '" ><p>' + d.Value[i].RoleName + '</p><p>' + d.Value[i].Level + '级</p><p>' + d.Value[i].Religion + '</p></li>';
                            }
                            $(".sel_role_list").html(str);

                            //add by pengjia 2014.1.8 新增角色选择弹出框超过8个时宽度 并添加滚动
                            if (d.Value.length > 8) {
                                $("#public_ChooseRole_divTip .pop").css("width", "566px");
                                $("#public_ChooseRole_divTip .select_role_body ul:first").css({ "height": "405px", "overflow": "auto" });
                                $("#public_ChooseRole_divTip .select_role_body ul:last").css("width", "506px");
                            }



                            var winwidth = $(window).width();
                            var thisleft = winwidth / 2 - $("#public_ChooseRole_divTip").width() / 2;
                            var thistop = $(window).height() / 2 - $("#public_ChooseRole_divTip").height() / 2 + $(window).scrollTop();
                            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
                            $(".public_ChooseRole_div .markdiv").css("height", bodyheight);
                            $("#public_ChooseRole_divTip").css({ 'left': thisleft, 'top': thistop });

                            $(".sel_role_list li").hover(function () {
                                $(this).addClass("on");
                            }, function () {
                                $(this).removeClass("on");
                            });

                            $(".js_backtologin_btn").die("click").live("click", function () {
                                $(".public_ChooseRole_div").remove();
                                QiBao.showLogindiv(d.AreaCode, d.AreaName, d.ServerCode, d.ServerName);
                                yzmType();
                            });

                            $(".sel_role_list li").die("click").live("click", function () {
                                var roleId = $(this).attr("data-rid");
                                $(this).addClass("crr").siblings("li").addClass("filters").removeClass("crr");
                                $(this).append('<p><img width="16" height="11" src=/img.gyyxcdn.cn/qibao/Images/changeloading.gif" style="margin:5% auto 0 auto;"></p>');
                                //update by tianhaiting 2015-2-3
                                QiBao.ChooseRoleLogin(roleId);
                                $(".sel_role_list li").die("click");
                            });

                        } else if (d.Value.length == 0 || d.Value == "") {

                            $(".select_role").html('当前登录服务器:<i>' + d.ServerName + '</i>');
                            var str = '<p class="pp">该服务器下没有角色，请<a onclick="QiBao.getLogoutToServerList()" href="javascript:;">重新选择区组</a>或创建角色</p>';
                            var winwidth = $(window).width();
                            var thisleft = winwidth / 2 - $("#public_ChooseRole_divTip").width() / 2;
                            var thistop = $(window).height() / 2 - $("#public_ChooseRole_divTip").height() / 2 + $(window).scrollTop();
                            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
                            $(".public_ChooseRole_div .markdiv").css("height", bodyheight);
                            $("#public_ChooseRole_divTip").css({ 'left': thisleft, 'top': thistop });
                            $(".pop_body").html(str).css("padding", "50px 14px 70px");
                        }
                    } else {
                        if (d.Data == "unauthorized") {
                            QiBao.TimeOutDiv();
                        } else if (d.Data == "JsonException") {
                            window.location.href = d.ReturnUrl;
                        } else {
                            alert(d.Message)
                        }
                    }
                },
                error: function (d, e) { alert("LayerChooseRole 失败") }
            })

        }, chooseRolebtn: function (callback) {
            $.ajax({
                url: Defaults.LayerChooseRole,
                type: "get",
                data: { r: Math.random() },
                success: function (d) {
                    if (d.IsSuccess) {
                        $(".yh_signout").attr("data-ac", d.AreaCode).attr("data-sc", d.ServerCode).attr("data-an", d.AreaName).attr("data-sn", d.ServerName);
                        if (d.Value.length <= 1 || d.Value == "") {
                            $(".js_chorole").css({ color: "#ddd", cursor: "default" }).attr("onclick", "").text("无切换角色");
                        }
                    }
                }
            })
        },
        showLoginCrossdiv: function (areaCode, areaName, serverCode, serverName, sellServerId, callback) {

            $(".public_ChooseRoleCross_div").remove();
            $(".public_loginCross_div").remove();
            $("body").append(LoginCrossPopHtml);
            if (btnType == "self") {
                $(".js_chooseServer").hide();
            }
            $(".public_loginCross_div .js_areaName").html(areaName).attr("data-areaCode", areaCode);
            $(".public_loginCross_div .js_serverName").html(serverName).attr("data-serverCode", serverCode);

            var winwidth = $(window).width();
            var thisleft = winwidth / 2 - $("#public_loginCross_divTip").width() / 2;
            var thistop = $(window).height() / 2 - $("#public_loginCross_divTip").height() / 2 + $(window).scrollTop();
            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
            $(".public_loginCross_div .markdiv").css("height", bodyheight);
            $("#public_loginCross_divTip").css({ 'left': thisleft, 'top': thistop });

            $(".js_chooseServer").die("click").live("click", function () {
                var serverSaleCode = sellServerId;
                $(".public_loginCross_div").remove();
                $(".public_ChooseRoleCross_div").remove();
                $.ajax({
                    url: "/Navigation/CrossServerList",
                    type: "GET",
                    dataType: "JSON",
                    data: {
                        r: Math.random(),
                        sellServerId: sellServerId
                    },
                    success: function (d) {
                        if (!d.IsSuccess) {
                            if (d.Data == "unauthorized") {
                                window.location.href = "/Navigation/ServerList";
                            } else {
                                QiBao.ShowMessageDiv({
                                    Content: "<p style='font-size:14px;'>" + d.Message + "</p>"
                                });
                            }
                        } else {
                            if (d.Data.length > 0) {
                                serverSaleCode = d.Data[0].SellServerCode;
                                QiBao.showServerCrossDiv(d.Data, serverSaleCode);
                            } else {
                                alert("该服务器商品无法跨服购买！");
                            }
                        }
                    }
                });

            });

            // 注册页面提示 input输入框获取焦点和失去焦点
            $(".js_tip").focus(function () {
                var obj = $(this);
                var hstip = obj.next(".js_tipword");
                hstip.css('display', 'none');
            });
            $(".js_tip").blur(function () {
                var val = $(this).attr("value");
                var hstip = $(this).next(".js_tipword");
                if (val == "") {
                    hstip.css('display', 'block')
                }
            });
            $(".js_tipword").click(function () {
                $(this).prev("input").focus();
            });
            setTimeout(function () {
                $(".js_tip").val("");
            }, 100);


            //弹出短信验证码
            var chinaCaptcha = configCaptcha({
                captchaInWrap: "#configCaptchaWrap01",
                data: {
                    bid: "qbslsms"
                },
                inputName: "CaptchaSms",
                inputCookieName: "cookiesSms",
                simHtml: codestring
            });
            //弹出密码登录验证码
            var chinaCaptchapw = configCaptcha({
                captchaInWrap: "#configCaptchaWrap",
                data: {
                    bid: "qbpwsms"
                },
                inputName: "Captcha",
                inputCookieName: "cookies",
                simHtml: codestring
            });
            //选项卡切换
            $(".public_loginCross_div .js_tab li").click(function (event) {
                //当短信登录的时候初始化验证码
                if ($(this).index() == 2) {
                    chinaCaptcha.init();
                }
                //当密码登录的时候初始化验证码
                if ($(this).index() == 1) {
                    chinaCaptchapw.init();
                }

                $(this).addClass('curr').siblings('li').removeClass('curr');
                var $slide = $(this).parent().next(".pop_slide");
                $(this).parent().next(".pop_slide").animate({ left: 40 + 78 * $(this).attr('alt') + "px" }, "50");
                $(".js_tabdiv ul").addClass('dn');
                $("#" + $(this).attr("data-id")).removeClass('dn');
                //登录注册表单
                $("#" + $(this).attr("data-form")).removeClass('dn');
                $("#" + $(this).siblings("li").attr("data-form")).addClass('dn');
                if ($(this).attr("data-id") == "js_ewm") {
                    if ($("#js_ewm_box").attr("data-status") == "1") {
                        $("#js_ewm_box").attr('data-status', '0');
                        getqrcode($("#js_ewm_box"));
                    }
                }
                return false;
            });
            getqrcode($("#js_ewm_box"));
            function ewmLoginFn(oEwmbox) {
                $.ajax({
                    url: Defaults.QRCodeLogin,
                    type: 'GET',
                    data: {
                        isCrossServerLogin: "YES",
                        serverCode: serverCode,
                        serverName: serverName,
                        areaCode: areaCode,
                        areaName: areaName,
                        r: Math.random()
                    },
                    success: function (d) {
                        if (d.success) {
                            $(".public_loginCross_div").remove();
                            //QiBao.showChooseRolediv(callback);
                            //弹出跨服后的角色列表，20161012，lxc
                            QiBao.showChooseRoleCrossdiv(callback, btnType);
                        } else {
                            $('.ewmOverDue_box').show();
                            $('.ewmtxt').html('二维码失效<br/>请点击刷新');
                            oEwmbox.attr('data-status', '1');
                        }
                    },
                    error: function () {
                        $('.ewmOverDue_box').show();
                        $('.ewmtxt').html('网络异常<br/>请点击刷新');
                        oEwmbox.attr('data-status', '1');
                    }
                });
            }
            function getqrcode(oEwmbox) {
                if (oEwmbox.attr('data-status') == '1') {
                    oEwmbox.attr('data-status', '0');
                    $('.ewmOverDue_box').hide();
                    ajaxqrcode(oEwmbox);
                } else {
                    $('.ewmOverDue_box').hide();
                    ajaxqrcode(oEwmbox);
                }
            };
            function ajaxqrcode(oEwmbox) {
                $.ajax({
                    url: "/QRCode/GetQRCode",
                    type: 'GET',
                    data: { r: Math.random() },
                    success: function (d) {
                        if (d.success) {
                            $('#js_ewm_box').empty();
                            var qrcode = new QRCode('js_ewm_box', {
                                text: d.content,
                                width: 177,
                                height: 177,
                                colorDark: '#000',
                                colorLight: '#ffffff',
                                correctLevel: QRCode.CorrectLevel.H
                            });
                            if (oEwmbox.find('table').length == 1) {
                                ewmLoginFn(oEwmbox);
                            } else {
                                oEwmbox.find('img').unbind('load').bind('load', function () {
                                    ewmLoginFn(oEwmbox);
                                });
                            };
                            $('#js_ewm_box').attr("title", "");
                        }
                    },
                    error: function () {
                        $('.ewmOverDue_box').show();
                        $('.ewmtxt').html('获取二维码失败<br/>请点击刷新');
                        oEwmbox.attr('data-status', '1');
                    }
                });
            };

            $('.ewmOverDue_box').unbind('click').bind('click', function () {
                $(this).hide();
                getqrcode($("#js_ewm_box"));
            });

            /* 检查帐号是否绑定了手机认证、然后决定是否发送短信 */
            $("#dxyzm").die("click").live("click", function () {
                //判断验证码是否在倒计时中
                if ($(this).attr("disabled") == "disabled") {
                    return false;
                }
                $("#formsms").find(".js_phone_err").hide().html("");
                var exp = new RegExp("^[\u4e00-\u9fa5]{0,}$");
                var account = $(":input[data-id=txtSmsUserName]");

                if (account.val() == "") {
                    $("#formsms").find(".js_phone_err").show().html("账号不能为空");
                    account.parent(".d_iptw").addClass("d_iptw_err");
                    return false;
                } else if (exp.test(account.val())) {
                    $("#formsms").find(".js_phone_err").show().html("账号格式错误");
                    account.parent(".d_iptw").addClass("d_iptw_err");
                    return false;
                }
                //新验证码
                if (chinaCaptcha.captcahSwitchOpen == 1) {
                    chinaCaptcha.openCaptchaPop(SenderMessage);
                } else if (chinaCaptcha.captcahSwitchOpen == 0) {
                    if ($('.mm').val() != "") {
                        SenderMessage();
                    } else {
                        $("#formsms").find(".js_phone_err").show().html("请输入验证码");
                    }
                } else if (chinaCaptcha.captcahSwitchOpen == -1) {
                    SenderMessage();
                }
                /* 发送短信验证码 */
                function SenderMessage() {
                    $.ajax({
                        url: Defaults.SenderMessage,
                        type: "post",
                        dataType: "json",
                        data: {
                            captchaCode: $('input[name="CaptchaSms"]').val(),
                            cookieValue: $('input[name="cookiesSms"]').val(),
                            captchaBid: "qbslsms",
                            Account: $(":input[data-id=txtSmsUserName]").val(),
                            r: Math.random()
                        },
                        beforeSend: function (d) {
                            $(".js_sendbtn").addClass("disb").attr("disabled", "disabled").val("发送中...");
                        },
                        success: function (data) {
                            //验证码消失
                            chinaCaptcha.closeCaptchaPop();
                            $("#formsms").find(".js_phone_err").hide().html("");
                            account.parent(".d_iptw").addClass("d_iptw_err");

                            if (data.IsSuccess && data.Message == "发送成功") {
                                $("#dxyzm").attr("disabled", "disabled").empty().html("重新获取（" + data.PushTime + "）");
                                QiBao.countDown($("#dxyzm"), data.PushTime);
                            } else {
                                //刷新验证码
                                chinaCaptcha.refreshCaptcha($("#configCaptchaWrap01"));
                                $("#formsms").find(".js_phone_err").show().html(data.Message);
                                $(".js_sendbtn").addClass("disb").removeClass("disb").removeAttr("disabled").val("免费获取短信验证码");
                                //验证码消失
                                chinaCaptcha.closeCaptchaPop();

                                if (data.Data == "unauthorized") {
                                    QiBao.TimeOutDiv();
                                } else if (data.Data == "JsonException") {
                                    window.location.href = data.ReturnUrl;
                                } else {
                                    $("#formsms").find(".js_phone_err").show().html(data.Message);
                                }
                            }
                        },
                        error: function () {
                            chinaCaptcha.refreshCaptcha($("#configCaptchaWrap01"));
                            $(":input[data-id=txtSmsUserName]").removeAttr("disabled");
                        }
                    });
                }
            });
            /* 检查帐号是否绑定了手机认证、然后决定是否发送短信 end */

            //短信登录 
            $(".js_phone").die("keyup").live("keyup", function () {
                if ($("#dxyzm").attr("disabled") == "disabled") {
                    $("#dxyzm").removeAttr("disabled");
                    clearInterval(timer);
                    $("#dxyzm").empty().html("免费获取短信验证码");
                }
            });

            /* 手机登录 */
            $("#formsms").submit(function () {

                $(".js_phone_err").hide().html("");

                var PhonePatt = /^[a-zA-Z0-9]{5}$/;
                var exp = new RegExp("^[\u4e00-\u9fa5]{0,}$");
                var account = $(":input[data-id=txtSmsUserName]");
                var auxiliaryInfo = $(":input[data-id=txtSms]");

                if (account.val() == "") {
                    $("#formsms").find(".js_phone_err").show().html("账号不能为空");
                    account.parent(".d_iptw").addClass("d_iptw_err");
                    return false;
                } else if (exp.test(account.val())) {
                    $("#formsms").find(".js_phone_err").show().html("账号格式错误");
                    account.parent(".d_iptw").addClass("d_iptw_err");
                    return false;
                } else if (auxiliaryInfo.val() == "") {
                    $("#formsms").find(".js_phone_err").show().html("手机验证码不能为空");
                    auxiliaryInfo.parent(".d_iptw").addClass("d_iptw_err");
                    return false;
                } else if (!PhonePatt.test(auxiliaryInfo.val())) {
                    $("#formsms").find(".js_phone_err").show().html("手机验证码错误");
                    auxiliaryInfo.parent(".d_iptw").addClass("d_iptw_err");
                    return false;
                }
                $.ajax({
                    url: Defaults.AsynLayerLoginUrl,
                    type: "post",
                    dataType: "json",
                    data: {
                        Account: account.val(),
                        AuxiliaryInfo: auxiliaryInfo.val(),
                        IsSmsCodeLogin: true,
                        serverCode: serverCode,
                        serverName: serverName,
                        areaCode: areaCode,
                        areaName: areaName,
                        r: Math.random()
                    },
                    beforeSend: function () {
                        $("#formsms").find(":submit").attr("disabled", "disabled").val("正在登录...");
                    },
                    success: function (d) {
                        $("#formsms").find(":submit").removeAttr("disabled").val("登  录");
                        if (d.IsSuccess) {

                            QiBao.showChooseRoleCrossdiv(callback, btnType);

                        } else {
                            //刷新验证码
                            chinaCaptcha.refreshCaptcha($("#configCaptchaWrap01"));
                            if (d.Data == "unauthorized") {
                                QiBao.TimeOutDiv();
                            } else if (d.Data == "JsonException") {
                                window.location.href = d.ReturnUrl;
                            } else {
                                $("#formsms").find(".js_phone_err").show().html(d.Message);
                            }
                        }
                    },
                    error: function () {
                        //刷新验证码
                        chinaCaptcha.refreshCaptcha($("#configCaptchaWrap01"));
                        $("#formsms").find(":submit").removeAttr("disabled").val("登  录");
                        $("#formsms").find(".js_phone_err").show().html("登录失败，请稍后重试。");
                    }
                });
                return false;
            });
            /* 手机登录 end */

            /* 帐号密码登录 1*/
            $("#formmima").submit(function () {

                $(".js_ekey_err").hide().html("");
                var exp = new RegExp("^[\u4e00-\u9fa5]{0,}$");
                var account = $(":input[data-id=txtUserName]");
                var auxiliaryInfo = $(":input[data-id=txtUserPassword]");
                var captchaCode = $("#Captcha");

                if (account.val() == "") {
                    $("#formmima").find(".js_pass_err").html("账号不能为空").show();
                    account.parent(".d_iptw").addClass("d_iptw_err");
                    return false;
                } else if (exp.test(account.val())) {
                    $("#formmima").find(".js_pass_err").show().html("账号格式错误");
                    account.parent(".d_iptw").addClass("d_iptw_err");
                    return false;
                } else if (auxiliaryInfo.val() == "") {
                    $("#formmima").find(".js_pass_err").show().html("密码不能为空");
                    auxiliaryInfo.parent(".d_iptw").addClass("d_iptw_err");
                    return false;
                } else { }

                if (chinaCaptchapw.captcahSwitchOpen == 1) {
                    chinaCaptchapw.openCaptchaPop(loginAjax);
                } else if (chinaCaptchapw.captcahSwitchOpen == 0) {
                    if ($('.mm').val() != "") {
                        loginAjax()
                    } else {
                        $("#formmima").find(".js_pass_err").show().html("请输入验证码");
                    }
                } else if (chinaCaptchapw.captcahSwitchOpen == -1) {
                    loginAjax();
                }

                function loginAjax() {
                    $.ajax({
                        url: Defaults.AsynLayerLoginUrl,
                        type: "post",
                        dataType: "json",
                        data: {
                            Account: account.val(),
                            AuxiliaryInfo: auxiliaryInfo.val(),
                            //Captcha: captchaCode.val(),
                            Captcha: $('input[name="Captcha"]').val(),
                            IsSmsCodeLogin: false,
                            serverCode: serverCode,
                            serverName: serverName,
                            areaCode: areaCode,
                            areaName: areaName,
                            CaptchaBid: "qbpwsms",
                            CookieValue: $('input[name="cookies"]').val(),
                            r: Math.random()
                        },
                        beforeSend: function () { $("#formmima").find(":submit").attr("disabled", "disabled").val("正在登录..."); },
                        success: function (d) {
                            $("#formmima").find(":submit").removeAttr("disabled").val("登  录");
                            if (d.IsSuccess) {
                                //验证成功验证码消失
                                chinaCaptcha.closeCaptchaPop();
                                $('.js_chinaCaptchaContainer').remove();
                                $('.js_chinaCaptcha_Alert').hide();
                                $('.public_loginCross_div').hide();
                                QiBao.showChooseRoleCrossdiv(callback, btnType);

                            } else {
                                //验证码消失
                                chinaCaptchapw.closeCaptchaPop();
                                //刷新验证码
                                chinaCaptchapw.refreshCaptcha($("#configCaptchaWrap"));
                                $("#formmima").find(".js_pass_err").show().html(d.Message);
                                //if ($('.js_login_type').val() == 0) {
                                //    $(".js_captchaimg ").attr("src", "/login/create?bid=ybtvat&r=" + Math.random() + ".png");
                                //    captchaCode.val('');
                                //}

                                //if ($('.js_login_type').val() == 1) {
                                //    chinaCaptchapw.refreshCaptcha();
                                //    alert(d.Message);
                                //}

                                if (d.Data == "unauthorized") {
                                    QiBao.TimeOutDiv();
                                } else if (d.Data == "JsonException") {
                                    window.location.href = d.ReturnUrl;
                                } else {

                                    $("#formmima").find(".js_pass_err").show().html(d.Message);

                                }
                            }
                        },
                        error: function () {
                            //验证码消失
                            chinaCaptcha.closeCaptchaPop();
                            //刷新验证码
                            chinaCaptchapw.refreshCaptcha($("#configCaptchaWrap"));
                            $("#formsms").find(":submit").removeAttr("disabled").val("登  录");
                            $("#formsms").find(".errorbox").show().html("登录失败，请稍后重试。");
                        }
                    });
                }

                return false;
            });
            /* 帐号密码登录 end */
            $(".js_publogCross_popclose").die("click").live("click", function () {
                $(".public_loginCross_div").remove();
            });
        },
        showChooseRoleCrossdiv: function (callback, btnType) {
            $.ajax({
                url: Defaults.CrossServerLayerChooseRole,
                type: "get",
                data: { r: Math.random() },
                beforeSend: function (d) {
                    $(".js_chooserole_popCross_btn").find("span").html("确认中...");
                },
                success: function (d) {
                    if (d.IsSuccess) {
                        var SellServerName = '';

                        $(".public_loginCross_div").remove();
                        $(".public_ChooseRoleCross_div").remove();
                        //add by tianhaiting 2015-2-3 start
                        if (d.Value.length == 1 && d.Value != "") {
                            var roleId = d.Value[0].RoleId;
                            QiBao.ChooseRoleCrossLogin(roleId);
                        } else {
                            $("body").append(ChooseRoleCrossHtml);
                            $(".js_chooseRBox_popclose").die("click").live("click", function () {
                                $(".public_ChooseRoleCross_div").remove();
                            });
                        }
                        if (d.Value.length > 1 && d.Value != "") {
                            if (btnType == "cross") {
                                $(".select_role").html('购买商品服务器:<i>' + d.BuyServerName + '</i><br/>商品所在服务器:<i>' + SellServerName + '</i>');

                            } else {
                                $(".select_role").html('当前登录服务器:<i>' + d.BuyServerName + '</i>');

                            }
                            var str = "";
                            for (var i = 0; i < d.Value.length; i++) {
                                str += '<li data-rid="' + d.Value[i].RoleId + '"><img width="50" height="50" src="/img.gyyxcdn.cn/qibao/Images/layerRoleImages/' + d.Value[i].ImageNumber + '" ><p>' + d.Value[i].RoleName + '</p><p>' + d.Value[i].Level + '级</p><p>' + d.Value[i].Religion + '</p></li>';
                            }
                            $(".sel_role_list").html(str);

                            //add by pengjia 2014.1.8 新增角色选择弹出框超过8个时宽度 并添加滚动
                            if (d.Value.length > 8) {
                                $("#public_ChooseRoleCross_divTip .pop").css("width", "566px");
                                $("#public_ChooseRoleCross_divTip .select_role_body ul:first").css({ "height": "405px", "overflow": "auto" });
                                $("#public_ChooseRoleCross_divTip .select_role_body ul:last").css("width", "506px");
                            }

                            var winwidth = $(window).width();
                            var thisleft = winwidth / 2 - $("#public_ChooseRoleCross_divTip").width() / 2;
                            var thistop = $(window).height() / 2 - $("#public_ChooseRoleCross_divTip").height() / 2 + $(window).scrollTop();
                            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
                            $(".public_ChooseRoleCross_div .markdiv").css("height", bodyheight);
                            $("#public_ChooseRoleCross_divTip").css({ 'left': thisleft, 'top': thistop });

                            $(".sel_role_list li").hover(function () {
                                $(this).addClass("on");
                            }, function () {
                                $(this).removeClass("on");
                            });

                            $(".js_backtologinCross_btn").die("click").live("click", function () {
                                $('.public_ChooseRoleCross_div').remove();
                                var callbackname = $(this).attr("data-callback");
                                QiBao.getUserStatus(callbackname);
                                yzmType();//验证类型。
                            });

                            $(".sel_role_list li").die("click").live("click", function () {
                                var roleId = $(this).attr("data-rid");
                                $(this).addClass("crr").siblings("li").addClass("filters").removeClass("crr");
                                $(this).append('<p><img width="16" height="11" src="/img.gyyxcdn.cn/qibao/Images/changeloading.gif" style="margin:5% auto 0 auto;"></p>');
                                //update by tianhaiting 2015-2-3
                                QiBao.ChooseRoleCrossLogin(roleId);
                                $(".sel_role_list li").die("click");
                            });

                        } else if (d.Value.length == 0 || d.Value == "") {

                            if (btnType == "cross") {
                                $(".select_role").html('购买商品服务器:<i>' + d.BuyServerName + '</i><br/>商品所在服务器:<i>' + SellServerName + '</i>');
                                var str = '<p class="pp">该服务器下没有角色，请<a class="js_chooseServer" href="javascript:;">重新选择区组</a>或创建角色、<a class="js_loginagian" href="javascript:;">重新登录</a></p>';

                            } else {
                                $(".select_role").html('当前登录服务器:<i>' + SellServerName + '</i>');
                                var str = '<p class="pp">该服务器下没有角色，请创建角色或<a class="js_loginagian" href="javascript:;">重新登录</a></p>';

                            }

                            var winwidth = $(window).width();
                            var thisleft = winwidth / 2 - $("#public_ChooseRoleCross_divTip").width() / 2;
                            var thistop = $(window).height() / 2 - $("#public_ChooseRoleCross_divTip").height() / 2 + $(window).scrollTop();
                            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
                            $(".public_ChooseRoleCross_div .markdiv").css("height", bodyheight);
                            $("#public_ChooseRoleCross_divTip").css({ 'left': thisleft, 'top': thistop });
                            $(".pop_body").html(str).css("padding", "50px 14px 70px");
                            $(".js_chooseServer").die("click").live("click", function () {
                                var serverSaleCode = SellServerCode;
                                $(".public_loginCross_div").remove();
                                $(".public_ChooseRoleCross_div").remove();
                                $.ajax({
                                    url: "/Navigation/CrossServerList",
                                    type: "GET",
                                    dataType: "JSON",
                                    data: {
                                        r: Math.random(),
                                        sellServerId: SellServerCode
                                    },
                                    success: function (d) {
                                        if (!d.IsSuccess) {
                                            if (d.Data == "unauthorized") {
                                                window.location.href = "/Navigation/ServerList";
                                            } else {
                                                QiBao.ShowMessageDiv({
                                                    Content: "<p style='font-size:14px;'>" + d.Message + "</p>"
                                                });
                                            }
                                        } else {
                                            if (d.Data.length > 0) {
                                                serverSaleCode = d.Data[0].SellServerCode;
                                                QiBao.showServerCrossDiv(d.Data, serverSaleCode);
                                            } else {
                                                alert("该服务器商品无法跨服购买！");
                                            }
                                        }
                                    }
                                });

                            });
                            $(".js_loginagian").die("click").live("click", function () {
                                QiBao.showLoginCrossdiv(d.BuyAreaCode, d.BuyAreaName, d.BuyServerCode, d.BuyServerName, d.SellServerCode);
                                yzmType();//验证码类型
                            });
                        }
                    } else {
                        if (d.Data == "unauthorized") {
                            QiBao.TimeOutDiv();
                        } else if (d.Data == "JsonException") {
                            window.location.href = d.ReturnUrl;
                        } else {
                            alert(d.Message)
                        }
                    }
                },
                error: function (d, e) { alert("LayerChooseRole 失败") }
            })

        },
        ChooseRoleLogin: function (roleId) {
            $.ajax({
                url: Defaults.LayerChooseRoleByRoleId,
                type: "post",
                data: { r: Math.random(), roleId: roleId },
                beforeSend: function (d) {
                    $(".signinfo_wrap").html('<p style="width:100%; text-align:center; margin: 5% 0 0 0;"><img width="16" height="11" src="/img.gyyxcdn.cn/qibao/Images/changeloading.gif" style="margin:0px 3% 0px 0px;">登录中...</p>');
                },
                success: function (d) {
                    if (d.IsSuccess) {
                        /*这里查询登录的用户信息*/
                        $.ajax({
                            url: Defaults.SimpleUserInfo,
                            type: "get",
                            data: { r: Math.random() },
                            success: function (d) {
                                if (d.IsSuccess) {
                                    if (checkCross.test(crossUrl)) {
                                        window.location.href = window.location.href;
                                    } else {
                                        $(".public_ChooseRole_div").remove();
                                        var str = '<div class="sginfo fl">';
                                        var msgcut = "";
                                        var logotourl = window.location.href;
                                        if (d.Value.UnReadNoticesCount > 99) {
                                            msgcut = '<a class="yhxx icon" href="/Notices/Index?pageindex=1&readed=unread" ><em class="longs">99+</em>';
                                            $(".yhxx em").show();
                                        } else if (d.Value.UnReadNoticesCount == 0) {
                                            msgcut = '<a class="yhxx msgnone icon" href="/Notices/Index?pageindex=1&readed=unread" >';
                                        } else {
                                            msgcut = '<a class="yhxx icon" href="/Notices/Index?pageindex=1&readed=unread" ><em>' + d.Value.UnReadNoticesCount + '</em>';
                                        }
                                        if (d.Value.RoleName == "游客") {
                                            str += '<div><span class="span">您好，您尚未登录</span><a data-callback="QiBao.Goto(' + logotourl + ')" class="logina js_cl_login" href="javascript:;">登录</a><a class="yh_signout" href="/account.gyyx.cn/Member/Register/">注册</a></div><div class="yhye"></div><div class="yhqz"><span>' + d.Value.AreaName + '→' + d.Value.ServerName + '</span><a href="javascript:;" onclick="QiBao.getLogoutToServerList()">重选区组</a></div></div><img class="fl" src="' + d.Value.RoleImage + '" alt="头像" /><div class="bg_arr1 fl"></div>';
                                        } else {
                                            str += '<div>欢迎， <span>' + d.Value.RoleName + '</span>' + msgcut + '</a><a class="yh_signout" href="javascript:;" onclick="QiBao.getLogoutToItemList();">退出</a></div><div class="yhye">您的账户余额：<strong>' + d.Value.Cash + '</strong></div><div class="yhqz"><span>' + d.Value.AreaName + '→' + d.Value.ServerName + '</span><a href="javascript:;" onclick="QiBao.getLogoutToServerList()">重选区组</a><a class="js_chorole" href="javascript:;" onclick="QiBao.showChooseRolediv();">切换角色</a></div></div><img class="fl" src="' + d.Value.RoleImage + '" alt="头像" /><div class="bg_arr1 fl"></div>';
                                        }

                                        $(".signinfo_wrap").html(str);
                                        //add by tianhaiting 2015-2-2 start
                                        if (d.Value.RoleName != "游客") {
                                            //检查收藏状态
                                            QiBao.collectState();
                                        }
                                        //add by tianhaiting 2015-2-2 end
                                        QiBao.chooseRolebtn();//判断当只有一个角色时切换角色按钮不可用
                                        window.location.reload(true);
                                    }
                                } else {
                                    if (d.Data == "unauthorized") {
                                        QiBao.TimeOutDiv();
                                    } else if (d.Data == "JsonException") {
                                        window.location.href = d.ReturnUrl;
                                    } else {
                                        $(".puberror_pop").html(d.Message).show();
                                    }
                                }
                            },
                            // error: function () { alert("SimpleUserInfo 失败") }
                            error: function () { alert("获取用户信息失败") }
                        });
                    } else {
                        if (d.Data == "unauthorized") {
                            QiBao.TimeOutDiv();
                        } else if (d.Data == "JsonException") {
                            window.location.href = d.ReturnUrl;
                        } else {
                            $(".puberror_pop").html(d.Message).show();
                        }
                    }
                },
                error: function () { alert("获取用户角色失败") }
            });
        },
        ChooseRoleCrossLogin: function (roleId) {
            $.ajax({
                url: Defaults.LayerChooseRoleCrossByRoleId,
                type: "post",
                data: { r: Math.random(), roleId: roleId },
                success: function (d) {
                    if (d.IsSuccess) {
                        //不同的按钮选择角色登录跳到不同页面
                        if (btnType == "cross") {
                            window.location.href = d.ReturnUrl + "?ItemCode=" + ItemCode;
                        } else {
                            window.location.href = window.location.href;
                        }
                    } else {
                        if (d.Data == "unauthorized") {
                            QiBao.TimeOutDiv();
                        } else if (d.Data == "JsonException") {
                            window.location.href = d.ReturnUrl;
                        } else {
                            $(".puberror_pop").html(d.Message).show();
                        }
                    }
                },
                error: function () { alert("获取用户角色失败"); }
            });
        },
        countDown: function (obj, seconds) {
            $obj = $(obj);
            timer = setInterval(function () {
                if (seconds > 1) {
                    seconds = seconds - 1;
                    $obj.empty().html("重新获取（" + seconds + "）");
                } else {
                    clearInterval(timer);
                    $obj.removeAttr("disabled").empty().html("免费获取短信验证码");
                }
            }, 1000);
        },
        countDown2: function (obj, seconds) {
            $obj = $(obj);
            timer = setInterval(function () {
                if (seconds > 1) {
                    seconds = seconds - 1;
                    $obj.val("发送短信验证码(" + seconds + "秒后可重新点击发送)");
                } else {
                    clearInterval(timer);
                    $obj.removeAttr("disabled").val("发送短信验证码(60秒后可重新点击发送)");
                }
            }, 1000);
        },
        getLogoutToServerList: function () {
            $.ajax({
                url: Defaults.LogoutToServerList,
                type: "post",
                data: { r: Math.random() },
                success: function (d) {
                    if (d.IsSuccess) {
                        window.location.href = d.ReturnUrl;
                    } else {
                        if (d.Data == "unauthorized") {
                            QiBao.TimeOutDiv();
                        } else if (d.Data == "JsonException") {
                            window.location.href = d.ReturnUrl;
                        } else {
                            alert(d.Message)
                        }
                    }
                }
            })
        },
        getLogoutToItemList: function () {
            $.ajax({
                url: Defaults.getLogoutToItemList,
                type: "post",
                data: { r: Math.random() },
                success: function (d) {
                    if (d.IsSuccess) {
                        window.location.href = d.ReturnUrl + "?r=" + Math.random();
                    } else {
                        if (d.Data == "unauthorized") {
                            QiBao.TimeOutDiv();
                        } else if (d.Data == "JsonException") {
                            window.location.href = d.ReturnUrl;
                        } else {
                            window.location.href = "/Navigation/ServerList/";
                        }
                    }
                }
            })
        },
        Goto: function (obj) {
            window.location.href = obj;
        },
        ShowMessageDiv: function (options) {
            var defaults = {
                Title: "提示消息",/*弹层标题*/
                Content: "",/*内容*/
                Aurl: "",/*确定按钮的连接*/
                BtnWord: ""
            };
            defaults = $.extend(defaults, options);

            $("body").append(MessageBoxDiv);



            if (defaults.Aurl == "") {
                if (defaults.BtnWord == "") {
                    var cont = '<div class="pop_body" >' + defaults.Content + '<ul class="pop_sms_btnbox"><li class="pop_btn"><a class="js_pubmessbox_btn" href="javascript:"><span class="icon">确定</span><i class="icon"></i></a></li></ul></div>';
                } else {
                    var cont = '<div class="pop_body" >' + defaults.Content + '<ul class="pop_sms_btnbox"><li class="pop_btn"><a class="js_pubmessbox_btn" href="javascript:"><span class="icon">' + defaults.BtnWord + '</span><i class="icon"></i></a></li></ul></div>';
                }
            } else if (defaults.Aurl != "") {
                if (defaults.BtnWord == "") {
                    var cont = '<div class="pop_body" >' + defaults.Content + '<ul class="pop_sms_btnbox"><li class="pop_btn"><a  href="' + defaults.Aurl + '"><span class="icon">确定</span><i class="icon"></i></a></li></ul></div>';
                } else {
                    var cont = '<div class="pop_body" >' + defaults.Content + '<ul class="pop_sms_btnbox"><li class="pop_btn"><a  href="' + defaults.Aurl + '"><span class="icon">' + defaults.BtnWord + '</span><i class="icon"></i></a></li></ul></div>';
                }

            }
            $(".public_MessageBox_div .pop_title").html('<li class="curr">' + defaults.Title + '</li>');
            $(".public_MessageBox_div .js_pubMBox_popclose").after(cont);

            var winwidth = $(window).width();
            var thisleft = winwidth / 2 - $("#public_MessageBox_divTip").width() / 2;
            var thistop = $(window).height() / 2 - $("#public_MessageBox_divTip").height() / 2 + $(window).scrollTop();
            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
            $(".public_MessageBox_div .markdiv").css("height", bodyheight);
            $("#public_MessageBox_divTip").css({ 'left': thisleft, 'top': thistop });

            $(".js_pubMBox_popclose,.js_pubmessbox_btn").die("click").live("click", function () {
                $(".public_MessageBox_div").remove();
            });
        },
        ShowMessageDialog: function (options) {
            var defaults = {
                Title: "提示消息",/*弹层标题*/
                Content: "",/*内容*/
                Aurl: "",/*确定按钮的连接*/
                BtnWord: ["确定","取消"],
                callback:null,
                callbackCancel:null
            };
            defaults = $.extend(defaults, options);
            $("body").append(MessageDialogDiv);
             //渲染按钮
            if(defaults.BtnWord.length==0) return;
            var btnhtml = "";
            for (var i = 0; i < defaults.BtnWord.length; i++) {
                btnhtml += '<span class="icon btnsposi" id="btnword'+i+'">' + defaults.BtnWord[i] + '</span>';
            }
            if (defaults.BtnWord == "") {
                var cont = '<div class="pop_body" >' + defaults.Content + '<ul class="pop_sms_btnbox"><li class="pop_btn"><a class="js_pubmessbox_btn" href="javascript:"><span class="icon">确定</span></a></li></ul></div>';
            } else {
                var cont = '<div class="pop_body" >' + defaults.Content + '<ul class="pop_sms_btnbox"><li class="pop_btn"><a class="js_pubmessbox_btn" href="javascript:">' + btnhtml + '</a></li></ul></div>';
            }
            $(".public_MessageBox_div .pop_title").html('<li class="curr">' + defaults.Title + '</li>');
            $(".public_MessageBox_div .js_pubMBox_popclose").after(cont);
            $("#btnword0").on("click",function(){
                     defaults.callback && defaults.callback.call(this); 
                     close();  
            })
            $(".js_pubMBox_popclose,#btnword1").on("click",function(){
                     defaults.callbackCancel && defaults.callbackCancel.call(this); 
                     close();
            })
            var winwidth = $(window).width();
            var thisleft = winwidth / 2 - $("#public_MessageBox_divTip").width() / 2;
            var thistop = $(window).height() / 2 - $("#public_MessageBox_divTip").height() / 2 + $(window).scrollTop();
            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
            $(".public_MessageBox_div .markdiv").css("height", bodyheight);
            $("#public_MessageBox_divTip").css({ 'left': thisleft, 'top': thistop });
            function close(){
                    $(".public_MessageBox_div").remove();
            }
        },
        
        ShowMessageCrossDiv: function (options) {

            $(".public_MessageBoxCross_div").remove();
            $("body").append(MessageBoxCrossDiv);

            var winwidth = $(window).width();
            var thisleft = winwidth / 2 - $("#public_MessageBoxCross_divTip").width() / 2;
            var thistop = $(window).height() / 2 - $("#public_MessageBoxCross_divTip").height() / 2 + $(window).scrollTop();
            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
            $(".public_MessageBoxCross_div .markdiv").css("height", bodyheight);
            $("#public_MessageBoxCross_divTip").css({ 'left': thisleft, 'top': thistop });

            $(".js_pubMBox_popclose").die("click").live("click", function () {
                $(".public_MessageBoxCross_div").remove();
            });
        },
        TimeOutDiv: function () {
            $(".public_TimeOut_div").remove();
            $("body").append(TimeOutHtml);
            var winwidth = $(window).width();
            var thisleft = winwidth / 2 - $("#public_TimeOut_divTip").width() / 2;
            var thistop = $(window).height() / 2 - $("#public_TimeOut_divTip").height() / 2 + $(window).scrollTop();
            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
            $(".public_TimeOut_div .markdiv").css("height", bodyheight);
            $("#public_TimeOut_divTip").css({ 'left': thisleft, 'top': thistop });

            $(".js_pubTimeout_popclose").die("click").live("click", function () {
                $(".public_TimeOut_div").remove();
            });
        },
        DisLoginDiv: function () {
            $(".public_TimeOut_div").remove();
            $("body").append(DisabledLogin);
            var winwidth = $(window).width();
            var thisleft = winwidth / 2 - $("#public_TimeOut_divTip").width() / 2;
            var thistop = $(window).height() / 2 - $("#public_TimeOut_divTip").height() / 2 + $(window).scrollTop();
            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
            $(".public_TimeOut_div .markdiv").css("height", bodyheight);
            $("#public_TimeOut_divTip").css({ 'left': thisleft, 'top': thistop });

            $(".js_dislogin_popclose").die("click").live("click", function () {
                $(".public_TimeOut_div").remove();
                window.location.reload(true);
            });
        },
        BargainDiv: function (thisbtns) {
            $(".public_TimeOut_div").remove();
            $("body").append(BargainHtml);
            var winwidth = $(window).width();
            var thisleft = winwidth / 2 - $("#public_Bargain_divTip").width() / 2;
            var thistop = $(window).height() / 2 - $("#public_Bargain_divTip").height() / 2 + $(window).scrollTop();
            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
            $(".public_Bargain_div .markdiv").css("height", bodyheight);
            $("#public_Bargain_divTip").css({ 'left': thisleft, 'top': thistop });

            $(".js_pubTimeout_popclose").die("click").live("click", function () {
                $(".public_Bargain_div").remove();
            });
            //数据绑定
            $(".js_pop_ban_tip").empty().html("提示：只能输入低于当前价格的正整数");
            $(".js_pop_ban_name").empty().html(thisbtns.parent().parent().find(".js_itemname").text());
            $(".js_pop_ban_code").empty().html(thisbtns.parent().parent().find(".js_itemcode").text());
            $(".js_pop_ban_price").empty().html("￥" + thisbtns.parent().parent().find(".js_itemprice").val() + ".00");
            if (thisbtns.parent().parent().find(".js_pro_status").text() != "免公示" && Math.ceil(thisbtns.parent().parent().find(".js_originalprice").val() * 0.8) <= 50) {
                $(".js_pop_ori_price").empty().html("(最低：￥50.00)");
            } else if (thisbtns.parent().parent().find(".js_pro_status").text() == "免公示" && Math.ceil(thisbtns.parent().parent().find(".js_originalprice").val() * 0.8) <= 60) {
                $(".js_pop_ori_price").empty().html("(最低：￥60.00)");
            } else {
                $(".js_pop_ori_price").empty().html("(最低：￥" + Math.ceil(thisbtns.parent().parent().find(".js_originalprice").val() * 0.8) + ".00)");
            }
            //提交验证
            $(".js_ban_submit").die("click").live("click", function () {
                var searchcount = $(".js_pop_ban_couoff").val();
                var reg = /^[0-9]\d*$/;
                var testinput = reg.test(searchcount);
                var itemtypeid = parseInt(thisbtns.parent().parent().find(".js_itemtypeid").val() / 100);
                var itemlow = Math.ceil(thisbtns.parent().parent().find(".js_originalprice").val() * 0.8);
                if (thisbtns.parent().parent().find(".js_pro_status").text() != "免公示" && itemlow <= 50) {
                    itemlow = 50;
                } else if (thisbtns.parent().parent().find(".js_pro_status").text() == "免公示" && itemlow <= 60) {
                    itemlow = 60;
                }
                if ($.trim($(".js_pop_ban_couoff").val()) == "") {
                    $(".js_pop_ban_tip").empty().html("错误：还价价格不能为空");
                } else if (!testinput) {
                    $(".js_pop_ban_tip").empty().html("错误：只能输入低于当前价格的正整数");
                } else if (itemtypeid == 5 && searchcount < itemlow || thisbtns.parent().parent().find(".js_itemtypeid").val() == 5 && searchcount < itemlow) {
                    $(".js_pop_ban_tip").empty().html("错误：还价价格不能低于最低还价");
                } else if (itemtypeid == 5 && Math.ceil($(".js_pop_ban_couoff").val()) < 50 && thisbtns.parent().parent().find(".js_pro_status").text() != "免公示" || thisbtns.parent().parent().find(".js_itemtypeid").val() == 5 && Math.ceil($(".js_pop_ban_couoff").val()) < 50 && thisbtns.parent().parent().find(".js_pro_status").val() != "免公示") {
                    $(".js_pop_ban_tip").empty().html("错误：还价价格不能低于50.00元");
                } else if (itemtypeid == 5 && Math.ceil($(".js_pop_ban_couoff").val()) < 60 && thisbtns.parent().parent().find(".js_pro_status").text() == "免公示" || thisbtns.parent().parent().find(".js_itemtypeid").val() == 5 && Math.ceil($(".js_pop_ban_couoff").val()) < 60 && thisbtns.parent().parent().find(".js_pro_status").val() == "免公示") {
                    $(".js_pop_ban_tip").empty().html("错误：还价价格不能低于60.00元");
                } else if (itemtypeid != 5 && Math.ceil($(".js_pop_ban_couoff").val()) < 10 || thisbtns.parent().parent().find(".js_itemtypeid").val() != 5 && Math.ceil($(".js_pop_ban_couoff").val()) < 10) {
                    $(".js_pop_ban_tip").empty().html("错误：还价价格不能低于10.00元");
                } else if (Math.ceil($(".js_pop_ban_couoff").val()) >= Math.ceil(thisbtns.parent().parent().find(".js_itemprice").val())) {
                    $(".js_pop_ban_tip").empty().html("错误：还价价格必须小于当前价格");
                } else {
                    $.ajax({
                        url: '/Bargain/Bargain',
                        type: "post",
                        data: {
                            saleAccount: thisbtns.parent().parent().find(".js_itemsellacc").val(),
                            itemTypeId: thisbtns.parent().parent().find(".js_itemtypeid").val(),
                            itemName: $(".js_pop_ban_name").html(),
                            itemPrice: thisbtns.parent().parent().find(".js_itemprice").val() + ".00",
                            bargainPrice: $(".js_pop_ban_couoff").val() + ".00",
                            itemCode: $(".js_pop_ban_code").html(),
                            r: Math.random()
                        },
                        dataType: "json",
                        success: function (d) {
                            if (d.IsSuccess) {
                                $(".js_pop_ban_tip").empty().html("");
                                $(".js_pop_ban_tit").empty().html("提 示");
                                $(".js_pop_ban_body").empty().html("<p>发送成功~！您的还价信息已发送给卖家，请在&nbsp;<a href='/Bargain/BargainIndex' target='_blank' style=' text-decoration:underline;'>交易管理-消息-我的还价</a>&nbsp;中关注卖家回复</p>");
                                $(".js_ban_submit").removeClass("js_ban_submit").addClass("js_pubTimeout_popclose").find("span").html("确 认");
                            } else {
                                alert(d.Message);
                            }
                        }, error: function (error) {
                        }
                    });
                }
            });
        },
        ReplyDiv: function (isban, isconde, ispir, isname, isid, istime) {
            $(".public_TimeOut_div").remove();
            $("body").append(ReplyHtml);
            var winwidth = $(window).width();
            var thisleft = winwidth / 2 - $("#public_Bargain_divTip").width() / 2;
            var thistop = $(window).height() / 2 - $("#public_Bargain_divTip").height() / 2 + $(window).scrollTop();
            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
            $(".public_Bargain_div .markdiv").css("height", bodyheight);
            $("#public_Bargain_divTip").css({ 'left': thisleft, 'top': thistop });

            $(".js_pubTimeout_popclose").die("click").live("click", function () {
                $(".public_Bargain_div").remove();
            });
            //数据绑定
            $(".js_pop_ban_name").empty().html(isname);
            $(".js_pop_ban_code").empty().html(isid);
            $(".js_pop_ban_price").empty().html("￥" + ispir + ".00元");
            $(".js_pop_ban_ban").empty().html("￥" + isban + ".00元");
            $(".js_pop_ban_bantime").empty().html(istime);
            //回复买家
            $(".js_rep").die("click").live("click", function () {
                $(this).addClass('on').siblings().removeClass('on');
            });
            //获取寄售状态
            var jsitemtype = "";
            $.ajax({
                url: '/Bargain/ItemState',
                type: "get",
                data: {
                    itemCode: $(".js_pop_ban_code").html(),
                    r: Math.random()
                },
                dataType: "json",
                success: function (d) {
                    if (d.IsSuccess) {
                        $(".js_pop_ban_itemtype").html(d.Message);
                        jsitemtype = d.Message;
                    } else {
                        alert(d.Message);
                    }
                }, error: function (error) {
                }
            });
            //提交验证
            $(".js_ban_submit").die("click").live("click", function () {
                var recoverymsg = "";
                for (var i = 0; i < $(".js_rep").length; i++) {
                    if ($(".js_rep").eq(i).hasClass("on")) {
                        recoverymsg = $(".js_rep").eq(i).find(".js_pop_ban_reply").html();
                    }
                }
                $.ajax({
                    url: '/Bargain/Recovery',
                    type: "post",
                    data: {
                        recoveryMsg: recoverymsg,
                        code: isconde,
                        itemCode: $(".js_pop_ban_code").html(),
                        r: Math.random()
                    },
                    dataType: "json",
                    success: function (d) {
                        if (d.IsSuccess) {
                            if (recoverymsg == "亲,太低了~!" || recoverymsg == "亲,有点为难啊~!") {
                                $(".js_pop_ban_tit").empty().html("提 示");
                                $(".js_pop_ban_body").empty().html("<p>发送成功~！您的还价信息已发送给卖家，请在&nbsp;<a href='/Bargain/BargainIndex' target='_blank' style=' text-decoration:underline;'>消息-我的还价</a>&nbsp;中关注卖家回复</p>");
                                $(".js_ban_submit").removeClass("js_ban_submit").addClass("js_pubTimeout_popclose").find("span").html("确 认");
                            } else if (recoverymsg == "亲,已经卖啦~!") {
                                $(".js_pop_ban_tit").empty().html("提 示");
                                $(".js_pop_ban_body").empty().html("<p>发送成功~！但商品已经卖出了，买家伤心了~！</p>");
                                $(".js_ban_submit").removeClass("js_ban_submit").addClass("js_pubTimeout_popclose").find("span").html("确 认");
                            } else if (recoverymsg == "亲,等我降价吧~!") {
                                if (jsitemtype == "免公示" || jsitemtype == "公示期") {
                                    $(".js_pop_ban_tit").empty().html("提 示");
                                    $(".js_pop_ban_body").empty().html("<p>发送成功~！可去游戏修改价格。</p>");
                                    $(".js_ban_submit").removeClass("js_ban_submit").addClass("js_pubTimeout_popclose").find("span").html("确 认");
                                } else if (jsitemtype == "寄售中" || jsitemtype == "不在出售中") {
                                    $(".js_pop_ban_tit").empty().html("提 示");
                                    $(".js_pop_ban_body").empty().html("<p>发送成功~！您的回复已发送给买家，请在游戏中或<a data-callback='QiBao.IsHasProtection()' href='javascript:' class='js_cl_login js_closeban'>我是卖家</a>中修改价格。</p>");
                                    $(".js_ban_submit").removeClass("js_ban_submit").addClass("js_pubTimeout_popclose").find("span").html("确 认");
                                } else if (jsitemtype == "已出售") {
                                    $(".js_pop_ban_tit").empty().html("提 示");
                                    $(".js_pop_ban_body").empty().html("<p>发送成功~！，但商品已经卖出了，买家伤心了~！</p>");
                                    $(".js_ban_submit").removeClass("js_ban_submit").addClass("js_pubTimeout_popclose").find("span").html("确 认");
                                }
                            }
                            $(".js_pubTimeout_popclose").click(function () {
                                window.location.href = window.location.href;
                            });
                            $(".js_closeban").click(function () {
                                $(".public_Bargain_div").remove();
                            });
                        } else {
                            alert(d.Message);
                        }
                    }, error: function (error) {
                    }
                });
            });
        },

        OrderTipDiv: function (isdata) {
            $(".public_TimeOut_div").remove();
            $("body").append(OrderTipDivHtml);
            var winwidth = $(window).width();
            var thisleft = winwidth / 2 - $("#public_Bargain_divTip").width() / 2;
            var thistop = $(window).height() / 2 - $("#public_Bargain_divTip").height() / 2 + $(window).scrollTop();
            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
            $(".public_Bargain_div .markdiv").css("height", bodyheight);
            $("#public_Bargain_divTip").css({ 'left': thisleft, 'top': thistop });

            $(".js_pubTimeout_popclose").die("click").live("click", function () {
                $(".public_Bargain_div").remove();
            });
            //数据绑定
            $(".js_pop_otd_body").empty().html(isdata);
        },

        IsHasProtection: function (gotourl) {

            $.ajax({
                url: Defaults.IsHasProtectionUrl,
                type: "get",
                data: { r: Math.random() },
                success: function (d) {
                    if (d.IsSuccess) {

                        if (d.IsSecurityVerified) {
                            if (gotourl == undefined) {
                                window.location.href = '/ItemSellOperate/ItemForSaler';
                            } else {
                                window.location.href = gotourl;
                            }
                        } else {
                            QiBao.HasProtectionDiv({
                                IsPhoneAuth: d.IsPhoneAuth,
                                IsBindPhoneSecurity: d.IsBindPhoneSecurity,
                                IsBindEKey: d.IsBindEKey,
                                IsBindJZ: d.IsBindJZ,
                                IputPlace: d.IputPlace
                            });
                        }
                    } else {
                        if (d.Data == "unauthorized") {
                            QiBao.TimeOutDiv();
                        } else if (d.Data == "JsonException") {
                            window.location.href = d.ReturnUrl;
                        } else {
                            if (!d.IsSecurityVerified) {
                                QiBao.NoHasProtectionDiv({
                                    Title: "未绑定密保"
                                });
                            }
                        }
                    }
                }
            })
        },

        NoHasProtectionDiv: function (options) {
            var defaults = {
                Title: ""/*标题*/
            };
            defaults = $.extend(defaults, options);
            var str = '';
            $(".public_NoHasProtection_div").remove();
            if (defaults.Title.length == 11) {
                str = '<ul class="pop_title"><li class="curr">' + defaults.Title + '</li></ul><div style="width: 220px;" class="pop_slide"></div>';
            } else {
                str = '<ul class="pop_title"><li class="curr">' + defaults.Title + '</li></ul><div style="width: 140px;" class="pop_slide"></div>';
            }

            $("body").append(NoHasProtectionHtml);
            $(".pop").prepend(str);
            //未绑定手机认证时去掉手机乾坤锁下载 2015-3-2 update by tianhaiting
            if (defaults.Title == "未绑定手机认证") {
                $(".js_unBindPhone").hide();
            }

            var winwidth = $(window).width();
            var thisleft = winwidth / 2 - $("#public_NoHasProtection_divTip").width() / 2;
            var thistop = $(window).height() / 2 - $("#public_NoHasProtection_divTip").height() / 2 + $(window).scrollTop();
            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
            $(".public_NoHasProtection_div .markdiv").css("height", bodyheight);
            $("#public_NoHasProtection_divTip").css({ 'left': thisleft, 'top': thistop });
            $(".public_NoHasProtection_div").show();

            $(".public_NoHasProtection_div .pop_close").die("click").live("click", function () {
                $(".public_NoHasProtection_div").remove();
            });

        },

        HasProtectionDiv: function (options) {
            var defaults = {
                IsPhoneAuth: true,/*是否手机认证*/
                IsBindPhoneSecurity: true,/*是否验证电话密保*/
                IsBindEKey: true,/*是否验证乾坤锁*/
                IsBindJZ: true,/*是否验证矩阵密保*/
                IputPlace: ""/*矩阵编码*/
            };
            defaults = $.extend(defaults, options);
            $(".public_HasProtection_div").remove();
            $("body").append(HasProtectionHtml);

            var meun = '', divbody = '', divul2_1 = '<ul id="js_phone_Protection" class="dn">', divul2_2 = '<ul id="js_phone_Protection" class="dn">',
                divul3 = '<li class="ser_bodyli"><div class="errorbox js_phoneProtection_err"></div></li>' +
                         '  <li class="ser_bodyli"><input type="checkbox" class="ser_checkinput js_chk_4" checked="checked" disabled="disabled" ><div class="ser_li_lab">请输入认证手机收到的短信验证码：<p class="ser_p"><input  maxlength="5" type="password"  class="ser_textinput js_PhonePassword_txt"></p></div></li>' +
                         '  <li><input type="button" value="发送短信验证码(60秒后可重新点击发送)" class="ser_redcolor js_sendsms_btn"></li>' +
                         '  <li class="pop_btn ser_bodyli"><a href="javascript:" ><input class="icon loginbtn js_phone_Protection_btn" type="button" value="确认解锁"><i class="icon"></i></a></li>' +
                         '</ul>',
                divul0 = '<ul id="js_ewm_Protection">' +
                         '<li style="margin:0 0 10px 0;"><div id="js_ewm_box" data-status="0"></div><div class="ewmOverDue_box"><p class="ewmOverDue"></p><p class="ewmtxt"></p></div></li>' +
                         '<li class="mar_b_0 ">使用<a style="color:#2783ea;" href="/wd.gyyx.cn/News/NewsDetail_New.aspx?NewsID=78899" target="_blank">光宇游戏APP</a>扫描二维码安全验证</li>' +
                         '</ul>';

            var divul1 = '<ul id="js_mibao_Protection" class="dn"><li class="ser_bodyli"><div class="errorbox js_mibaoProtection_err"></div></li>';
            if (defaults.IsBindPhoneSecurity) {
                divul1 += '<li class="ser_bodyli"><input type="checkbox" class="ser_checkinput js_chk_1" checked="checked" disabled="disabled"><div class="ser_li_lab">请确认您得电话密保已经解锁<p class="ser_p">请拨打电400-811-0495,400-100-1824</p></div></li>';
            } else {
                divul1 += '<li class="ser_bodyli"><input type="checkbox" class="ser_checkinput js_chk_1" disabled="disabled"><div class="ser_li_lab">请确认您得电话密保已经解锁<p class="ser_p">请拨打电400-811-0495,400-100-1824</p></div></li>';
            }


            if (defaults.IsBindEKey) {
                divul1 += '<li class="ser_bodyli"><input type="checkbox" class="ser_checkinput js_chk_2" checked="checked" disabled="disabled"><div class="ser_li_lab">请输入您的主乾坤锁密码<p class="ser_p"><input type="password" maxlength="10" class="ser_textinput js_EKeyPassword_txt"></p></div></li>';
            } else {
                divul1 += '<li class="ser_bodyli"><input type="checkbox" class="ser_checkinput js_chk_2" disabled="disabled"><div class="ser_li_lab">请输入您的主乾坤锁密码<p class="ser_p"><input type="password" maxlength="10" class="ser_textinput js_EKeyPassword_txt" disabled="disabled"></p></div></li>';
            }


            if (defaults.IsBindJZ) {
                divul1 += '<li class="ser_bodyli"><input type="checkbox" class="ser_checkinput js_chk_3" checked="checked" disabled="disabled"><div class="ser_li_lab">请确认您矩阵密保卡' + defaults.IputPlace + '位置编号的密码：<p class="ser_p"><input type="password" maxlength="10" class="ser_textinput js_Matrix_txt"></p></div></li>';
            } else {
                divul1 += '<li class="ser_bodyli"><input type="checkbox" class="ser_checkinput js_chk_3" disabled="disabled"><div class="ser_li_lab">请确认您矩阵密保卡' + defaults.IputPlace + '位置编号的密码：<p class="ser_p"><input type="password" maxlength="10" class="ser_textinput js_Matrix_txt" disabled="disabled"></p></div></li>';
            }

            divul1 += '<li class="pop_btn ser_bodyli"><a href="javascript:"><input class="icon loginbtn js_mibao_Protection_btn" type="button" value="确认解锁"><i class="icon"></i></a></li></ul>';
            if (defaults.IsPhoneAuth && (defaults.IsBindPhoneSecurity || defaults.IsBindEKey || defaults.IsBindJZ)) {
                meun = '<li class="curr" data-id="js_ewm_Protection" alt="0">扫码验证</li><li data-id="js_mibao_Protection" alt="1">密保验证</li><li data-id="js_phone_Protection" alt="2">手机验证</li>';
                divbody = divul0 + divul1 + divul2_1 + divul3;
            } else if (!defaults.IsPhoneAuth) {
                meun = '<li class="curr" data-id="js_ewm_Protection" alt="0">扫码验证</li><li data-id="js_mibao_Protection" alt="1">密保验证</li>';
                divbody = divul0 + divul1;
            } else if (defaults.IsPhoneAuth && !defaults.IsBindPhoneSecurity && !defaults.IsBindEKey && !defaults.IsBindJZ) {
                meun = '<li class="curr" data-id="js_ewm_Protection" alt="0">扫码验证</li><li data-id="js_phone_Protection" alt="1">手机验证</li>';
                divbody = divul0 + divul2_2 + divul3;
            }

            $(".public_HasProtection_div .js_tab").html(meun);
            $(".public_HasProtection_div .js_tabdiv").html(divbody);

            //选项卡切换
            $(".public_HasProtection_div .js_tab li").click(function (event) {
                $(this).addClass('curr').siblings('li').removeClass('curr');
                var $slide = $(this).parent().next(".pop_slide");
                $(this).parent().next(".pop_slide").animate({ left: 40 + 78 * $(this).attr('alt') + "px" }, "50");
                $(".js_tabdiv ul").addClass('dn');
                $("#" + $(this).attr("data-id")).removeClass('dn');
                if ($(this).attr("data-id") == "js_ewm_Protection") {
                    if ($("#js_ewm_box").attr("data-status") == "1") {
                        $("#js_ewm_box").attr('data-status', '0');
                        getqrcode($("#js_ewm_box"));
                    }
                }
                return false;
            });
            getqrcode($("#js_ewm_box"));
            function ewmLoginFn(oEwmbox) {
                var request = $.ajax({
                    url: Defaults.QRCodeLogin,
                    type: 'GET',
                    data: { r: Math.random() },
                    success: function (d) {
                        if (d.success) {
                            $(".public_login_div").remove();
                            window.location.href = "/ItemSellOperate/ItemForSaler";
                        } else {
                            $('.ewmOverDue_box').show();
                            $('.ewmtxt').html('二维码失效<br/>请点击刷新');
                            oEwmbox.attr('data-status', '1');
                        }
                    },
                    error: function () {
                        $('.ewmOverDue_box').show();
                        $('.ewmtxt').html('网络异常<br/>请点击刷新');
                        oEwmbox.attr('data-status', '1');
                    }
                });
                $(".public_HasProtection_div .js_pubHasProtection_popclose").die("click").live("click", function () {
                    $(".public_HasProtection_div").remove();
                    request.abort();
                });
            }
            function getqrcode(oEwmbox) {
                if (oEwmbox.attr('data-status') == '1') {
                    oEwmbox.attr('data-status', '0');
                    $('.ewmOverDue_box').hide();
                    ajaxqrcode(oEwmbox)
                } else {
                    $('.ewmOverDue_box').hide();
                    ajaxqrcode(oEwmbox)
                }
            };
            function ajaxqrcode(oEwmbox) {
                $.ajax({
                    url: "/QRCode/GetQRCode",
                    type: 'GET',
                    data: {
                        r: Math.random(),
                        qRCodeType: "sellerverify"
                    },
                    success: function (d) {
                        if (d.success) {
                            $('#js_ewm_box').empty();
                            var qrcode = new QRCode('js_ewm_box', {
                                text: d.content,
                                width: 177,
                                height: 177,
                                colorDark: '#000',
                                colorLight: '#ffffff',
                                correctLevel: QRCode.CorrectLevel.H
                            });
                            if (oEwmbox.find('table').length == 1) {
                                ewmLoginFn(oEwmbox)
                            } else {
                                oEwmbox.find('img').unbind('load').bind('load', function () {
                                    ewmLoginFn(oEwmbox)
                                });
                            };
                            $('#js_ewm_box').attr("title", "");
                        }
                    },
                    error: function () {
                        $('.ewmOverDue_box').show();
                        $('.ewmtxt').html('获取二维码失败<br/>请点击刷新');
                        oEwmbox.attr('data-status', '1');
                    }
                })
            };
            $('.ewmOverDue_box').unbind('click').bind('click', function () {
                $(this).hide();
                getqrcode($("#js_ewm_box"));
            })


            $(".public_HasProtection_div .js_pubHasProtection_popclose").die("click").live("click", function () {
                $(".public_HasProtection_div").remove();
            });

            var winwidth = $(window).width();
            var thisleft = winwidth / 2 - $("#public_HasProtection_divTip").width() / 2;
            var thistop = $(window).height() / 2 - $("#public_HasProtection_divTip").height() / 2 + $(window).scrollTop();
            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
            $(".public_HasProtection_div .markdiv").css("height", bodyheight);
            $("#public_HasProtection_divTip").css({ 'left': thisleft, 'top': thistop });

            /*发送验证码*/
            $(".js_sendsms_btn").die("click").live("click", function () {
                $.ajax({
                    url: Defaults.ProtectionSenderMessage,
                    type: "post",
                    dataType: "json",
                    data: {
                        r: Math.random()
                    },
                    beforeSend: function () {
                        $(".js_sendsms_btn").attr("disabled", "disabled").val("发送中...");
                    },
                    success: function (d) {
                        $(".js_phoneProtection_err").hide().html("");

                        if (d.IsSuccess) {
                            $(".js_sendsms_btn").attr("disabled", "disabled").val("发送短信验证码(" + d.PushTime + "秒后可重新点击发送)");
                            QiBao.countDown2($(".js_sendsms_btn"), d.PushTime);
                        } else {
                            if (d.Data == "unauthorized") {
                                $(".public_HasProtection_div").remove();
                                QiBao.TimeOutDiv();
                            } else if (d.Data == "JsonException") {
                                $(".public_HasProtection_div").remove();
                                window.location.href = d.ReturnUrl;
                            } else {
                                $(".js_sendsms_btn").removeAttr("disabled").val("发送短信验证码(60秒后可重新点击发送)");
                                $(".js_phoneProtection_err").show().html(d.Message);
                            }
                        }
                    },
                    error: function () {
                        $(".js_sendsms_btn").removeAttr("disabled").val("发送短信验证码(60秒后可重新点击发送)");
                        $(".js_phoneProtection_err").show().html(data.Message);
                    }
                });
            });

            /* 解锁 */
            var Unlock = function (verifyType, phoneVerifyCode, ekeyVerifyCode, jzSecurityCode) {
                $.ajax({
                    url: Defaults.ProtectionUrl,
                    type: "post",
                    data: {
                        r: Math.random(),
                        verifyType: verifyType,
                        phoneVerifyCode: phoneVerifyCode,
                        ekeyVerifyCode: ekeyVerifyCode,
                        jzSecurityCode: jzSecurityCode
                    },
                    beforeSend: function () {
                        if (verifyType == "security") {
                            $(".js_mibao_Protection_btn").attr("disabled", "disabled").val("正在解锁...");
                        } else if (verifyType == "phone") {
                            $(".js_phone_Protection_btn").attr("disabled", "disabled").val("正在解锁...");
                        }
                    },
                    success: function (d) {
                        if (d.IsSuccess) {
                            $(".public_HasProtection_div").remove();
                            window.location.href = "/ItemSellOperate/ItemForSaler";
                        } else {
                            if (d.Data == "unauthorized") {
                                QiBao.TimeOutDiv();
                            } else if (d.Data == "JsonException") {
                                window.location.href = d.ReturnUrl;
                            } else {
                                if (verifyType == "security") {
                                    $(".js_mibao_Protection_btn").removeAttr("disabled").val("确认解锁");
                                    $(".js_mibaoProtection_err").html(d.Message.split(':')[1]).show();
                                } else if (verifyType == "phone") {
                                    $(".js_phone_Protection_btn").removeAttr("disabled").val("确认解锁");
                                    $(".js_phoneProtection_err").html(d.Message.split(':')[1]).show();
                                }
                            }
                        }
                    }
                })
            }

            /*手机验证解锁*/
            $(".js_phone_Protection_btn").die("click").live("click", function () {
                var exp1 = new RegExp("^[\u4e00-\u9fa5]+$");
                var val = $(".js_PhonePassword_txt").val();
                $(".js_phoneProtection_err").html("").hide();
                if (val == "") {
                    $(".js_phoneProtection_err").html("验证码不能为空").show();
                } else if (val.length != 5) {
                    $(".js_phoneProtection_err").html("验证码格式错误").show();
                } else if (exp1.test(val)) {
                    $(".js_phoneProtection_err").html("验证码格式错误").show();
                } else {
                    Unlock("phone", val, "", "");
                }
            });
            /*密保验证解锁*/
            $(".js_mibao_Protection_btn").die("click").live("click", function () {
                var exp1 = new RegExp("^[0-9]*$");
                $(".js_mibaoProtection_err").html("").hide();

                var bindekey = false, bindjz = false, binphone = false;
                if ($(".js_chk_1").attr("checked") == "checked") {
                    binphone = true;
                }
                if ($(".js_chk_2").attr("checked") == "checked") {
                    bindekey = true;
                }
                if ($(".js_chk_3").attr("checked") == "checked") {
                    bindjz = true;
                }



                if (bindekey && !bindjz && !binphone) { //只绑定了 主乾坤锁
                    if ($(".js_EKeyPassword_txt").val() == "") {
                        $(".js_mibaoProtection_err").html("乾坤锁密码不能为空").show();
                    } else if (!exp1.test($(".js_EKeyPassword_txt").val())) {
                        $(".js_mibaoProtection_err").html("乾坤锁密码必须为数字").show();
                    } else {
                        Unlock("security", "", $(".js_EKeyPassword_txt").val(), "");
                    }
                } else if (bindjz && !bindekey && !binphone) { //只绑定了 密保卡
                    if ($(".js_Matrix_txt").val() == "") {
                        $(".js_mibaoProtection_err").html("矩阵密码不能为空").show();
                    } else if (!exp1.test($(".js_Matrix_txt").val())) {
                        $(".js_mibaoProtection_err").html("矩阵密码必须为数字").show();
                    } else {
                        Unlock("security", "", "", $(".js_Matrix_txt").val());
                    }
                } else if (bindjz && bindekey && !binphone) { //绑定 主乾坤锁 和 密保卡
                    if ($(".js_EKeyPassword_txt").val() == "") {
                        $(".js_mibaoProtection_err").html("乾坤锁密码不能为空").show();
                    } else if (!exp1.test($(".js_EKeyPassword_txt").val())) {
                        $(".js_mibaoProtection_err").html("乾坤锁密码必须为数字").show();
                    } else if ($(".js_Matrix_txt").val() == "") {
                        $(".js_mibaoProtection_err").html("矩阵密码不能为空").show();
                    } else if (!exp1.test($(".js_Matrix_txt").val())) {
                        $(".js_mibaoProtection_err").html("矩阵密码必须为数字").show();
                    } else {
                        Unlock("security", "", $(".js_EKeyPassword_txt").val(), $(".js_Matrix_txt").val());
                    }
                } else if (binphone && !bindekey && !bindjz) {//只绑定了 电话密保
                    Unlock("security", "", "", "");
                } else if (binphone && bindekey && !bindjz) { //只绑定了 电话密保+ 乾坤锁
                    if ($(".js_EKeyPassword_txt").val() == "") {
                        $(".js_mibaoProtection_err").html("乾坤锁密码不能为空").show();
                    } else if (!exp1.test($(".js_EKeyPassword_txt").val())) {
                        $(".js_mibaoProtection_err").html("乾坤锁密码必须为数字").show();
                    } else {
                        Unlock("security", "", $(".js_EKeyPassword_txt").val(), "");
                    }

                } else if (binphone && !bindekey && bindjz) { //只绑定了 电话密保+ 密保卡
                    if ($(".js_Matrix_txt").val() == "") {
                        $(".js_mibaoProtection_err").html("矩阵密码不能为空").show();
                    } else if (!exp1.test($(".js_Matrix_txt").val())) {
                        $(".js_mibaoProtection_err").html("矩阵密码必须为数字").show();
                    } else {
                        Unlock("security", "", "", $(".js_Matrix_txt").val());
                    }
                } else if (binphone && bindekey && bindjz) { //只绑定了  电话密保+ 乾坤锁+密保卡
                    if ($(".js_EKeyPassword_txt").val() == "") {
                        $(".js_mibaoProtection_err").html("乾坤锁密码不能为空").show();
                    } else if (!exp1.test($(".js_EKeyPassword_txt").val())) {
                        $(".js_mibaoProtection_err").html("乾坤锁密码必须为数字").show();
                    } else if ($(".js_Matrix_txt").val() == "") {
                        $(".js_mibaoProtection_err").html("矩阵密码不能为空").show();
                    } else if (!exp1.test($(".js_Matrix_txt").val())) {
                        $(".js_mibaoProtection_err").html("矩阵密码必须为数字").show();
                    } else {
                        Unlock("security", "", $(".js_EKeyPassword_txt").val(), $(".js_Matrix_txt").val());
                    }
                } else {

                }
            });

        },

        ChangePriceDiv: function (itemId, Opic, Cpic) {

            $(".public_ChangePrice_div").remove();
            $("body").append(ChangePriceHtml);
            $(".original").html(Opic + ".00元");
            $(".current").html(Cpic + ".00元");

            var winwidth = $(window).width();
            var thisleft = winwidth / 2 - $("#public_ChangePrice_divTip").width() / 2;
            var thistop = $(window).height() / 2 - $("#public_ChangePrice_divTip").height() / 2 + $(window).scrollTop();
            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
            $(".public_ChangePrice_div .markdiv").css("height", bodyheight);
            $("#public_ChangePrice_divTip").css({ 'left': thisleft, 'top': thistop });

            $(".js_pubChangePrice_popclose").die("click").live("click", function () {
                $(".public_ChangePrice_div").remove();
            });

            $(".js_pubChangePrice_btn").die("click").live("click", function () {
                var exp1 = new RegExp("^[0-9]*$");
                if ($(".modify_price_input").val() == "") {
                    $(".public_ChangePrice_div .puberror_pop").show().html("请填写价格");
                } else if (!exp1.test($(".modify_price_input").val())) {
                    $(".public_ChangePrice_div .puberror_pop").show().html("格式错误");
                } else {
                    $.ajax({
                        url: Defaults.ChangePriceUrl,
                        type: "post",
                        data: {
                            r: Math.random(),
                            itemCode: itemId,
                            newPrice: $(".public_ChangePrice_div .modify_price_input").val()
                        },
                        beforeSend: function () {
                            $(".js_pubChangePrice_btn").attr("disabled", "disabled").val("修改中...");
                        },
                        success: function (d) {
                            $(".js_pubChangePrice_btn").removeAttr("disabled").val("修改价格");
                            if (d.IsSuccess) {
                                window.location.href = window.location.href;
                            } else {
                                if (d.Data == "unauthorized") {
                                    $(".public_ChangePrice_div").remove();
                                    QiBao.TimeOutDiv();
                                } else if (d.Data == "JsonException") {
                                    $(".public_ChangePrice_div").remove();
                                    window.location.href = d.ReturnUrl;
                                } else {
                                    if (d.Message == "非贵重物品且修改后价格大于700元") {
                                        if (confirm("物品为非贵重物品,修改价格超过700上限,交易成功后,获得的收入会在光宇GO购锁定24小时无法使用？")) {
                                            $.ajax({
                                                url: Defaults.ChangePriceUrl,
                                                type: "post",
                                                data: {
                                                    r: Math.random(),
                                                    repeatSubmit: 1,
                                                    itemCode: itemId,
                                                    newPrice: $(".public_ChangePrice_div .modify_price_input").val()
                                                },
                                                beforeSend: function () {
                                                    $(".js_pubChangePrice_btn").attr("disabled", "disabled").val("修改中...");
                                                },
                                                success: function (d) {
                                                    $(".js_pubChangePrice_btn").removeAttr("disabled").val("修改价格");
                                                    if (d.IsSuccess) {
                                                        window.location.href = window.location.href;
                                                    } else {
                                                        if (d.Data == "unauthorized") {
                                                            $(".public_ChangePrice_div").remove();
                                                            QiBao.TimeOutDiv();
                                                        } else if (d.Data == "JsonException") {
                                                            $(".public_ChangePrice_div").remove();
                                                            window.location.href = d.ReturnUrl;
                                                        } else {
                                                            $(".public_ChangePrice_div .puberror_pop").show().html(d.Message)
                                                        }
                                                    }
                                                },
                                                error: function (d) {
                                                    $(".public_ChangePrice_div .puberror_pop").show().html(d.Message);
                                                    $(".js_pubChangePrice_btn").removeAttr("disabled").val("修改价格");
                                                }
                                            })
                                        } return false;
                                    } else {
                                        $(".public_ChangePrice_div .puberror_pop").show().html(d.Message)
                                    }
                                }
                            }
                        },
                        error: function (d) {
                            $(".public_ChangePrice_div .puberror_pop").show().html(d.Message);
                            $(".js_pubChangePrice_btn").removeAttr("disabled").val("修改价格");
                        }
                    })
                }
            });
        },

        CancelConsignedDiv: function (itemId) {
            /* CancelConsignedDiv 取消寄售弹层  itemId 物品id*/
            $(".public_CancelConsigned_div").remove();
            $("body").append(CancelConsignedHtml);
            var winwidth = $(window).width();
            var thisleft = winwidth / 2 - $("#public_CancelConsigned_divTip").width() / 2;
            var thistop = $(window).height() / 2 - $("#public_CancelConsigned_divTip").height() / 2 + $(window).scrollTop();
            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
            $(".public_CancelConsigned_div .markdiv").css("height", bodyheight);
            $("#public_CancelConsigned_divTip").css({ 'left': thisleft, 'top': thistop });

            $(".js_pubCancelConsigned_popclose").die("click").live("click", function () {
                $(".public_CancelConsigned_div").remove();
            });

            $(".js_pubCancelConsigned_btn").die("click").live("click", function () {
                $.ajax({
                    url: Defaults.CancelConsigneUrl,
                    type: "post",
                    data: {
                        r: Math.random(),
                        itemCode: itemId
                    },
                    beforeSend: function () {
                        $(".js_pubCancelConsigned_btn").attr("disabled", "disabled").val("取消中...");
                    },
                    success: function (d) {
                        $(".js_pubCancelConsigned_btn").removeAttr("disabled").val("取消寄售");
                        if (d.IsSuccess) {
                            window.location.href = window.location.href;
                        } else {
                            if (d.Data == "unauthorized") {
                                $(".public_CancelConsigned_div").remove();
                                QiBao.TimeOutDiv();
                            } else if (d.Data == "JsonException") {
                                $(".public_CancelConsigned_div").remove();
                                window.location.href = d.ReturnUrl;
                            } else {
                                $(".public_CancelConsigned_div .puberror_pop").show().html(d.Message)
                            }
                        }
                    },
                    error: function () {
                        $(".public_CancelConsigned_div .puberror_pop").show().html(d.Message);
                        $(".js_pubCancelConsigned_btn").removeAttr("disabled").val("取消寄售");
                    }
                })
            });
        },

        showCodeDiv: function () {
            $(".public_Code_div").remove();
            $("body").append(CodeDivHtml);

            var winwidth = $(window).width();
            var thisleft = winwidth / 2 - $("#public_Code_divTip").width() / 2;
            var thistop = $(window).height() / 2 - $("#public_Code_divTip").height() / 2 + $(window).scrollTop();
            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
            $(".public_Code_div .markdiv").css("height", bodyheight);
            $("#public_Code_divTip").css({ 'left': thisleft, 'top': thistop });

            $(".flash_pagecode").die("click").live("click", function () {
                $(this).attr("src", "/Login/Create?fileName=" + Math.random() + ".png");
                return false
            }).attr("src", "/Login/Create?fileName=" + Math.random() + ".png");

            $(".js_publog_popclose").die("click").live("click", function () {
                $(".public_Code_div").remove();
            });

            $(".js_tip").focus(function () {
                var obj = $(this);
                var hstip = obj.next(".js_tipword");
                hstip.css('display', 'none');
            });
            $(".js_tip").blur(function () {
                var val = $(this).attr("value");
                var hstip = $(this).next(".js_tipword");
                if (val == "") {
                    hstip.css('display', 'block')
                }
            });
            $(".js_tipword").click(function () {
                $(this).prev("input").focus();
            });
            //九宫格验证码  add by tianhaiting 2015-1-22 start
            //IE6下默认不缓存背景图片，CSS里每次更改图片的位置时都会重新发起请求，用这个方法告诉IE6缓存背景图片 
            var isIE6 = /msie 6/i.test(navigator.userAgent);
            if (isIE6) {
                try { document.execCommand('BackgroundImageCache', false, true); } catch (e) { }
            }
            //点击加载验证码
            $(".js_ChinaCaptchaYes, .js_refreshChinaCaptcha").click(function () {

                QiBao.refreshCaptcha();
                return false;
            });
            getChinaCaptcha();
            function getChinaCaptcha() {
                QiBao.refreshCaptcha();
                //图片点击事件
                $(".js_ChinaCaptchaSelect_img").die("click").live("click", function () {
                    _chinaCaptchaClick($(this));
                });
            };
            //验证码图片点击函数
            var _chinaCaptchaClick = function (obj) {
                var objAttrCode = obj.attr("data-code"),
                codeLen = parseInt($("input[name='CaptchaCode']").val().length),
                checkcodeStr = $("input[name='CaptchaCode']").val() + objAttrCode;

                if (codeLen < 4) {
                    //验证码真实值
                    $("input[name='CaptchaCode']").val(checkcodeStr);
                    $(".js_ChinaCaptchaInput").eq(codeLen).find("i").addClass("chinaCaptchaImg_" + objAttrCode);
                }
            };
            //删除九宫格中文验证码函数
            $(".js_deleteChinaCaptcha").die("click").live("click", function () {
                var Len = parseInt($("input[name='CaptchaCode']").val().length),
                    checkcodeStr1 = $("input[name='CaptchaCode']").val();
                checkcodeStr1 = checkcodeStr1.substring(0, Len - 1);
                $("input[name='CaptchaCode']").val(checkcodeStr1);
                $(".js_ChinaCaptchaInput").eq(Len - 1).find("i").removeClass().attr("class", "chinaCaptchaImg");
            });

            //九宫格验证码  add by tianhaiting 2015-1-22 end
        },
        refreshCaptcha: function () {
            $(".js_ChinaCaptchaInput").find("i").attr("class", "chinaCaptchaImg");
            $("input[name='CaptchaCode']").val("");
            $(".chinaCaptchaImg").css("background-image", "url(" + Defaults.AjaxGetChinaCaptcha + "?bid=" + Defaults.bid + "&r=" + Math.random() + ".png)");
        },
        /* 站内右下角弹层实时提醒功能 */
        autoRemind: function (options) {
            var t;
            var settings = {
                Ishide: true, /* 层没有操作是否消失，默认不消失 */
                exitTime: 30000, /* 没有操作下该提醒层默认展示时间 */
                url: "/Notices/NoticeByAccount",  /* 异步请求地址    */
                Isrefresh: true, /* 是否需要实时请求 */
                refreshTime: 30 * 1000 /* 多长时间请求一次 */
            };

            $.extend(settings, options);

            var createRemindInfo = function (d) { /* 创建层 */
                var ranId = "box" + Math.ceil(Math.random() * 1000);
                var str = '<div data-code="' + d.Code + '"  class="public_NoticeBox_div" id="' + ranId + '">' + NoticeBoxDiv + '</div>';
                $("body").append(str);
                var $box = $("#" + ranId);
                $box.find(".pop_title").html('<li class="curr">' + (d.MailTitle.toString().length > 14 ? d.MailTitle.toString().substr(0, 14) + "..." : d.MailTitle.toString()) + '</li>');
                var SmallNote = d.SmallNote.replace(/[\r\n\s]/g, "");
                $box.find(".pop_body p").empty().html(SmallNote.toString().length > 100 ? SmallNote.toString().substr(0, 100) + "..." : SmallNote.toString());
                $box.find(".js_pubmessbox_btn").attr("href", '/Notices/Detail?id=' + d.Code + '');
                var winwidth = $(window).width();
                var thisleft = winwidth / 2 - $("#public_NoticeBox_divTip").width() / 2;
                var thistop = $(window).height() / 2 - $("#public_NoticeBox_divTip").height() / 2 + $(window).scrollTop();
                var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
                $box.find("#public_NoticeBox_divTip").css({ 'right': "0px", 'bottom': "0px", "position": "fixed" });
                $box.find(".js_pubMBox_popclose,.js_pubmessbox_btn").die("click").live("click", function () {
                    $(this).parents(".public_NoticeBox_div").remove();
                    //上线默认点叉叉是详情/Notices/CloseNoticeButton post
                    $.ajax({
                        url: "/Notices/CloseNoticeButton",
                        type: "POST",
                        data: { r: Math.random(), code: $box.attr("data-code") },
                        dataType: "JSON",
                        success: function (d) { }
                    })//ajax end
                });
            };

            var getData = function () { /* 异步请求 */
                $.ajax({
                    url: settings.url,
                    type: "GET",
                    data: {
                        r: Math.random()
                    },
                    dataType: "json",
                    success: function (data) {
                        if (data.IsSuccess && data.Data != null) {
                            for (var i = 0; i < data.Data.length; i++) {
                                createRemindInfo(data.Data[i]);
                            }
                        }
                    }
                });
            };

            getData();
        },
        /* 站内右下角还价消息弹层实时提醒功能 */
        autoBanRemind: function (options) {
            var t;
            var settings = {
                Ishide: true, /* 层没有操作是否消失，默认不消失 */
                exitTime: 30000, /* 没有操作下该提醒层默认展示时间 */
                url: "/Bargain/NoReadCount",  /* 异步请求地址    */
                Isrefresh: true, /* 是否需要实时请求 */
                refreshTime: 180 * 1000 /* 多长时间请求一次 */
            };

            $.extend(settings, options);

            var createBanRemindInfo = function (d) { /* 创建层 */
                var ranId = "box" + Math.ceil(Math.random() * 1000);
                var str = '<div class="public_NoticeBox_div" id="' + ranId + '">' + BanBoxDiv + '</div>';
                $("body").append(str);
                var $box = $("#" + ranId);
                $box.find(".pop_title").html('<li class="curr">未读消息</li>');
                if (d.SaleNoReadCount == 0 && d.BuyNoReadCount != 0) {
                    $box.find(".pop_body p").empty().html("<p>尊敬的用户，您有未读消息：</p><p>卖家回复:<a href='/Bargain/BargainIndex?pageindex=1&state=noRead' style='padding:0 5px;color:red;font-weight:bold'>" + d.BuyNoReadCount + "</a>封</p>")
                } else if (d.SaleNoReadCount != 0 && d.BuyNoReadCount != 0) {
                    $box.find(".pop_body p").empty().html("<p>尊敬的用户，您有未读消息：</p><p>买家还价:<a href='/Bargain/RecoveryIndex?pageindex=1&state=noRead' style='padding:0 5px;color:red;font-weight:bold'>" + d.SaleNoReadCount + "</a>封</p><p>卖家回复:<a href='/Bargain/BargainIndex?pageindex=1&state=noRead' style='padding:0 5px;color:red;font-weight:bold'>" + d.BuyNoReadCount + "</a>封</p>")
                } else if (d.BuyNoReadCount == 0 && d.SaleNoReadCount != 0) {
                    $box.find(".pop_body p").empty().html("<p>尊敬的用户，您有未读消息：</p><p>买家还价:<a href='/Bargain/RecoveryIndex?pageindex=1&state=noRead' style='padding:0 5px;color:red;font-weight:bold'>" + d.SaleNoReadCount + "</a>封</p>")
                } else if (d.BuyNoReadCount == 0 && d.SaleNoReadCount == 0) {
                    $box.find(".pop_body p").empty().html("<p>尊敬的用户，您有未读消息：</p><p>买家还价:<a style='padding:0 5px;color:red;font-weight:bold'>" + d.SaleNoReadCount + "</a>封</p><p>卖家回复:<a style='padding:0 5px;color:red;font-weight:bold'>" + d.BuyNoReadCount + "</a>封</p>")
                }
                $box.find(".js_pubmessbox_btn").attr("href", '/Bargain/RecoveryIndex?pageindex=1&state=noRead');
                var winwidth = $(window).width();
                var thisleft = winwidth / 2 - $("#public_NoticeBox_divTip").width() / 2;
                var thistop = $(window).height() / 2 - $("#public_NoticeBox_divTip").height() / 2 + $(window).scrollTop();
                var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
                $box.find("#public_NoticeBox_divTip").css({ 'right': "0px", 'bottom': "0px", "position": "fixed" });
                $box.find(".js_pubMBox_popclose,.js_pubmessbox_btn").die("click").live("click", function () {
                    $(this).parents(".public_NoticeBox_div").remove();
                    //上线默认点叉叉是详情/Notices/CloseNoticeButton post
                    $.ajax({
                        url: "/Notices/CloseNoticeButton",
                        type: "POST",
                        data: { r: Math.random(), code: $box.attr("data-code") },
                        dataType: "JSON",
                        success: function (d) { }
                    })//ajax end
                });
            };

            var getData = function () { /* 异步请求 */
                $.ajax({
                    url: settings.url,
                    type: "GET",
                    data: {
                        r: Math.random()
                    },
                    dataType: "json",
                    success: function (data) {
                        if (data.IsSuccess && data.NoReadCount > 0) {
                            createBanRemindInfo(data);
                        }
                    }
                });
            };

            getData();

            if (settings.Isrefresh) { /* 是否实时请求数据 */
                clearInterval(t);
                t = setInterval(function () { getData(); }, settings.refreshTime);
            }
        },
        /* 站内右下角交易消息弹层实时提醒功能 */
        autoBusNotRemind: function (options) {
            var t;
            var settings = {
                Ishide: true, /* 层没有操作是否消失，默认不消失 */
                exitTime: 30000, /* 没有操作下该提醒层默认展示时间 */
                url: "/BusinessNotice/NoReadCount",  /* 异步请求地址    */
                Isrefresh: true, /* 是否需要实时请求 */
                refreshTime: 180 * 1000 /* 多长时间请求一次 */
            };

            $.extend(settings, options);

            var createBusNotRemindInfo = function (d) { /* 创建层 */

                var ranId = "box" + Math.ceil(Math.random() * 1000);
                var str = '<div class="public_NoticeBox_div" id="' + ranId + '">' + BusNotBoxDiv + '</div>';
                $("body").append(str);
                var $box = $("#" + ranId);
                $box.find(".pop_title").html('<li class="curr">未读消息</li>');
                $box.find(".pop_body p").empty().html("<p>尊敬的用户，您有未读消息：</p><p>交易消息:<a href='/BusinessNotice/BusinessNoticeIndex?pageindex=1&state=noRead' style='padding:0 5px;color:red;font-weight:bold' target='_blank'>" + d.NoReadCount + "</a>封</p>")
                $box.find(".js_pubmessbox_btn").attr("href", '/BusinessNotice/BusinessNoticeIndex?pageindex=1&state=noRead');
                var winwidth = $(window).width();
                var thisleft = winwidth / 2 - $("#public_NoticeBox_divTip").width() / 2;
                var thistop = $(window).height() / 2 - $("#public_NoticeBox_divTip").height() / 2 + $(window).scrollTop();
                var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
                $box.find("#public_NoticeBox_divTip").css({ 'right': "0px", 'bottom': "0px", "position": "fixed" });

                $box.find(".js_pubMBox_popclose,.js_pubmessbox_btn").die("click").live("click", function () {
                    $(this).parents(".public_NoticeBox_div").remove();
                    //上线默认点叉叉是详情/Notices/CloseNoticeButton post
                    $.ajax({
                        url: "/Notices/CloseNoticeButton",
                        type: "POST",
                        data: { r: Math.random(), code: $box.attr("data-code") },
                        dataType: "JSON",
                        success: function (d) { }
                    })//ajax end
                });
            };

            var getData = function () { /* 异步请求 */
                $.ajax({
                    url: settings.url,
                    type: "GET",
                    data: {
                        r: Math.random()
                    },
                    dataType: "json",
                    success: function (data) {
                        if (data.IsSuccess && data.NoReadCount > 0) {
                            createBusNotRemindInfo(data);
                        }
                    }
                });
            };

            getData();

            if (settings.Isrefresh) { /* 是否实时请求数据 */
                clearInterval(t);
                t = setInterval(function () { getData(); }, settings.refreshTime);
            }
        },
        /* 引导动画 */
        GuiderJs: function (options) {
            var clicked = false;
            var settings = {
                url: "/Navigation/GuideAnimation", /* 接受是否引导请求地址 */
                url2: "/Guide/AddGuideBrowseLog", /* 添加用户浏览向导日志请求地址 */
                type: "serverList",//播放动画类型默认播放 区服播放动画 itemList(商品详细页播放动画)
                needPage: "buy_auction", /* 需要引导的页面名称 */
                maxwidthObj: ".qbzbg", /* 页面最大宽度对象 */
                guiderObj: [".settings", ".logout", ".leftUserDrop"],  /* 需要引导的对象 */
                guider_decImg: ".guide_decdiv div",  /* 说明图片对象 */
                overlayObj: ".overlay", /* 遮罩层对象 */
                guiderObjP: "p", /* 引导位置对象P */
                exitguide: ".guide_close", /* 退出引导关闭按钮 */
                btnstep: ".guide_step", /* 说明面板里的按钮，例如“继续” */
                tabstep: ".tab_step li a", /* step选项卡对象 */
                IsSlocation: true, /* 是否规定引导说明单独定位，默认false在屏幕中间 */
                Isfixed: false /* 是否固定引导图片位置 */
            };

            $.extend(settings, options);

            var getData = function () {/* 请求是否播放拍卖引导 */
                $.ajax({
                    url: settings.url,
                    data: {
                        r: Math.random(),
                        type: settings.type
                    },
                    dataType: "json",
                    success: function (d) {
                        if (d.IsSuccess) {
                            //clickguide();
                            if (d.Result) { clickguide(); }
                        }
                    }
                });
            }

            getData();

            function clickguide() {
                var bodywidth, bodyheight, decwidth, decheight;
                decwidth = $(settings.guider_decImg).width(); /* 图片宽度 */
                decheight = $(settings.guider_decImg).height(); /* 图片高度 */
                $(window).scroll(function () {/* 屏幕滚动 */
                    bodyheight = $(window).height() + $(document).scrollTop();
                    if (!clicked) {
                        $(settings.overlayObj).show().css({ width: bodywidth, "height": bodyheight });
                    }
                });

                $(window).resize(function () {/* 屏幕大小改变 */
                    var left = $(settings.guiderObj[0]).offset().left;

                    if (!clicked) {
                        settings.Isfixed
                        ? imgpos($(settings.guiderObj[0]).offset().left, $(settings.guiderObj[0]).offset().top)
                        : imgpos($(settings.guiderObj[0]).offset().left + $(settings.guiderObj[0]).width() - decwidth, $(settings.guiderObj[0]).offset().top);
                    }
                });
                /* 初始化图片 */
                settings.Isfixed
                ? imgpos($(settings.guiderObj[0]).offset().left, $(settings.guiderObj[0]).offset().top)
                : imgpos($(settings.guiderObj[0]).offset().left + $(settings.guiderObj[0]).width() - decwidth, $(settings.guiderObj[0]).offset().top);


                mapclick();

                $(settings.exitguide).bind("click", function () { /* 关闭事件 */
                    closeguide();
                });

                function mapclick() {	 /* 图片引导主函数 */
                    var objleft, objtop;
                    var length = $(settings.guider_decImg).length;

                    $(settings.guider_decImg).each(function (i, n) {
                        if (i != length - 1) {
                            $(this).find(settings.btnstep).click(function () {/* 下一步click */
                                changesrc(i + 1);
                            });

                            $(this).find(settings.guiderObjP).click(function () {/* 引导内容click */
                                changesrc(i + 1);
                            });

                            $(this).find(settings.tabstep).each(function (j) {/* tab步骤click */
                                $(this).click(function () {
                                    changesrc(j);
                                });
                            });
                        } else {
                            $(this).find(settings.btnstep).click(function () {
                                closeguide();
                            });
                            $(this).find(settings.guiderObjP).click(function () {/* 引导内容click */
                                closeguide();
                            });
                            $(this).find(settings.tabstep).each(function (j) {/* tab步骤click */
                                $(this).click(function () {
                                    changesrc(j);
                                });
                            });
                        }
                    });

                }

                var changesrc = function (index) { /* 引导图片与说明的src与位置改变 */
                    objleft = $(settings.guiderObj[index]).offset().left;
                    objtop = $(settings.guiderObj[index]).offset().top;
                    imgwidth = $(settings.guiderObj[index]).width();
                    imgheight = $(settings.guiderObj[index]).height();

                    settings.Isfixed
                    ? imgpos(objleft, objtop)
                    : imgpos(objleft + imgwidth - decwidth, objtop);

                    $(settings.guider_decImg).hide().eq(index).show();

                    $(window).resize(function () {
                        objleft = $(settings.guiderObj[index]).offset().left;
                        objtop = $(settings.guiderObj[index]).offset().top;
                        if (!clicked) {
                            settings.Isfixed
                            ? imgpos(objleft, objtop)
                            : imgpos(objleft + imgwidth - decwidth, objtop);
                            $(settings.guider_decImg).hide().eq(index).show();
                        }
                    });
                }

                function imgpos(objleft, objtop) { /* 设置引导图片位置 */
                    bodywidth = $(settings.maxwidthObj).width();
                    bodyheight = $(document).height() + $(document).scrollTop();

                    $(settings.overlayObj).css({ width: bodywidth, "height": bodyheight }).show();

                    $(settings.guider_decImg).eq(0).show();

                    if (settings.IsSlocation) {
                        $(settings.guider_decImg).css({
                            left: objleft + "px",
                            top: objtop + "px"
                        });
                    } else {
                        $(settings.guider_decImg).css({
                            left: (bodywidth - decwidth) / 2 + "px",
                            top: (bodyheight - decheight) / 2 + "px"
                        });
                    }
                }

                var closeguide = function () { /* 退出引导 */
                    $(settings.overlayObj).hide();
                    $(settings.guider_decImg).hide();
                    clicked = true;
                }
            }


        },
        //轮播图
        lb: function () {
            (function (C, B) { function A(D) { var O = C.extend({ box: "", className: "on", classType: "only", index: 0, mousetype: "click", fadeInTime: 600, fadeOutTime: 1000, delay: 5000, autoPlay: false }, D || {}); var F = C("#" + O.box); var I = F.children("ul:first-child").children("li"); var H = F.children("ul:last-child").children("li"); var E = null; var J = O.index; var M = H.size(); H.each(function (P) { var Q = P; C(this).bind(O.mousetype, function () { if (J == Q) { return } L(Q); N() }) }); function L(P) { var Q = (O.classType == "only") ? O.className : O.className + String(index + 1); H.eq(P).addClass(Q).siblings().removeClass(); I.eq(P).fadeIn(600).siblings().fadeOut(600); J = P } function N() { if (!O.autoPlay) { return } if (E) { clearInterval(E) } E = setInterval(K, O.delay) } function K() { var P = ((J + 1) >= M) ? 0 : J + 1; L(P) } function G() { H.eq(J).addClass(O.className); I.hide().eq(J).show(); N() } G() } if (typeof YM == "undefined") { B.YM = {} } YM.addSlideTwo = A })(jQuery, window);

            //幻灯片
            YM.addSlideTwo({ box: 'slide_1', className: 'on', classType: 'only', index: 0, mousetype: 'click', fadeInTime: 600, fadeOutTime: 1000, delay: 5000, autoPlay: true });
        },
        collectState: function (options) {

            var locations = window.location.href;
            var locations2 = window.location.href;
            locations = locations.indexOf("/Buy/Order");
            locations2 = locations2.indexOf("/Buy/Contrast");
            if (locations != -1) {
                $.ajax({
                    url: Defaults.GetCollectStateUrl,
                    type: "get",
                    dataType: "json",
                    data: {
                        r: Math.random(),
                        ItemCode: ItemCode
                    },
                    success: function (d) {
                        if (d.IsSuccess) {
                            if (d.Result) {
                                $(".js_collect_wrap").removeClass("pro_collect_no").find("a").text("取消收藏").removeClass("js_addCollectBtn").addClass("js_cancelCollectBtn");
                            }
                        } else {
                            window.location.href = d.ReturnUrl;
                        }
                    }
                });
                //取消收藏
                cancelCollect();
                //添加收藏
                addCollect();
            }
            else if (locations2 != -1) {
                function getQuery(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
                        r = window.location.search.substr(1).match(reg);
                    if (r != null) {
                        return r[2];
                    }
                    return null;
                };
                function colect(urlitemcode, collectCountbtn, colwrapbtns) {
                    $.ajax({
                        url: Defaults.GetCollectStateUrl,
                        type: "get",
                        dataType: "json",
                        data: {
                            r: Math.random(),
                            ItemCode: urlitemcode
                        },
                        success: function (d) {
                            if (d.IsSuccess) {
                                if (d.Result) {
                                    $("." + colwrapbtns).removeClass("pro_collect_no").find("a").text("取消收藏").removeClass("js_addCollectBtn").addClass("js_cancelCollectBtn");
                                }
                                getCollectCount(urlitemcode, $("." + collectCountbtn));
                                //添加收藏
                                function addCollect() {
                                    $(".js_addCollectBtn").die("click").live("click", function () {
                                        var $this = $(this);
                                        $.ajax({
                                            url: "/ItemSellOperate/Collect",
                                            type: "post",
                                            dataType: "json",
                                            data: {
                                                r: Math.random(),
                                                ItemCode: $this.parent().parent().find(".js_itemcode").text()
                                            },
                                            success: function (d) {
                                                if (d.IsSuccess) {
                                                    if (d.CollectResult) {
                                                        $this.text("取消收藏").removeClass("js_addCollectBtn").addClass("js_cancelCollectBtn").parent(".js_collect_wrap").removeClass("pro_collect_no");
                                                        getCollectCount($this.parent().parent().find(".js_itemcode").text(), $this.parent().find(".js_collectCount"));
                                                        QiBao.ShowMessageDiv({
                                                            Content: "<p style='font-size:14px;'>" + d.Message + "</p>"
                                                        });
                                                    } else {
                                                        QiBao.ShowMessageDiv({
                                                            Content: "<p style='font-size:14px;'>" + d.Message + "</p>"
                                                        });
                                                    }
                                                } else {
                                                    window.location.href = d.ReturnUrl;
                                                }
                                            }
                                        });
                                    });
                                };
                                //取消收藏
                                function cancelCollect() {
                                    $(".js_cancelCollectBtn").die("click").live("click", function () {
                                        var $this = $(this);
                                        $.ajax({
                                            url: "/ItemSellOperate/CancelCollect",
                                            type: "post",
                                            dataType: "json",
                                            data: {
                                                r: Math.random(),
                                                ItemCode: $this.parent().parent().find(".js_itemcode").text()
                                            },
                                            success: function (d) {
                                                if (d.IsSuccess) {
                                                    if (d.CanCelCollectResult) {
                                                        $this.text("收藏该物品").removeClass("js_cancelCollectBtn").addClass("js_addCollectBtn").parent(".js_collect_wrap").addClass("pro_collect_no");

                                                        getCollectCount($this.parent().parent().find(".js_itemcode").text(), $this.parent().find(".js_collectCount"));

                                                        QiBao.ShowMessageDiv({
                                                            Content: "<p style='font-size:14px;'>" + d.Message + "</p>"
                                                        });
                                                    } else {
                                                        QiBao.ShowMessageDiv({
                                                            Content: "<p style='font-size:14px;'>" + d.Message + "</p>"
                                                        });
                                                    }
                                                } else {
                                                    window.location.href = d.ReturnUrl;
                                                }
                                            }
                                        });
                                    });
                                };
                                //获取收藏人数
                                function getCollectCount(thiscodes, count) {
                                    $.ajax({
                                        url: "/ItemSellOperate/CollectCount",
                                        type: "get",
                                        dataType: "json",
                                        data: {
                                            r: Math.random(),
                                            ItemCode: thiscodes
                                        },
                                        success: function (d) {
                                            if (d.IsSuccess) {
                                                count.text(d.Count);
                                            } else {
                                                window.location.href = d.ReturnUrl;
                                            }
                                        }
                                    });
                                };
                                //取消收藏
                                cancelCollect();
                                //添加收藏
                                addCollect();
                            } else {
                                window.location.href = d.ReturnUrl;
                            }
                        }
                    });
                };
                colect(getQuery("ItemCode1"), "js_collectCountbtn1", "js_colwrapbtn1");
                colect(getQuery("ItemCode2"), "js_collectCountbtn2", "js_colwrapbtn2");
            }

        },
        showServerCrossDiv: function (data, sellServerId) {
            $(".public_SelectServer_div").remove();
            $("body").append(selectServerHtml);
            var winwidth = $(window).width();
            var thisleft = winwidth / 2 - $("#public_SelectServer_divTip").width() / 2;
            var thistop = $(window).height() / 2 - $("#public_SelectServer_divTip").height() / 2 + $(window).scrollTop();
            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
            $(".public_SelectServer_div .markdiv").css("height", bodyheight);
            $("#public_SelectServer_divTip").css({ 'left': thisleft, 'top': thistop });

            $(".js_SelectServer_popclose").die("click").live("click", function () {
                $(".public_SelectServer_div").remove();
            });
            //各个大区添加数据
            for (i = 0; i < data.length; i++) {
                var str = "<a data-aname=" + data[i].BuyAreaName + " data-aid=" + data[i].BuyAreaCode + " data-sid=" + data[i].BuyServerCode + " href='javascript:;'>" + data[i].BuyServerName + "</a>";

                switch (data[i].BuyAreaCode) {
                    case 6:
                        $(".js_sxOne").append(str);
                        break;
                    case 7:
                        $(".js_sxTwo").append(str);
                        break;
                    case 1:
                        $(".js_dxOne").append(str);
                        break;
                    case 2:
                        $(".js_dxTwo").append(str);
                        break;
                    case 4:
                        $(".js_wtOne").append(str);
                        break;
                    case 5:
                        $(".js_wtTwo").append(str);
                        break;
                }
            }
            //弹层大区服务器切换效果
            $("#js_areaServer > .tb_th > a").click(function () {
                $(this).addClass("curr").siblings("a").removeClass("curr");
                $("#js_areaServer > .tb_tbody").hide();
                $("#js_areaServer > .tb_tbody").eq($(this).index()).show();
            });
            $("#js_areaServer > .tb_tbody > a").click(function () {
                //移除大区服务器层
                $(".public_SelectServer_div").remove();
                serverBuyCode = $(this).attr("data-sid");
                serverBuyName = $(this).text();
                areaBuyCode = $(this).attr("data-aid");
                areaBuyName = $(this).attr("data-aname");
                //直接弹登录层
                QiBao.showLoginCrossdiv(areaBuyCode, areaBuyName, serverBuyCode, serverBuyName, sellServerId);
            });



        },
        ShowSearchLoadDiv: function (options) {

            $(".public_SearchLoadBox_div").remove();
            $("body").append(searchLoadBoxDiv);
            var winwidth = $(window).width();
            var thisleft = winwidth / 2 - $("#public_SearchLoadBox_divTip").width() / 2;
            var thistop = $(window).height() / 2 - $("#public_SearchLoadBox_divTip").height() / 2 + $(window).scrollTop();
            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
            $(".public_SearchLoadBox_div .markdiv").css("height", bodyheight);
            $("#public_SearchLoadBox_divTip").css({ 'left': thisleft, 'top': thistop });
        },
        ShowTopNav: function () {
            var timeout = 500;
            var closetimer = 0;
            var ddmenuitem = 0;
            function jsddm_open() {
                jsddm_canceltimer();
                jsddm_close();
                ddmenuitem = $(this).find('ul').eq(0).css('visibility', 'visible');
            }
            function jsddm_close()
            { if (ddmenuitem) ddmenuitem.css('visibility', 'hidden'); }
            function jsddm_timer()
            { closetimer = window.setTimeout(jsddm_close, timeout); }
            function jsddm_canceltimer() {
                if (closetimer) {
                    window.clearTimeout(closetimer);
                    closetimer = null;
                }
            }
            $(document).ready(function () {
                $('#jsddm > li').bind('mouseover', jsddm_open);
                $('#jsddm > li').bind('mouseout', jsddm_timer);
            });
            document.onclick = jsddm_close;
        }
    }
})();

$(function () {
    QiBao.init();
});


