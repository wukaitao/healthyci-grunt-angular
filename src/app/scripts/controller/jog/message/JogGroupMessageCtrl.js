var JogGroupMessageCtrl = ['$rootScope', '$scope', '$location',
    'acceptJoinGroupService', 'refuseJoinGroupService', 'delMessageService', 'getMessageService',
    function ($rootScope, $scope, $location, acceptJoinGroupService, refuseJoinGroupService, delMessageService, getMessageService) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "跑团消息";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    //返回
    $scope.form.leftBtnClick = function () {
        history.back();
    };
    
    //获取跑团消息
    function _getMessageFn(){
        getMessageService().then(function(res) {
            if (res.statusCode != 0) {
                $scope.$root.getErrorCodeMsg(res.msg);
            } else {
                $scope.groupMessages = res.data;
                //action:1-团长接受 2-团长拒绝 3-加入跑团申请 4-撤销申请 5-任命为团长 6-被移除 7-退团
            };
        });
    };
    _getMessageFn();
    
    //跑团详情
    $scope.selectClick = function () {
        $location.path('/jogGroupDetails');
    };
    //接受加入请求
    $scope.acceptClick = function (msg) {
        acceptJoinGroupService({
            groupId: msg.groupId,
            memberId: msg.userId
        }).then(function (res) {
            if (res.statusCode != 0) {
                $scope.$root.getErrorCodeMsg(res.msg);
            	if(res.statusCode == 1005){
            		_getMessageFn();
            	};
            } else {
                msg.action = 1;
            };
        });
    };
    //拒绝加入请求
    $scope.refuseClick = function (msg) {
        refuseJoinGroupService({
            groupId: msg.groupId,
            memberId: msg.userId
        }).then(function (res) {
            if (res.statusCode != 0) {
                $scope.$root.getErrorCodeMsg(res.msg);
            	if(res.statusCode == 1005){
            		_getMessageFn();
            	};
            } else {
                msg.action = 2;
            };
        });
    };
    //删除消息
    $scope.deleteClick = function (msg) {
    	delMessageService({
            groupId: msg.groupId,
            memberId: msg.userId
    	}).then(function(res){
            if (res.statusCode != 0) {
                $scope.$root.getErrorCodeMsg(res.msg);
            } else {
                $rootScope.showToast("已删除");
                msg.action = 10;
            };
    	});
    };
    //滑动出现删除按钮
    $scope.onHammer = function (event) {
        var obj = event.element;
        switch (event.direction) {
            case 2:
                obj.addClass('move-left');
                break;
            case 4:
                obj.removeClass('move-left');
                break;
        };
    };
}];