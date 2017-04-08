var JoinJogGroupCtrl = ['$rootScope', '$scope', '$location', 'getRecommendGroupsService', 'getGroupListService',
    function ($rootScope, $scope, $location, getRecommendGroupsService, getGroupListService) {
        factoryVal.topBar.showTopBar = true;
        factoryVal.topBar.topBarTitle = "添加跑团";
        factoryVal.topBar.showLeftBtn = true;
        factoryVal.topBar.leftBtnType = setting.btn.backBtn;
        
    	//请求数据
		var flag = false;
    	function _getGroupListFn(callback){
    		flag = false;
    		var callback = callback || function(){};
            var params = {
                    pageNo: 1,
                    pageSize: 10,
                    groupName: $scope.form.searchJogGroup.replace(/(^\s*)|(\s*$)/g, '')
                };
            getGroupListService(params).then(function(res) {
                if (res.statusCode != 0) $scope.$root.getErrorCodeMsg(res.msg);
                else {
    				if(!res.data || !res.data.length){
						$rootScope.showToast('无记录');
						flag = false;
    				}else{
    					flag = true;
    				};
                };
                callback.call(this);
            });
    	};

        getRecommendGroupsService()
            .then(function (res) {
                if (res.statusCode != 0) {
                    $scope.$root.getErrorCodeMsg(res.msg);
                } else {
                    $scope.recommendGrouds = res.data;
                }
            });

        $scope.createClick = function() {
            $location.path("/createJogGroup");
        };

        $scope.form.leftBtnClick = function () {
            $location.path("/jogGroup");
            //history.back();
        };

        $scope.searchJogGroupLength = 0;
        $scope.searchJogGroupLimit = 40;    //字数限制
        $scope.searchJogGroupCheck = function() {
            if($scope.searchJogGroup.length > $scope.searchJogGroupLimit) {
                $scope.searchJogGroup = $scope.searchJogGroup.substring(0, $scope.searchJogGroupLimit);
            }

            $scope.searchJogGroupLength = $scope.searchJogGroup.length;
        };

        $scope.range = 'week';
        $scope.topClick = function (range) {
            $scope.range = range;
        };

        $scope.searchClick = function () {
            $scope.form.searchJogGroup = $scope.searchJogGroup || '';
            //if ($scope.form.searchJogGroup == undefined || $scope.form.searchJogGroup.length == 0) {
            //    return;
            //}
            _getGroupListFn(function(){
                if(flag){
                	$scope.form.searchBackPath = '/joinJogGroup';
                    $location.path("/searchJogGroup");
                };
            });
        };

        $scope.selectClick = function (groupId) {
            if(groupId==null || groupId==undefined) {
                $rootScope.showToast('无效跑团ID');
                return;
            }
            $scope.form.detailsBackPath = '/joinJogGroup';
            $location.path('/jogGroupDetails/' + groupId);
        };
    }];