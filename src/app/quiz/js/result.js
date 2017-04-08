$(function(){
	var resultData = JSON.parse(localStorage.getItem('resultData'));
	$('.top-menu h1').html(resultData.menu);
	$('.healthy-tips').html(resultData.resultMessage);
    //返回处理
    $('#backBtn').on('click',function(){
    	window.location.href = pageDomain + '/app.html';
    });
});