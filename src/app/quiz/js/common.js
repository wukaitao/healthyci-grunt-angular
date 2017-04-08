//设置apiDomain和pageDomain
apiDomain="https://hms-sit.test-cignacmb.com/hmc_cmb_server";
pageDomain = 'https://hms-sit.test-cignacmb.com/sit-hms-cmb';
//获取url参数
function getQueryString(name){
	var reg = new RegExp('(^|&)'+ name +'=([^&]*)(&|$)');
	var r = window.location.search.substr(1).match(reg);
	if(r!=null){
		return unescape(r[2]);
	}else{
		return null;
	};
};
//显示提示
function showTips(tips){
	var tipsHtml = '<div class="cover">' + 
				       '<div class="tips">' + 
				           tips +
				       '</div>' + 
				   '</div>';
	$('.cover').remove();
	$('body').append(tipsHtml);
	window.setTimeout(function(){
		$('.cover').remove();
	},2000);
};
//显示加载
function showLoading(msg){
	var msg = msg || '正在加载...';
	var rectHtml = '<span class="rect-odd"></span><span class="rect-even"></span>';
	var loadingHtml = '<div class="loading">' +
						  '<div class="box">' +
						      '<div class="contaier-one">' + rectHtml + '</div>' +
						      '<div class="contaier-two">' + rectHtml + '</div>' +
						      '<div class="contaier-three">' + rectHtml + '</div>' +
						      '<div class="contaier-four">' + rectHtml + '</div>' +
						      '<div class="contaier-five">' + rectHtml + '</div>' +
						      '<div class="contaier-sixe">' + rectHtml + '</div>' +
						  '</div>' +
						  '<p>' + msg + '</p>' + 
					  '</div>';
	msg != '正在加载...' && (loadingHtml = '<div class="cover-loading">' + loadingHtml + '</div>');
	$('.cover-loading,.loading').remove();
	$('body').append(loadingHtml);
};
//隐藏加载
function hideLoading(){
	$('.cover-loading,.loading').remove();
	$('.page-view').removeClass('hide');
};