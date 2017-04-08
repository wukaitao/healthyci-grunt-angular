var JogGroupTopCtrl = ['$rootScope', '$scope', '$timeout', '$location', 'getGroupRankService',
    function ($rootScope, $scope, $timeout, $location, getGroupRankService) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "跑团排行榜";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;

    //返回
    $scope.form.leftBtnClick = function () {
        $location.path("/jogGroup");
    };
    //页面初始设置
    $scope.isLoading = false;
    $scope.rankNames = ['周', '月', '总'];
    $scope.rankType = $scope.form.rankType || 0; //0-本周，1-本月，2-总计
    $scope.rangeName = $scope.rankNames[$scope.rankType];
    $scope.pageSize = 10;//50
    $scope.pageNo = 1;
	$scope.isNoData = false;
	$scope.groups = [];
	$scope.droploader = {};
	var flag = false;
	//请求数据
	function _getGroupRankFn(rankType,callback){
	    $scope.isLoading = true;
		var callback = callback || function(){};
		var rankType = $scope.rankType;
        getGroupRankService({
            type: $scope.rankType,
            pageNo: $scope.pageNo++,
            pageSize: $scope.pageSize
        }).then(function(res) {
        	if (rankType != $scope.rankType) return;//防止弱网情况下，其他TAB的请求结果加载到当前请求结果上
        	if ($scope.pageNo == 2 && flag) return;//防止TabA快速切换到TabB再到TabA后，三个Ajax还在进行中，第一个请求返回还保存下来
            if (res.statusCode != 0) $scope.$root.getErrorCodeMsg(res.msg);
            else {
                if(!res.data || !res.data.length){
                	if($scope.pageNo == 2){
						$timeout(function(){
		                	$('.dropload-down-nodata').show();
						},100);
                	};
                }else{
                	$('.dropload-down-nodata').hide();
                };
				(!res.data || res.data.length < $scope.pageSize) && ($scope.isNoData = true);
				!!res.data && ($scope.groups = $scope.groups.concat(res.data));
                callback.call(this);
            };
            $scope.isLoading = false;
            if ($scope.pageNo == 2) flag = true;
            else flag = false;
        });
	};
	//切换排行类别
    $scope.topClick = function (rankType) {
    	//loadUpFn的设置要挪到点击切换类别处
    	//if($scope.isLoading) return;
    	if($scope.rankType == rankType && $scope.isLoading) return;
    	flag = false;
        $scope.rankType = rankType;
        $scope.rangeName = $scope.rankNames[$scope.rankType];
    	$scope.groups = [];
        $scope.pageNo = 1;
		$scope.isNoData = false;
		$scope.droploader.unlock();
		$scope.droploader.noData(false);
    	_getGroupRankFn(rankType,function(){
			//锁定
			if($scope.isNoData){
				$scope.droploader.lock('down');
				$scope.droploader.noData();
			};
			//ng-repeat遍历完后重置
			$timeout(function(){
				$scope.droploader.resetload();
			},50);
    	});
    };
    //跑团详情
    $scope.selectClick = function (groupId) {
    	$scope.form.rankType = $scope.rankType;
    	$scope.form.detailsBackPath = '/jogGroupTop';
        $location.path('/jogGroupDetails/' + groupId);
    };
	//上拉刷新下拉加载更多
    var refreshingHintDom = '<div style="text-align: center;padding: 0 15px 15px;"><img style="width: 40%;" src="images/jog/img-loading.png"></div>';
    var loadingHintDom = '<div style="text-align: center;padding: 15px;"><img style="width: 40%;" src="images/jog/img-loading.png"></div>';
    var noDataHintDom = '<div class="dropload-down-nodata" style="text-align: center;padding: 15px;display: none;">暂时没有数据</div>';
    $('.jog-group-top-list').dropload({
        scrollArea: window,
        autoLoad: true,
        domUp: {
            domClass: 'dropload-up',
            domRefresh: refreshingHintDom,
            domUpdate: refreshingHintDom,
            domLoad: refreshingHintDom
        },
        domDown: {
            domClass: 'dropload-down',
            domRefresh: loadingHintDom,
            domLoad: loadingHintDom,
            domNoData: noDataHintDom
        },
        loadUpFn: function (me) {
        	flag = false;
			$scope.groups = [];
			$scope.pageNo = 1;
			$scope.isNoData = false;
			me.unlock();
			me.noData(false);
			_getGroupRankFn($scope.rankType,function(){
				//锁定
				if($scope.isNoData){
					me.lock('down');
					me.noData();
				};
				me.direction = 'down';//修复插件BUG
				//ng-repeat遍历完后重置
				$timeout(function(){
					me.resetload();
				},50);
			});
        },
        loadDownFn: function (me) {
        	$scope.droploader = me;
        	_getGroupRankFn($scope.rankType,function(){
				//锁定
				if($scope.isNoData){
					me.lock('down');
					me.noData();
				};
				//ng-repeat遍历完后重置
				$timeout(function(){
					me.resetload();
				},50);
			});
        }
    });
}];