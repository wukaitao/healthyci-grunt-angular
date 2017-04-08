var CreateJogGroupCtrl = ['$rootScope', '$scope', '$location', '$timeout', 'createDialog', 'createGroupService', 'shareGroupMessageService', 'getGroupListService',
    function ($rootScope, $scope, $location, $timeout, createDialogService, createGroupService, shareGroupMessageService, getGroupListService) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "创建跑团";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    //初始化
    $scope.createdSuccess = false;
    $scope.isCreating = false;
//    $scope.cityList = chinaData;
    $scope.isMobile = isMobile;
    //返回
    $scope.form.leftBtnClick = function () {
        if($scope.createdSuccess) {
            $location.path("/jogGroup");
        }else {
            $location.path("/joinJogGroup");
        };
    };
    //选择省份/城市
    $scope.selectCity = function () {
    	$('.input-text').blur();
    	$timeout(function(){
        	var defaultValue = $scope.curProvinceName&&$scope.curCityName ? [$scope.curProvinceName,$scope.curCityName] : ['北京','北京'];
    		$('#cityList').mobiscroll().treelist({
        		theme: 'ios',
        		display: 'bottom',
        		mode: 'scroller',
        		lang: 'zh',
        		defaultValue: defaultValue,
        		onSelect: function(val){
        			$timeout(function(){
    	    			$scope.curProvinceName = val.split(' ')[0];
    	                $scope.curCityName = val.split(' ')[1];
        			});
        		}
        	}).mobiscroll('show');
    	},50);
    };
    //跑团名称字数限制
    $scope.groupName = '';
    $scope.groupNameLength = 0;
    $scope.groupNameLimit = 20;
    $scope.groupNameCheck = function() {
    	$scope.groupName = $scope.groupName.replace(/[\uff00-\uffff]/g,'');
        if($scope.groupName.length > $scope.groupNameLimit) $scope.groupName = $scope.groupName.substring(0, $scope.groupNameLimit);
        $scope.groupNameLength = $scope.groupName.length;
    };
    //跑团名称校验
    $scope.groupNameCheckReg = function(){
    	var reg = new RegExp('^[\u4e00-\u9fa5a-zA-Z]*$');
    	if(!reg.test($scope.groupName)){
    		$rootScope.showToast('名称只能输入中英文');
        	return false;
    	}else{
    		return true;
    	};
    };
    //跑团描述字数限制
    $scope.groupDescLength = 0;
    $scope.groupDescLimit = 100;
    $scope.groupDescMinLength = 10;
    $scope.groupDescCheck = function() {
        if ($scope.groupDesc.length > $scope.groupDescLimit) $scope.groupDesc = $scope.groupDesc.substring(0, $scope.groupDescLimit);
        $scope.groupDescLength = $scope.groupDesc.length;
    };
    $scope.groupDescLengthCheck = function(){
    	if($scope.groupDescLength < $scope.groupDescMinLength){
    		$rootScope.showToast('介绍不能少于' + $scope.groupDescMinLength + '个字');
        	return false;
    	}else{
    		return true;
    	};
    };
    //提交创建跑团申请
    $scope.submitClick = function () {
    	if($scope.isCreating) return;
        if(isNull($scope.groupName)) {
            $rootScope.showToast('名称不能为空');
            return;
        };
    	if(!$scope.groupNameCheckReg()) return;
        if(isNull($scope.curCityName)) {
            $rootScope.showToast('城市不能为空');
            return;
        };
        if(isNull($scope.groupDesc)) {
            $rootScope.showToast('介绍不能为空');
            return;
        };
    	if(!$scope.groupDescLengthCheck()) return;
        $rootScope.showConfirmAlert("确认创建跑团吗？", function () {
            $scope.isCreating = true;
			createGroupService({
			    groupName: $scope.groupName,
			    groupDesc: $scope.groupDesc,
			    province: $scope.curProvinceName,
			    city: $scope.curCityName
			}).then(function (res) {
			    $scope.isCreating = false;
		        if (res.statusCode != 0) {
		            if(res.statusCode == 1000) {
		            	//跑团名称已存在，换一个吧
		                $rootScope.showToast(res.msg);
		            }else {
		                $scope.$root.getErrorCodeMsg(res.msg);
		            };
		        } else {
		        	if(!res.data.groupId) return;
		            $('#create_jog_group').fadeOut();
		            $('#create_jog_group_ok').fadeIn();
		            $scope.groupId = res.data.groupId;
		            $scope.createdSuccess = true;
		            factoryVal.topBar.topBarTitle = "跑团创建成功";
	            };
	        });
		});
	};
	//分享
    var shareing=false;
    $scope.shareClick = function () {
    	if(shareing) return;
    	shareing = true;
        trackerApi("2-跑团","创建跑团分享",{});
        //$scope.showShareDialog(function (recommend) {
    		var title = '我正在' + $scope.groupName + '跑团一起进来玩吧！';
    		var text = '我正在' + $scope.groupName + '跑团一起进来玩吧！';
        	shareGroupMessageService({
        		groupId: $scope.groupId
        	}).then(function(res){
				if(res.statusCode != 0) $scope.$root.getErrorCodeMsg(res.msg);
				else{
					var shareUrl = delQueStr(window.location.href) + 'jog/share/share.html?shareId=' + res.data.id;
					window.location.href = 'http://CMBLS/socialShare?id=22&&type=url&title=' + title + '&text=' + text + '&url=' + shareUrl;
					//console.log('分享地址:' + shareUrl);
				};
        		shareing = false;
        	});
        //});
    };
    $scope.showShareDialog = function (success, cancel) {
    	var template = '<div class="healthyAssess-popup text-center share-dialog">' +
    				       '<div class="link">' +
    				           '<img src="images/jog/icon-jog-link.png">' +
    				           '<div>' +
    				               '<p class="title">我正在' + $scope.groupName + '跑团一起进来玩吧！</p>' +
    				               '<p class="info">我正在' + $scope.groupName + '跑团一起进来玩吧！</p>' +
    				           '</div>' +
    				       '</div>' +
    				       '<input id="share-recommend" type="text" placeholder="评论一番吧">' +
    				       '<div class="button-area">' +
    				           '<button class="line-twobutton" ng-click="$modalCancel()">取消</button>' +
    				           '<button class="line-twobutton" ng-click="$modalSuccess()">发送</button>' +
    				       '</div>' +
    				   '</div>';
        $timeout(function () {
            createDialogService({
                id: 'shareLinkPopup',
                title: '',
                template: template,
                backdrop: true,
                controller: null,
                success: {
                    fn: function () {
                        var reason = $('#share-recommend').val();

                        if (success) success(reason);
                    }
                },
                cancel: {
                    fn: function () {
                        if (cancel) cancel();
                    }
                }
            });
        });
    };
    function isNull( str ){
        if (str == undefined || str == null || str == 'undefined' || str == '') {
            return true;
        };
        return new RegExp("^[ ]+$").test(str);
    };
    $('textarea.input-text').focus(function(){
    	$('.top-menu').addClass('fixedTopmenu');
    }).blur(function(){
    	$('.top-menu').removeClass('fixedTopmenu');
    });
    var textareaEl = document.querySelector('#groupDesc');
    if('oninput' in textareaEl){
    	textareaEl.addEventListener('input',changeHeightFn,false);
    }else{
    	textareaEl.onpropertychange = changeHeightFn;
    };
    function changeHeightFn(){
    	var scrollHeight = textareaEl.scrollHeight;
    	var height = parseInt(textareaEl.style.height);
    	if(scrollHeight < height){
    		textareaEl.style.height = height - 17 + 'px';
    	}else{
    		textareaEl.style.height = scrollHeight + 'px';
    	};
    };
}];