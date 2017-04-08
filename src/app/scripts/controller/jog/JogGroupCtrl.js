var JogGroupCtrl = ['$rootScope', '$scope', '$location', 'createDialog', '$timeout',
    'getStatusUserInGroupService', 'getGroupInfoService',
    function ($rootScope, $scope, $location, createDialogService, $timeout, getStatusUserInGroupService, getGroupInfoService) {
        factoryVal.topBar.showTopBar = true;
        factoryVal.topBar.topBarTitle = "跑团";
        factoryVal.topBar.showLeftBtn = true;
        factoryVal.topBar.leftBtnType = setting.btn.backBtn;

        $scope.status = -1;

        getStatusUserInGroupService().then(function(res) {
            if (res.statusCode != 0) {
                $scope.$root.getErrorCodeMsg(res.msg);
            } else {
                $scope.statusInfo = res.data;
                $scope.status = parseInt($scope.statusInfo.status);
                
                if(!$scope.statusInfo.groupId) return;
                getGroupInfoService({
                    groupId: $scope.statusInfo.groupId
                }).then(function(res) {
                    $scope.groupInfo = res.data;
                })
            }
        });

        $scope.form.leftBtnClick = function () {
            $location.path("/myCommunity");
        };

        //创建跑团
        $scope.addClick = function () {
            $location.path("/joinJogGroup");
        };

        //产看跑团详情
        $scope.selectClick = function(groupId) {
            $location.path('/jogGroupDetails/' + groupId);
        };

        //查看更多跑团
        $scope.moreClick = function() {
            $location.path("/moreJogGroup");
        };

        //查看跑团排行
        $scope.topClick = function () {
            trackerApi("2-跑团","跑团排行榜",{});
            $location.path("/jogGroupTop");
        };
    }];