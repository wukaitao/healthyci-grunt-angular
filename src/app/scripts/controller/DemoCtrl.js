var DemoCtrl = ['$scope', '$location', 'form', '$http', function($scope, $location, form, $http) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "demo";

    $scope.form = form;
    $scope.form.useIntroduction = function() {
        $location.path("/useIntroduction");
    }
    $scope.form.bind = function() {
        $location.path("/bind");
    }
    $scope.form.myHealthy = function() {
        $location.path("/myHealthy");
    }
    $scope.form.healthyStatus = function() {
        $location.path("/healthyStatus");
    }
    $scope.form.myCommunity = function() {
        $location.path("/myCommunity");
    }
    $scope.form.share = function() {
        $location.path("/share");
    }
    $scope.form.personalFile = function() {
        $location.path("/personalFile");
    }

    $scope.form.DataUi = function() {
        $location.path("/Data");
    }

    $scope.form.healthyTaskUi = function() {
        $location.path("/healthyTask");
    }

    $scope.form.lineUi = function() {
        $location.path("/line");
    }

    return;
}];
