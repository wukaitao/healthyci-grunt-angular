var ChallengeAdminCtrl = ['$scope', '$location', 'form', '$http', '$timeout', 'createDialog', function($scope, $location, form, $http, $timeout, createDialogService) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "组团战";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.form = form;
    
    trackerApi("3-团战详情","",{});


    $(document).scrollTop(0);

    $scope.form.leftBtnClick = function() {
        $location.path("/myCommunity");
    }
    if ($scope.form.userTask.taskId == undefined) {
        $location.path("/myCommunity");
    }
    // debugger;
    $scope.taskMemberCount=0;
    $scope.taskMembers=[];
    var friend = $scope.form.rankList.rankList;
    for (var i = 0; i < $scope.form.taskMembers.length; i++) {
        var taskMember=$scope.form.taskMembers[i];
        if(!taskMember.isSelf){
            if(friend.length>0){
                for (var j = 0; j < friend.length; j++) {
                    if(friend[j].userId==taskMember.userId){
                        taskMember.isFriend=true;
                        break;
                    }
                };
            }
            $scope.taskMembers.push(taskMember);
            if(taskMember.status==1){
                $scope.taskMemberCount++;
            }

        }
    };

    // $scope.taskMembers=[];
    // $scope.taskMemberCount=0;
    // for (var i = 0; i <  $scope.form.taskMembers.length; i++) {
    //     var taskMember=$scope.form.taskMembers[i];
    //     if(taskMember.userId!=$scope.form.userInfo.id){
    //         $scope.taskMembers.push(taskMember);
    //         if(taskMember.status!=0){
    //             $scope.taskMemberCount++;
    //         }
    //     }
    // };
    // $scope.sendInvite = function(userId, taskId) {

    //     var sendInviteApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + sendInviteApi;
    //     var sendInvitePostData = copyData($scope.form.userData);
    //     sendInvitePostData.type = 2;
    //     sendInvitePostData.inviteUserId = userId;
    //     sendInvitePostData.userTaskId = taskId;
    //     $.ajax({
    //         type: $scope.form.postType,
    //         url: sendInviteApiUrl,
    //         context: document.body,
    //         data: sendInvitePostData,
    //         success: function(data) {
    //             if (data.errorCode == -6 || data.errorCode == -100) {
    //                 alert("Error no.:" + data.errorCode + " errorMessage:" + data.errorMessage);
    //                 $location.path('/bind')
    //                 return;
    //             } else if (data.errorCode < 0) {
    //                 alert("Error no.:" + data.errorCode + " errorMessage:" + data.errorMessage)
    //             } else {
    //                 if (data.result == 1) {
    //                     alert("邀请好友成功！");
    //                 } else {
    //                     alert("邀请好友失败！");
    //                 }
    //             }
    //         },
    //         error: function(e) {
    //             alert(e.statusText + ":" + e.responseText);
    //         }
    //     });
    // }

    $scope.addFriendFn = function(self, userId) {
        if (self.target.status) {
            return
        }
        trackerApi("3-团战详情","团战详情-添加好友",{});

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
                        //$scope.$root.showAlert("发送邀请成功！");        
                        $('.challenge-admin').append('<div class="submit-success text-center saveSuccess"><span class="success-icon"><i class="icon-right"></i></span><span>'+"发送邀请成功！"+'</span></div>')
                                setTimeout(function(){
                                    $('.saveSuccess').remove();
                                },2000)
                    } else {
                        if (data.result == 3) {
                            //$scope.$root.showAlert("已发送过邀请！");
                        $('.challenge-admin').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+"已发送过邀请！"+'</span></div>')
                                setTimeout(function(){
                                    $('.errorMsgShow').remove();
                                },2000)
                            // self.target.status = 1;
                            // self.target.innerHTML = "已发送邀请";
                        }else if(data.result == 4){
                            // $scope.$root.showAlert("已经是好友");

                        $('.challenge-admin').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+"已经是好友"+'</span></div>')
                                setTimeout(function(){
                                    $('.errorMsgShow').remove();
                                },2000)
                            // self.target.status=1;
                            // self.target.innerHTML="已发送邀请";
                        }else if(data.result == 5){
                            $scope.$root.showAlert("该用户已发好友邀请给您，请到收件箱接受");
                            // self.target.status=1;
                            // self.target.innerHTML="已发送邀请";
                        } else {
                            // $scope.$root.showAlert("发送邀请失败！");                            
                        $('.challenge-admin').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+"发送邀请失败！"+'</span></div>')
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
    
    $scope.getCMBgClass = function(item){
        if (item.id == '1') {
            return "list-head yi-bg";
        }else if (item.id == '2') {
            return "list-head qian-bg";
        }else{
            return "list-head";
        };
    }

    $scope.delChallengeAdminPopup = function() {
        trackerApi("3-团战详情","删除团战",{});
        createDialogService({
            id: 'editPersonalPopup',
            title: '',
            template: angular.element('#delChallengeAdminPopupTemplate'),
            backdrop: true,
            controller: null,
            success: {
                fn: function() {
                    var cancelUserTaskApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + cancelUserTaskApi;
                    var sendInvitePostData = copyData($scope.form.userData);
                    sendInvitePostData.userTaskId = $scope.form.userTask.taskId;
                    $.ajax({
                        type: $scope.form.postType,
                        url: cancelUserTaskApiUrl,
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
                                    $timeout(function(){
                                        $('#validateSuccess').addClass('hide');
                                        $location.path("/myCommunity"); 
                                    },2000)
                                    // location.reload();
                                    // $timeout(function(){
                                        
                                    // })
                                    
                                } else {
                                    $scope.$root.showAlert("删除失败！");
                                }
                            }
                        },
                        error: function(e) {
                            $scope.$root.getReadyStateMsg(e.readyState);
                        }
                    });
                }
            }
        });
    };

    return;
}];
