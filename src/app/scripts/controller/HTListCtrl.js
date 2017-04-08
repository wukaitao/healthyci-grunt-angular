var HTListCtrl = ['$scope', 'form', '$location', '$timeout', function($scope, form, $location, $timeout) {
	factoryVal.topBar.showTopBar = true;
	factoryVal.topBar.topBarTitle = "健康困扰";
	factoryVal.topBar.showLeftBtn = true;
	factoryVal.topBar.leftBtnType = setting.btn.backBtn;
	$scope.form = form;
	$scope.form.leftBtnClick = function() {
		$location.path("/myHealthy");
	};
	$('.loading').show();

	$.ajax({
		//type: factoryVal.postType,
		url: htListApi,
		dataType: "json",
		success: function(data){
			$timeout(function(){
				$scope.htlist=data.list;
				$('.loading').hide();
				trackerApi("2-健康困扰","",{"UserID":$scope.form.getUserId()});
			});
		},
		error: function(e){
			$('.loading').hide();
			$scope.$root.getReadyStateMsg(e.readyState);
		}
	});

	$scope.htDetail=function(link,title){
		localStorage.setItem("intoHTDetail",'/healthyTroubleList');
		trackerApi("2-健康困扰",title,{"UserID":$scope.form.getUserId()});
		$location.path("/healthyTroubleDetail/"+link);
	};
}];