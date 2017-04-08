//HEALTHY STATUS STRAT
var HealthyStatusCtrl = ['$scope', '$location', 'form', '$http', '$timeout', function($scope, $location, form, $http, $timeout) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "健康状态";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.form = form;
    $scope.isSuggestion = true;
    // var getHealthStatusApiUrl = cignaDomain + "/" + 200 + "/" + 1 + getHealthStatusApi;
    $scope.healthStatus = [];
    trackerApi("2-健康状态","",{UserID:$scope.form.getUserId()});
    var getHealthStatusApiUrl = cignaDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getHealthStatusApi;
    $.ajax({
        type: $scope.form.postType,
        url: getHealthStatusApiUrl,
        context: document.body,
        // data: $scope.form.userData,
        success: function(data) {

            if (data.statusCode == 2) {
                $scope.$root.getErrorCodeMsg(data.msg, function() {},data.statusCode);
                return;
            }
            if (data.statusCode != 200) {
                $('.loading').hide();
                if (data.statusCode == 1) {
                    $scope.$root.getErrorCodeMsg(data.msg);
                } else {
                    $scope.$root.getErrorCodeMsg('服务器错误');
                }
            } else {
                $timeout(function() {
                    var healthStatus = data.data;
                    $scope.isShowInsurance=data.isShowInsurance;
                    var title = "";
                    var target = "";
                    var index = 0;
                    for (var key in healthStatus) {
                        healthStatus[key].key = key;
                        healthStatus[key].isClick = false;
                        healthStatus[key].index = index;
                        index++;
                        $scope.healthStatus.push(healthStatus[key]);
                        var obj = healthStatus[key];
                        switch (obj.key) {
                            case "weight":
                                var labels = [];
                                var datas = [];
                                for (var i = 0; i < obj.weights.length; i++) {
                                    var weight = obj.weights[i];
                                	var date = weight.date.split("-");
                                    labels.push(parseInt(date[1],10) + '/' + parseInt(date[2],10));
                                    datas.push((weight.weight - 0));
                                };
                                title = (obj.yesterday == undefined ? "今日体重：" + obj.today + "公斤" : "今日体重：" + obj.yesterday + "公斤");
                                target = obj.target;

                                $scope.weightLabels = labels;
                                $scope.weightData = datas;
                                $scope.weightTitle = title;
                                $scope.weightTarget = target;
                                if (obj.weights.length == 0) {
                                    $scope.showWeight = false;
                                } else {
                                    $scope.showWeight = true;
                                }

                                break;
                            case "sport":
                                var labels = [];
                                var datas = [];
                                var calories = [];
                                for (var i = 0; i < obj.steps.length; i++) {
                                    var steps = obj.steps[i];

                                    var date = steps.date.split("-");
                                    labels.push(parseInt(date[1],10) + '/' + parseInt(date[2],10));
                                    datas.push((steps.step - 0));
                                    var calorie = {};
                                    calorie.date = steps.date;
                                    calorie.calorie = steps.calorie;
                                    calorie.step = steps.step;
                                    calories.push(calorie);
                                };
                                title = obj.today;
                                target = obj.note;
                                $scope.sportLabels = labels;
                                $scope.sportData = datas;


                                // 

                                $scope.sportTitle = title;
                                $scope.sportTarget = target;

                                if (obj.steps.length == 0) {
                                    $scope.showSport = false;
                                } else {
                                    $scope.showSport = true;

                                    // 
                                }
                                if (calories.length == 0) {
                                    $scope.calories = false;
                                } else {
                                    var calorieData = {};
                                    var newDate = new Date();
                                    var today =
                                        newDate.getFullYear() + "" + ((((newDate.getMonth() + 1) + "").length == 1) ? "0" + (newDate.getMonth() + 1) : "" + (newDate.getMonth() + 1)) + newDate.getDate();
                                    var yesterdayDate = new Date(newDate.setDate(newDate.getDate() - 1));
                                    var yesterday = yesterdayDate.getFullYear() + "" + ((((yesterdayDate.getMonth() + 1) + "").length == 1) ? "0" + (yesterdayDate.getMonth() + 1) : "" + (yesterdayDate.getMonth() + 1)) + (((yesterdayDate.getDate() + "").length == 1) ? "0" + yesterdayDate.getDate() : "" + yesterdayDate.getDate());

                                    var status = {};
                                    status.calorieData = [];
                                    if (obj.calorie != "" && obj.calorie != 0) {
                                        calorie.title = "今日消耗热量：" + obj.calorie + "卡路里";
                                        calorie.text = "根据" + obj.today.replace('今日步数', '今日已走步数') + " 计算";
                                        status.calorieData.push(calorie);
                                    }

                                    for (var i = 0; i < calories.length; i++) {
                                        var calorie = {};

                                        if (calories[i].date.replace(/-/g, '') == yesterday) {
                                            calorie.title = "昨日消耗热量：" + calories[i].calorie + "卡路里";
                                            calorie.text = "根据昨日已走步数: " + calories[i].step + "步 计算";
                                            status.calorieData.push(calorie);
                                        }

                                    };
                                    // $scope.calories=true;

                                    status.key = "calories";

                                    status.isClick = false;
                                    status.index = index;
                                    index++;
                                    $scope.healthStatus.push(status);
                                }

                                break;
                            case "drink":
                                var labels = [];
                                var datas = [];

                                for (var i = 0; i < obj.drinks.length; i++) {
                                    var drinks = obj.drinks[i];
                                    var date = drinks.date.split("-");
                                    labels.push(parseInt(date[1],10) + '/' + parseInt(date[2],10));
                                    datas.push((drinks.count - 0));
                                };
                                title = obj.title;
                                target = obj.note;

                                $scope.drinkLabels = labels;
                                $scope.drinkData = datas;
                                $scope.drinkTitle = title;
                                $scope.drinkTarget = target;

                                if (obj.drinks.length == 0) {
                                    $scope.showDrink = false;
                                } else {
                                    $scope.showDrink = true;
                                }

                                break;
                            case "smoke":
                                var labels = [];
                                var datas = [];

                                for (var i = 0; i < obj.smokes.length; i++) {
                                    var smokes = obj.smokes[i];

                                    var date = smokes.date.split("-");
                                    labels.push(parseInt(date[1],10) + '/' + parseInt(date[2],10));
                                    datas.push((smokes.smoke - 0));
                                };
                                title = obj.title;
                                target = obj.note;

                                $scope.smokeLabels = labels;
                                $scope.smokeData = datas;
                                $scope.smokeTitle = title;
                                $scope.smokeTarget = target;

                                if (obj.smokes.length == 0) {
                                    $scope.showSmoke = false;
                                } else {
                                    $scope.showSmoke = true;
                                }

                                break;
                            case "food":
                                $scope.foods = obj.foods;
                                break;
                            default:
                                break;
                        }

                    }
                    // debugger;
                    // $timeout(function() {
                    //     $('.statuses')[0].click();
                    //     // $scope.changeStatus($scope.healthStatus[0]);
                    // })


                    $timeout(function() {
                        if ($scope.sportData.length > 0) {
                            var sportLineChartData = {
                                labels: $scope.sportLabels, //X轴 坐标
                                datasets: [{
                                    bezierCurve: true,
                                    fillColor: "transparent", // 背景色
                                    strokeColor: "#5ecacc", // 线
                                    pointColor: "#5ecacc", // 点
                                    pointStrokeColor: "#fff", // 点的包围圈
                                    data: $scope.sportData
                                }]

                            }
                            var sportDefaults = {
                                // 刻度是否显示标签, 即Y轴上是否显示文字
                                scaleShowLabels: true,

                                // Y轴上的刻度,即文字
                                scaleLabel: "<%=value%> 步"
                            }
                            var sportLine = new Chart(document.getElementById("sport").getContext("2d")).Line(sportLineChartData, sportDefaults);
                        }

                        if ($scope.weightData.length > 0) {
                            var weightLineChartData = {
                                labels: $scope.weightLabels, //X轴 坐标
                                datasets: [{
                                    bezierCurve: true,
                                    fillColor: "transparent", // 背景色
                                    strokeColor: "#5ecacc", // 线
                                    pointColor: "#5ecacc", // 点
                                    pointStrokeColor: "#fff", // 点的包围圈
                                    data: $scope.weightData
                                }]

                            }
                            var weightDefaults = {
                                // 刻度是否显示标签, 即Y轴上是否显示文字
                                scaleShowLabels: true,

                                // Y轴上的刻度,即文字
                                scaleLabel: "<%=value%> kg"
                            }
                            var weightLine = new Chart(document.getElementById("weight").getContext("2d")).Line(weightLineChartData, weightDefaults);
                        }

                        if ($scope.drinkData.length > 0) {
                            var drinkLineChartData = {
                                labels: $scope.drinkLabels, //X轴 坐标
                                datasets: [{
                                    bezierCurve: false,
                                    fillColor: "transparent", // 背景色
                                    strokeColor: "#5ecacc", // 线
                                    pointColor: "#5ecacc", // 点
                                    pointStrokeColor: "#fff", // 点的包围圈
                                    data: $scope.drinkData
                                }]

                            }
                            var drinkDefaults = {
                                // 刻度是否显示标签, 即Y轴上是否显示文字
                                scaleShowLabels: true,

                                // Y轴上的刻度,即文字
                                scaleLabel: "<%=value%> 杯"
                            }
                            var drinkLine = new Chart(document.getElementById("drink").getContext("2d")).Line(drinkLineChartData, drinkDefaults);
                        }


                        if ($scope.smokeData.length > 0) {
                            var smokeLineChartData = {
                                labels: $scope.smokeLabels, //X轴 坐标
                                datasets: [{
                                    bezierCurve: false,
                                    fillColor: "transparent", // 背景色
                                    strokeColor: "#5ecacc", // 线
                                    pointColor: "#5ecacc", // 点
                                    pointStrokeColor: "#fff", // 点的包围圈
                                    data: $scope.smokeData
                                }]

                            }
                            var smokeDefaults = {
                                // 刻度是否显示标签, 即Y轴上是否显示文字
                                scaleShowLabels: true,

                                // Y轴上的刻度,即文字
                                scaleLabel: "<%=value%> 支"
                            }
                            var smokeLine = new Chart(document.getElementById("smoke").getContext("2d")).Line(smokeLineChartData, smokeDefaults);
                        }


                        $('.loading').hide();
                    })


                })
            }

        },
        error: function(e) {
            //alert(XMLHttpRequest.status)
            $('.loading').hide();
            $scope.$root.getReadyStateMsg(e.readyState);
        }
    });


    var getHealthSuggestionApiUrl = cignaDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getHealthSuggestionApi;

    //var getHealthStatusApiUrl = cignaDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getHealthStatusApi;
    $.ajax({
        type: $scope.form.postType,
        url: getHealthSuggestionApiUrl,
        context: document.body,
        // data: $scope.form.userData,
        success: function(data) {

            if (data.statusCode == 2) {
                $scope.$root.getErrorCodeMsg(data.msg, function() {},data.statusCode);
                return
            }
            if (data.statusCode != 200) {

                if (data.statusCode == 1) {
                    $scope.$root.getErrorCodeMsg(data.msg);
                } else {
                    $scope.$root.getErrorCodeMsg('服务器错误');
                }
            } else {
                $timeout(function() {
                    $scope.suggestionData = data;
                    // //alert(JSON.stringify($scope.suggestionData.data.suggestion.length))
                    // if($scope.suggestionData.data.suggestion.length>0)
                    // {
                    //     alert('1')
                    //     $scope.isSuggestion=true;
                    // }else{
                    //     alert('2')
                    //     $scope.isSuggestion=false;
                    // }
                })
            }

        },
        error: function(e) {
            //alert(XMLHttpRequest.status+"    :"+XMLHttpRequest.readyState)
            $scope.$root.getReadyStateMsg(e.readyState);
        }
    });


    $scope.form.leftBtnClick = function() {
        $location.path("/myHealthy");
    };

	$scope.insurance = function(){
    	trackerApi("2-健康状态","E诺综合意外险",{"UserID":$scope.form.getUserId()});
		location="http://"+location.host+location.pathname.substring(0,location.pathname.indexOf("/app.html"))+"/http/actBreast/td10.html?remark="+encodeURIComponent("健康状态-女性特定疾病")+"&userid="+$scope.form.getUserId();;
	};

    $scope.changeStatus = function(obj) {
        for (var i = 0; i < $scope.healthStatus.length; i++) {
            $scope.healthStatus[i].isClick = false;
        };

        obj.isClick = true;

        $timeout(function() {
            // var closestLi = $("#"+obj.index);
            var closestLi = $(".status-items:visible").eq($(".statuses:visible").index($("." + obj.key)));
            var firstLi = $(".status-items")[0];
            var height = -(firstLi.offsetTop - closestLi.offset().top);
            $(document).scrollTop(height);
        })

        //$(".chinese-quiz").css("transform","translateY("+height+"px)");


        // $(this).attr("href")
    }
    return;
}];
//HEALTHY STATUS END
