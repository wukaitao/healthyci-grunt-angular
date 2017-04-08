var BankCardCtrl = ['$scope', '$location', 'form', '$http', function($scope, $location, form, $http) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "输入银行卡";
    $scope.form = form;
    $scope.form.bankCardLogin = function() {
        localStorage.setItem("isBankCard", aesEncrypt(1, ys));
        $location.path("/bind");
    }
    return;
}];
