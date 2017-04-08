var ExchangeResultCtrl = ['$scope', 'form', '$location', '$timeout', function($scope, form, $location, $timeout) {
	factoryVal.topBar.showTopBar = true;
	factoryVal.topBar.topBarTitle = $scope.form.exchange.status?"投保成功":"投保失败";
	factoryVal.topBar.showLeftBtn = true;
	factoryVal.topBar.leftBtnType = setting.btn.backBtn;
	$scope.form = form;
	$scope.form.leftBtnClick = function() {
		$location.path("/exchangeList");
	};
	trackerApi("4-健康币兑换投保结果",$scope.form.exchange.status?"投保成功:"+$scope.form.exchange.title:"投保失败:"+$scope.form.exchange.title,{"UserID":$scope.form.getUserId()});
}];