var RankingListCtrl = ['$scope', '$location', 'form', '$http', '$timeout', function($scope, $location, form, $http, $timeout) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "好友排行榜";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    
    trackerApi("2-排行榜","",{UserID:$scope.form.getUserId()});

    $scope.form = form;
    $scope.showFriend = true;
    $scope.isWorldListReady = false;
    $scope.isFriendListReady = false;
    $scope.loadingTips='';
    $(".loading").show();
    var rankListApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + rankListApi;
    var postData = copyData($scope.form.userData);
    postData.type = "1";
    postData.offset = "0";
    $.ajax({
        type: $scope.form.postType,
        url: rankListApiUrl,
        context: document.body,
        data: postData,
        success: function(data) {
            if (data.errorCode == -6 || data.errorCode == -100) {
                $(".loading").hide();
                $scope.$root.getErrorCodeMsg(data.errorMessage,function(){},data.errorCode);
                //$location.path('/bind')
                return;
            } else if (data.errorCode < 0) {
                $(".loading").hide();
                $scope.$root.getErrorCodeMsg(data.errorMessage);
            } else {
                $timeout(function() {                    
                    if(data.result.rankList.length==0)
                    {
                        $scope.loadingTips='亲，您还未添加好友哦，先去添加好友吧！';
                    }
                    $scope.form.rankList = data.result;
                    $scope.showRankList = data.result;
                    $scope.isFriendListReady = true;
                    $scope.hideLoading();
                })
            }
        },
        error: function(e) {

            $scope.$root.getReadyStateMsg(e.readyState);
        }
    });



    var rankListApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + rankListApi;
    var postData = copyData($scope.form.userData);
    postData.type = "2";
    $.ajax({
        type: $scope.form.postType,
        url: rankListApiUrl,
        context: document.body,
        data: postData,
        success: function(data) {
            if (data.errorCode == -6 || data.errorCode == -100) {
                $(".loading").hide();
                $scope.$root.getErrorCodeMsg(data.errorMessage,function(){},data.errorCode);
                //$location.path('/bind')
                return;
            } else if (data.errorCode < 0) {
                $(".loading").hide();
                $scope.$root.getErrorCodeMsg(data.errorMessage);
            } else {
                $timeout(function() {
                    $scope.worldList = data.result;
                    $scope.isWorldListReady = true;
                    $scope.hideLoading();
                })
            }
        },
        error: function(e) {
            $scope.$root.getReadyStateMsg(e.readyState);
        }
    });

    $scope.addFriendFn = function(self,userId) {

        //if(self.target.status){return}
        trackerApi("2-排行榜","世界排名-添加好友",{});
        var sendInviteApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + sendInviteApi;
        var sendInvitePostData = copyData($scope.form.userData);
        sendInvitePostData.type = 1;
        sendInvitePostData.inviteUserId = userId;
        $.ajax({
            type: $scope.form.postType,
            url: sendInviteApiUrl,
            context: document.body,
            data: sendInvitePostData,
            success: function(data) {
                if (data.errorCode == -6 || data.errorCode == -100) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage,function(){},data.errorCode);
                    //$location.path('/bind')
                    return;
                } else if (data.errorCode < 0) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                } else {
                    if (data.result == 1) {
                        $('#validateSuccess').removeClass('hide');
                        $('#successMsg').text("发送邀请成功！");
                        setTimeout(function(){
                            $('#validateSuccess').addClass('hide');                            
                        },2000)
                        //self.target.status=1;
                    } else {
                        if(data.result == 3){
                            $('#validateError').removeClass('hide');
                            $('#errorMsg').text("已发送过邀请！");
                            setTimeout(function(){
                                $('#validateError').addClass('hide');                            
                            },2000);
                            //self.target.status=1;
                        }else if(data.result == 4){
                            $('#validateError').removeClass('hide');
                            $('#errorMsg').text("已是好友！");
                            setTimeout(function(){
                                $('#validateError').addClass('hide');                            
                            },2000);

                        }else if(data.result == 2){
                            $('#validateError').removeClass('hide');
                            $('#errorMsg').text("自己不能邀请自己！");
                            setTimeout(function(){
                                $('#validateError').addClass('hide');                            
                            },2000);
                        }else if(data.result == 5){
                            $('#validateError').removeClass('hide');
                            $('#errorMsg').text("该用户已发好友邀请给您，请到收件箱接受");
                            setTimeout(function(){
                                $('#validateError').addClass('hide');                            
                            },2000);
                            // self.target.status=1;
                            // self.target.innerHTML="已发送邀请";
                        }else{
                            $('#validateError').removeClass('hide');
                            $('#errorMsg').text("发送邀请失败！");
                            setTimeout(function(){
                                $('#validateError').addClass('hide');                            
                            },2000);
                        }
                    }
                }
            },
            error: function(e) {
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
    }

    $scope.hideLoading = function() {
        $timeout(function(){
            if ($scope.isWorldListReady && $scope.isFriendListReady) {
                $(".loading").hide();
            }    
        }, 100)
        
    }

    $scope.showFriendBtn = function() {
        trackerApi("2-排行榜","好友排名Tab",{});
        if ($scope.isFriendListReady && $scope.isWorldListReady) {
            $scope.showRankList = $scope.form.rankList;
            $scope.showFriend = true;
        }
    }
    $scope.showWorldBtn = function() {

        trackerApi("2-排行榜","世界排名Tab",{});
        if ($scope.isFriendListReady && $scope.isWorldListReady) {
            $scope.showRankList = $scope.worldList;
            $scope.showFriend = false;
        }


        // $timeout(function(){
        //     var closestLi = $(".titleon");
        //     var firstLi  = $("#self");
        //     var height = (firstLi.offset().top - closestLi.offset().top);
        //     $(document).scrollTop(height);
        // })
    }
    $scope.form.leftBtnClick = function() {
        $location.path("/myCommunity");
    }
    
    return;
}];