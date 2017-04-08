var HTDetailCtrl = ['$scope', 'form', '$location', '$timeout', '$routeParams', 'baseDataService', function($scope, form, $location, $timeout, $routeParams, baseDataService) {
	factoryVal.topBar.showTopBar = true;
	factoryVal.topBar.showLeftBtn = true;
	factoryVal.topBar.leftBtnType = setting.btn.backBtn;
	$scope.form = form;
	$scope.form.leftBtnClick = function() {
		$location.path(localStorage.getItem("intoHTDetail"));
	};
	$('.loading').show();

	var id=$routeParams.detailId;
	var htDetailApi="healthyTrouble/detail/"+id+".json";
	$.ajax({
		//type: factoryVal.postType,
		url: htDetailApi,
		dataType: "json",
		success: function(data){
			$timeout(function(){
				factoryVal.topBar.topBarTitle=data.title;
				$scope.summary=data.summary;
				$scope.img=data.img;
				$scope.content=data.content;
				$scope.infos=data.infos;
				$scope.link=data.link;
				$('.loading').hide();
				trackerApi("3-健康困扰详情",data.title,{"UserId":$scope.form.getUserId()});
			});
		},
		error: function(e){
			$('.loading').hide();
			$scope.$root.getReadyStateMsg(e.readyState);
		}
	});

	$scope.htInfo=function(link,title){
		trackerApi("3-健康困扰详情",factoryVal.topBar.topBarTitle+":相关资讯",{"infoId":title,"UserId":$scope.form.getUserId()});
		$location.path("/healthyTroubleInfo/"+id+"/"+link);
	};

	$scope.showIndex=-1;
	var initTop=0;
	$scope.htDetailShow=function(i,title){
		if(!initTop) initTop=$(".ht-main section")[0].offsetTop-44;
		trackerApi("3-健康困扰详情",factoryVal.topBar.topBarTitle+":"+title,{"UserId":$scope.form.getUserId()});
		if($scope.showIndex==i) $scope.showIndex=-1;
		else{
			$scope.showIndex=i;
			$(window).scrollTop(initTop+i*47);
		}
	};

	$scope.path=function(url,title){
		trackerApi("3-健康困扰详情",factoryVal.topBar.topBarTitle+":"+title,{"UserId":$scope.form.getUserId()});
		if(url[0]=="#") $location.path(url.substring(1));
		else if(url[0]=="!"){
			var p=url.split("!");
			var base="://"+location.host+location.pathname.substring(0,location.pathname.indexOf("/app.html"))+"/http/";
			var returnUrl=encodeURIComponent(location.href);
			if(p[3]==''){
				location=p[1]+base+p[2]+"?"+returnUrl;
			}else{
				location=p[1]+base+p[2]+"?"+p[3].split(",").map(function(o){
					var t=o.split(":");
					if(t[1]=="userid") return t[0]+"="+$scope.form.getUserId();
					else if(t[1]=="returnurl") return t[0]+"="+returnUrl;
					else return t[0]+"="+encodeURIComponent(t[1]);
				}).join("&");
			}
		}else location=url;
	};
	
	//完成健康困扰任务
	var _getTaskTrouble = function(){
    	var param = copyData($scope.form.userData);
    	var url = apiDomain + '/' + $scope.form.userData.userId + '/' + $scope.form.userData.session + getTaskTroubleApi;
		var promise = baseDataService.originalHttp(url,param);
		promise.then(function(data){},function(err){});
	}; 
	_getTaskTrouble();
}];