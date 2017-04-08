var RulerCtrl = ['$scope', '$location', 'form', '$http', function($scope, $location, form, $http) {
    $scope.form = form;
    var heights = []
    for (var i = 60; i < 100; i++) {
        heights.push(i);
    }
    $scope.heights = heights;
    $scope.height = 70;
    //$location.path('/useIntroduction');
    $scope.labelTimes = "次";
    return;
}];