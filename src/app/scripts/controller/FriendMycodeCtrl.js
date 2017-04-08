var FriendMycodeCtrl = ['$scope', '$location', 'form', '$http', '$timeout', function($scope, $location, form, $http, $timeout) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "邀请码";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.form = form;
    trackerApi("3-我的邀请码","",{});
    var genInviteCodeApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + genInviteCodeApi;
    $.ajax({
        type: $scope.form.postType,
        url: genInviteCodeApiUrl,
        context: document.body,
        data: $scope.form.userData,
        success: function(data) {
            if (data.errorCode == -6 || data.errorCode == -100) {
                $scope.$root.getErrorCodeMsg( data.errorMessage,function(){},data.errorCode);
               // $location.path('/bind')
                return;
            } else if (data.errorCode < 0) {
                $scope.$root.getErrorCodeMsg(data.errorMessage);
            } else {
                $timeout(function() {
                    $scope.genInviteCode = data.result.inviteCode;
                })
            }
        },
        error: function(e) {
            $scope.$root.getReadyStateMsg(e.readyState);
        }
    });

    $scope.form.leftBtnClick = function() {
        $location.path("/addFriend");
    }

    return;
}];