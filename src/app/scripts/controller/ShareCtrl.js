// SHARE PAGE STRAT
var ShareCtrl = ['$scope', '$location', 'form', '$http', function($scope, $location, form, $http) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "分享";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.form = form;
    $scope.form.leftBtnClick = function() {
        $location.path("/myHealthy");
    }
    $scope.form.btnShareNow = function() {
        $location.path("/myHealthy");
    }

    return;
}];
// SHARE PAGE END