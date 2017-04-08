var HealthyQuestionnairesSuccessCtrl = ['$scope', '$location', 'form', 'baseDataService', 'createDialog', function($scope, $location, form, baseDataService, createDialogService){
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "健康管理";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.form = form;
	$scope.form.leftBtnClick = function(){
		$location.path('myHealthy');
	};
    $scope.page = {};
    $scope.page.tips = '感谢您的参与，您已获得100健康币。';
    $scope.page.tipsPs = '5元话费将在七个工作日内赠送。';
    $scope.page.tipsPsAdd = '注：重复提交，不能重复获得健康币。';
    
    $('.loading').hide();
	return;
}];