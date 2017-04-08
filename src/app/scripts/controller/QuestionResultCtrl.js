// HEALTHY QUESTION RESULT PAGE END
var QuestionResultCtrl = ['$scope', '$location', 'form', '$http', function($scope, $location, form, $http) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "初级健康评估报告";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;

    $scope.form = form;
    $scope.bankCardFn = function() {        
        localStorage.setItem("isLogin", aesEncrypt(0, ys));
        $location.path("/bind");
    }

    $scope.form.leftBtnClick=function(){
        $scope.form.reload = 1;
        $location.path("/healthyQuestion");
    }


    return;
}];
// HEALTHY QUESTION RESULT PAGE END