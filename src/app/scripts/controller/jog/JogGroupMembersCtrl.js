var JogGroupMembersCtrl = ['$rootScope', '$scope', '$timeout', '$location', '$routeParams',
    'getMemberListService', 'delMemeberService', 'baseDataService',
    function ($rootScope, $scope, $timeout, $location, $routeParams, getMemberListService, delMemeberService, baseDataService) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "跑团成员";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;

    $scope.groupId = $routeParams.groupId;

    //页面初始设置
    $scope.isLoading = false;
	$scope.form.searchMember = '';
    $scope.pageSize = 50;//50
    $scope.pageNo = 1;
	$scope.isNoData = false;
	$scope.memberInfo = {};
	$scope.dataList = [];
	$scope.droploader = {};
	//$scope.isAllMembers = true;
	var leaderId = '';
	//请求数据
	function _getMemberListFn(callback){
        if($scope.isLoading) return;
	    $scope.isLoading = true;
		var callback = callback || function(){};
        var params = {
                pageNo: $scope.pageNo++,
                pageSize: $scope.pageSize,
                groupId: $scope.groupId,
                memberName: $scope.form.searchMember.replace(/(^\s*)|(\s*$)/g, '')
            };
        //!$scope.isAllMembers && (params.memberName = $scope.form.searchMember);
        getMemberListService(params).then(function (res) {
            if (res.statusCode != 0) $scope.$root.getErrorCodeMsg(res.msg);
            else {
                //console.log('跑团成员数据:' + JSON.stringify(res.data));
                $scope.memberInfo = res.data;
                leaderId = leaderId || $scope.memberInfo.leaderId;
                if(!res.data || (!res.data.leaderId && (!res.data.list || !res.data.list.length))){
                	if($scope.pageNo == 2){
                		$rootScope.showToast('无记录');
						$timeout(function(){
		                	$('.dropload-down-nodata').show();
						},100);
                	};
                }else{
                	$('.dropload-down-nodata').hide();
                };
				(!res.data || !res.data.list || res.data.list.length < $scope.pageSize) && ($scope.isNoData = true);
				if(!!res.data && !!res.data.list && !!res.data.list.length){
					$scope.memberInfo.list = $scope.dataList.concat(res.data.list);
					$scope.dataList = $scope.memberInfo.list;
				};
                callback.call(this);
            };
            $scope.isLoading = false;
        });
	};
	//是否为团长
    $scope.isLeader = function() {
        return leaderId == $scope.form.userData.userId;
    };
    //返回
    $scope.form.leftBtnClick = function () {
    	//if($scope.isAllMembers){
    		$location.path('/jogGroupDetails/' + $scope.groupId);
    	//}else{
    	//	$scope.isAllMembers = true; 
    	//	$scope.form.searchMember = '';
        //	//loadUpFn的设置要挪到默认加载处
        //    $scope.pageNo = 1;
        //	$scope.isNoData = false;
        //	$scope.memberInfo = {};
        //	$scope.dataList = [];
    	//	$scope.droploader.unlock();
    	//	$scope.droploader.noData(false);
    	//	_getMemberListFn(function(){
    	//		//锁定
    	//		if($scope.isNoData){
    	//			$scope.droploader.lock('down');
    	//			$scope.droploader.noData();
    	//		};
    	//		//ng-repeat遍历完后重置
    	//		$timeout(function(){
    	//			$scope.droploader.resetload();
    	//		},50);
        //	});
    	//};
    };
    //搜索
    $scope.searchClick = function () {
    	$scope.form.searchMember = $scope.form.searchMember || '';
        //if(!!$scope.form.searchMember){
        	//loadUpFn的设置要挪到搜索点击处
            $scope.pageNo = 1;
        	$scope.isNoData = false;
        	$scope.memberInfo = {};
        	$scope.dataList = [];
    		$scope.droploader.unlock();
    		$scope.droploader.noData(false);
    	//	$scope.isAllMembers = false;
    		_getMemberListFn(function(){
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
        //};
    };
    //请求加为好友
    $scope.isAdding = false;
    $scope.addFriendClick = function(user) {
        if(user.isFriend || user.isLeaderFriend > 0 || $scope.isAdding) return;
        $scope.isAdding = true;
        var param = copyData($scope.form.userData);
        param.type = 1;
        param.inviteUserId = user.userId || user.leaderId;
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
    //踢出跑团（团长才有权限）
    $scope.removeClick = function(user) {
        if(!$scope.isLeader()) return;
        $rootScope.showConfirmAlert("确定要将"+user.userName+"移除该团？", function () {

            delMemeberService({
                groupId: $scope.groupId,
                memberId: user.userId
            }).then(function(res) {
                if (res.statusCode != 0) {
                    $scope.$root.getErrorCodeMsg(res.msg);
                } else {
                	$rootScope.showToast('删除成功');
                    //重新加载数据
                	//loadUpFn的设置要挪到重载处
                    $scope.pageNo = 1;
                	$scope.isNoData = false;
                	$scope.memberInfo = {};
                	$scope.dataList = [];
            		$scope.droploader.unlock();
            		$scope.droploader.noData(false);
            		//$scope.isAllMembers = true;
            		_getMemberListFn(function(){
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
            });
        });
    };
	//上拉刷新下拉加载更多
    var refreshingHintDom = '<div style="text-align: center;padding: 0 15px 15px;"><img style="width: 40%;" src="images/jog/img-loading.png"></div>';
    var loadingHintDom = '<div style="text-align: center;padding: 15px;"><img style="width: 40%;" src="images/jog/img-loading.png"></div>';
    var noDataHintDom = '<div class="dropload-down-nodata" style="text-align: center;padding: 15px;display: none;">暂时没有数据</div>';
    $('.jog-group-members-list').dropload({
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
			$scope.memberInfo = {};
			$scope.dataList = [];
			$scope.pageNo = 1;
			$scope.isNoData = false;
			me.unlock();
			me.noData(false);
			_getMemberListFn(function(){
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
        	_getMemberListFn(function(){
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
    
    //搜索获取焦点时候改变定位
    $('#search-input').focus(function(){
    	$('.top-menu,.search-area').addClass('fixedTopmenu');
    }).blur(function(){
    	$('.top-menu,.search-area').removeClass('fixedTopmenu');
    });
}];