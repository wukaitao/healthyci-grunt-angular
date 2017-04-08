var CQuizReportDetailCtrl = ['$scope', '$location', 'form', '$http','$timeout', function($scope, $location, form, $http,$timeout) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "体质调理处方";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.form=form;
    $(document).scrollTop(0);
    $scope.form.leftBtnClick = function() {
        $location.path("/chineseQuizReport");
    }
    trackerApi("4-中医体质调理处方","",{});
    return;
}];