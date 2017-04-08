var AddFriendCtrl = ['$scope', '$location', 'form', '$http', '$timeout', function($scope, $location, form, $http, $timeout) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "加好友";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.form = form;
    $scope.searchFriend = "";
    $scope.friends = {};
    var nickName= form.userInfo.nickName;
    var nickNameTemp = 0;

    trackerApi("2-加好友","",{UserID:$scope.form.getUserId()});

    $scope.bytesCount = function(str) {
        if (str == undefined)
            return 0
        var bytesCount = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            if (/^[\u0000-\u00ff]$/.test(c)) {
                bytesCount += 1;
            } else {
                bytesCount += 2;
            }
        }
        return bytesCount;
    }

    $scope.$watch("searchFriend", function(newV, oldV) {
        var bytesCount = $scope.bytesCount(newV);
        var pat = new RegExp("[0-9a-zA-Z\u4e00-\u9fa5 ]");
        if (newV != oldV && newV != '') {
            for (var i = 0; i < newV.length; i++) {
                var newChar = newV[i];
                    if (pat.test(newChar) && bytesCount <= 20) {
                    $scope.searchFriend = newV;
                } else {
                    $scope.searchFriend = oldV;
                    return;
                }
            };
            
            
        } else {
            if (pat.test(newV) && bytesCount <= 20) {
                $scope.searchFriend = newV;
            } else {
                $scope.searchFriend = "";
            }
        }
    }, true);


    $scope.$watch("searchFriend", function(newV, oldV) {
        if (newV!=oldV&&$scope.friends.length>0) {
            $scope.friends=[];
        };                
    }, true)

    $scope.searchFriendFn = function() {
        trackerApi("2-加好友","搜索",{});
        if($scope.searchFriend==""){
            return;
        }
        var searchFriendApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + searchFriendApi;
        var postData = copyData($scope.form.userData);
        postData.searchType = "1";
        postData.searchParam = $scope.searchFriend;
        //debugger;
        if (postData.phoneNum==postData.searchParam) {
            // $scope.$root.showAlert("不能加自己为好友");
            $('.add-friend').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+"不能加自己为好友"+'</span></div>')
            setTimeout(function(){
                $('.errorMsgShow').remove();
            },2000)
            return;
        }
        $.ajax({
            type: $scope.form.postType,
            url: searchFriendApiUrl,
            context: document.body,
            data: postData,
            success: function(data) {
                if (data.errorCode == -6 || data.errorCode == -100) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage,function(){},data.errorCode);
                    //$location.path('/bind')
                    return;
                } else if (data.errorCode < 0) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                } else {
                    $timeout(function() {
                        $scope.friends = data.result;
                        if(data.result.length<=0){
                            // $scope.$root.showAlert("没有此用户！");
                            
                        $('.add-friend').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+"没有此用户！"+'</span></div>')
                                setTimeout(function(){
                                    $('.errorMsgShow').remove();
                                },2000)
                        }
                    })
                }
            },
            error: function(e) {
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
    };



    $scope.formatPhone = function(phoneNum) {
        if(phoneNum==null||phoneNum=='')
            return '';
        return phoneNum.substr(0,3)+"****"+phoneNum.substr(7);
    }

    $scope.friendMycodeFn = function() {
        trackerApi("2-加好友","产生我的邀请码",{});
        $location.path("/friendMycode");
    }
    $scope.addFriendcodeFn = function() {
        $location.path("/addFriendcode");

    }
    $scope.addFriendFn = function(self,userId) {

        if(self.target.status){return}

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
                        // $scope.$root.showAlert("发送邀请成功！");                              
                        $('.add-friend').append('<div class="submit-success text-center saveSuccess"><span class="success-icon"><i class="icon-right"></i></span><span>'+"发送邀请成功！"+'</span></div>')
                                setTimeout(function(){
                                    $('.saveSuccess').remove();
                                },2000)
                        self.target.status=1;
                        self.target.innerHTML="已发送邀请";
                    } else {
                        if(data.result == 3){
                            // $scope.$root.showAlert("已发送过邀请！");
                        $('.add-friend').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+"已发送过邀请！"+'</span></div>')
                                setTimeout(function(){
                                    $('.errorMsgShow').remove();
                                },2000)
                            self.target.status=1;
                            self.target.innerHTML="已发送邀请";
                        }else if(data.result == 5){
                            $scope.$root.showAlert("该用户已发好友邀请给您，请到收件箱接受");
                            // self.target.status=1;
                            // self.target.innerHTML="已发送邀请";
                        }else{
                            // $scope.$root.showAlert("发送邀请失败！");
                        $('.add-friend').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+"发送邀请失败！"+'</span></div>')
                                setTimeout(function(){
                                    $('.errorMsgShow').remove();
                                },2000)
                        }
                    }
                }
            },
            error: function(e) {
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
    }
    $scope.form.leftBtnClick = function() {
        $location.path("/myCommunity");
    }
    return;
}];