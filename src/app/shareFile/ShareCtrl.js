// SHARE PAGE STRAT
$(function(){ 
var browser={
        versions:function(){
          var u = navigator.userAgent, app = navigator.appVersion;
          return {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                               android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                               iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                               iPad: u.indexOf('iPad') > -1, //是否iPad
                               webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                             };
                           }(),
                           language:(navigator.browserLanguage || navigator.language).toLowerCase()
                         }
                         isMobile=browser.versions.mobile;
var postData={
        "lang": 'zh_CN',
        "device": 'Android4.0',
        "appVerNum": '4.0.0',
        "deviceVerNum": '1.0.0',
        "userId": "",
        "phoneNum": "",
        "session": ""
    }
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
    {
        return unescape(r[2]);
    }
    return null;
}
function format_number(n){
   var b=parseInt(n).toString();
   var len=b.length;
   if(len<=3){return b;}
   var r=len%3;
   return r>0?b.slice(0,r)+","+b.slice(r,len).match(/\d{3}/g).join(","):b.slice(r,len).match(/\d{3}/g).join(",");
 }
var getShareMessageUrl=apiDomain+getShareMessageApi;
//alert(getShareMessageUrl)
postData.shareId=getUrlParam('shareId');
$.ajax({
    type: 'POST',
    url: getShareMessageUrl,
    context: document.body,
    data: postData,
    success: function(data) {
        if(data.errorCode==0)
        {
          
            //alert(JSON.stringify(data))
           var message=JSON.parse(data.result.shareMessage);
           $('.titleText').text(message.text);
           $('.dayTime').text(message.today); 
           $('.user-name').text(message.nickName)  
           if(message.type=="healthy"){
            $('.healthy-share').removeClass('hide');
            $('.people').addClass(message.people);
            $('.todayStep').text(format_number(message.todayStep));
            $('.totalStep').text(format_number(message.totalStep));
            $('.userRankForFriend').text(parseInt(message.userRankForFriend));
           }else if(message.type=="team")
           {
            if(message.taskId=="1")
            {
              $('.brttleGroup-content').addClass('team-yi-bg');
            }else if(message.taskId=="2")
            {
              $('.brttleGroup-content').addClass('team-qian-bg');
            }
            $('.team-share').removeClass('hide');
            $('.taskName').text(message.taskName);
            $('.nickName').text(message.nickName);
            $('.steps').text(format_number(message.steps));
            for(var i = 0;i<message.taskMembers.length;i++)
            {
              if(message.taskMembers[i].status!=0)
                $('.ranking-content').append('<li><div class="tdcell ranking-places">第<span class="rank-num userRank">'+message.taskMembers[i].userRank+'</span>名</div><div class="tdcell name-leavel"><span class="name userName">'+message.taskMembers[i].userName+'</span><br/><i class="icon-coin"></i><span class="leavel-num"> '+format_number(message.taskMembers[i].score)+'</span></div><div class="text-right tdcell ranking-nums"><span class="steps">'+format_number(message.taskMembers[i].steps)+'</span>步</div></li>');
            }
           }
        }else
        {
             alert('数据加载失败！')
        }  
    },
    error: function(e) {
        alert(e.statusText + ":" + e.responseText);
    }
});
var timeout;
if(isMobile)
{
$('.downBtn').bind('touchstart',function(){
  timeout=setTimeout(function(){
    window.location.href="http://e95555.cn/ZIqjJU";
  },1500)
})
$('.downBtn').bind('touchend',function(){
  clearTimeout(timeout);
})
}else{
$('.downBtn').bind('mousedown',function(){
  timeout=setTimeout(function(){
    window.location.href="http://e95555.cn/ZIqjJU";
  },1500)
})
$('.downBtn').bind('mouseup',function(){
  clearTimeout(timeout);
})
$('.downBtn').bind('mouseout',function(){
  clearTimeout(timeout);
})
}
})
// SHARE PAGE END