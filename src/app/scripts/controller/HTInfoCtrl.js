var HTInfoCtrl = ['$scope', 'form', '$location', '$timeout', '$routeParams', function($scope, form, $location, $timeout, $routeParams) {
	factoryVal.topBar.showTopBar = true;
	factoryVal.topBar.topBarTitle = "资讯";
	factoryVal.topBar.showLeftBtn = true;
	factoryVal.topBar.leftBtnType = setting.btn.backBtn;
	$scope.form = form;
	$scope.form.leftBtnClick = function() {
		$location.path("/healthyTroubleDetail/"+$routeParams.detailId);
	};
	$('.loading').show();

	var id=$routeParams.infoId;
	var htInfoApi="healthyTrouble/info/"+id+".json";
	$.ajax({
		//type: factoryVal.postType,
		url: htInfoApi,
		dataType: "json",
		success: function(data){
			$timeout(function(){
				$scope.title=data.title;
				$scope.update=data.update;
				$scope.content=data.content;
				$('.loading').hide();
				trackerApi("4-相关资讯详情","",{"infoId":data.title});
			});
		},
		error: function(e){
			$('.loading').hide();
			$scope.$root.getReadyStateMsg(e.readyState);
		}
	});
}];