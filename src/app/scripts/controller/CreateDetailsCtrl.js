var CreateDetailsCtrl = ['$scope', '$location', 'form', '$http', '$timeout', function($scope, $location, form, $http, $timeout) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "组团战";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.coinChange = true; // initial is change, if coin chang is true ,need to call server reset the players' information
    $scope.form = form;

    trackerApi("3-创建团战","",{UserID:$scope.form.getUserId()});

    if ($scope.form.sysTask.coin == undefined) {
        $location.path("/communityCreate");
        return;
    }
    $scope.form.task.typeId = $scope.form.sysTask.typeId;
    $scope.form.task.taskId = $scope.form.sysTask.taskId;
    $scope.form.task.score = 0;
    $scope.form.task.taskName = $scope.form.sysTask.taskName;
    $scope.form.task.rewards = $scope.form.sysTask.onePrice + "," + $scope.form.sysTask.secondPrice + "," + $scope.form.sysTask.thirdPrice;
    $scope.form.task.steps = $scope.form.sysTask.targetStepNum;

    var stepsOpt = {
        theme: 'ios',
        lang: 'zh',
        display: 'bottom',
        defaultValue: '50000',
        onSelect: function(val) {
            // angular.element($("#height-1")).scope().setHeightValue(angular.element($("#height-1")).scope().answer.value)
        }
    }
    setTimeout(function() {
        $('.steps').mobiscroll().select(stepsOpt);
    })

    var daysOpt = {
        theme: 'ios',
        lang: 'zh',
        display: 'bottom',
        // defaultValue: '1',
        onSelect: function(val) {

            // angular.element($("#days-1")).scope().setHeightValue(angular.element($("#height-1")).scope().answer.value)
        }
    }
    setTimeout(function() {
        $('.days').mobiscroll().select(daysOpt);
    })

    //change backgroudimage
    //change backgroudimage
    var startDate = new Date(new Date().setDate(new Date().getDate() + 1));
    $scope.form.task.startDate =
        startDate.getFullYear() + "-" +
        (((startDate.getMonth() + 1) + "").length == 1 ? ("0" + (startDate.getMonth() + 1)) : (startDate.getMonth() + 1)) + "-" +
        startDate.getDate();
    var coins = $scope.form.sysTask.coin.split(',')
    $scope.coins = [];
    $scope.coin = 0;
    for (var i = 0; i < coins.length; i++) {
        // coins[i].isCheck=(i==1);
        var coin = {};
        coin.isCheck = (i == 0);
        coin.coin = coins[i];

        $scope.coins.push(coin);
        if (i == 0) {
            $scope.coin = coins[i];
        }

    };

    $scope.changeCoin = function(coins) {
        $scope.coin = coins.coin;
        for (var i = 0; i < $scope.coins.length; i++) {
            if ($scope.coins[i] == coins) {
                $scope.coins[i].isCheck = true;
            } else {
                $scope.coins[i].isCheck = false;
            }
        };
    }

    $scope.$watch("coin", function(newV, oldV) {
        if (newV != oldV) {

            //$scope.resetPlayers();
            $scope.clearPlayers();
            $scope.playersCount = 0;
            $scope.players = "";
            $scope.coinChange = true;
        }
    })
    $scope.players = "";
    $scope.day = "1";
    $scope.isFriend = true;
    $scope.playersCount = 0;

    $scope.addPlayers = function(player) {
        if($('.friendTab').hasClass('titleon')){
            trackerApi("4-选择玩家","好友Tab-选择",{});
        }

        if($('.worldTab').hasClass('titleon')){
            trackerApi("4-选择玩家","在线用户Tab-选择",{});
        }
        
        if (!player.isClick) {
            if ($scope.playersCount < 9) {
                $scope.players += player.userId + ","
            }
            $scope.playersCount += 1;
        } else {
            $scope.players = $scope.players.replace(player.userId + ",", '');
            $scope.playersCount -= 1;
        }
        if ($scope.playersCount == 10) {
            $('#validateError').removeClass('hide');
            setTimeout(function() {
                    $('#validateError').addClass('hide');
                }, 2000)
                // $scope.$root.showMsg("人数已满！");
            $scope.playersCount = 9;

            return;
        }
        player.isClick = !player.isClick;
    }
    $scope.btnConfirm = function() {
        $scope.showChoosePlayer = false;
    }
    var setCoinRuler = [];
    for (var i = 1; i < 11; i++) {
        setCoinRuler.push(50 * i);
    }
    $scope.setCoinRuler = setCoinRuler;
    $scope.coinNum = "健康币";



    $('#startDate').mobiscroll().date({
        theme: 'ios',
        mode: 'scroller',
        display: 'bottom',
        lang: 'zh',
        dateFormat: 'yyyy-mm-dd',
        minDate: startDate,
        defaultValue: startDate
    });
    $('#endDate').mobiscroll().date({
        theme: 'ios',
        mode: 'scroller',
        display: 'bottom',
        lang: 'zh',
        dateFormat: 'yyyy-mm-dd'
    });


    var startX = 0,
        startY = 0;
    $scope.closeChoosePlayerFn = function() {

        trackerApi("4-选择玩家","",{});

        $scope.showChoosePlayer = false;
    }
    $scope.choosePlayerFn = function() {
        if ($scope.coinChange) {
            $scope.resetPlayers();
        }

        $scope.form.task.lang = $scope.form.userData.lang;
        $scope.form.task.device = $scope.form.userData.device;
        $scope.form.task.deviceVerNum = $scope.form.userData.deviceVerNum;
        $scope.form.task.appVerNum = $scope.form.userData.appVerNum;
        $scope.showChoosePlayer = true;

        $scope.form.task.taskId = $scope.form.sysTask.taskId;
        // $scope.form.task.score=$scope.form.sysTask.coin;
        // $scope.form.task.taskName=$scope.form.sysTask.taskName;
        // $scope.form.task.targetStepNum=$scope.form.sysTask.targetStepNum;
        // $scope.form.task.rewards=$scope.form.sysTask.onePrice+","+$scope.form.sysTask.secondPrice+","+$scope.form.sysTask.thirdPrice;

        // $location.path("/choosePlayer");
    }

    $scope.getCDBgClass = function(item) {
        if (item == '1') {
            return "list-head text-center yi-bg";
        } else if (item == '2') {
            return "list-head text-center qian-bg";
        } else {
            return "list-head text-center";
        };
    }

    $scope.form.leftBtnClick = function() {
        $location.path("/communityCreate");
    }

    $scope.clearPlayers = function() {
         $scope.friendsArray = new Array();
        $scope.worldArray = new Array();
    }

    $scope.resetPlayers = function() {
        $('.loading').show();
        var searchFriendApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + searchFriendApi;
        var friendsPostData = copyData($scope.form.userData);
        var worldPostData = copyData($scope.form.userData);

        $scope.friendsArray = new Array();
        $scope.worldArray = new Array();

        friendsPostData.searchType = "6";
        friendsPostData.offset = "0";
        $.ajax({
            type: $scope.form.postType,
            url: searchFriendApiUrl,
            context: document.body,
            data: friendsPostData,
            success: function(data) {
                $('.loading').hide();
                if (data.errorCode == -6 || data.errorCode == -100) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage, function() {},data.errorCode);
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

                            
                            // $scope.showRankList = $scope.friendsArray;

                    })
                }
            },
            error: function(e) {
                $('.loading').hide();
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
        worldPostData.sorce = $scope.coin;
        worldPostData.searchType = "5";
        worldPostData.offset = "0";
        $.ajax({
            type: $scope.form.postType,
            url: searchFriendApiUrl,
            context: document.body,
            data: worldPostData,
            success: function(data) {
                $('.loading').hide();
                if (data.errorCode == -6 || data.errorCode == -100) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage, function() {},data.errorCode);
                    //$location.path('/bind')
                    return;
                } else if (data.errorCode < 0) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                } else {
                    $timeout(function() {
                        $scope.coinChange = false;  // get the new players' info, set the coin change to false;
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
                $('.loading').hide();
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
    }

    //$scope.resetPlayers();
    $scope.friendFn = function() {
        trackerApi("4-选择玩家","好友Tab-选择",{});
        // $scope.showRankList = $scope.friendsArray;
        $scope.isFriend = true;
    }
    $scope.worldFn = function() {
        trackerApi("4-选择玩家","在线用户Tab",{});
        // $scope.showRankList = $scope.worldArray;
        $scope.isFriend = false;
    }
    $scope.isSubmit = true;
    $scope.btnSubmit = function() {
        trackerApi("3-创建团战","确定",{});
            if ($scope.coin == "") {
                $scope.$root.showAlert("请选择押注！")
            } else if ($scope.players == "") {
                // $scope.$root.showAlert("请选择玩家！")                                       
                $('.create-details').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>' + '请选择玩家！' + '</span></div>')
                setTimeout(function() {
                    $('.errorMsgShow').remove();
                }, 2000)
            } else if ($scope.day == "") {
                $scope.$root.showAlert("请选择天数")
            } else {
                $scope.isSubmit = false;
                var nowDate = new Date();
                if ($scope.form.task.startDate == undefined) {
                    $scope.form.task.startDate = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate();
                } else {
                    nowDate = new Date($scope.form.task.startDate.replace(/-/g, '/'));
                }
                var endDate = new Date(nowDate.setDate(nowDate.getDate() + ($scope.day - 1)));
                $scope.form.task.endDate =
                    endDate.getFullYear() + "-" +
                    ((endDate.getMonth() + 1 + '').length == 1 ? "0" + (endDate.getMonth() + 1 + '') : (endDate.getMonth() + 1 + '')) + "-" +
                    endDate.getDate();

                var createTaskApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + createTaskApi;
                var postData = copyData($scope.form.task);
                postData.startDate = $scope.form.task.startDate + " 00:00";
                postData.endDate = $scope.form.task.endDate + " 23:59";
                postData.players = $scope.players;
                postData.score = $scope.coin;
                $.ajax({
                    type: "POST",
                    url: createTaskApiUrl,
                    context: document.body,
                    data: postData,
                    success: function(data) {
                        if (data.errorCode == -6 || data.errorCode == -100) {
                            $scope.isSubmit = true;
                            $scope.$root.getErrorCodeMsg(data.errorMessage, function() {},data.errorCode);
                            //$location.path('/bind')                           
                            return;
                        } else if (data.errorCode == -109) {
                            $scope.isSubmit = true;
                            $scope.$root.getErrorCodeMsg("健康币不足，无法创建团战");
                        } else if (data.errorCode < 0) {
                            $scope.isSubmit = true;
                            $scope.$root.getErrorCodeMsg(data.errorMessage);
                        } else {
                            if (data.result.userTaskId == 0) {
                                $scope.isSubmit = true;
                                return;
                            }
                            $scope.userTaskId = data.result.userTaskId;
                            $('#validateSuccess').removeClass('hide');
                            $timeout(function() {
                                    $('#validateSuccess').addClass('hide');
                                    $scope.isSubmit = true;
                                    $location.path('/myCommunity')
                                }, 2000)
                                //$scope.$root.showAlert('创建团战成功！',function(){$location.path('/myCommunity')})
                                // $location.path('/myCommunity');                            
                        }

                    },
                    error: function(e) {
                        $scope.$root.getReadyStateMsg(e.readyState);
                        $scope.isSubmit = true;
                    }
                });
            }

        }
        // popupInit();

    //var startX = 0, startY = 0;


    // $("li").each(function(){
    //     var start = touchSatrtFunc($('this'));
    //     alert(start.startX);
    //     alert(start.startY);
    // });
    // 
    //var isClick=false;
    // set ui
    // $("create-details").on('click touchsatrt',function(e){
    //     //isClick=true;
    //     //if(isClick){
    //         var liy=e.clientY;
    //         alert(liy);
    //     //}
    // });
    // $('.create-details').on(' mouseover touchend',function(e){
    //     //if(isClick){
    //         var divy=e.clientY;
    //         //isClick=false;
    //         alert(divy);
    //     //}
    // })    
    // var touch = $(this).touches[0]; //获取第一个触点
    // var x = Number(touch.pageX); //页面触点X坐标
    // var y = Number(touch.pageY); //页面触点Y坐标
    // //记录触点初始位置
    // startX = x;
    // startX = y;

    //})

    //touchstart事件
    // function touchSatrtFunc(evt){
    //     try {
    //         //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等

    //         var touch = evt.touches[0]; //获取第一个触点
    //         var x = Number(touch.pageX); //页面触点X坐标
    //         var y = Number(touch.pageY); //页面触点Y坐标
    //         //记录触点初始位置
    //         startX = x;
    //         startX = y;

    //         return startX,startX;
    //     }
    //     catch (e) {
    //         alert(e.message);
    //     }
    // }

    //touchend事件
    // function touchEndFunc(evt){
    //     try {
    //         //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
    //         nChangX = evt.changedTouches[0].pageX;
    //         nChangY = evt.changedTouches[0].pageY;
    //         if(nChangX - startX > 10){
    //             slideButton("left");
    //         }else if(nChangX - startX < -10){
    //             slideButton("right");
    //         }
    //     }
    //     catch (e) {
    //         alert('touchEndFunc：' + e.message);
    //     }
    // }


    return;
}];
