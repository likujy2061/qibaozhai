$("a[data-tyid='E'],a[data-tyid='D'],a[data-tyid='C'],a[data-tyid='B'],a[data-tyid='A'],a[data-tyid='S'],a[data-tyid='S+'],a[data-tyid='S++'],a[data-tyid='SSS']").click(function(){
console.log("尼玛死了")

//判断按钮的植
if($(this).attr("code")==1){
$(this).css("background", "#37bcb2");
$(this).attr("code",0);

}
else
  {
$(this).attr("code",1);
  };

});


if($(this).attr("code")==1){
console.log($(this).attr("code"),"设置所有未0") 
$("a[data-tyid='Publicity']").attr("code",0);
$("a[data-tyid='Sales']").attr("code",0);
$("a[data-tyid='Sales']").removeAttr("style");
$("a[data-tyid='Publicity']").removeAttr("style");
$("a[data-tyid='FreeShow']").removeAttr("style");

}else{
	console.log($(this).attr("code"),"设置背景色为蓝色") 
$(this).attr("code",1);
$(this).css("background", "#37bcb2");
};


//关于出售状态的获取
$("a[data-tyid='FreeShow'],a[data-tyid='Publicity'],a[data-tyid='Sales']").click(function(){
console.log($(this).attr("data-tyid")) 
//判断按钮的植
if($(this).attr("code")==1){
console.log($(this).attr("code"),"设置所有未0") 
$("a[data-tyid='Publicity']").attr("code",0);
$("a[data-tyid='Sales']").attr("code",0);
$("a[data-tyid='FreeShow']").attr("FreeShow",0);
$("a[data-tyid='Sales']").removeAttr("style");
$("a[data-tyid='Publicity']").removeAttr("style");
$("a[data-tyid='FreeShow']").removeAttr("style");
}else{
console.log($(this).attr("code"),"设置背景色为蓝色") 
$("a[data-tyid='Publicity']").attr("code",0);
$("a[data-tyid='Sales']").attr("code",0);
$("a[data-tyid='FreeShow']").attr("FreeShow",0);
$("a[data-tyid='Sales']").removeAttr("style");
$("a[data-tyid='Publicity']").removeAttr("style");
$("a[data-tyid='FreeShow']").removeAttr("style");
$(this).attr("code",1);
$(this).css("background", "#37bcb2");
};
});