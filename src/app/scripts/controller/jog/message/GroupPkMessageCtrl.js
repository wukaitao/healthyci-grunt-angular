var GroupPkMessageCtrl = ['$rootScope', '$scope', '$location', '$timeout', 'createDialog',
    function($rootScope, $scope, $location, $timeout, createDialogService) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "团战消息";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;

    $scope.form.leftBtnClick = function() {
        $location.path("/messagePortal");
    };

    $scope.delMailByGame = function(self,inviteUserId,index){
		trackerApi("3-团战消息","删除",{});
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
                    return;
                } else if (data.errorCode < 0) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                } else {
                    if (data.result == 1) {
                        $('.group-pk-message').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon "><i class="icon-right"></i></span><span>'+'删除成功！'+'</span></div>')
                        $timeout(function() {$scope.form.groupList.splice(index,1);});
                        setTimeout(function(){
                            $('.errorMsgShow').remove();
                        },2000)
                    } else {
                        $('.group-pk-message').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+'删除失败！'+'</span></div>')
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

	$scope.acceptInviteApiFn=function(group){
        var acceptInviteApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + acceptInviteApi;
        var postData = copyData($scope.form.userData);
        postData.type = 3;
        postData.status = 1;
        postData.userTaskId = group.userTaskId;
        postData.inviteId = group.id;
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
                        $('.mailbox').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon "><i class="icon-right"></i></span><span>'+'参与团战成功！'+'</span></div>')
                        $timeout(function() {group.status=1;});
                        setTimeout(function(){
                            $('.errorMsgShow').remove();
                        },2000);
                    } else {
                        $('.mailbox').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+'参与团战失败！'+'</span></div>')
                        setTimeout(function(){
                            $('.errorMsgShow').remove();
                        },2000);
                    }
                }
            },
            error: function(e) {

                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
	}
	$scope.showConfirmAlert=function(msg,group){
	    $timeout(function() {
	        createDialogService({
	            id: 'editPersonalPopup',
	            title: '',
	            template: '<div class="healthyAssess-popup text-center">'+msg+'<div class="button-area"><button class="line-twobutton" ng-click="$modalCancel()">取消</button><button class="line-twobutton" ng-click="$modalSuccess()">确定</button></div></div>',
	            backdrop: true,
	            controller: null,
	            success: {
	                fn: function(){
	                    $scope.acceptInviteApiFn(group);
	                }
	            },
	            cancel:{
	                fn:function(){
	                    
	                }
	            }
	        }); 
	        
	    });
	}
	$scope.acceptInvite = function(group) {
        trackerApi("3-团战消息","接受",{});
        var haveTask=0;
        for (var i = 0; i < $scope.form.taskMembers.length; i++) {
            var taskMember=$scope.form.taskMembers[i];
            if(taskMember.userId==$scope.form.userData.userId){
                haveTask=taskMember.status;
                break;
            }
        };
        if(haveTask==1)
        {
            $scope.$root.showAlert("您正在一个团战中，无法加入其它团战");
        }else
        {
            $scope.showConfirmAlert("每人每次仅能参与一个团战，接受后将不能拒绝",group); 
        }
    }

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
                    $scope.form.groupList = data.result;
                    var startDate,endDate;
                    $scope.form.groupList.forEach(function(o,i){
                        if (o.taskId=="1") {
                            o.imageUrl="images/creat-moon-bg.jpg";
                        } else if (o.taskId=="2"){
                            o.imageUrl="images/creat-qian-bg.jpg";
                        }else{
                            o.imageUrl="images/creat-pao-bg.jpg";
                        };
                        startDate  = new Date(o.startDate);
                        endDate  = new Date(o.endDate);
                        sY = startDate.getFullYear(); // 开始年份
                        sM = startDate.getMonth()+1; // 开始月份
                        sD = startDate.getDate(); // 开始日期
                        eY = endDate.getFullYear(); // 结束年份
                        eM = endDate.getMonth()+1; // 结束月份
                        eD = endDate.getDate(); // 结束日期
                        if (sY!=eY || eM!=sM) {
                            o.schedule = sM + "月" + sD + "至" + eM + "月" + eD + "日";
                        }else{
                            o.schedule = sM + "月" + sD + "至" + eD + "日";
                        }
                    });
                })
            }
        },
        error: function(e) {
            $scope.$root.getReadyStateMsg(e.readyState);
        }
    });
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
}];