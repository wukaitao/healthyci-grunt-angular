var SearchJogGroupCtrl = ['$rootScope', '$scope', '$timeout', '$location', 'getGroupListService',
    function ($rootScope, $scope, $timeout, $location, getGroupListService) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "查找跑团";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    
    //页面初始化
    $scope.isLoading = false;
    $scope.searchJogGroup = $scope.form.searchJogGroup;
    $scope.pageSize = 10;//10
    $scope.pageNo = 1;
	$scope.isNoData = false;
	$scope.groups = [];
	$scope.droploader = {};
	//请求数据
	function _getGroupListFn(callback){
        if($scope.isLoading) return;
	    $scope.isLoading = true;
		var callback = callback || function(){};
        var params = {
                pageNo: $scope.pageNo++,
                pageSize: $scope.pageSize,
                groupName: $scope.form.searchJogGroup.replace(/(^\s*)|(\s*$)/g, '')
            };
        //if (isNaN($scope.form.searchJogGroup) || !$scope.form.searchJogGroup.replace(/(^\s*)|(\s*$)/g, '')) params.groupName = $scope.form.searchJogGroup;
        //else params.groupId = $scope.form.searchJogGroup;
        getGroupListService(params).then(function(res) {
            $scope.isLoading = false;
            if (res.statusCode != 0) $scope.$root.getErrorCodeMsg(res.msg);
            else {
				if(!res.data || !res.data.length){
					if($scope.pageNo == 2){
						$rootScope.showToast('无记录');
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
        });
	};
    //返回
    $scope.form.leftBtnClick = function () {
        if($scope.form.searchBackPath != undefined) {
            $location.path($scope.form.searchBackPath);
            $scope.form.searchBackPath = undefined;
        }else{
            $location.path("/jogGroup");
        }
    };
	//搜索字数限制
    $scope.searchJogGroupLength = 0;
    $scope.searchJogGroupLimit = 40;
    $scope.searchJogGroupCheck = function() {
        if($scope.searchJogGroup.length > $scope.searchJogGroupLimit) {
            $scope.searchJogGroup = $scope.searchJogGroup.substring(0, $scope.searchJogGroupLimit);
        }

        $scope.searchJogGroupLength = $scope.searchJogGroup.length;
    };
    //跑团详情
    $scope.selectClick = function (groupId) {
        if(groupId==null || groupId==undefined) {
            $rootScope.showToast('无效跑团ID');
            return;
        }
        $scope.form.detailsBackPath = 'searchJogGroup';
        $location.path('/jogGroupDetails/' + groupId);
    };
    //搜索
    $scope.searchClick = function () {
        $scope.form.searchJogGroup = $scope.searchJogGroup || '';
        //if(!!$scope.form.searchJogGroup){
        	//loadUpFn的设置要挪到搜索点击处
            $scope.pageNo = 1;
        	$scope.isNoData = false;
        	$scope.groups = [];
    		$scope.droploader.unlock();
    		$scope.droploader.noData(false);
        	_getGroupListFn(function(){
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
        //}
    };

	//上拉刷新下拉加载更多
    var refreshingHintDom = '<div style="text-align: center;padding: 0 15px 15px;"><img style="width: 40%;" src="images/jog/img-loading.png"></div>';
    var loadingHintDom = '<div style="text-align: center;padding: 15px;"><img style="width: 40%;" src="images/jog/img-loading.png"></div>';
    var noDataHintDom = '<div class="dropload-down-nodata" style="text-align: center;padding: 15px;display: none;">暂时没有数据</div>';
    $('.search-jog-group-list').dropload({
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
			$scope.groups = [];
			$scope.pageNo = 1;
			$scope.isNoData = false;
			me.unlock();
			me.noData(false);
			_getGroupListFn(function(){
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
        	_getGroupListFn(function(){
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
    
    //搜索获取焦点时候改变定位
    $('#search-input').focus(function(){
    	$('.top-menu,.search-area').addClass('fixedTopmenu');
    }).blur(function(){
    	$('.top-menu,.search-area').removeClass('fixedTopmenu');
    });
}];