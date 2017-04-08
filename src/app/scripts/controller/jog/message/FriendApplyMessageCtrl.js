var FriendApplyMessageCtrl = ['$rootScope', '$scope', '$location', '$timeout', function($rootScope, $scope, $location, $timeout) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "好友请求";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;

    $scope.form.leftBtnClick = function() {
        $location.path("/messagePortal");
    };

	$scope.addFriend = function(self,friend) {
		trackerApi("3-好友请求","接受",{});
        var acceptInviteApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + acceptInviteApi;
        var postData = copyData($scope.form.userData);
        postData.type = 1;
        postData.status = 1;
        postData.friendUserId = friend.inviteUserId;
        $.ajax({
            type: $scope.form.postType,
            url: acceptInviteApiUrl,
            context: document.body,
            data: postData,
            success: function(data) {
                if (data.errorCode == -6 || data.errorCode == -100) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage,function(){},data.errorCode);
                    return;
                } else if (data.errorCode < 0) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                } else {
                    if (data.result.status == 1) {
                        $('#validateSuccess1').removeClass('hide');
                        $timeout(function(){friend.status=1;});
                        setTimeout(function(){
                            $('#validateSuccess1').addClass('hide');
                        },2000)
                    }else if(data.result.status == 4) {
                        $('#validateSuccess4').removeClass('hide');
                        $timeout(function(){friend.status=1;});
                        setTimeout(function(){
                            $('#validateSuccess4').addClass('hide');
                        },2000)
                    }else{
                        $('#validateError').removeClass('hide');
                        setTimeout(function(){
                            $('#validateError').addClass('hide');
                        },2000)
                    }
                }
            },
            error: function(e) {
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
    };
    
    $scope.deleteClick = function(self,inviteUserId){
        var delInviteApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + delInviteApi;
        var postData = copyData($scope.form.userData);
        postData.inviteId = inviteUserId;
        $.ajax({
            type: $scope.form.postType,
            url: delInviteApiUrl,
            context: document.body,
            data: postData,
            success: function(data) {
                if (data.errorCode == -6 || data.errorCode == -100) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage,function(){},data.errorCode);
                    return;
                } else if (data.errorCode < 0) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                } else {
                    if (data.result == 1) {
                        $('#validateSuccessDel').removeClass('hide');
                        setTimeout(function(){
                            $('#validateSuccessDel').addClass('hide');
                            _getInviteList();
                        },2000)
                    } else {
                         $('#validateErrorDel').removeClass('hide');
                        setTimeout(function(){
                            $('#validateErrorDel').addClass('hide');
                            _getInviteList();
                        },2000)
                    }
                }
            },
            error: function(e) {
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
    };

    $scope.onHammer = function(event) {

        var obj = event.element;
        switch (event.direction) {
            case 2:
                obj.addClass('move-left');
                break;
            case 4:
                obj.removeClass('move-left');
                break;
        }
    };

    function _getInviteList(){
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
                        $scope.form.inviteList = data.result;
                    })
                }
            },
            error: function(e) {
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
    };
    _getInviteList();
}];