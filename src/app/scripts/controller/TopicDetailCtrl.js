var topicDetailCtrl = ['$scope', 'form', '$location', '$timeout', '$routeParams', function($scope, form, $location, $timeout, $routeParams) {
	factoryVal.topBar.showTopBar = true;
	factoryVal.topBar.showLeftBtn = true;
	factoryVal.topBar.leftBtnType = setting.btn.backBtn;
	factoryVal.topBar.topBarTitle = "健康热门话题";
	$scope.form = form;
	$scope.form.leftBtnClick = function() {
		$location.path(localStorage.getItem("intoTopicDetail"));
	};
	$('.loading').show();
	var id=$routeParams.detailId;
    var articleLike = copyData($scope.form.userData);
    articleLike.articleId=id;

	var htInfoApi="hotTopic/detail/td"+id+".json";
	$.ajax({
		//type: factoryVal.postType,
		url: htInfoApi,
		dataType: "json",
		success: function(data){
			$timeout(function(){
				$scope.title=data.title;
				$scope.content=data.content;
				$scope.link=data.link;
				$('.loading').hide();
				trackerApi("3-健康热门话题:"+data.title,"",{"topicId":id,"UserID":$scope.form.getUserId()});
			});
		},
		error: function(e){
			$('.loading').hide();
			$scope.$root.getReadyStateMsg(e.readyState);
		}
	});

	var getArticleLikeApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getArticleLikeApi;
    $.ajax({
        type: $scope.form.postType,
        url: getArticleLikeApiUrl,
        context: document.body,
        data: articleLike,
        success: function(data) {
            if (data.errorCode == 0) {
            	$timeout(function() {
            		$scope.likeCount=data.result.count;
            		$scope.isLiked=data.result.isLiked;
            	});
            } else{
                $scope.$root.getErrorCodeMsg(data.errorMessage);
            }
        },
        error: function(e) {
            $scope.$root.getReadyStateMsg(e.readyState);
        }
    });

	$scope.like=function(){
		var saveArticleLikeApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + saveArticleLikeApi;
	    $.ajax({
	        type: $scope.form.postType,
	        url: saveArticleLikeApiUrl,
	        context: document.body,
	        data: articleLike,
	        success: function(data) {
	            if (data.errorCode == 0) {
	            	$timeout(function() {
	            		$scope.likeCount=data.result.count;
	            		$scope.isLiked=data.result.isLiked;
						trackerApi("3-健康热门话题:"+data.title,"点赞",{"topicId":id,"UserID":$scope.form.getUserId()});
	            	});
	            } else{
	                $scope.$root.getErrorCodeMsg(data.errorMessage);
	            }
	        },
	        error: function(e) {
	            $scope.$root.getReadyStateMsg(e.readyState);
	        }
	    });
	};

	$scope.path=function(url,title){
		trackerApi("3-健康热门话题:"+$scope.title,factoryVal.topBar.topBarTitle+":"+title,{"UserId":$scope.form.getUserId()});
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
}];