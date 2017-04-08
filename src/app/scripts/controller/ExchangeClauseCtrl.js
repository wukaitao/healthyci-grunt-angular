var ExchangeClauseCtrl = ['$scope', 'form', '$location', '$timeout', '$routeParams', 'baseDataService',
    function($scope, form, $location, $timeout, $routeParams, baseDataService) {
	factoryVal.topBar.showTopBar = true;
	factoryVal.topBar.showLeftBtn = true;
	factoryVal.topBar.leftBtnType = setting.btn.backBtn;
	$scope.form = form;
	//初始化
	$('.loading').show();
	var productCode = $routeParams.detailId;
	var id = productCode == 'ZD' ? '1' : productCode == 'ACMB' ? '2' : productCode == 'ELCA' ? '3' : '4';
	var pagePath = location.href.substring(0,location.href.lastIndexOf('app.html'));
	$scope.isLoaded = false;
	//返回
	$scope.form.leftBtnClick = function() {
		$location.path('/exchangeDetail/' + productCode);
	};
	//获取页面数据
	function _getClause(){
		var url = pagePath + 'exchange/clause/td' + id + '.json';
		var param = {};
		var promise = baseDataService.originalHttp(url,param,{method:'get'});
		promise.then(function(data){
			$('.loading').hide();
			$scope.isLoaded = true;
			$scope.clause = data;
			$scope.form.topBar.topBarTitle = data.menu;
		});
	};
	_getClause();
}];