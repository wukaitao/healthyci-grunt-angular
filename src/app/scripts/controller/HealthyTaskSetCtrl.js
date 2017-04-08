//HEALTHY TASK SET STRAT
var HealthyTaskSetCtrl = ['$scope', '$location', 'form', '$http', '$timeout', function($scope, $location, form, $http, $timeout) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "任务设置";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.category = [];
    $scope.isSubmit=false;
    $scope.serverCategory = {};
    $scope.item0601 = {};
    $scope.item0602 = {};
    var CONST_CHECK = "1";
    var CONST_UNCHECK = "0";
    var CONST_SMOKE_ITEM = "0602";
    var CONST_NO_SMOKE_ITEM = "0601"; 
    var CONST_STEP_ITEM = "0521";
    var CONST_WATER_ITEM  = "0201";
    var CONST_WEIGHT_ITEM = "0801";
    
    $scope.workTimes = "步";
    $scope.smokeUnit = "";
    $scope.steps = [];
    $scope.smokes = [0];
    $scope.serverSmoke = "";
    $scope.targetStepRefresh = false;
    $scope.smokeRefresh = false;
    $scope.smoke = 0;
    $scope.targetStep = "";

    trackerApi("3-任务设置","",{});

    var getHealthyTaskSetApiUrl = cignaDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getHealthyTaskSetApi;


    initStep = function() {
        for (var i = 3000; i <= 20500; i = i + 500) {
            $scope.steps.push(i);
        }
    }()
    $scope.form.leftBtnClick = function() {
        $location.path("/healthyTask");
    }

    /*if ($scope.form.userData.userId && $scope.form.userData.session){
        $scope.form.userData.userId=1;
        $scope.form.userData.session=1;
    }*/
    $scope.addItem06 = function(item) {
        if (item.id == CONST_NO_SMOKE_ITEM) {
            item0601 = item;
        }

        if (item.id == CONST_SMOKE_ITEM) {
            item0602 = item;
        }

        return true;
    }
    $scope.getTitleClass = function(item) {
        var cssClass = "font-grey";
        if (item.isCheck == CONST_UNCHECK) {
            cssClass = "font-grey"
        } else {
            cssClass = "font-blue"
        }

        return cssClass;
    }

    $scope.getButtonClass = function(item) {

        var cssClass = "check-button uncheck-button";
        if (item.isCheck == CONST_UNCHECK) {
            cssClass = "check-button uncheck-button"
        } else {
            cssClass = "check-button checked"
        }

        if (item.id == CONST_STEP_ITEM || item.id == CONST_WEIGHT_ITEM || item.id == CONST_WATER_ITEM) {
            //common task. Not show icon
            cssClass = "";
        }
        return cssClass;

    }

    $scope.getButtonIconClass = function(item) {
        var cssClass = "icon-right";
        if (item.isCheck == CONST_UNCHECK) {
            cssClass = "icon-right"
        } else {
            cssClass = "icon-right"
        }

        if (item.id == CONST_STEP_ITEM || item.id == CONST_WEIGHT_ITEM || item.id == CONST_WATER_ITEM) {
            //common task. Not show icon
            cssClass = "";
        }
        return cssClass;
    }
    
    $scope.submitTaskSet = function() {
        trackerApi("3-任务设置","提交",{});
        $scope.isSubmit=true;
        var getHealthyTaskSetUpdateApiUrl = cignaDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getHealthyTaskSetUpdateApi;
        var catJson = JSON.stringify({
            "category": $scope.category
        });

        $.ajax({
            type: $scope.form.postType,
            url: getHealthyTaskSetUpdateApiUrl,
            context: document.body,
            data: {
                data: catJson
            },
            success: function(data) {
                if (data.statusCode == 2) {
                    $scope.$root.getErrorCodeMsg(data.msg, function() {},data.statusCode);
                    $scope.isSubmit=false;
                    return;
                }
                if (data.statusCode != 200) {
                    if (data.statusCode == 1) {
                        $scope.$root.getErrorCodeMsg(data.msg);
                    } else {
                        $scope.$root.getErrorCodeMsg('服务器错误');
                    }
                    $scope.isSubmit=false;
                    return;
                } else {
                    $('.healthy-task').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon "><i class="icon-right"></i></span><span>'+'设置成功!'+'</span></div>')
                    $timeout(function(){
                        $('.errorMsgShow').remove();
                        $location.path('/healthyTask');
                    },2000)
                }
            },
            error: function(e) {
                $scope.isSubmit=false;
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
        debugger
        if ($scope.saveflag) {
            return " submit-success text-center";
        }
        return " text-center hide";
    }

    $scope.changeCheck = function(item, newValue, ignoreStepSmoke) { 
        var tempCheck = 0;

        //0602 smoke, 0521 walking
        if (item.id == CONST_STEP_ITEM || item.id == CONST_SMOKE_ITEM) {
            if (newValue === undefined) {
                item.showme = true;
                if (ignoreStepSmoke) {
                    return ;
                }
                /* if (item.id == "0521") {
                     $timeout(function() {
                         $scope.targetStepRefresh = true;
                     }, 100);
                 }*/

                if (item.id == CONST_SMOKE_ITEM) {
                    $timeout(function() {
                        $scope.smokeRefresh = true;
                    }, 100);
                }
            } else {
                if (item.id == CONST_STEP_ITEM) {
                    //smoke not change the subTitle
                    item.subTitle = newValue;
                }

                item.showme = false;
            }
        }



        if (item.isCheck == CONST_CHECK) {
            if (item.id == CONST_SMOKE_ITEM) {
                if (newValue == undefined) {
                    item.isCheck = CONST_UNCHECK;
                    item.showme = false;
                    item.value = $scope.serverSmoke;
                }
            } else if (item.id == CONST_STEP_ITEM || item.id == CONST_WEIGHT_ITEM || item.id == CONST_WATER_ITEM) {
                //do nothing, common task. Cannot cancel
                if (item.id != CONST_STEP_ITEM) {
                    //Not 0521 target steps, return  
                    return;    
                }
                
            } else {
                item.isCheck = CONST_UNCHECK;
            }
        } else {
            //0601,0602 smoke, cannot check at the same time
            if (item.id == CONST_NO_SMOKE_ITEM) {
                item.isCheck = CONST_CHECK;
                item0602.isCheck = CONST_UNCHECK;
                $scope.doSmokeItem(CONST_SMOKE_ITEM);
            } else if (item.id == CONST_SMOKE_ITEM) {
                item.isCheck = CONST_CHECK;
                item0601.isCheck = CONST_UNCHECK;
                $scope.doSmokeItem(CONST_NO_SMOKE_ITEM);
                newValue=$scope.smoke;
            } else {
                item.isCheck = CONST_CHECK;
            }

        }

        var canFind = false;
        for (var i = 0; i < $scope.category.length; i++) {
            var category = $scope.category[i];
            if (category.itemId == item.id) {
                var val = item.isCheck;
                if (newValue != undefined) {
                    val = newValue;
                }

                category.value = val;

                if ($scope.checkSameStatusAsServerCategory(category)) {
                    category.remove = true;
                }

                /*if (item.id == CONST_SMOKE_ITEM) {
                    if (newValue != undefined) {
                        item.value = newValue; // just for 0602 smoke, update control number in display
                    }
                }*/
                canFind = true;
                break;
            }
        }

        $scope.removeCategory();

        if (!canFind) {
            var val = item.isCheck;
            if (newValue != undefined) {
                val = newValue;
                if (item.id == CONST_SMOKE_ITEM) {
                    if (newValue != undefined) {
                        item.value = newValue; // just for 0602 smoke, update control number in display
                    }
                }
            }
            var newItem = {itemId: item.id, value: val};

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
        var serverItem  = $scope.serverCategory[item.itemId];
        if (serverItem) {
            if (item.itemId == CONST_SMOKE_ITEM) {
                if  (item.value == serverItem.value) {
                return true;
            } 
            return false;
        }else if (item.itemId == CONST_STEP_ITEM) {
                if  (item.value == serverItem.subTitle) {
                return true;
               }
               return false;
            } else  {
               if  (item.value == serverItem.isCheck) {
                return true;
               }    
            }

            return false;
        }
        return false;
    }
    $scope.doSmokeItem = function(itemid) {

        var canFind = false;
        for (var i = 0; i < $scope.category.length; i++) {
            var category = $scope.category[i];
            if (category.itemId == itemid) {
                var val = CONST_UNCHECK;
                category.value = val;
                canFind = true;
                break;
            }
        }

        if (!canFind) {
            var val = CONST_UNCHECK;

            $scope.category.push({
                itemId: itemid,
                value: val
            });
        }

    }
    $scope.showList = function(item) {
        for (var i = 0; i < item.length; i++) {
            if (item[i].id == '0601' || item[i].id == '0521') {
            return true;
        }
        return false;
        };
        
    }
    $scope.expandme = function(category) {
        return category.showme;
    }

    isMyScrollE = false;

    $(".healthy-task").on("touchstart", function(e) {
        if (e.target.className.indexOf("myscrollE") >= 0) {
            isMyScrollE = true;
        }
    });

    $(document).on("touchend", function(e) {

        isMyScrollE = false;

    });

    $(".healthy-task").on("touchmove", function(e) {

        if (isMyScrollE) {
            e.preventDefault();
            return;
        }

    });

    window.onscroll = function(e) {
        if (isMyScrollE) {
            e.stopPropagation();
            e.preventDefault();
            return;
        }
    }

    function initSmokeData(iSmoke) {
        $scope.smokes = [];
        for (var i = 1; i < iSmoke; i++) {
            //$scope.smoke = iSmoke-1;
            $scope.smokes.push(i);
        }
    }

    function initTasksData(tasksData) {
        for (var i = 0; i < tasksData.length; i++) {
            var group = tasksData[i];
            for (var j = 0; j < group.category.length; j++) {
                var cat = group.category[j];
                for (var m = 0; m < cat.subCategory.length; m++) {
                    var subCat = cat.subCategory[m];

                    $scope.serverCategory[subCat.id] = {id:subCat.id, value:subCat.value, isCheck: subCat.isCheck, subTitle:subCat.subTitle};

                    if (subCat.id == CONST_SMOKE_ITEM) {
                        //smoke
                        var smokeDefaultNum = 1;
                        try {
                            smokeDefaultNum = parseInt(subCat.subTitle, 10);
                        } catch (e) {

                        }
                        $scope.smoke = smokeDefaultNum;
                        $scope.serverSmoke = subCat.value;
                        initSmokeData(subCat.value);
                    }

                    if (subCat.id == CONST_STEP_ITEM) {
                        //step
                        var v = 7000;
                        try{
                            v = parseInt(subCat.subTitle, 10);
                        } catch(e) {

                        }
                        
                        $scope.targetStep = v;

                        $timeout(function() {
                            $scope.targetStepRefresh = true;
                        }, 400);
                    }
                }
            }
        }
    }
    function getHealthyTaskSet() {
        $.ajax({
            type: $scope.form.postType,
            url: getHealthyTaskSetApiUrl,
            context: document.body,
            data: $scope.form.userData,
            success: function(data) {
                if (data.statusCode == 2) {
                    $scope.$root.getErrorCodeMsg(data.msg, function() {},data.statusCode);
                    return;
                }
                $timeout(function() {
                    var tasksData = data.data;
                    $scope.serverCategory = {};
                    $scope.category=[];
                    initTasksData(tasksData);

                    $scope.taskGroups = tasksData;
                    $('.loading').hide();
                })

            },
            error: function(e) {
                $('.loading').hide();
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
    }

    getHealthyTaskSet();

    return;
}];
//HEALTHY TASK SET END
