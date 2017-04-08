//HEALTHY TASK STRAT
var HealthyTaskCtrl = ['$scope', '$location', 'form', '$http', '$timeout', 'createDialog', function($scope, $location, form, $http, $timeout, createDialogService) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "健康任务";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;

    $scope.goHealthyTaskSet = function() {
        trackerApi("2-健康任务","任务设置",{});
        $location.path("/healthyTaskSet");
    }
    $scope.changeTargetStep = function() {
        trackerApi("2-健康任务","修改目标步数",{});
        $location.path("/healthyTaskSet");
    }
    trackerApi("2-健康任务","",{UserID:$scope.form.getUserId()});

    $scope.category = [];
    $scope.serverCategory = {};
    $scope.weight = 55;
    $scope.smoke = 0;
    $scope.weightValue = "";
    $scope.setWeightValue = function(val) {
        $timeout(function() {
            $scope.weightValue = val;
        })
    }
    var getHealthyTaskApiUrl = cignaDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getHealthyTaskRecordApi;
    var getHealthyTaskUpdateApiUrl = cignaDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getHealthyTaskRecordUpdateApi;

    var CONST_COMPLETE = 1;
    var CONST_INCOMPLETE = 0;
    var CONST_WALKING_ITEM = "0521"; //Item number from server
    var CONST_SMOKE_ITEM = "0602";
    var CONST_WATER_ITEM = "0201";
    var CONST_WEIGHT_ITEM = "0801";
    var weightRuler = [];
    var smokeRuler = [];

    for (var i = 30; i < 121; i++) {
        weightRuler.push(i);
    }

    for (var i = 0; i < 100; i++) {
        smokeRuler.push(i);
    }

    $scope.weightRuler = weightRuler;
    $scope.smokeRuler = smokeRuler;

    $scope.showTip = function(msg) {
        $timeout(function() {
            createDialogService({
                id: 'editPersonalPopup',
                title: '',
                template: '<div class="healthyAssess-popup text-center">' + '每日完成健康任务并记录，赢取健康币！' + '<div class="button-area"><button class="long-button" ng-click="$modalSuccess()">明白</button></div></div>',
                backdrop: true,
                controller: null,
                success: {
                    fn: function() {
                        localStorage.setItem("showTip", 'off');
                    }
                },
                cancel: {
                    fn: function() {
                        localStorage.setItem("showTip", 'off');
                    }
                }
            });
        });
    }
    $scope.showUpdateTip = function(msg) {
        $timeout(function() {
            createDialogService({
                id: 'editPersonalPopup',
                title: '',
                template: msg,
                backdrop: true,
                controller: null,
                success: {
                    fn: function() {
                        $location.path('/healthyStatus')
                    }
                },
                cancel: {
                    fn: function() {}
                }
            });
        });
    }
    if (!localStorage.getItem("showTip"))
        localStorage.setItem("showTip", 'on');
    if (localStorage.getItem("showTip") == 'on') {
        $scope.showTip();
    }
    $scope.form.leftBtnClick = function() {
        if ($scope.form.isWQR) {
        	var id=$scope.form.isWQR;
            $scope.form.isWQR=0;
            $location.path("/westernQuizReport/"+id);
        } else {
            $location.path("/myHealthy");
        }
    }

    $scope.getTitleClass = function(item) {
        var cssClass = "font-grey";
        if (item.isComplete == CONST_INCOMPLETE) {
            cssClass = "font-grey"
        } else {
            cssClass = "font-blue"
        }

        return cssClass;
    }

    $scope.getButtonClass = function(item) {

        var cssClass = "check-button uncheck-button";
        if (item.isComplete == CONST_INCOMPLETE) {
            cssClass = "check-button uncheck-button"
        } else {
            cssClass = "check-button checked"
        }

        if (item.id == CONST_WALKING_ITEM) {
            //WALKING
            cssClass = "";
        }
        return cssClass;

    }

    $scope.getButtonIconClass = function(item) {
        var cssClass = "icon-right";
        if (item.isComplete == CONST_INCOMPLETE) {
            cssClass = "icon-right"
        } else {
            cssClass = "icon-right"
        }

        if (item.id == CONST_WALKING_ITEM) {
            //WALKING
            cssClass = "";
        }
        return cssClass;
    }
    $scope.isSubmit = false;
    $scope.submitTask = function() {
        trackerApi("2-健康任务","提交",{});
        $scope.isSubmit = true;
        var data = {
            data: JSON.stringify({
                "category": $scope.category
            })
        };

        $.ajax({
            type: $scope.form.postType,
            url: getHealthyTaskUpdateApiUrl,
            context: document.body,
            data: data,
            success: function(data) {
                if (data.statusCode == 2) {
                    $scope.$root.getErrorCodeMsg(data.msg, function() {}, data.statusCode);
                    $scope.isSubmit = false;
                    return;
                }
                if (data.statusCode != 200) {
                    if (data.statusCode == 1) {
                        $scope.$root.getErrorCodeMsg(data.msg);
                    } else {
                        $scope.$root.getErrorCodeMsg('服务器错误');
                    }
                    $scope.isSubmit = false;
                    return;
                } else {
                    $scope.isSubmit = false;
                    getHealthRecord();
                    var message = '';
                    if (data.score != 0) {
                        message = '<div class="healthyAssess-popup text-center">' + '保存成功，获得' + data.score + '个健康币。您的健康状态更新啦！' + '<div class="button-area"><button class="line-twobutton" ng-click="$modalCancel()">确定</button><button class="line-twobutton" ng-click="$modalSuccess()">查看健康状态</button></div></div>'
                    } else {
                        message = '<div class="healthyAssess-popup text-center">' + '保存成功，已完成的任务不再获得健康币。' + '<div class="button-area"><button class="line-twobutton" ng-click="$modalCancel()">确定</button><button class="line-twobutton" ng-click="$modalSuccess()">查看健康状态</button></div></div>'
                    }

                    $scope.showUpdateTip(message);
                    //$scope.saveSuccess();
                }
            },
            error: function(e) {
                $scope.isSubmit = false;
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
    }

    $scope.saveSuccess = function() {
        $scope.saveflag = true;
        $timeout(function() {
            $scope.saveflag = false
        }, 1500);
    }

    $scope.showSubmitSuccess = function() {
        if ($scope.saveflag) {
            return " submit-success text-center";
        }
        return " text-center hide";
    }
    $scope.changeCheck = function(item, newValue) {
        /*
        fix the bug 4000, can reset the value
        if (item.fromServer && item.id != "0201") {
            return;
        }*/
        trackerApi("2-健康任务","任务点击",{});
        if (item.id == CONST_WALKING_ITEM) {
            //0521 walking, do nothing
            return;
        }

        var value = "";
        if (item.id == CONST_WEIGHT_ITEM) {
            if (newValue === undefined) {
                item.showme = true;
                return;
            } else {
                try {
                    newValue = parseInt(newValue, 10);
                    if (isNaN(newValue)) {

                        $scope.$root.showAlert("合理范围 30 ~120 KG");

                        return true;
                    }
                    if (newValue < 30 || newValue > 120) {
                        $scope.$root.showAlert("合理范围 30 ~120 KG");
                        return;
                    }
                    $scope.weight = newValue;
                } catch (e) {

                    $scope.$root.showAlert("合理范围 30 ~120 KG");
                    return;
                }
                if (!item.originalTitle) {
                    item.originalTitle = item.title;
                }

                item.showme = false;
            }
            value = newValue;
        }

        if (item.id == CONST_SMOKE_ITEM) {
            if (newValue === undefined) {
                item.showme = true;
                return;
            } else {
                try {
                    newValue = parseInt(newValue, 10);
                    if (isNaN(newValue)) {

                        $scope.$root.showAlert("合理范围 0 ~99");

                        return true;
                    }
                    if (newValue < 0 || newValue > 99) {
                        $scope.$root.showAlert("合理范围 0 ~99");
                        return;
                    }
                    $scope.smoke = newValue;
                } catch (e) {

                    $scope.$root.showAlert("合理范围 0 ~99");
                    return;
                }

                if (!item.originalTitle) {
                    item.originalTitle = item.title;
                }

                item.showme = false;
            }

            value = newValue;
        }

        if (item.id == CONST_WATER_ITEM) {
            value = $scope.totleCupsLength();
        }

        var tempCheck = 0;
        if (item.isComplete == CONST_COMPLETE) {
            item.isComplete = CONST_INCOMPLETE;
        } else {
            item.isComplete = CONST_COMPLETE;
        }

        if (value !== "") {
            item.isComplete = CONST_COMPLETE;
        }

        var canFind = false;
        for (var i = 0; i < $scope.category.length; i++) {
            var category = $scope.category[i];
            if (category.itemId == item.id) {
                category.isChoice = item.isComplete;
                category.value = value;

                if ($scope.checkSameStatusAsServerCategory(category)) {
                    category.remove = true;
                }
                canFind = true;
                break;
            }
        }

        $scope.removeCategory();

        if (!canFind) {
            var newItem = {
                itemId: item.id,
                isChoice: item.isComplete,
                value: value
            };

            if (!$scope.checkSameStatusAsServerCategory(newItem)) {
                //status change than add to category
                $scope.category.push(newItem);
            }

        }

    }

    $scope.removeCategory = function() {

        for (var i = 0; i < $scope.category.length; i++) {
            var category = $scope.category[i];
            if (category.remove) {
                $scope.category.splice(i, 1);
                return true;
            }
        }
    }

    $scope.checkSameStatusAsServerCategory = function(item) {
        var serverItem = $scope.serverCategory[item.itemId];
        if (serverItem) {
            if (item.itemId == CONST_SMOKE_ITEM) {
                if (item.value == serverItem.value && item.isChoice == serverItem.isComplete) {
                    return true;
                }
                return false;
            }
            if (item.itemId == CONST_WEIGHT_ITEM) {
                if (item.value == serverItem.value && item.isChoice == serverItem.isComplete) {
                    return true;
                }
                return false;
            } else if (item.itemId == CONST_WATER_ITEM) {
                if (item.value == serverItem.value) {
                    return true;
                }
                return false
            } else {
                if (item.isChoice == serverItem.isComplete) {
                    return true;
                }
            }

            return false;
        }
        return false;
    }



    $scope.expandme = function(category) {
        if (category.showme) {
            return true;
        }
        return false;
    }

    $scope.totleCups = {
        "totleCups": [{
            "isEmpty": true
        }, {
            "isEmpty": true
        }, {
            "isEmpty": true
        }, {
            "isEmpty": true
        }, {
            "isEmpty": true
        }, {
            "isEmpty": true
        }, {
            "isEmpty": true
        }, {
            "isEmpty": true
        }]
    };
    $scope.totleCupsLength = function() {
        var count = 0;
        var cups = $scope.totleCups.totleCups;
        for (var i = 0; i < cups.length; i++) {
            count += ((cups[i].isEmpty ? "0" : "1") - 0);
        };
        return count;
    }

    $scope.setCupStatus = function(item, idx, cat) {
        for (var i = 0; i < $scope.totleCups.totleCups.length; i++) {
            if (i < idx) {
                $scope.totleCups.totleCups[i].isEmpty = false;

            } else if (i == idx) {
                $scope.totleCups.totleCups[i].isEmpty = !$scope.totleCups.totleCups[i].isEmpty;

            } else if (i > idx) {
                $scope.totleCups.totleCups[i].isEmpty = true;

            }
        }

        $scope.changeCheck(cat);

    }



    //add a from server flag 
    function setIsCompleteToFromServer(data) {
        for (var i = 0; i < data.length; i++) {
            var group = data[i];

            var categorys = group.category;
            for (var j = 0; j < categorys.length; j++) {
                var category = categorys[j];

                if (category.id == CONST_WALKING_ITEM) {
                    //walking is common task, always checked.Cigna Jason said 9/2
                    category.isComplete = 1;
                }

                $scope.serverCategory[category.id] = {
                    id: category.id,
                    value: category.value,
                    isComplete: category.isComplete
                };



                if (category.isComplete == "1") {
                    if (category.id == CONST_WEIGHT_ITEM) {
                        var v = "";
                        try {
                            v = parseInt(category.value, 10);
                        } catch (e) {}
                        $scope.weight = v;

                    } else if (category.id == CONST_SMOKE_ITEM) {
                        var v = "";
                        try {
                            v = parseInt(category.value, 10);
                        } catch (e) {}
                        $scope.smoke = v;
                    } else if (category.id == CONST_WATER_ITEM) {
                        var cups = category.value;
                        try {
                            cups = parseInt(cups, 10);
                        } catch (e) {
                            cups = 0;
                        }
                        for (var m = 0; m < cups; m++) {
                            $scope.totleCups.totleCups[m].isEmpty = false;
                        }
                    }

                    category.fromServer = true;
                } else {
                    category.fromServer = false;
                }
                categorys[j] = category;
            }
        }
    }
    // $scope.pagesLoading=false;
    function getHealthRecord() {
        $.ajax({
            type: $scope.form.postType,
            url: getHealthyTaskApiUrl,
            context: document.body,
            data: $scope.form.userData,
            success: function(data) {

                if (data.statusCode == 2) {
                    $scope.$root.getErrorCodeMsg(data.msg, function() {}, data.statusCode);
                    return;
                }
                if (data.statusCode != 200) {
                    if (data.statusCode == 1) {
                        $scope.$root.getErrorCodeMsg(data.msg);
                    } else {
                        $scope.$root.getErrorCodeMsg('服务器错误');
                    }
                    $('.loading').hide();
                    return;
                } else {
                    $timeout(function() {
                        var tasksData = data.data;
                        $scope.category = [];
                        $scope.serverCategory = {};

                        setIsCompleteToFromServer(tasksData);
                        for (var i = 0; i < tasksData.length; i++) {
                            for (var j = 0; j < tasksData[i].category.length; j++) {
                                if (tasksData[i].category[j].id == "0521") {
                                    tasksData[i].category[j].summaryCheck = "走了" + ($scope.form.todayStep||0) + "步";
                                };
                            };
                        };
                        $scope.taskGroups = tasksData;
                        if (tasksData[2].category.length>0&&tasksData[2].category[0].value) {
                            $scope.weightValue = parseInt(tasksData[2].category[0].value);
                        };
                        $('.loading').hide();
                    })
                }

            },
            error: function(e) {
                $('.loading').hide();
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        })
    }

    getHealthRecord();
    return;

}];
//HEALTHY TASK END
