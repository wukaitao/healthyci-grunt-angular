//HMS HEALTHY WESTERN QUIZ STRAT
var WesternQuizCtrl = ['$scope', '$location', 'form', '$timeout', 'createDialog', '$routeParams', function($scope, $location, form, $timeout, createDialogService, $routeParams) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;

    $scope.form = form;
	$scope.id=parseInt($routeParams.testId,10);
	var testTitle=["亚健康测评","体重BMI测评","饮食测评"];
    factoryVal.topBar.topBarTitle = testTitle[$scope.id];
    $scope.testList = [];
    $scope.total = 0;
    $scope.cur=0;
    var indexList = [];

	$scope.calc=function(i0,i1){
		var cur=0;
		for(var i=0;i<i0;i++){
			cur+=indexList[i];
		}
		return cur+i1;
	};

	$scope.initArray=function(i){
		return new Array(i);
	}

	var testApi="test.json";
	$.ajax({
		//type: factoryVal.postType,
		url: testApi,
		dataType: "json",
		success: function(data){
			$timeout(function(){
				$scope.testList=data[$scope.id];
				var sex=parseInt(localStorage.getItem("gender"),10);
				indexList=data[$scope.id].map(function(v){
					v.list=v.list.filter(function(v){
						if(v.sex&&v.sex!=sex) return false;
						return true;
					});
					$scope.total+=v.list.length;
					return v.list.length;
				});
				$('.loading').hide();
				trackerApi("3-健康测评详情",testTitle[$scope.id],{"UserId":$scope.form.getUserId()});
			});
		},
		error: function(e){
			$('.loading').hide();
			$scope.$root.getReadyStateMsg(e.readyState);
		}
	});

	$scope.choose=function(t,c,i0,i1){
		var cur=$scope.calc(i0,i1);
		if(cur<=$scope.cur){
			t.value=c;
			if($scope.cur==cur){
				$scope.cur++;
				$(document).scrollTop($(".test article")[$scope.cur].offsetTop-100);
			}
		}
	};

	$scope.time=function(t,v,i0,i1){
		var cur=$scope.calc(i0,i1);
		if(cur<=$scope.cur){
			$(".test article:eq("+cur+") input").mobiscroll().time({
	    		theme: 'ios',
				mode: 'scroller',
				display: 'bottom',
				lang: 'zh',
				onSelect: function(val){
					$timeout(function(){
						t.value=val;
						if($scope.cur==cur){
							$scope.cur++;
							$(document).scrollTop($(".test article")[$scope.cur].offsetTop-100);
						}
					});
				}
	    	}).mobiscroll('setValue', v).mobiscroll('show');
	    }
	};

	$scope.range=function(t,v,i0,i1){
		var cur=$scope.calc(i0,i1);
		if(cur<=$scope.cur){
			$(".test article:eq("+cur+") ul").mobiscroll().list({
	    		theme: 'ios',
				mode: 'scroller',
				display: 'bottom',
				lang: 'zh',
				onSelect: function(val){
					$timeout(function(){
						t.value=val;
						if($scope.cur==cur){
							$scope.cur++;
							$(document).scrollTop($(".test article")[$scope.cur].offsetTop-100);
						}
					});
				}
	    	}).mobiscroll('setValue', v).mobiscroll('show');
	    }
	};

	$scope.submitStatus = true;
	$scope.submit=function(){
		if($scope.cur==$scope.total&&$scope.submitStatus){
			$scope.submitStatus = false;
			$('.loading').show();
			var getSubmitEltResultApiUrl = cignaDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getSubmitEltResultApi;
			$.ajax({
				type: $scope.form.postType,
				url: getSubmitEltResultApiUrl,
				context: document.body,
				data: decodeURIComponent($("form").serialize()),
				success: function(data) {
					$timeout(function(){
						$('.loading').hide();
						$scope.submitStatus = true;
						if (data.statusCode == 200) {
								var completeWQ=JSON.parse(localStorage.getItem("completeWQ"));
								completeWQ[$scope.id] = true;
								localStorage.setItem("completeWQ",JSON.stringify(completeWQ));
								$location.path("/westernQuizReport/"+$scope.id);
						} else if (data.statusCode == 2) {
							$scope.$root.getErrorCodeMsg(data.msg, function() {}, data.statusCode);
						} else if (data.statusCode == 1) {
								$scope.$root.getErrorCodeMsg(data.msg);
						} else {
							$scope.$root.getErrorCodeMsg('服务器错误');
						}
					});
				},
				error: function(e) {
					$('.loading').hide();
					$scope.submitStatus=true;
					$scope.$root.getReadyStateMsg(e.readyState);
				}
			});
		}else $(document).scrollTop($(".test article")[$scope.cur].offsetTop-100);
	};

    $scope.form.leftBtnClick = function() {
        $timeout(function() {
            createDialogService({
                id: 'editPersonalPopup',
                title: '',
                template: '<div class="healthyAssess-popup text-center">是否放弃？<div class="button-area"><button class="line-twobutton" ng-click="$modalCancel()">取消</button><button class="line-twobutton" ng-click="$modalSuccess()">确定</button></div></div>',
                backdrop: true,
                controller: null,
                success: {
                    fn: function() {
                            $location.path(localStorage.getItem('gotowesternQuiz'));
                    }
                },
                cancel: {
                    fn: function() {
                        return;
                    }
                }
            });

        });
    }
}];
