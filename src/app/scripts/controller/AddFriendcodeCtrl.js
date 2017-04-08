var AddFriendcodeCtrl = ['$scope', '$location', 'form', '$http','$timeout', function($scope, $location, form, $http,$timeout) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "加好友";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.form = form;
    $scope.code = "";

    trackerApi("3-输入邀请码添加好友","",{});

    $('#code').on('focus',function(){
        $('.friend-code').css('position','absolute');
        $('.friend-code').css('height','150%');
        $('html, body').stop().animate({
            'scrollTop': 150
        }, 400, 'swing');
    });

    $('#code').on('blur',function(){
    	var that = this;
        $('html, body').stop().animate({
            'scrollTop': -150
        }, 400, 'swing'); 
        $('.friend-code').css('height','');
        $('.friend-code').css('position','fixed');
    });

	$scope.$watch('code', function(newV, oldV) {
        if (newV && newV != "" && newV.length == 4) {
            trackerApi("2-加好友","输入邀请码添加好友",{});
            $('#code').blur();
            var acceptInviteApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + acceptInviteApi;
            var postData = copyData($scope.form.userData);
            postData.type = 2;
            postData.status = 1;
            postData.inviteCode = $scope.code;
            $.ajax({
                type: $scope.form.postType,
                url: acceptInviteApiUrl,
                context: document.body,
                data: postData,
                success: function(data) {
                    if (data.errorCode == -6 || data.errorCode == -100) {
                        $scope.$root.showAlert(getErrorMsg(data.errorCode,data.errorMessage),function(){},data.errorCode);
                        
                        return;
                    } else if (data.errorCode < 0) {
                        $scope.$root.showAlert(getErrorMsg(data.errorCode,data.errorMessage));
                    } else {
                        var inviteUserName = data.result.acceptUserName;
                        if (data.result.status == 1) {
                            $scope.$root.showAlert("成功添加 "+inviteUserName+" 为好友！",function(){
                                                        
                            $timeout(function(){
                                $location.path("/addFriend");
                            })
                            });
                        } else if(data.result.status == 4) {
                            $scope.$root.showAlert("与 "+inviteUserName+" 已是好友，不需重复添加");
                        }else if(data.result.status == 2) {
                            $('#validateError2').removeClass('hide');
                            setTimeout(function(){
                                $('#validateError2').addClass('hide');
                            },2000)
                        }else{
                            //alert(data.result.status)
                            //$scope.$root.showAlert("添加好友失败！");
                            $('#validateError').removeClass('hide');
                            setTimeout(function(){
                                $('#validateError').addClass('hide');
                            },2000)
                        }



                    //     if (data.result == 1) {
                    //     $scope.$root.showAlert("发送邀请成功！");
                    //     //self.target.status=1;
                    // } else {
                    //     if(data.result == 3){
                    //         $scope.$root.showAlert("已发送过邀请！");
                    //         //self.target.status=1;
                    //     }else if(data.result == 4){
                    //         $scope.$root.showAlert("已是好友！");
                    //     }else if(data.result == 2){
                    //         $scope.$root.showAlert("自己不能邀请自己！");
                    //     }else{
                    //         $scope.$root.showAlert("发送邀请失败！");
                    //     }
                    // }
                    }
                },
                error: function(e) {
                    $scope.$root.getReadyStateMsg(e.readyState);
                }
            });
        }
    });

    $scope.form.leftBtnClick = function() {
        $location.path("/addFriend");
    };

    $scope.friendMycodeFn = function() {
            $location.path("/friendMycode");
    };
        // acceptInvite
    return;
}];