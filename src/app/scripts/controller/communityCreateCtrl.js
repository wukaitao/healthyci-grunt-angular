var communityCreateCtrl = ['$scope', '$location', 'form', '$http', '$timeout', function($scope, $location, form, $http, $timeout) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "组团战";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;

    trackerApi("2-组团战","",{UserID:$scope.form.getUserId()});

    $scope.form = form;
    var getSysTaskListPostData = copyData($scope.form.userData);
    var getSysTaskListApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getSysTaskListApi;
    $scope.sysTaskList = {};
    $.ajax({
        // type: $scope.form.postType,
        url: getSysTaskListApiUrl,
        context: document.body,
        data: getSysTaskListPostData,
        success: function(data) {
            if (data.errorCode == -6 || data.errorCode == -100) {
                $scope.$root.getErrorCodeMsg( data.errorMessage,function (){ },data.errorCode);
                return;
            } else if (data.errorCode < 0) {
                $scope.$root.getErrorCodeMsg(data.errorMessage);
            } else {
                $timeout(function() {
                    var sysTaskList = data.result;
                   
                    for (var i = 0; i<sysTaskList.length; i++) {
                        if (sysTaskList[i].taskId=="1") {
                            sysTaskList[i].imgName="images/creat-moon-bg.jpg";
                        } else if (sysTaskList[i].taskId=="2"){
                            sysTaskList[i].imgName="images/creat-qian-bg.jpg";
                        }else
                        {
                            sysTaskList[i].imgName="images/creat-pao-bg.jpg";
                        };
                        var coin=(sysTaskList[i].coin.split(',')[0])
                        if(i!=2){
                            $scope.form.userDefined=sysTaskList[i].userDefined=coin;
                        }else{
                             $scope.form.userDefined=sysTaskList[i].userDefined="自定义";
                        }
                    };

                    $scope.form.sysTaskList = sysTaskList;

                })
            }
        },
        error: function(e) {
            $scope.$root.getReadyStateMsg(e.readyState);
        }
    });

    $scope.getCCBgClass = function(item){
        if (item.taskId == '1') {
            return "head-img text-center yi-bg";
        }else if (item.taskId == '2') {
            return "head-img text-center qian-bg";
        }else{
            return "head-img text-center";
        };
    }

    $scope.createDetailsFn = function(sysTasks) {
        if(sysTasks.taskId==1){
            trackerApi("2-组团战","稳步登天",{});
        }else if(sysTasks.taskId==2){
            trackerApi("2-组团战","千里之外",{});
        }else{
            trackerApi("2-组团战","约Pao吧",{});
        }
        $scope.form.sysTask = sysTasks;
        $timeout(function() {
            $location.path("/createDetails");
        })
    }
    $scope.form.leftBtnClick = function() {
        $location.path("/myCommunity");
    }

    return;
}];