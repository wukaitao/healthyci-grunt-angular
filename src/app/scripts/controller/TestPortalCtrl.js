var TestPortalCtrl = ['$scope', '$location', '$timeout', 'form',
    function($scope, $location, $timeout, form) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "健康测评";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.form = form;
    var completeWQ=JSON.parse(localStorage.getItem("completeWQ"));
    var isComplete=parseInt(localStorage.getItem("completeCQ"),10);
    var age=localStorage.getItem("age");
    if(age) age=eval(age);
    trackerApi("2-健康测评列表","",{UserID:$scope.form.getUserId()});

    $scope.form.leftBtnClick = function() {
        $location.path("/myHealthy");
    };

	$scope.westernQuizFn = function(i) {
		var testTitle=["亚健康测评","体重BMI测评","饮食测评"];
        trackerApi("2-健康测评列表",testTitle[i],{UserID:$scope.form.getUserId()});
        localStorage.setItem('gotowesternQuiz','/testPortal');
        if(completeWQ[i]) $location.path("/westernQuizReport/"+i);
        else if(age) $location.path("/westernQuiz/"+i);
        else $location.path("/ageGender/"+i);
    }
    $scope.chineseQuizFn = function() {
        trackerApi("2-健康测评列表","中医体质评估（中医）",{UserID:$scope.form.getUserId()});
        if (isComplete) $location.path("/chineseQuizReport");
        else if(age) $location.path("/chineseQuiz");
        else $location.path("/ageGender/3");
    }
}];