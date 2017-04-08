var AgeGender = ['$scope', '$location', '$timeout', 'form', '$routeParams',
    function($scope, $location, $timeout, form, $routeParams) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "您的性别/年龄";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.form = form;
    $scope.sex = form.userInfo.sex;
    $scope.age = form.userInfo.age;
    $scope.isSaveClick=true;
    trackerApi("3-性别年龄","",{UserID:$scope.form.getUserId()});
    var id=$routeParams.testId;

    $scope.form.leftBtnClick = function() {
        $location.path("/testPortal");
    };

    $scope.setSex = function(s){
    	$scope.sex=s;
    };

    $scope.setAge = function(a){
    	$scope.age=a;
    };

	$scope.submit=function(){
		if($scope.sex&&$scope.age&&$scope.isSaveClick){
			$scope.isSaveClick=false;
	        var saveUserProfileApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + saveUserProfileApi;
	        var postData = copyData($scope.form.userData);
	        postData.sex = $scope.sex;
	        postData.age = $scope.age;
	        $.ajax({
	            type: $scope.form.postType,
	            url: saveUserProfileApiUrl,
	            context: document.body,
	            data: postData,
	            success: function(data) {
	            	$timeout(function(){
	                    $scope.isSaveClick=true;
		                if (data.errorCode == -6 || data.errorCode == -100) {
		                    $scope.$root.getErrorCodeMsg(data.errorMessage,function(){},data.errorCode);
		                } else if (data.errorCode < 0) {
		                    $scope.$root.getErrorCodeMsg(data.errorMessage);
		                } else if (data.result && data.errorCode == 0){
						    form.userInfo.sex = $scope.sex;
						    form.userInfo.age = $scope.age;
	                        localStorage.setItem("gender",$scope.sex);
	                        localStorage.setItem("age",!!$scope.age);
	                        if(id==3) $location.path("/chineseQuiz");
		                    else $location.path("/westernQuiz/"+id);
		                }
	            	});
	            },
	            error: function(e) {
	                $scope.isSaveClick=true;
	                $scope.$root.getReadyStateMsg(e.readyState);
	            }
	        });
		}
	};
}];