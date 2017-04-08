var LineCtrl = ['$scope', '$location', 'form', '$http', 'createDialog', function($scope, $location, form, $http, createDialogService ) {
    factoryVal.topBar.showTopBar = false;
    factoryVal.topBar.topBarTitle = "健康状态";
    factoryVal.topBar.showLeftBtn = true;
    //factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.form = form;
    $scope.form.leftBtnClick = function() {
        $location.path("/myHealthy");
    }

    $scope.form.weightsLabels = ["29", "30", "31", "1", "2", "3", "4"];
    $scope.form.weightsData = [
        [122, 126, 120, 118, 120, 124, 123]
    ];

    $scope.form.stepsLabels = ["29", "30", "31", "1", "2", "3", "4"];
    $scope.form.stepsData = [
        [3650, 3800, 3600, 3550, 3600, 3710, 3680]
    ];

    $scope.form.calorieLabels = ["29", "30", "31", "1", "2", "3", "4"];
    $scope.form.calorieData = [
        [122, 126, 120, 118, 120, 124, 123]
    ];
    
     $scope.activityPopup = function() {
        createDialogService('popup/activityPopup.html', {
            id: 'activityPopup',
            title: '',
            backdrop: true,
            controller: null,
            success: {
                label: 'Success',
                fn: function() {
                    console.log('Complex modal closed');
                }
            }
        });
    };
    return;
}];
