var ExchangeDetailCtrl = ['$rootScope', '$scope', 'form', '$location', '$timeout', '$routeParams', 'baseDataService',
    function($rootScope, $scope, form, $location, $timeout, $routeParams, baseDataService) {
	factoryVal.topBar.showTopBar = true;
	factoryVal.topBar.showLeftBtn = true;
	factoryVal.topBar.leftBtnType = setting.btn.backBtn;
	$scope.form = form;
	//初始化
	$('.loading').show();
	var productCode = $routeParams.detailId;
	var id = productCode == 'ZD' ? '1' : productCode == 'ACMB' ? '2' : productCode == 'ELCA' ? '3' : '4';
	$scope.isDisabled = $scope.form.exchangeStatus!=0 || false;
	$scope.isInsuring = false;
	$scope.form.insure = $scope.form.insure || {};
	$scope.name = $scope.form.insure.name || '';
	$scope.mobile = $scope.form.insure.mobile || '';
	$scope.identity = $scope.form.insure.identity || '';
	$scope.email = $scope.form.insure.email || '';
	$scope.occupationCode = $scope.form.insure.occupationCode || '';
	$scope.occupationName = $scope.form.insure.occupationName || '请选择';
	$scope.agree = $scope.form.insure.agree || false;
	var pagePath = location.href.substring(0,location.href.lastIndexOf('app.html'));
	//返回
	$scope.form.leftBtnClick = function() {
		$location.path('/exchangeList');
	};
	//获取页面数据
	function _getPageData(){
		var url = pagePath + 'exchange/detail/td' + id + '.json';
		var param = null;
		var promise = baseDataService.originalHttp(url,param,{method:'get'});
		promise.then(function(data){
			$scope.detail = data;
			$scope.form.topBar.topBarTitle = data.menu;
			trackerApi('3-免费险产品页','界面打开次数：' + data.menu,{'UserId': $scope.form.userData.userId});
		},function(err){
			$scope.$root.getErrorCodeMsg(err.readyState);
		});
	};
	function _getPageInfo(){
		var url = exchangeDomain + getProductByCordApi;
		var param = {
				productCode: productCode,
				channel: 'CMB11'
		};
		var promise = baseDataService.originalHttp(url,param);
		promise.then(function(data){
			$('.loading').hide();
			if(data.statusCode == 200){
				$scope.info = data.data;
			}else{
				$scope.$root.getErrorCodeMsg(data.msg);
			};
		},function(err){
			$('.loading').hide();
			$scope.$root.getErrorCodeMsg(err.readyState);
		});
	};
	_getPageData();
	_getPageInfo();
	//职业
	$scope.selectOccupation = function(){
		$('.toast').hide();
		$scope.form.insure = {
				name: $scope.name,
				identity: $scope.identity,
				mobile: $scope.mobile,
				email: $scope.email,
				occupationCode: $scope.occupationCode,
				occupationName: $scope.occupationName,
				agree: $scope.agree
			};
		$location.path('/exchangeOccupation/'+productCode);
	};
	$timeout(function(){
		var listWidth = $('.form-list li').width();
		$('.ipt').css({
			display: 'inline-block',
			width: listWidth-110+'px'
		});
	});
	//校验
	var aCity = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",
		33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",
		46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",
		65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"
	};
	//删除非中文
	var _delNotCn = function(str){
		var chReg = new RegExp('[\u4E00-\u9FA5]');
		var result = '';
		str.split('').forEach(function(item,index){
			chReg.test(item) && (result = result + item);
		});
		return result;
	};
	//删除空格
	var _delBlank = function(str){
		var blankReg = /\s+/g;
		return str.replace(blankReg,'');
	};
	//删除特殊字符
	var _delSpeStr = function(str){
		var speReg = new RegExp("[\\s`~!@#$^&*()=|{}':;',\\[\\]%<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？_]",'g');
		return str.replace(speReg,'');
	};
	$scope.filterName = function(){
		$scope.name = _delNotCn($scope.name);
	};
	$scope.filterIdentity = function(){
		$scope.identity = _delSpeStr($scope.identity);
	};
	$scope.filterMobile = function(){
		$scope.mobile = _delSpeStr($scope.mobile);
	};
	$scope.checkName = function(){
		var chReg = new RegExp('^[\u4E00-\u9FA5]{1,10}$');
		if(!$scope.name || !chReg.test($scope.name)){
			$rootScope.showToast('请填写正确的中文姓名');
			return false;
		};
		return true;
	};
	$scope.checkIdentity = function(){
		if(!$scope.identity || !/^\d{17}(\d|x)$/i.test($scope.identity)){
			$rootScope.showToast('请填写正确的身份证号码');
			return false;
		};
		var iSum = 0;
		if(aCity[parseInt($scope.identity.substr(0,2))] == null){
			$rootScope.showToast('请填写正确的身份证号码');//地区非法
			return false;
		};
		sBirthday = $scope.identity.substr(6,4) + '-' + Number($scope.identity.substr(10,2)) + '-' + Number($scope.identity.substr(12,2));
		var date = new Date(sBirthday.replace(/-/g,'/'));
		if(sBirthday != (date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate())){
			$rootScope.showToast('请填写正确的身份证号码');//出生日期非法
			return false;
		};
		$scope.identity = $scope.identity.replace(/x$/i,'a');
		for(var i=17; i>=0; i--){
			iSum += (Math.pow(2,i) % 11) * parseInt($scope.identity.charAt(17 - i),11);
		};
		$scope.identity = $scope.identity.replace(/a$/i,'x');
		if(iSum%11 != 1){
			$rootScope.showToast('请填写正确的身份证号码');//身份证号非法
			return false;
		};
        var year = $scope.identity.substr(6,4);
        var month = $scope.identity.substr(10,2);
        var day = $scope.identity.substr(12,2);
        var today = new Date();
        var targetday_milliseconds=today.getTime() + 1000*60*60*24; 								
        today.setTime(targetday_milliseconds);
        var thisYear = today.getFullYear();
        var thisMonth = today.getMonth() + 1;
        var thisDay = today.getDate();
        var realAge;
        var offSet = thisYear - year;
        var monthOffSet = thisMonth - month;
        var dayOffSet = thisDay - day;
        if(monthOffSet < 0){//未满实岁
            realAge = offSet - 1;
        }else if(monthOffSet > 0){//已满实岁
            realAge = offSet;
        }else if(monthOffSet === 0){//月分相等，需要判断日期
            if(dayOffSet < 0){//未满实岁
                realAge = offSet - 1;
            }else if (dayOffSet >= 0){//已满实岁
                realAge = offSet;
            };
        };
        if(realAge > 60 || realAge < 18){//年龄不符合
			$rootScope.showToast('投保年龄须在18到60周岁');
        	return false;
        };
        return true;
	};
	$scope.checkMobile = function(){
		var mobileReg = new RegExp('^[1][3,4,5,7,8][0-9]{9}$');
		if(!$scope.mobile || !mobileReg.test($scope.mobile)){
			$rootScope.showToast('请填写正确的手机号码');
			return false;
		};
		return true;
	};
	$scope.checkEmail = function(){
		var emailReg = new RegExp('^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$');
		if(!$scope.email || !emailReg.test($scope.email)){
			$rootScope.showToast('请填写正确的邮箱地址');
			return false;
		};
		return true;
	};
	$scope.checkOccupation = function(){
		if($scope.occupationCode==''){
			$rootScope.showToast('请选择职业');
			return false;
		};
		return true;
	};
	$scope.checkClause = function(){
		if(!$scope.agree){
			$rootScope.showToast('请阅读并同意《保险须知》、<br>《保险条款》');
			return false;
		};
		return true;
	};
	//条款/须知跳转
	$scope.goPage = function(path){
		$scope.form.insure = {
			name: $scope.name,
			identity: $scope.identity,
			mobile: $scope.mobile,
			email: $scope.email,
			occupationCode: $scope.occupationCode,
			occupationName: $scope.occupationName,
			agree: $scope.agree
		};
		$location.path(path + '/' + productCode);
	};
	//完成一次健康币兑换任务
	var _expendScoreRrewardTask = function(){
    	var param = copyData($scope.form.userData);
    	var url = apiDomain + '/' + $scope.form.userData.userId + '/' + $scope.form.userData.session + expendScoreRrewardTaskApi;
		var promise = baseDataService.originalHttp(url,param);
		promise.then(function(data){},function(err){});
	};
	//投保
	$scope.insure = function(){
		if($scope.isDisabled) return;
		var checkFlag = $scope.checkName() && $scope.checkIdentity() && $scope.checkMobile() && $scope.checkEmail() && $scope.checkOccupation() && $scope.checkClause();
		if(!checkFlag || $scope.isInsuring) return;
		_expendScoreRrewardTask();
		$('.loading').show();
		$scope.isInsuring = true;
		var url = exchangeDomain + addInsureApi;
		var param = {
				name: encodeURI($scope.name),
				idcard: $scope.identity,
				phone: $scope.mobile,
				email: $scope.email,
				occupationCode: $scope.occupationCode,
				code: productCode,
				channel: 'CMB11',
				userId: $scope.form.userData.userId
			};
		var promise = baseDataService.originalHttp(url,param);
		promise.then(function(data){
			$('.loading').hide();
			$scope.isInsuring = false;
			if(data.statusCode == 200){
				//投保成功
				$scope.form.exchange = {status: true, name: data.data.desc, data:data.data.policyNo, title: $scope.form.topBar.topBarTitle};
				$location.path('/exchangeResult');
			}else if(data.statusCode == 301){
				//重复投保
				$scope.form.exchange = {status: false, data: '您已购买过该保险<br>且当前在保险有效期内', title: $scope.form.topBar.topBarTitle};
				$location.path('/exchangeResult');
			}else if(data.statusCode == 601){
				//健康币不足
				$scope.form.exchangeStatus = 2;
				$scope.isDisabled = true;
			}else{
				//核保失败
				$scope.$root.getErrorCodeMsg(data.msg);
			};
		},function(err){
			$('.loading').hide();
			$scope.isInsuring = false;
			$scope.$root.getErrorCodeMsg('网络不给力，请检查网络后再试试吧！');
		});
	};
	//输入框获取和失去焦点时title定位的变化改变
    $('input[type="text"],input[type="tel"],input[type="email"]').focus(function(){
    	$('.top-menu').addClass('fixedTopmenu');
    }).blur(function(){
    	$('.top-menu').removeClass('fixedTopmenu');
    });
}];