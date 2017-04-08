var topicListCtrl = ['$scope', 'form', '$location', '$timeout', function($scope, form, $location, $timeout) {
	factoryVal.topBar.showTopBar = true;
	factoryVal.topBar.topBarTitle = "健康热门话题";
	factoryVal.topBar.showLeftBtn = true;
	factoryVal.topBar.leftBtnType = setting.btn.backBtn;
	$scope.form = form;
	$scope.form.leftBtnClick = function() {
		$location.path("/myHealthy");
	};
	$('.loading').show();

	$.ajax({
		//type: factoryVal.postType,
		url: topicListApi,
		dataType: "json",
		success: function(data){
			$timeout(function(){
				$scope.topiclist=data.list;
				$('.loading').hide();
				trackerApi("2-健康热门话题","",{"UserID":$scope.form.getUserId()});
			});
		},
		error: function(e){
			$('.loading').hide();
			$scope.$root.getReadyStateMsg(e.readyState);
		}
	});

	$scope.topicDetail=function(link,title){
		localStorage.setItem("intoTopicDetail",'/topicList');
		trackerApi("2-健康热门话题",title,{"UserID":$scope.form.getUserId()});
		$location.path("/topicDetail/"+link);
	};
}];