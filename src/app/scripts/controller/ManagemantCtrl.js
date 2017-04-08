var ManagemantCtrl = ['$scope', '$location', 'form', '$http', '$timeout', 'createDialog', function($scope, $location, form, $http, $timeout, createDialogService) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "活动&帮助";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.form = form;
    trackerApi("2-活动&帮助","",{});
    $scope.form.leftBtnClick = function() {
        $location.path("/myHealthy");
    }
    $scope.goTutorial = function() {
        trackerApi("2-活动&帮助","帮助",{});
        $location.path("/tutorial");
    }
    $scope.goFeedBack = function() {
        trackerApi("2-活动&帮助","意见反馈",{});
        $location.path("/feedBack");
    }
    if (localStorage.getItem("switchControl") == 'on') {
        $('.control-btn a').addClass('on');
    } else {
        $('.control-btn a').removeClass('on');
    }
    $scope.isIos;
    if (localStorage.getItem("isIos") == "true") {
        $scope.isIos = true;
    } else {
        $scope.isIos = false;
    }

    $scope.switchControl = function() {
        trackerApi("2-活动&帮助","计步器开关",{});
        if (localStorage.getItem("switchControl") == 'off') {
            setStepCounterSettingOn(true);
            // startStepCounter();
            localStorage.setItem("switchControl", 'on');
            $('.control-btn a').addClass('on');
        } else {
            $scope.confirmItem("取消后，将无法计步，确定要取消吗？");
        }
    }

    $scope.confirmItem = function(msg) {
        $timeout(function() {
            createDialogService({
                id: 'confirmItem',
                title: '',
                template: '<div class="healthyAssess-popup text-center">' + msg + '<div class="button-area"><button class="line-twobutton" ng-click="$modalCancel()">取消</button><button class="line-twobutton" ng-click="$modalSuccess()">确定</button></div></div>',
                backdrop: true,
                controller: null,
                success: {
                    fn: function() {
                        setStepCounterSettingOn(false);
                        //stopStepCounter();
                        localStorage.setItem("switchControl", 'off');
                        $('.control-btn a').removeClass('on');
                    }
                },
                cancel: {
                    fn: function() {
                        return;
                    }
                }
            });

        });
    }
    $scope.showAd = function() {
        trackerApi("2-活动&帮助","最新活动",{});
        var urlPath = $scope.form.act_ad.urlPath;
        urlPath = urlPath + "?identity=" + $scope.form.userData.userId + "&phoneNum=" + $scope.form.userData.phoneNum + "&magic=" + $scope.form.userData.session;
                    if(urlPath[0]=="#"){
                    	var strs=urlPath.substring(1).split("?");
                    	if(strs.length>1){
                    		strs[1].split("&").forEach(function(o){
                    			var param=o.split("=");
                    			$location.search(param[0],param[1]);
                    		});
                    	}
                    	$location.path(strs[0]);
                    }else location=urlPath;
//      createDialogService({
//          id: 'activityPopup',
//          title: '最新活动',
//          backdrop: true,
//          controller: null,
//          template: '<img src="'+$scope.form.act_ad.imagePath+'" style="width: 100%;" ng-click="$modalSuccess()">',
//          success: {
//              label: 'Success',
//              fn: function() {
//              	trackerApi("2-活动&帮助",$scope.desc);
//                  if(urlPath[0]=="#"){
//                  	var strs=urlPath.substring(1).split("?");
//                  	if(strs.length>1){
//                  		strs[1].split("&").forEach(function(o){
//                  			var param=o.split("=");
//                  			$location.search(param[0],param[1]);
//                  		});
//                  	}
//                  	$location.path(strs[0]);
//                  }else location=urlPath;
//              }
//          }
//      });
    }

    return;
}];
