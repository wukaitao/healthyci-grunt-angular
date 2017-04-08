var TopGradeCtrl = ['$scope', '$location', 'form', '$routeParams', '$http', '$timeout', function($scope, $location, form, $routeParams, $http, $timeout) {
    $scope.form = form;
    $('.loading').show();
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "健康管理";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    factoryVal.peopleIsRuning = true;
    $scope.imgLoad = false;
    $scope.$root.isShowDownPopup = false;

    $scope.init = function() {
        $("#img").on("load", function() {
            $scope.imgLoad = true;
        });

    }

    $scope.form.leftBtnClick = function() {
        trackerApi("3-健康管理中转页","标题栏左侧返回",{});
        $scope.leftBtnClick();
    }


    $scope.$root.appVersion = $routeParams.appVersion;
    dAlert('href: ' + window.location.href)
    dAlert('$scope.$root.appVersion: ' + $scope.$root.appVersion)
        // if(browser.versions.ios){
        //     $scope.form.Version=$routeParams.appVersion;
        // }else if(browser.versions.android){
        //     $scope.form.Version=$routeParams.Version;
        // }    

    $scope.leftBtnClick = function() {
        trackerApi("3-健康管理中转页","返回",{});
        if (browser.versions.ios) {
            window.location.href = "http://cmbiphone/tool";
        } else if (browser.versions.android) {
            window.location.href = "http://cmbandroid/tool";
        }
    }


    $scope.tplogin = "";
    $scope.loginClick = function() {
        trackerApi("3-健康管理中转页","登录",{});
        window.location = $scope.tplogin;
    }
    $scope.autoLogin = function() {
        trackerApi("2-招行登录","",{});
        window.location = $scope.tplogin;
    }


    $scope.form.cmbUserId = $routeParams.cmbUserId;

    $scope.redirect = function() {
        var getRedirectApiUrl = apiDomain + "/" + redirectMD5PathApi;
        var pathUrl = "tplogins://hms-sit.test-cignacmb.com/hms-cmb/?corpno=001043&version=" + $scope.$root.appVersion;
        var data = {
            path: pathUrl
        };
        $.ajax({
            type: $scope.form.postType,
            url: getRedirectApiUrl,
            context: document.body,
            data: data,
            success: function(data) {
                dAlert("redirect success:   " + JSON.stringify(data))
                if (data.errorCode == 0) {
                    $scope.tplogin = pathUrl + '&auth=' + data.result;
                    $('.empty').removeClass('hidden');
                    if ($scope.imgLoad) {
                        $scope.autoLogin();
                    } else {
                        $("#img").on("load", function() {
                            $scope.autoLogin();
                        });
                    }
                } else {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                }
            },
            error: function(e) {
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        })
    }

    
    var isUserId = aesDecrypt(localStorage.getItem("userId"), ys);
    var isCmbUserId = aesDecrypt(localStorage.getItem("cmbUserId"), ys);
    var apiUrl = apiDomain + loginApi;
    var postData = copyData($scope.form.userData);
    if($scope.form.cmbUserId&&$scope.form.cmbUserId!=isCmbUserId){
    	postData.userId = "";
    	postData.cmbUserId = $scope.form.cmbUserId;
    }else{
    	postData.userId = isUserId;
    	postData.cmbUserId = isCmbUserId;
    }
    dAlert(JSON.stringify(postData))
    $.ajax({
        type: $scope.form.postType,
        url: apiUrl,
        context: document.body,
        data: postData,
        success: function(data) {
            $('.loading').hide();
            $timeout(function() {
                dAlert('data: ' + JSON.stringify(data))
                if (data.errorCode == 0) {
                    if (aesDecrypt(localStorage.getItem("userId"), ys) != data.result.userId) {
                        localStorage.removeItem('setLocalAnswersList');
                        localStorage.removeItem('showList');
                        localStorage.removeItem('gotowesternQuiz');
                        localStorage.removeItem('showDownDate');
                        localStorage.removeItem('adMapping');
						localStorage.removeItem("CItemID");
						localStorage.removeItem("CItemList");
                    }
                    $scope.form.userData.session = data.result.userSession;
                    $scope.form.userData.userId = data.result.userId;
                    $scope.form.userData.userAgent = window.navigator.userAgent;
                    localStorage.setItem('userId', aesEncrypt($scope.form.userData.userId, ys));
                    localStorage.setItem('userSession', aesEncrypt($scope.form.userData.session, ys));
                    if(data.result.cmbUserId) localStorage.setItem('cmbUserId', aesEncrypt(data.result.cmbUserId, ys));
                    $location.path('/myHealthy');
                    trackerApi("3-健康管理中转页","",{UserID:$scope.form.getUserId()});
                    return;
                } else if (data.errorCode == -121) {
                    $scope.redirect();

                    return;
                } else {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                }
            })
        },
        error: function(e) {
            $('.loading').hide();
            $scope.$root.getReadyStateMsg(e.readyState);
        }
    });



    $scope.init();
    return;
}];
