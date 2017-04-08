var ExchangeListCtrl = ['$scope', 'form', '$location', '$timeout', 'createDialog', function($scope, form, $location, $timeout, createDialogService) {
	factoryVal.topBar.showTopBar = true;
	factoryVal.topBar.topBarTitle = "健康币兑换";
	factoryVal.topBar.showLeftBtn = true;
	factoryVal.topBar.leftBtnType = setting.btn.backBtn;
	$scope.form = form;
	$scope.form.leftBtnClick = function() {
		$location.path("/myHealthy");
	};
	$('.loading').show();

//	$scope.exchangelist=[];
    var request=copyData($scope.form.userData);
	$.ajax({
		type: factoryVal.postType,
		url: apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getProductListApi,
		dataType: "json",
		data: request,
		success: function(data){
			$timeout(function(){
				$scope.exchangelist=data.result;
				$('.loading').hide();
				trackerApi("2-健康币兑换列表","页面进入",{"UserID":$scope.form.getUserId()});
			});
		},
		error: function(e){
			$('.loading').hide();
			$scope.$root.getReadyStateMsg(e.readyState);
		}
	});

	$scope.exchangeDetail=function(status,link,title){
		if(status!=3&&status!=1){
			trackerApi("2-健康币兑换列表",title,{"UserID":$scope.form.getUserId()});
			$scope.form.exchangeStatus=status;
			$location.path("/exchangeDetail/"+link);
		}
//      createDialogService({
//          id: 'coinShort',
//          title: '健康币不足',
//          template: '<div class="healthyAssess-popup text-center">健康币不足</div>',
//          backdrop: true,
//          controller: null
//      });
	};
}];