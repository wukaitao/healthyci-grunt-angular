//设置apiDomain
rungroupDomain="https://hms-sit.test-cignacmb.com/hmc_rungroup_server";
getShareMessageApi = '/getShareMessage';
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
//补齐两位小数
var _toDecimal2 = function(num){
	if(num == 0) return num;
	var num = num.toString();
	var index = num.indexOf('.');
	if(index < 0){
		index = num.length;
		num += '.'; 
	};
	while(num.length <= index+2){
		num += '0';
	};
	return num;
};

$(function(){
	function _getShareInfo(){
		var param = {
				lang: 'zh_CN',
				device: 'Android4.0',
				appVerNum: '4.0.0',
				deviceVerNum: '1.0.0',
				userId: '',
				phoneNum: '',
				session: '',
				shareId: getQueryString('shareId')
			};
		var getShareMessageUrl = rungroupDomain + getShareMessageApi;
		$.ajax({
			url: getShareMessageUrl,
			type: 'get',
			data: param,
			dataType: 'json',
			success: function(data){
				if(data.statusCode != 0) alert('数据加载失败！');
				else{
					var resultObj = JSON.parse(data.data.shareMessage);
					var groupSumHml = '';
					$('#groupName,#tipsGroupName').html(resultObj.groupName);
					$('#groupDesc').html(resultObj.groupDesc);
					$('#city').html(resultObj.city);
					$('#groupId').html(resultObj.groupId);
					$('#groupMemCount').html(resultObj.groupMemCount);
					$('#date').html(data.data.createTime);
					//总里程
					if(resultObj.groupSum > 10000000000){
						groupSumHml = _toDecimal2(Math.floor((resultObj.groupSum/10000000000)*100)/100)+'百亿公里';
					}else if(resultObj.groupSum > 10000000){
						groupSumHml = _toDecimal2(Math.floor((resultObj.groupSum/10000000)*100)/100)+'千万公里';
					}else if(resultObj.groupSum > 10000){
						groupSumHml = _toDecimal2(Math.floor((resultObj.groupSum/10000)*100)/100)+'万公里';
					}else{
						groupSumHml = _toDecimal2(Math.floor(resultObj.groupSum*100)/100)+'公里';
					};
					$('#groupSum').html(groupSumHml);
				};
			},
			error: function(err){
				alert(err.statusText + ':' + err.responseText);
			}
		});
	};
	_getShareInfo();
});