var MailBoxCtrl = ['$scope', '$location', 'form', '$http', '$timeout', 'createDialog', function($scope, $location, form, $http, $timeout, createDialogService) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "收件箱";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.form = form;

    trackerApi("2-收件箱","",{UserID:$scope.form.getUserId()});

    $scope.friendMailStatus = 0;
    $scope.groupMailStatus = 0;

    $scope.resetMail = function() {
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
                    //$location.path('/bind')
                    return;
                } else if (data.errorCode < 0) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                } else {
                    $timeout(function() {
                        var inviteList = $scope.form.inviteList = data.result;

                        //是否有新邀请好友信息
                        $scope.friendMailStatus = data.result.some(function(o,i){
                            return !o.status;
                        });
                    })
                }
            },
            error: function(e) {
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
    }


    $scope.resetGroup = function() {
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
                    //$location.path('/bind')
                    return;
                } else if (data.errorCode < 0) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                } else {
                    $timeout(function() {
                        var groupList = data.result;
                    for (var i = 0; i<groupList.length; i++) {
                        if (groupList[i].taskId=="1") {
                            groupList[i].imageUrl="images/creat-moon-bg.jpg";
                        } else if (groupList[i].taskId=="2"){
                            groupList[i].imageUrl="images/creat-qian-bg.jpg";
                        }else
                        {
                            groupList[i].imageUrl="images/creat-pao-bg.jpg";
                        };

                    };
                        var groupList = data.result;

                        var startDate;
                        var endDate;
               
                        for (var i = 0; i < groupList.length; i++) {
                            startDate  = new Date(groupList[i].startDate);
                            endDate  = new Date(groupList[i].endDate);
                            sY = startDate.getFullYear(); // 开始年份
                            sM = startDate.getMonth()+1; // 开始月份
                            sD = startDate.getDate(); // 开始日期

                            eY = endDate.getFullYear(); // 结束年份
                            eM = endDate.getMonth()+1; // 结束月份
                            eD = endDate.getDate(); // 结束日期

                            if (eM>sM) {
                                groupList[i].schedule = sM + "月" + sD + "至" + eM + "月" + eD + "日";
                            }else{
                                groupList[i].schedule = sM + "月" + sD + "至" + eD + "日";
                            }
                        };

                        $scope.form.groupList = groupList;
                        //是否有新邀请团战信息
                        $scope.groupMailStatus=( data.result.length!=0&& data.result[0].status==0);
                            
                       
                    })
                }
            },
            error: function(e) {
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
    }
    $scope.compareDate = function(item){
        var startDate = item.startDate;
        //var nowDate = Date(long millisec);
        var nowDate = item.presentTime;
        if (nowDate-startDate>0) {
            return false;
        }else{
            return true;
        }
    }
    $scope.cancelCommunite = function(item){
        
        if (item.status ==4) {
            return true;
        };
    }

    $scope.friendFn = function() {
        trackerApi("2-收件箱","好友邀请Tab",{});
        $scope.isFriend = true;
        $scope.resetMail();
    }
    $scope.groupFn = function() {
        trackerApi("2-收件箱","团战邀请Tab",{});
        $scope.isFriend = false;
        $scope.resetGroup();
    }
    $scope.isFriend = true;
    if ($scope.form.bellClick) {
        $scope.isFriend = false;
        $scope.groupFn();
        $scope.form.bellClick = false;
    }
    $scope.accepted=function(){
//        trackerApi("2-收件箱","好友邀请-已接受按钮",{});
    }
    $scope.addFriend = function(self,friendUserId) {
		trackerApi("2-收件箱","好友邀请-接受按钮",{});
        //if(self.target.status){return}

        var acceptInviteApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + acceptInviteApi;
        var postData = copyData($scope.form.userData);

        postData.type = 1;
        postData.status = 1;
        postData.friendUserId = friendUserId;
        $.ajax({
            type: $scope.form.postType,
            url: acceptInviteApiUrl,
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
                    if (data.result.status == 1) {
                        $('#validateSuccess1').removeClass('hide');
                        setTimeout(function(){
                            $('#validateSuccess1').addClass('hide');
                            $scope.resetMail();
                        },2000)
                        //self.target.status=1;
                        //self.target.innerHTML="已是好友";
                    }else if(data.result.status == 4) {
                        // $scope.$root.showAlert("已接受");
                        // validateSuccess
                        
                        $('#validateSuccess4').removeClass('hide');
                        setTimeout(function(){
                            $('#validateSuccess4').addClass('hide');
                            $scope.resetMail();
                        },2000)
                        //self.target.status=1;
                        //self.target.innerHTML="已是好友";
                    } else {
                        $('#validateSuccess4').removeClass('hide');
                        setTimeout(function(){
                            $('#validateError').addClass('hide');
                            $scope.resetMail();
                        },2000)

                    }
                }
            },
            error: function(e) {
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
    }

$scope.showConfirmAlert=function(msg,userTaskId, inviteUserId){
    $timeout(function() {
        // if($('.healthyAssess-popup'))
        //     $('.healthyAssess-popup').remove();
        // $('#showAlertPopupTemplate').append('<div class="healthyAssess-popup text-center">'+msg+'<div class="button-area"><button class="middle-button" ng-click="$modalCancel()">取消</button><button class="middle-button" ng-click="$modalSuccess()">确定</button></div></div>')
        createDialogService({
            id: 'editPersonalPopup',
            title: '',
            template: '<div class="healthyAssess-popup text-center">'+msg+'<div class="button-area"><button class="line-twobutton" ng-click="$modalCancel()">取消</button><button class="line-twobutton" ng-click="$modalSuccess()">确定</button></div></div>',
            backdrop: true,
            controller: null,
            success: {
                fn: function(){
                    $scope.acceptInviteApiFn(userTaskId, inviteUserId)
                }
            },
            cancel:{
                fn:function(){
                    
                }
            }
        }); 
        
    });
}
$scope.acceptInviteApiFn=function(userTaskId, inviteUserId){
        var acceptInviteApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + acceptInviteApi;
        var postData = copyData($scope.form.userData);
        postData.type = 3;
        postData.status = 1;
        postData.userTaskId = userTaskId;
        postData.inviteId = inviteUserId;
        $.ajax({
            type: $scope.form.postType,
            url: acceptInviteApiUrl,
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
                    if (data.result.status == 1) {
                        // $scope.$root.showAlert("参与团战成功！");                                                
                        $('.mailbox').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon "><i class="icon-right"></i></span><span>'+'参与团战成功！'+'</span></div>')
                                setTimeout(function(){
                                    $('.errorMsgShow').remove();
                                },2000)
                        $scope.resetGroup();
                    } else {
                        // $scope.$root.showAlert("参与团战失败！");                        
                        $('.mailbox').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+'参与团战失败！'+'</span></div>')
                                setTimeout(function(){
                                    $('.errorMsgShow').remove();
                                },2000)
                        $scope.resetGroup();
                    }
                }
            },
            error: function(e) {

                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
}
    $scope.acceptInvite = function(userTaskId, inviteUserId) {
        var haveTask=0;
        for (var i = 0; i < $scope.form.taskMembers.length; i++) {
            var taskMember=$scope.form.taskMembers[i];
            if(taskMember.userId==$scope.form.userData.userId){
                haveTask=taskMember.status;
                break;
            }
        };
        trackerApi("2-收件箱","团战邀请-加入按钮",{});
        if(haveTask==1)
        {
            $scope.$root.showAlert("您正在一个团战中，无法加入其它团战");
        }else
        {
            $scope.showConfirmAlert("每人每次仅能参与一个团战，接受后将不能拒绝",userTaskId, inviteUserId); 
        }
        

        // if(!a){
        //     return;
        // }
         
    }
    $scope.resetMail();
    $scope.resetGroup();
    $scope.form.leftBtnClick = function() {
        $location.path("/myCommunity");
    }

    $scope.delMail = function(self,inviteUserId){
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
                    //$location.path('/bind')
                    return;
                } else if (data.errorCode < 0) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                } else {
                    if (data.result == 1) {
                        $('#validateSuccessDel').removeClass('hide');
                        setTimeout(function(){
                            $('#validateSuccessDel').addClass('hide');
                            $scope.resetMail();
                        },2000)
                    } else {
                         $('#validateErrorDel').removeClass('hide');
                        setTimeout(function(){
                            $('#validateErrorDel').addClass('hide');
                            $scope.resetMail();
                        },2000)
                    }
                }
            },
            error: function(e) {
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
    }

   
     $scope.delMailByGame = function(self,inviteUserId){
        var delInviteApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + delInviteApi;
        var postData = copyData($scope.form.userData);
        postData.type=2;
        postData.inviteId = inviteUserId;
        $.ajax({
            type: $scope.form.postType,
            url: delInviteApiUrl,
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
                    if (data.result == 1) {
                        // $scope.$root.showAlert("删除成功！");                                             
                        $('.mailbox').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon "><i class="icon-right"></i></span><span>'+'删除成功！'+'</span></div>')
                                setTimeout(function(){
                                    $('.errorMsgShow').remove();
                                },2000)
                        $scope.resetGroup();
                    } else {
                        // $scope.$root.showAlert("删除失败！");                                              
                        $('.mailbox').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+'删除失败！'+'</span></div>')
                                setTimeout(function(){
                                    $('.errorMsgShow').remove();
                                },2000)

                    }
                }
            },
            error: function(e) {
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
    }

     $scope.deleteBtnShow = function(){
    }
    return;
}];

app.directive('delmailaction', function() {
  return {
    restrict: 'A',
    scope: {},
    link: function(scope, elm, attr) {
        elm.find('.friend-name').on('click',function(){
            if(elm.css("margin-left")=="-90px"){
                elm.css({"margin-left":"0px"});
            }else{
                elm.css({"margin-left":"-90px"});
                $('.wrap-friend').not(elm).css({"margin-left":"0px"});
            }
        });
    }
  };
});