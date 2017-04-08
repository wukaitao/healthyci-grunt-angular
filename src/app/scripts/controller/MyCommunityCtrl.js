//MY COMMUNITY STRAT
var MyCommunityCtrl = ['$scope', '$location', 'form', '$http', '$timeout', 'createDialog', 'getMessageService', function($scope, $location, form, $http, $timeout, createDialogService, getMessageService) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "健康管理";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.form = form;
    $scope.mailBoxStatus = 0;
    $scope.userEndHour = 0;
    $scope.userEndMinutes = 0;
    $scope.userEndSecond = 0;
    $scope.needPerfect=false;
    $scope.eclipseLength = 0;
    $scope.loadingTips='加载中…';
	var d=new Date();
	d.setDate(d.getDate()-1);
	$scope.dateRange=d.getMonth()+1+"."+d.getDate();
	var day=(d.getDay()+6)%7;
	d.setDate(d.getDate()-day);
	$scope.dateRange=d.getMonth()+1+"."+d.getDate()+"-"+$scope.dateRange;

    // $timeout(function() {
    //     getDaysData();
    // }, 300)


    trackerApi("1-我的社区","",{UserID:$scope.form.getUserId()});
    
    $scope.form.leftBtnClick = function() {
        if (browser.versions.ios) {
            window.location.href = "http://cmbiphone/tool";
        } else if (browser.versions.android) {
            window.location.href = "http://cmbandroid/tool";
        } else {
            //$location.path("/bind");
        }
    }

	var getUserInfoApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getUserInfoApi;
    var userInfoPostData2 = copyData($scope.form.userData);
    userInfoPostData2.lang = "zh_CN";
    $timeout(function() {
        
        $.ajax({
            type: $scope.form.postType,
            url: getUserInfoApiUrl,
            context: document.body,
            data: userInfoPostData2,
            success: function(data) {
                if (data.errorCode == -6 || data.errorCode == -100) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage, function() {},data.errorCode);
                    return;
                } else if (data.errorCode < 0) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                } else {
                    $timeout(function() {
                        $scope.form.sex = data.result.sex;
                        $scope.form.userInfo = data.result;                      
                        if(data.result.phone==""||data.result.phone==null||data.result.nickName==null||data.result.nickName==""||data.result.nickName=="游客")
                        {
                            $scope.needPerfect=true; 
                        }  
                        $scope.userRankForSys = (form.userInfo.userRankForSys + '').split('.')[0];
                        // form.userInfo.userRankForSys
                    });
                }
            },
            error: function(e) {

                // if(e.readyState==0){
                //     $scope.errorCount++;
                // }else{
                $scope.$root.getReadyStateMsg(e.readyState);
                // } 
            }
        });
    })
    var rankListApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + rankListApi;
    var postData = copyData($scope.form.userData);
    postData.type = "1";
    postData.offset = "0";
    postData.lang = "zh_CN";

    $timeout(function() {
        
        $.ajax({
            type: $scope.form.postType,
            url: rankListApiUrl,
            context: document.body,
            data: postData,
            success: function(data) {
                if (data.errorCode == -6 || data.errorCode == -100) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage, function() {},data.errorCode);
                    return;
                } else if (data.errorCode < 0) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                } else {
                    $timeout(function() {
                        if(data.result.rankList.length==0)
                        {
                            $scope.loadingTips='亲，您还未添加好友哦，先去添加好友吧！';
                        }
                        $scope.form.rankList = data.result;
                    })
                }
            },
            error: function(e) {
                // if(e.readyState==0){
                //     $scope.errorCount++;
                // }else{
                $scope.$root.getReadyStateMsg(e.readyState);
                // } 
            }
        });
    })
    
    var inviteListPostData = copyData($scope.form.userData);
    inviteListPostData.type = 1;
    inviteListPostData.lang = "zh_CN";
    var inviteListApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + inviteListApi;
        

    $timeout(function() {
        $.ajax({
            type: $scope.form.postType,
            url: inviteListApiUrl,
            context: document.body,
            data: inviteListPostData,
            success: function(data) {
                if (data.errorCode == -6 || data.errorCode == -100) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage, function() {},data.errorCode);
                    return;
                } else if (data.errorCode < 0) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                } else {
                    $timeout(function() {
                        $scope.form.inviteList = data.result;
                        //是否有新邀请好友信息
                        data.result.forEach(function(o, i) {
                            if (!o.status) {
                                $scope.mailBoxStatus++;
                            }
                        })
                    })
                }
            },
            error: function(e) {
                // if(e.readyState==0){
                //     $scope.errorCount++;
                // }else{
                $scope.$root.getReadyStateMsg(e.readyState);
                // } 
            }
        });
    })

        var groupInviteListPostData = copyData($scope.form.userData);
        groupInviteListPostData.type = 3;
        groupInviteListPostData.lang = "zh_CN";
        var groupInviteListApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + inviteListApi;


    $timeout(function() {
    

        $.ajax({
            type: $scope.form.postType,
            url: groupInviteListApiUrl,
            context: document.body,
            data: groupInviteListPostData,
            success: function(data) {
                if (data.errorCode == -6 || data.errorCode == -100) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage, function() {},data.errorCode);
                    //$location.path('/bind')
                    return;
                } else if (data.errorCode < 0) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                } else {
                    $timeout(function() {
                        $scope.form.groupList = data.result;
                        //是否有新邀请团战信息

                        $scope.mailBoxStatus = $scope.mailBoxStatus + (data.result.length != 0 && data.result[0].status == 0) ? 1 : 0;
                    })
                }
            },
            error: function(e) {
                // if(e.readyState==0){
                //     $scope.errorCount++;
                // }else{
                $scope.$root.getReadyStateMsg(e.readyState);
                // } 
            }
        });
    })
    
    $scope.form.userTask = {};
        $scope.form.taskMembers = {};
        var getUserTaskInfoApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getUserTaskInfoApi;
        var getUserTaskInfoPostData = copyData($scope.form.userData);
        getUserTaskInfoPostData.lang = "zh_CN";
        var userId = getUserTaskInfoPostData.userId;
        $scope.form.isOwn = 0;
        $scope.gameStatus = -1; //

    $timeout(function() {
        
        $.ajax({
            type: $scope.form.postType,
            url: getUserTaskInfoApiUrl,
            context: document.body,
            data: getUserTaskInfoPostData,
            success: function(data) {
                if (data.errorCode == -6 || data.errorCode == -100) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage, function() {},data.errorCode);
                    return;
                } else if (data.errorCode < 0) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                } else {
                    $timeout(function() {
                        $scope.form.userTask = data.result.userTask;
                        if (data.result.userTask == null) {
                            $scope.gameStatus = 0;
                            return;
                        }
                        var startDate = new Date($scope.form.userTask.startDate);
                        var endDate = new Date($scope.form.userTask.endDate);
                        sY = startDate.getFullYear(); // 开始年份
                        sM = startDate.getMonth() + 1; // 开始月份
                        sD = startDate.getDate(); // 开始日期

                        eY = endDate.getFullYear(); // 结束年份
                        eM = endDate.getMonth() + 1; // 结束月份
                        eD = endDate.getDate(); // 结束日期

                        if (eM > sM) {
                            $scope.form.userTask.schedule = sM + "月" + sD + "至" + eM + "月" + eD + "日";
                        } else {
                            $scope.form.userTask.schedule = sM + "月" + sD + "至" + eD + "日";
                        }
                        var haveTask=0;
                        var members = 0;
                        var finishMember = 0;
                        if (data.result.userTask == null) {
                            $scope.isTaskEnd = false;
                        } else if (data.result.userTask.isShow == 1) {

                            $scope.isTaskEnd = true;
                        } else {
                            $scope.isTaskEnd = false;
                        }
                        if ($scope.form.userTask != null)
                            $scope.form.isOwn = $scope.form.userTask.isOwn;
                        var taskMembers = $scope.form.taskMembers = data.result.taskMembers;
                        if (taskMembers.length > 0) {
                            members = taskMembers.length; //参加人数
                            $scope.form.userTask.members = members;

                            $scope.form.taskMembers = [];

                            for (var i = 0; i < taskMembers.length; i++) {
                                if (userId == taskMembers[i].userId) {
                                    $scope.userStatus = taskMembers[i].status;
                                };
                                var taskMember = taskMembers[i];

                                if (taskMember.totalSteps >= $scope.form.userTask.targetStepNum) {
                                    finishMember = finishMember + 1; //完成人数
                                };

                                if (taskMember.userId == $scope.form.userInfo.id) {
                                    haveTask=taskMember.status;
                                    taskMember.isSelf = true;
                                    $scope.form.ownStatus = taskMembers[i].status;
                                } else {
                                    taskMember.isSelf = false;
                                }

                                $scope.form.taskMembers.push(taskMember);
                            };
                            $scope.form.userTask.finishMember = finishMember;

                        }

                        var groupCount = 0; //团战邀请0是没有 1是有
                        if ($scope.form.groupList.length != 0 && $scope.form.groupList[0].taskStatus == 0) {
                            groupCount = 1;
                        }
                        if (!data.result.userTask) {
                            $scope.gameStatus = 0; //0团战 可申请
                        } else {
                            if ($scope.form.isOwn == 1 && $scope.form.userTask.taskStatus == 0) {
                                $scope.gameStatus = 1; // 团长 待开始 taskStatus=0
                            } else if ($scope.form.isOwn == 0 && $scope.form.userTask.taskStatus == 0 && $scope.form.ownStatus == 0) {
                                if (groupCount == 0) {
                                    $scope.gameStatus = 0; //没团战邀请
                                } else {
                                    $scope.gameStatus = 2; // 团员 待通过 有团战邀请
                                }
                            } else if ($scope.form.isOwn == 0 && $scope.form.userTask.taskStatus == 0 && $scope.form.ownStatus == 1) {
                                $scope.gameStatus = 1; // 团员 待通过 
                            } else if ($scope.form.userTask.taskStatus == 1 && $scope.userStatus == 1) {
                                $scope.gameStatus = 3; //游戏进行中 ß
                            } else if ($scope.form.userTask.taskStatus == 1 && $scope.userStatus == 0) {
                                $scope.gameStatus = 0; //游戏进行中
                            } else if ($scope.form.userTask.taskStatus == 2 && $scope.isTaskEnd) {
                                $scope.gameStatus = 0; //看完团战结果 可再申请
                            } else if ($scope.form.userTask.taskStatus == 2 && !$scope.isTaskEnd&&haveTask!=0) {
                                $scope.gameStatus = 4; //未看团战结果 
                            } else if ($scope.form.userTask.taskStatus == 3 && $scope.isTaskEnd) {
                                $scope.gameStatus = 0; //看完团战结果 可再申请
                            } else if ($scope.form.userTask.taskStatus == 3 && !$scope.isTaskEnd&&haveTask!=0) {
                                $scope.gameStatus = 4; //团战失败
                            } else if ($scope.form.userTask.taskStatus == 4) {
                                $scope.gameStatus = 0;
                            } else if(($scope.form.userTask.taskStatus == 3||
                                $scope.form.userTask.taskStatus == 2) && !$scope.isTaskEnd&&haveTask==0){
                                //没有同意团战邀请
                                $scope.gameStatus = 0;
                            }
                        }

                        // 
                        if (form.userTask != null) {
                            $scope.userDay = parseInt((form.userTask.startDate - form.userTask.presentTime) / (1000 * 60 * 60 * 24), 10)
                            $scope.userHour = parseInt((form.userTask.startDate - form.userTask.presentTime) % (1000 * 60 * 60 * 24) / (1000 * 60 * 60), 10)
                            $scope.userMinutes = parseInt((form.userTask.startDate - form.userTask.presentTime) % (1000 * 60 * 60 * 24) % (1000 * 60 * 60) / (1000 * 60), 10)

                            var endDate = form.userTask.endDate;
                            var presentTime = form.userTask.presentTime;

                            var pendTime = form.userTask.startDate - form.userTask.createdTime;

                            if (form.userTask.presentTime < form.userTask.createdTime) {
                                form.userTask.presentTime = form.userTask.createdTime;
                            }

                            var eclipseTime = form.userTask.presentTime - form.userTask.createdTime;

                            $scope.eclipseLength = Math.floor(eclipseTime / pendTime * 420);


                            var timeHandle  = setInterval(function() {
                                //$scope.userEndDay = parseInt((endDate - presentTime) / (1000 * 60 * 60 * 24))
                                if (!$scope.$root) {
                                    clearInterval(timeHandle);
                                }
                                $scope.userEndHour = parseInt((endDate - presentTime) / (1000 * 60 * 60), 10);
                                $scope.userEndMinutes = parseInt((endDate - presentTime) % (1000 * 60 * 60 * 24) % (1000 * 60 * 60) / (1000 * 60), 10)
                                $scope.userEndSecond = parseInt((endDate - presentTime) % (1000 * 60 * 60 * 24) % (1000 * 60 * 60) % (1000 * 60) / 1000, 10)
                                presentTime += 1000;
                                $scope.$apply();
                            }, 1000);
                        }

                    }, 500)
                }

            },
            error: function(e) {
                // if(e.readyState==0){
                //     $scope.errorCount++;
                // }else{
                $scope.$root.getReadyStateMsg(e.readyState);
                // } 
            }
        });
    })
    $scope.getCommunityImg = function() {

        var percent = $scope.form.percent;
        var sex = $scope.form.sex;
        var leavelClass = '';
        if (percent > 80) {
            leavelClass = 'leavel-5';
        } else if (percent > 60 && percent < 81) {
            leavelClass = 'leavel-4';
        } else if (percent > 40 && percent < 61) {
            leavelClass = 'leavel-3';
        } else if (percent > 20 && percent < 41) {
            leavelClass = 'leavel-2';
        } else {
            leavelClass = 'leavel-1';
        }

        if (sex == 1) {
            leavelClass = leavelClass + '-man' + ' ' + 'running-img';
        }
        if (sex == 2) {
            leavelClass = leavelClass + '-girl' + ' ' + 'running-img';
        }
        return leavelClass;
    }


    $scope.getMCBgClass = function(item) {
        if (item.id == '1') {
            return "title clearfix yi-bg";
        } else if (item.id == '2') {
            return "title clearfix qian-bg";
        } else {
            return "title clearfix";
        };
    }


    $scope.challengeRankingFn = function() {
        trackerApi("1-我的社区","组团战",{});
        $location.path('/challengeRanking');
    }
    $scope.challenge = function(isOwn) {
        if (isOwn == 1) {
            $location.path('/challengeAdmin');
        } else {
            $location.path('/challengeUser');
        }
    }


    // var getUserTaskInfoApiUrl =apiDomain+"/"+$scope.form.userData.userId+"/"+$scope.form.userData.session+getUserTaskInfoApi;
    // // 
    // $.ajax({
    //     url: getUserTaskInfoApi,
    //     context: document.body,
    //     data: $scope.form.userData,
    //     success: function(data) {
    //     },
    //     error: function(e) {
    //         alert(e.statusText+":"+e.responseText);
    //     }
    // });
    $scope.challengeBattleFn = function() {
        trackerApi("1-我的社区","组团战",{});
        $location.path("/challengeBattle");
    }

    // var getUserTaskInfoApiUrl =apiDomain+"/"+$scope.form.userData.userId+"/"+$scope.form.userData.session+getUserTaskInfoApi;
    // // 
    // $.ajax({
    //     url: getUserTaskInfoApi,
    //     context: document.body,
    //     data: $scope.form.userData,
    //     success: function(data) {
    //     },
    //     error: function(e) {
    //         alert(e.statusText+":"+e.responseText);
    //     }
    // });


    $scope.addFriendFn = function() {
        trackerApi("1-我的社区","加好友",{});
        $location.path("/addFriend");
    }
    $scope.rankingListFn = function() {
        trackerApi("1-我的社区","好友排名",{});
        $location.path("/rankingList");
    }
    $scope.goMyHealthy = function() {
        trackerApi("1-我的健康","我的健康Tab",{});
        $location.path("/myHealthy");
    }
    $scope.personalFileFn = function() {
        trackerApi("1-我的社区","个人信息区域",{});
        $scope.form.intoPersonalFile = '/myCommunity';
        $location.path("/personalFile");
    }
    $scope.openPersonalFileFn = function() {
        trackerApi("1-我的社区","个人信息区域",{});
        $scope.form.openEditMode =  true;
        $scope.form.intoPersonalFile = '/myCommunity';
        $location.path("/personalFile");
    }
    $scope.mailBoxFn = function() {
        trackerApi("1-我的社区","消息",{});
        $location.path("/messagePortal");
    }
    $scope.communityCreateFn = function() {
        trackerApi("1-我的社区","组团战",{});
        $location.path("/communityCreate");
    }
    $scope.bellFn = function() {
        trackerApi("1-我的社区","消息",{});
        $scope.form.bellClick = true;
        $location.path("/messagePortal");
    }

    $scope.jogGroup = function() {
        trackerApi("1-我的社区","跑团",{});
        $location.path("/jogGroup");
    }

    $scope.rankingRulePopup = function() {

        createDialogService('popup/rankingRulePopup.html', {
            id: 'rankingRulePopup',
            title: '组团战规则',
            backdrop: true,
            controller: null,
            success: {
                label: 'Success',
                fn: function() {
                    trackerApi("2-团战说明","",{});
                    console.log('Complex modal closed');
                }
            },
            css: {
                "": "",

            }
        }, {
            data: null
        });
    };
    //跑团消息
    getMessageService().then(function(res) {
        if (res.statusCode != 0) {
            $scope.$root.getErrorCodeMsg(res.msg);
        } else {
        	//action:1-团长接受 2-团长拒绝 3-加入跑团申请 4-撤销申请 5-任命为团长 6-被移除 7-退团
        	res.data.forEach(function(item, index){
        		(item.action == 3 && item.isHead != 0) && ($scope.mailBoxStatus++);
        	});
        }
    });
    return;
}];
//MY COMMNITY END
