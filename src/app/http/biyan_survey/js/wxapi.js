function register_wxpai(args) {
  if ( navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' ) {
    $.getScript("http://res.wx.qq.com/open/js/jweixin-1.0.0.js", function () {
      $.get('/wx/signature?url='+encodeURIComponent(location.href.split('#')[0]))
        .done(function (value) {
          wx.config({
            debug    : false,
            appId: 'wxd372875e249f68e4',
            timestamp: value.timestamp,
            nonceStr : value.nonceStr,
            signature: value.signature,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'chooseWXPay']
          });

          wx.ready(function () {
            wx.onMenuShareTimeline({
              title  : args.share_title, // 分享标题
              link : args.share_url, // 分享链接
              imgUrl: args.share_img_url, // 分享图标
              success: function () {
                // 用户确认分享后执行的回调函数
                //alert('onMenuShareTimeline succeeded.');
              },
              cancel : function () {
                // 用户取消分享后执行的回调函数
                //alert('onMenuShareTimeline failed.');
              }
            });

            wx.onMenuShareAppMessage({
              title  : args.share_title, // 分享标题
              desc : args.share_descr, // 分享描述
              imgUrl: args.share_img_url, // 分享图标title: '', // 分享标题
              type  : 'link', // 分享类型,music、video或link，不填默认为link
              link  : args.share_url,
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function () {
                // 用户确认分享后执行的回调函数
                //alert('onMenuShareAppMessage succeeded.');
              },
              cancel : function () {
                // 用户取消分享后执行的回调函数
                //alert('onMenuShareAppMessage failed.');
              }
            });
          });

          wx.error(function () {
          });
        })
    });
  }
}
