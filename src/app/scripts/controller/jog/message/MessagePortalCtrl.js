var MessagePortalCtrl = ['$rootScope', '$scope', '$location', '$timeout', 'getMessageService', 'baseDataService',
    function($rootScope, $scope, $location, $timeout, getMessageService, baseDataService) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "消息";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    trackerApi("2-消息","",{UserID:$scope.form.getUserId()});
    var trackerString={friendApplyMessage:"好友请求",groupPkMessage:"团战消息",jogGroupMessage:"跑团消息"};

    $scope.form.leftBtnClick = function() {
        $location.path("/myCommunity");
    };

    $scope.path = function(path) {
    	var flag = (path == 'friendApplyMessage' && !!$scope.friendMsgNum) ||
    		       (path == 'groupPkMessage' && !!$scope.groupMailMsgNum) ||
    		       (path == 'jogGroupMessage' && !!$scope.jogMsgNum);
    	if(flag){
        	trackerApi("2-消息",trackerString[path],{});
            $location.path(path);
            if(path == 'jogGroupMessage'){
            	localStorage.setItem('jogDataCache',JSON.stringify(jogData));
            };
    	}else{
    		$rootScope.showToast('没有消息');
    	};
    };
    //好友请求
	$scope.friendMailStatus = 0;
	$scope.friendMsgNum = 0;
	var inviteListPostData = copyData($scope.form.userData);
	inviteListPostData.type = 1;
	var inviteListApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + inviteListApi;
    $.ajax({
        type: $scope.form.postType,
        url: inviteListApiUrl,
        context: document.body,
        data: inviteListPostData,
        success: function(data) {
            if (data.errorCode == -6 || data.errorCode == -100) {
                $scope.$root.getErrorCodeMsg(data.errorMessage,function(){},data.errorCode);
                return;
            } else if (data.errorCode < 0) {
                $scope.$root.getErrorCodeMsg(data.errorMessage);
            } else {
                $timeout(function() {
                    //是否有新邀请好友信息
                	$scope.friendMsgNum = data.result.length;
                    data.result.forEach(function(o,i){
                        if(!o.status) $scope.friendMailStatus++;
                    });
                })
            }
        },
        error: function(e) {
            $scope.$root.getReadyStateMsg(e.readyState);
        }
    });
    //团战消息
	$scope.groupMailStatus = 0;
	$scope.groupMailMsgNum = 0;
    var inviteListPostData = copyData($scope.form.userData);
    inviteListPostData.type = 3;
    var inviteListApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + inviteListApi;
    $.ajax({
        type:$scope.form.postType,
        url: inviteListApiUrl,
        context: document.body,
        data: inviteListPostData,
        success: function(data) {
            if (data.errorCode == -6 || data.errorCode == -100) {
                $scope.$root.getErrorCodeMsg(data.errorMessage,function(){},data.errorCode);
                return;
            } else if (data.errorCode < 0) {
                $scope.$root.getErrorCodeMsg(data.errorMessage);
            } else {
                $timeout(function() {
                    //是否有新邀请团战信息
                	$scope.groupMailMsgNum = data.result.length;
                    data.result.forEach(function(o,i){
                        if(!o.status && !o.taskStatus) $scope.groupMailStatus++;
                    });
                })
            }
        },
        error: function(e) {
            $scope.$root.getReadyStateMsg(e.readyState);
        }
    });
    //跑团消息
    $scope.jogStatus = 0;
    $scope.jogMsgNum = 0;
    $scope.isHead = false;
    var jogDataCache = !localStorage.getItem('jogDataCache') ? false : JSON.parse(localStorage.getItem('jogDataCache'));
    var jogData = [];
    getMessageService().then(function(res) {
        if (res.statusCode != 0) {
            $scope.$root.getErrorCodeMsg(res.msg);
        } else {
        	//action:1-团长接受 2-团长拒绝 3-加入跑团申请 4-撤销申请 5-任命为团长 6-被移除 7-退团
            $scope.jogMsgNum = res.data.length;
        	res.data.forEach(function(item, index){
        		(item.action == 3 && item.isHead != 0) && ($scope.jogStatus++);
        		item.isHead != 0 && ($scope.isHead = true);
        		jogData.push({groupId: item.groupId,updateTime: item.updateTime});
        	});
        	if(!jogDataCache && !!$scope.jogMsgNum){
        		$scope.jogHaveNew = true;
        	}else if(!jogDataCache && !$scope.jogMsgNum){
        		$scope.jogHaveNew = false;
        	}else{
        		$scope.jogHaveNew = JSON.stringify(jogDataCache) != JSON.stringify(jogData);
        	};
        }
    });
}];