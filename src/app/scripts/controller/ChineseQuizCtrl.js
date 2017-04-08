//HMS HEALTHY CHINESE QUIZ STRAT
var ChineseQuizCtrl = ['$scope', '$location', 'form', '$http', '$timeout', 'createDialog', '$routeParams', function($scope, $location, form, $http, $timeout, createDialogService, $routeParams) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "中医体质评估";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;

    trackerApi("2-中医体质评估","",{UserID:$scope.form.getUserId()});

    var getCmEvaluationApiUrl = cignaDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getCmEvaluationApi;
    //var getBaseEvaluationApiUrl = cignaDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getBaseEvaluationApi;

    var chineseQuizDataClickArray = {};
    // var selectItemValue = {};

    // progress init
	$scope.form.progresscount = $scope.form.progresscount || 0;

    $(document).scrollTop(0);
    
    var postData = copyData($scope.form.userData);
    if($routeParams.act) postData.sex=$routeParams.act;

    $.ajax({
        type: $scope.form.postType,
        url: getCmEvaluationApiUrl,
        context: document.body,
        data: postData,
        success: function(data) {
            $timeout(function() {

                if (data.statusCode == 2) {
                    $scope.$root.getErrorCodeMsg(data.msg, function() {},data.statusCode);
                    return;
                }
                var chineseQuizData = data.data;
                if (localStorage.getItem('CItemID')) {
                    $scope.item = localStorage.getItem('CItemID').split(",");
                    var list = eval(localStorage.getItem('CItemList'))
                    for (var i = 0; i < chineseQuizData.length; i++) {

                        chineseQuizData[i].answer = "";

                        for (var j = 0; j < $scope.item.length; j++) {
                            if (chineseQuizData[i].id == $scope.item[j]) {
                                chineseQuizData[i].answer = list[j].answer;
                                break;
                            }
                        };

                    };
                } else {
                    for (var i = 0; i < chineseQuizData.length; i++) {
                        chineseQuizData[i].answer = "";
                    }
                }
                $scope.form.chineseQuizData = chineseQuizData;
                $scope.progresscountMax = chineseQuizData.length;
                // page show answer init start
                // for (var i = 0; i < chineseQuizData.length; i++) {
                //     chineseQuizData[i].isShow = false;
                //     if (chineseQuizData[i].id=="01") {
                //         chineseQuizData[i].isShow = true;
                //     };
                // };
                // page show answer init end
                //debugger;

                //if refill ChineseQuiz , progress bar show all
                // if (chineseQuizData[0].answer != '') {
                //     $scope.form.progresscount = progresscount = 60;
                // };

                for (var i = 0; i < chineseQuizData.length; i++) {
                    if (chineseQuizData[i].answer != '') {
                        //selectItemValue.resultId=chineseQuizData[i].id;
                        //selectItemValue.value=chineseQuizData[i].answer;

                        chineseQuizDataClickArray[chineseQuizData[i].id] = {
                            "resultId": chineseQuizData[i].id,
                            "value": chineseQuizData[i].answer
                        };
                    };
                };
                $('.loading').hide();
                // console.log(chineseQuizDataClickArray);
                //debugger
            });
        var count = 0;
        var scrollToPage = setInterval(function(){

            if (!$scope.$root) {
                       clearInterval(scrollToPage);
            }

            if ($scope.item) {
                var showLastId =  $scope.item.length-1;
                $scope.form.progresscount = showLastId;
                if (showLastId<10) {
                    showLastIdClass = "._0"+showLastId;
                }else{
                    showLastIdClass = "._"+showLastId;
                }
                var scrollTopHeight = $(showLastIdClass)[0].offsetTop;
                $('body').animate({scrollTop: scrollTopHeight}, 400);
                clearInterval(scrollToPage);
            };
        }, 100)
        


        },
        error: function(e) {
            $('.loading').hide();
            //alert(e.statusText + ":" + e.responseText);
        }
    });

    $scope.itemId = "";
    $scope.itemList = [];
    $scope.selectItem = function(item, value, event) {
        item.answer = value;
        //debugger
        //add page show answer start
        $scope.itemId += item.id + ',';
        if (localStorage.getItem('CItemID')) {
			var CItemIDArray = localStorage.getItem('CItemID').split(',');
			CItemIDArray = CItemIDArray.slice(0,CItemIDArray.length-1);
			var index = $.inArray(item.id,CItemIDArray);
			if( index != -1){
                $scope.itemList = eval(localStorage.getItem('CItemList'));
                $scope.itemList[index] = item;
                localStorage.setItem('CItemList', JSON.stringify($scope.itemList));
			}else{
                $scope.itemId = localStorage.getItem('CItemID');
                $scope.itemId += item.id + ',';
                localStorage.setItem('CItemID', $scope.itemId);
                $scope.itemList = eval(localStorage.getItem('CItemList'));
                $scope.itemList.push(item);
                localStorage.setItem('CItemList', JSON.stringify($scope.itemList));
				$scope.form.progresscount = $scope.form.progresscount + 1;
			}
        } else {
            localStorage.setItem('CItemID', $scope.itemId);
            $scope.itemList.push(item);
            localStorage.setItem('CItemList', JSON.stringify($scope.itemList));
			$scope.form.progresscount = $scope.form.progresscount + 1;
        }

        $(event.target).closest("li").next().find(".check-box").removeClass("hide");


        //add page show answer end

        // add page click move start
        if (item.id != "60") {
            var closestLi = $(event.target).closest("li").next().find("a")[0]; //查找下一个问题 
            var firstLi = $("li:first", $(event.target).closest("ul")).find("a")[0]; //查找第一个问题
            var height = -(firstLi.offsetTop - closestLi.offsetTop);
            $('html, body').stop().animate({
                'scrollTop': height
            }, 400, 'swing');
            //$('html,body').animate({scrollTop: height}, 400); 
            //$(".chinese-quiz").css("transform","translateY("+height+"px)");
        };

        // add page click move end

        //      selectItemValue.resultId=item.id;
        //      selectItemValue.value=value;
        //fig bug
        //重新new一个对象，避免chineseQuizDataClickArray[item.id]指向同一块selectItemValue内存，覆盖了原先的值
        chineseQuizDataClickArray[item.id] = {
            "resultId": item.id,
            "value": value
        };

        //console.log(chineseQuizDataClickArray);
        //debugger;


    }

    $scope.form.leftBtnClick = function() {
        $scope.showConfirmAlert("是否放弃？");
        // if(a){
        //$location.path("/chineseQuizReport");})
        // }else{
        //    return
        // }
    }

    $scope.showConfirmAlert = function(msg) {
        $timeout(function() {
            // if($('.healthyAssess-popup'))
            //     $('.healthyAssess-popup').remove();
            // $('#showAlertPopupTemplate').append('<div class="healthyAssess-popup text-center">'+msg+'<div class="button-area"><button class="middle-button" ng-click="$modalCancel()">取消</button><button class="middle-button" ng-click="$modalSuccess()">确定</button></div></div>')
            createDialogService({
                id: 'editPersonalPopup',
                title: '',
                template: '<div class="healthyAssess-popup text-center">' + msg + '<div class="button-area"><button class="line-twobutton" ng-click="$modalCancel()">取消</button><button class="line-twobutton" ng-click="$modalSuccess()">确定</button></div></div>',
                backdrop: true,
                controller: null,
                success: {
                    fn: function() {
                    	if($routeParams.act) location="/hms-cmb-act/hmc_bodycode_web/page3.html?userId="+$scope.form.userData.userId+"&token="+$scope.form.userData.session;
                    	else if ($scope.form.pageTemp) {
                            $location.path("/chineseQuizReport");
                        } else {
                            $location.path("/testPortal");
                        }
                    }
                },
                cancel: {
                    fn: function() {
                        return
                    }
                }
            });

        });
    }

    $scope.selectItemClass = function(item, value) {
        if ($scope.form.answerTemp) {
            item.answer = "";
            $scope.form.answerTemp = 0;
        };
        if (value == item.answer) {
            return "checked";
        } else {
            return "";
        }
    }

    $scope.showAnswerClass = function(item) {
        var idClass = "_"+item.id;
        if (item.id == "01") {
            idClass = idClass +" "+ "check-box";
            return idClass;
        } else {
            // return "check-box hide";
            var showItem = $scope.item;
            if (showItem) {
                //展开最后一题的下一题 开始
                var showLastId = showItem.length;
                if (showLastId<10) {
                    showLastId = "0"+showLastId;
                }else{
                    showLastId = showLastId+"";
                }
                if(showLastId == item.id){
                    idClass = idClass +" "+ "check-box";
                    return idClass;
                }
                //展开最后一题的下一题 结束
                //展开已经答过的题目 开始
                if (localStorage.getItem('CItemID').match(item.id)) {
                    idClass = idClass +" "+ "check-box";
                    return idClass;
                }else{
                    idClass = idClass +" "+ "check-box hide";
                    return idClass;
                }
                //展开已经答过的题目 结束
            }else{
                idClass = idClass +" "+ "check-box hide";
                return idClass;
            }
        }
    }

    $scope.checkSubmitStatus = function(item) {
        if (item) {
            for (var i = 0; i < item.length; i++) {
                if (!item[i].answer) {
                    $scope.finishedQuestion = false;
                    return;
                } else {
                    $scope.finishedQuestion = true;
                }
            };
        };
        if ($scope.finishedQuestion && !$scope.submitStatus) {
            return true;
        };
    }

    $scope.checkSubmitDisableStatus = function(item) {
        if (item) {
            for (var i = 0; i < item.length; i++) {
                if (!item[i].answer) {
                    $scope.finishedQuestion = false;
                    return true;
                } else {
                    $scope.finishedQuestion = true;
                }
            };
        };
        if (!$scope.finishedQuestion && $scope.submitStatus) {
            return true;
        };
    }

    $scope.submitQuiz = function() {
        var chineseQuizDataArray = {
            answer: []
        };

        for (var key in chineseQuizDataClickArray) {
            var item = chineseQuizDataClickArray[key];
            chineseQuizDataArray.answer.push(item);
        };
        // resort the submit data start
        if (chineseQuizDataArray.answer.length == $scope.form.chineseQuizData.length) {
            var sortArrayQ = chineseQuizDataArray.answer.slice(0, chineseQuizDataArray.answer.length - 9);
            var sortArrayH = chineseQuizDataArray.answer.slice(chineseQuizDataArray.answer.length - 9);
            chineseQuizDataArray.answer = sortArrayH.concat(sortArrayQ);

            // resort the submit data end


            $scope.submitStatus = true;

            var submitCmEvaResultApiUrl = cignaDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + submitCmEvaResultApi;
            
            postData={data: JSON.stringify(chineseQuizDataArray)};
            if($routeParams.act) postData.sex=$routeParams.act;

            $.ajax({
                type: $scope.form.postType,
                url: submitCmEvaResultApiUrl,
                context: document.body,
                data: postData,
                success: function(data) {
					$scope.submitStatus = false;
                    if (data.statusCode == 2) {
                        $scope.$root.getErrorCodeMsg(data.msg, function() {},data.statusCode);
                        return;
                    }
                    if (data.statusCode != 200) {

                        if (data.statusCode == 1) {
                            $scope.$root.getErrorCodeMsg(data.msg);
                        } else {
                            $scope.$root.getErrorCodeMsg('服务器错误');
                        }
                        return;
                    };
                    $timeout(function() {
                        var submitData = data;
                        localStorage.setItem("completeCQ",1);
                        //console.log(submitData);
                        $location.path("/chineseQuizReport");
                    });

                },
                error: function(e) {
					$scope.submitStatus = false;
                    $scope.$root.getReadyStateMsg(e.readyState);
                }
            });
        } else {
            // $scope.$root.showAlert("请完成所有题目后再提交");
            $('.chinese-quiz').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>请完成所有题目后再提交</span></div>')
            setTimeout(function(){
                $('.errorMsgShow').remove();
            },2000)
            return;
        }
    }


    return;
}];
//HMS HEALTHY CHINESE QUIZ END
