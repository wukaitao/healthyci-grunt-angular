var ChoosePlayerCtrl = ['$scope', '$location', 'form', '$http', '$timeout', function($scope, $location, form, $http, $timeout) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "选择玩家";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;

    $scope.form = form;
    $scope.form.task.players = "";
    $scope.form.leftBtnClick = function() {
        $location.path("/createDetails");
    }
    $scope.isFriend = true;
    var searchFriendApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + searchFriendApi;
    var friendsPostData = copyData($scope.form.userData);
    var worldPostData = copyData($scope.form.userData);

    $scope.friendsArray = new Array();
    $scope.worldArray = new Array();

    friendsPostData.searchType = "4";
    friendsPostData.offset = "0";
    $.ajax({
        type: $scope.form.postType,
        url: searchFriendApiUrl,
        context: document.body,
        data: friendsPostData,
        success: function(data) {

            if (data.errorCode == -6 || data.errorCode == -100) {
                $scope.$root.getErrorCodeMsg(data.errorMessage,function(){},data.errorCode);
                //$location.path('/bind')
                return;
            } else if (data.errorCode < 0) {
                $scope.$root.getErrorCodeMsg(data.errorMessage);
            } else {
                $timeout(function() {

                    // $scope.friendsArray = data.result;
                    angular.forEach(data.result, function(value, key, obj) {
                        if (value.userId != $scope.form.userData.userId) {
                            value.isClick = false;
                            $scope.friendsArray.push(value);
                        }
                    })
                    $scope.showRankList = $scope.friendsArray;
                })
            }
        },
        error: function(e) {
            $scope.$root.getReadyStateMsg(e.readyState);
        }
    });

    worldPostData.searchType = "3";
    worldPostData.offset = "0";
    $.ajax({
        // type: "POST",
        url: searchFriendApiUrl,
        context: document.body,
        data: worldPostData,
        success: function(data) {
            if (data.errorCode == -6 || data.errorCode == -100) {
                $scope.$root.getErrorCodeMsg(data.errorMessage,function(){$location.path('/bind')});
                //$location.path('/bind')
                return;
            } else if (data.errorCode < 0) {
                $scope.$root.getErrorCodeMsg(data.errorMessage);
            } else {
                $timeout(function() {
                    angular.forEach(data.result, function(value, key, obj) {
                        if (value.userId != $scope.form.userData.userId) {
                            value.isClick = false;
                            $scope.worldArray.push(value);
                        }
                    })
                })
            }
        },
        error: function(e) {
            $scope.$root.getReadyStateMsg(e.readyState);
        }
    });

    $scope.friendFn = function() {
        $scope.showRankList = $scope.friendsArray;
        $scope.isFriend = true;
    }
    $scope.worldFn = function() {
        $scope.showRankList = $scope.worldArray;
        $scope.isFriend = false;
    }
    $scope.addPlayers = function(id, isClick) {
        if (!isClick) {
            $scope.form.task.players += id + ","
        } else {
            $scope.form.task.players = $scope.form.task.players.replace(id + ',', '');
        }
    }
    $scope.userTaskId = "";

    $scope.createTaskFn = function() {
        var createTaskApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + createTaskApi;
        var postData=copyData($scope.form.task);
        postData.startDate = $scope.form.task.startDate + " 00:00";
        postData.endDate = $scope.form.task.endDate + " 23:59";
        $.ajax({
            // type: "POST",
            url: createTaskApiUrl,
            context: document.body,
            data: postDatas,
            success: function(data) {
                if (data.errorCode == -6 || data.errorCode == -100) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage,function(){$location.path('/bind')});
                    //$location.path('/bind')
                    return;
                } else if (data.errorCode < 0) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                } else {
                    $timeout(function() {
                        $scope.userTaskId = data.result.userTaskId;
                        $scope.$root.showAlert('创建团战成功！',function(){$location.path('/myCommunity')})
                        //$location.path('/myCommunity');
                    })
                }
            },
            error: function(e) {
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
    }

    return;
}];