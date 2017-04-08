/** $scope.status 状态值说明
 * 0:      //已加入跑团
 * 1:      //已申请跑团
 * 10:     //已申请加入其他团
 * 2:      //未加入跑团
 * 20:     //已加入其他团
 **/
var JogGroupDetailsCtrl = ['$rootScope', '$scope', '$location', 'createDialog', '$timeout', '$routeParams',
    'getGroupInfoService', 'exitGroupService', 'joinGroupService', 'cancelJoinService', 'getStatusUserInGroupService', 'shareGroupMessageService',
    function ($rootScope, $scope, $location, createDialogService, $timeout, $routeParams,
	getGroupInfoService, exitGroupService, joinGroupService, cancelJoinService, getStatusUserInGroupService, shareGroupMessageService) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "跑团详情";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;

    $scope.groupId = $routeParams.groupId;
    $scope.isMobile = isMobile;
    $scope.content = {groupId:'10000',groupMemCount:'0',groupSum:'0'};
    //加载跑团信息
    if ($scope.groupId == null || $scope.groupId == undefined) {
        $rootScope.showToast('无效跑团ID');
    } else {
        getGroupInfoService({
            groupId: $scope.groupId
        }).then(function (res) {
            if (res.statusCode != 0) {
                $scope.$root.getErrorCodeMsg(res.msg);
            } else {
                $scope.content = res.data;

                getStatusUserInGroupService().then(function (res) {
                    if (res.statusCode != 0) {
                        $scope.$root.getErrorCodeMsg(res.msg);
                    } else {
                        var result = res.data;

                        $scope.isHead = result.isHead;
                        $scope.status = parseInt(result.status);
                        switch ($scope.status) {
                            case 0:     //已加入跑团
                                if (result.groupId != $scope.groupId) {
                                    $scope.status = 20; //已加入其他团
                                };
                                break;
                            case 1:     //已申请跑团
                                if (result.groupId != $scope.groupId) {
                                    $scope.status = 10; //已申请加入其他团
                                };
                                break;
                            case 2:     //未加入跑团
                                $scope.status = 2;
                                break;
                        };
                    };
                });
            };
        });
    };
    //返回
    $scope.form.leftBtnClick = function () {
        if ($scope.form.detailsBackPath != undefined) {
            if($scope.form.detailsBackPath == 'back') {
                history.back();
            };
            $location.path($scope.form.detailsBackPath);
            $scope.form.detailsBackPath = undefined;
        }else{
            $location.path("/jogGroup");
        };
    };
    //退出跑团
    $scope.quitClick = function () {
        if($scope.isHead == 1 && $scope.content.groupMemCount > 1) {
            $rootScope.showConfirmAlert("<span style='color:#929292;font-size: 16px;line-height: 16px;'>团长，请您指派下一任掌门<br>再退隐江湖吧</span>", function () {
                $location.path("/selectLeader/" + $scope.groupId);
            });
        }else {
            $rootScope.showConfirmAlert("确定要退出吗？", function () {

                exitGroupService({
                    groupId: $scope.groupId,
                    newHeadId: ''
                }).then(function (res) {
                    if (res.statusCode != 0) {
                        $scope.$root.getErrorCodeMsg(res.msg);
                    } else {
                        $rootScope.showToast("退出成功");

                        $scope.status = 2;

                        $location.path("/jogGroup");
                    };
                });
            });
        };
    };
    //分享
    var shareing=false;
    $scope.shareClick = function () {
    	if(shareing) return;
    	shareing = true;
        trackerApi("2-跑团","参加跑团分享",{});
        //$scope.showShareDialog(function (recommend) {
			var title = '我正在' + $scope.content.groupName + '跑团一起进来玩吧！';
			var text = '我正在' + $scope.content.groupName + '跑团一起进来玩吧！';
        	shareGroupMessageService({
        		groupId: $scope.content.groupId
        	}).then(function(res){
				if(res.statusCode != 0) $scope.$root.getErrorCodeMsg(res.msg);
				else{
					var shareUrl = delQueStr(window.location.href) + 'jog/share/share.html?shareId=' + res.data.id;
					window.location.href = 'http://CMBLS/socialShare?id=22&&type=url&title=' + title + '&text=' + text + '&url=' + shareUrl;
					//console.log('分享地址:' + shareUrl);
				};
        		shareing = false;
        	});
        //});
    };
    //申请加入跑团
    $scope.applyClick = function () {
        $scope.showApplyDialog(function (reason) {
            joinGroupService({
                groupId: $scope.groupId,
                reasons: reason
            }).then(function (res) {
                if (res.statusCode != 0) {
                    $scope.$root.getErrorCodeMsg(res.msg);
                } else {
                    $scope.status = 1;

                    $rootScope.showToast('申请成功，等待审核');
                    
                    $scope.form.searchBackPath = undefined;
                    $scope.form.detailsBackPath = '/jogGroup';
                    
                    $location.path("/jogGroup");
                };
            });
        });
    };
    //撤销申请
    $scope.cancelApplyClick = function () {
        $rootScope.showConfirmAlert("确定要撤销吗？", function () {
            cancelJoinService({
                groupId: $scope.groupId
            }).then(function (res) {
                if (res.statusCode != 0) {
                    $scope.$root.getErrorCodeMsg(res.msg);
                } else {
                    $rootScope.showToast("撤销成功");

                    $scope.status = 2;

                    $location.path("/jogGroup");
                };
            });
        });
    };
    //排行榜
    $scope.topClick = function () {
        $location.path('joggersTop/' + $scope.groupId);
    };
    //跑团成员
    $scope.membersClick = function () {
        $location.path('jogGroupMembers/' + $scope.groupId);
    };

    $scope.showApplyDialog = function (success, cancel) {
    	var template = '<div class="healthyAssess-popup text-center">' +
    				       '<input id="apply-reason" type="text" maxlength="100" placeholder="请填写加入的理由">' +
    				       '<div class="button-area">' +
    				           '<button class="line-twobutton" ng-click="$modalCancel()">取消</button>' +
    				           '<button class="line-twobutton" ng-click="$modalSuccess()">提交申请</button>' +
    				       '</div>' +
    				   '</div>';
        $timeout(function () {
            createDialogService({
                id: 'editPersonalPopup',
                title: '',
                template: template,
                backdrop: true,
                controller: null,
                success: {
                    fn: function () {
                        var reason = $('#apply-reason').val();

                        if(isNull(reason)) {
                            $rootScope.showToast("理由不能为空");
                            return false;
                        }else if(reason.length<2){
                            $rootScope.showToast("理由不能少于2个字符");
                            return false;
                        }else {
                            var limit = 100;
                            if(reason.length > limit) {
                                reason = reason.substring(0, limit);
                            }
                            if (success) success(reason);
                        };
                    }
                },
                cancel: {
                    fn: function () {
                        if (cancel) cancel();
                    }
                }
            });
        });
    };
    $scope.showShareDialog = function (success, cancel) {
    	var template = '<div class="healthyAssess-popup text-center share-dialog">' +
    				       '<div class="link">' +
    				           '<img src="images/jog/icon-jog-link.png">' +
    				           '<div>' +
    				               '<p class="title">我正在' + $scope.content.groupName + '跑团一起进来玩吧！</p>' +
    				               '<p class="info">我正在' + $scope.content.groupName + '跑团一起进来玩吧！</p>' +
    				           '</div>' +
    				       '</div>' +
    				       '<input id="share-recommend" type="text" placeholder="评论一番吧">' +
    				       '<div class="button-area">' +
    				           '<button class="line-twobutton" ng-click="$modalCancel()">取消</button>' +
    				           '<button class="line-twobutton" ng-click="$modalSuccess()">发送</button>' +
    				       '</div>' +
    				   '</div>';
        $timeout(function () {
            createDialogService({
                id: 'shareLinkPopup',
                title: '',
                template: template,
                backdrop: true,
                controller: null,
                success: {
                    fn: function () {
                        var reason = $('#share-recommend').val();

                        if (success) success(reason);
                    }
                },
                cancel: {
                    fn: function () {
                        if (cancel) cancel();
                    }
                }
            });
        });
    };
    function isNull( str ){
        if(str==undefined || str==null || str=='undefined' || str=="") {
            return true;
        };
        return new RegExp("^[ ]+$").test(str);
    };
}];