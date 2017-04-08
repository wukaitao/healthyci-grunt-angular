var JoggersTopCtrl = ['$rootScope', '$scope', '$timeout', '$location', '$routeParams', 'getMemberRankService', 'baseDataService',
    function ($rootScope, $scope, $timeout, $location, $routeParams, getMemberRankService, baseDataService) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "排行榜";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;

    $scope.groupId = $routeParams.groupId;
    
	//页面初始化
    $scope.isLoading = false;
    $scope.rankType = 0;//0-今日，1-本周，2-本月，3-上周，4-上月
    $scope.pageSize = 50;//50
    $scope.pageNo = 1;
	$scope.isNoData = false;
	$scope.rankData = {};
	$scope.dataList = [];
	$scope.droploader = {};
	var flag = false;
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
	$scope.formatSum = function(){
		if($scope.rankData.mySum > 10000000000){
		    $scope.sumUnit = '百亿公里';
		    $scope.sumCount = _toDecimal2(Math.floor(($scope.rankData.mySum/10000000000)*100)/100);
		}else if($scope.rankData.mySum > 10000000){
		    $scope.sumUnit = '千万公里';
		    $scope.sumCount = _toDecimal2(Math.floor(($scope.rankData.mySum/10000000)*100)/100);
		}else if($scope.rankData.mySum > 10000){
		    $scope.sumUnit = '万公里';
		    $scope.sumCount = _toDecimal2(Math.floor(($scope.rankData.mySum/10000)*100)/100);
		}else{
		    $scope.sumUnit = '公里';
		    $scope.sumCount = _toDecimal2(Math.floor($scope.rankData.mySum*100)/100);
		};
	};
	$scope.formatSteps = function(){
		if($scope.rankData.mySteps > 10000000){
		    $scope.rankData.mySteps = Math.floor(($scope.rankData.mySteps/10000000)*100)/100 + '千万';
		};
	};
    //请求数据
    function _getMemberRankFn(callback){
    	$scope.isLoading = true;
        var params = {
                pageNo: $scope.pageNo++,
                pageSize: $scope.pageSize,
                groupId: $scope.groupId,
                type: $scope.rankType
            };
		var rankType = $scope.rankType;
        getMemberRankService(params).then(function (res) {
        	if (rankType != $scope.rankType) return;//防止弱网情况下，其他TAB的请求结果加载到当前请求结果上
        	if ($scope.pageNo == 2 && flag) return;//防止TabA快速切换到TabB再到TabA后，三个Ajax还在进行中，第一个请求返回还保存下来
            if (res.statusCode != 0) $scope.$root.getErrorCodeMsg(res.msg);
            else {
                //console.log('排行榜数据:' + JSON.stringify(res.data));
                //res.data.timePeriod = res.data.timePeriod;
                $scope.rankData = res.data;
                if(!res.data || !res.data.list || !res.data.list.length){
                	if($scope.pageNo == 2){
						$timeout(function(){
		                	$('.dropload-down-nodata').show();
						},100);
                	};
                }else{
                	$('.dropload-down-nodata').hide();
                };
				(!res.data || !res.data.list || res.data.list.length < $scope.pageSize) && ($scope.isNoData = true);
				if(!!res.data && !!res.data.list){
					$scope.rankData.list = $scope.dataList.concat(res.data.list);
					$scope.dataList = $scope.rankData.list;
					$scope.formatSum();
					$scope.formatSteps();
				};
                callback.call(this);
            };
            $scope.isLoading = false;
            if ($scope.pageNo == 2) flag = true;
            else flag = false;
        });
    };
    //返回
    $scope.form.leftBtnClick = function () {
    	switch ($scope.rankType){
	    	case 3:
	    		$scope.topClick(1);
	    		break;
	    	case 4:
	    		$scope.topClick(2);
	    		break;
	    	default:
	    		$location.path('/jogGroupDetails/' + $scope.groupId);
	    		break;
    	};
    };
    //切换排名
    $scope.topClick = function (rankType) {
    	if((!$scope.rankData.existWeekRank&&rankType==3)||(!$scope.rankData.existMonthRank&&rankType==4)) return;
    	if($scope.rankType == rankType && $scope.isLoading) return;
        $timeout(function(){$(window).scrollTop(0);},50);
    	flag = false;
        $scope.rankType = rankType;
    	//loadUpFn的设置要挪到搜索点击处
        $scope.pageNo = 1;
    	$scope.isNoData = false;
    	//$scope.rankData = {};
    	$scope.dataList = [];
		$scope.droploader.unlock();
		$scope.droploader.noData(false);
		_getMemberRankFn(function(){
			//锁定
			if($scope.isNoData){
				$scope.droploader.lock('down');
				$scope.droploader.noData();
			};
			//ng-repeat遍历完后重置
			$timeout(function(){
				$scope.droploader.resetload();
			},50);
    	});
    };
    //选中好友
    $scope.selectClick = function () {};
    //请求加为好友
    $scope.isAdding = false;
    $scope.addFriendClick = function(user) {
        if(user.isFriend > 0 || $scope.isAdding) return;
        $scope.isAdding = true;
        //console.log("请求加为好友，接口暂未提供！");
        var param = copyData($scope.form.userData);
        param.type = 1;
        param.inviteUserId = user.userId;
        var sendInviteApiUrl = apiDomain + '/' + $scope.form.userData.userId + '/' + $scope.form.userData.session + sendInviteApi;
		var promise = baseDataService.originalHttp(sendInviteApiUrl,param);
		promise.then(function(data){
			$scope.isAdding = false;
			if(data.errorCode == -6 || data.errorCode == -100 || data.errorCode < 0) $scope.$root.getErrorCodeMsg(data.errorMessage);
			else{
				if(data.result == 1) $rootScope.showToast('发送邀请成功');
				else if(data.result == 3) $rootScope.showToast('已发送过邀请');
				else if(data.result == 5) $rootScope.showToast('该用户已发好友邀请给您，请到个人消息接受');
				else $rootScope.showToast('发送邀请失败');
			};
		},function(err){
			$scope.$root.getErrorCodeMsg(err.status);
			$scope.isAdding = false;
		});
    };
	//上拉刷新下拉加载更多
    var refreshingHintDom = '<div style="text-align: center;padding: 0 15px 15px;"><img style="width: 40%;" src="images/jog/img-loading.png"></div>';
    var loadingHintDom = '<div style="text-align: center;padding: 15px;"><img style="width: 40%;" src="images/jog/img-loading.png"></div>';
    var noDataHintDom = '<div class="dropload-down-nodata" style="text-align: center;padding: 15px;display: none;">暂时没有数据</div>';
    $('.joggers-top-list').dropload({
        scrollArea: window,
        autoLoad: true,
        domUp: {
            domClass: 'dropload-up',
            domRefresh: refreshingHintDom,
            domUpdate: refreshingHintDom,
            domLoad: refreshingHintDom
        },
        domDown: {
            domClass: 'dropload-down',
            domRefresh: loadingHintDom,
            domLoad: loadingHintDom,
            domNoData: noDataHintDom
        },
        loadUpFn: function (me) {
        	flag = false;
        	$scope.rankData = {};
        	$scope.dataList = [];
			$scope.pageNo = 1;
			$scope.isNoData = false;
			me.unlock();
			me.noData(false);
			_getMemberRankFn(function(){
				//锁定
				if($scope.isNoData){
					me.lock('down');
					me.noData();
				};
				me.direction = 'down';//修复插件BUG
				//ng-repeat遍历完后重置
				$timeout(function(){
					me.resetload();
				},50);
			});
        },
        loadDownFn: function (me) {
        	$scope.droploader = me;
        	_getMemberRankFn(function(){
				//锁定
				if($scope.isNoData){
					me.lock('down');
					me.noData();
				};
				//ng-repeat遍历完后重置
				$timeout(function(){
					me.resetload();
				},50);
			});
        }
    });
}];