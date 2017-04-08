// HEALTHY QUESTION PAGE STRAT
var HealthyQuestionCtrl = ['$scope', '$location', 'form', '$http', '$timeout', function($scope, $location, form, $http, $timeout) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "初级健康评估";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    // 
    var newAnswersArray = []
    isMyScrollE = false;
    $scope.form = form;
    // $scope.form.leftBtnClick = function() {
    //     $location.path("/useIntroduction");
    // }
    if ($scope.form.reload) {
        $scope.form.reload = 0;
        $timeout(function(){
        $location.reload();
    },100);
    };
    $scope.form.leftBtnClick = function() {
        if ($scope.backButton+1) {
            var backButtonfIndex = $scope.backButton;
            var backButtonfClass = ".li"+backButtonfIndex;
            $(backButtonfClass).click();
            $scope.backButton = $scope.backButton - 1;
        }else{
            if(browser.versions.ios){
                window.location.href="http://cmbiphone/tool";
            }else if(browser.versions.android){
                window.location.href="http://cmbandroid/tool";
            }else{            
                $location.path("/useIntroduction");
            }
        }
    }

    //初始化身高的尺子 开始
    var heightRuler = [];
    for (var i = 120; i < 230; i++) {
        heightRuler.push(i);
    }
    $scope.heightRuler = heightRuler;

    //初始化身高的尺子 结束

    //初始化体重的尺子 开始
    var weightRuler = [];
    for (var i = 30; i < 121; i++) {
        weightRuler.push(i);
    }
    $scope.weightRuler = weightRuler;

    //初始化体重的尺子 结束

    //初始化喝水的尺子 开始
    var waterRuler = [];
    for (var i = 0; i < 9; i++) {
        waterRuler.push(i);
    }
    $scope.waterRuler = waterRuler;
    $scope.waterNum = "杯";
    //初始化喝水的尺子 结束

    //初始化运动次数的尺子 开始
    var sportNumRuler = [];
    for (var i = 0; i < 15; i++) {
        sportNumRuler.push(i);
    }
    $scope.sportNumRuler = sportNumRuler;
    $scope.labelNum = "次";

    //初始化运动次数的尺子 结束

    //初始化运动时间的尺子 开始
    var sportTimeRuler = [];
    for (var i = 0; i < 301; i++) {
        sportTimeRuler.push(i * 10);
    }
    $scope.sportTimeRuler = sportTimeRuler;
    $scope.labelTimes = "分钟";

    //初始化运动时间的尺子 结束


    //初始化走路时间的尺子 开始
    var workTimeRuler = [];
    for (var i = 0; i < 5; i++) {
        workTimeRuler.push(i);
    }
    $scope.workTimeRuler = workTimeRuler;
    $scope.workTimes = "小时";

    //初始化走路时间的尺子 结束

    //初始化骑车时间的尺子 开始
    var bicyclingTimeRuler = [];
    for (var i = 0; i < 60; i++) {
        bicyclingTimeRuler.push(i);
    }
    $scope.bicyclingTimeRuler = bicyclingTimeRuler;
    $scope.bicyclingRulerTimes = "分钟";

    //初始化骑车时间的尺子 结束
    $scope.form.work = 0;
    $scope.form.bicycling = 30;

    $scope.form.water = 3;

    var waterRuler = [];
    for (var i = 0; i < 9; i++) {
        waterRuler.push(i);
    }
    $scope.waterRuler = waterRuler;

    $scope.walkTimeRefresh = false;
    $scope.bicyclingRefresh = false;
    $scope.sportTimeRefresh = false;
    $scope.sportNumRefresh = false;


    var answerArray = new Array();

    var getBaseEvaluationApiUrl = cignaDomain + getBaseEvaluationApi;
    // var getBaseEvaluationApiUrl = cignaDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getBaseEvaluationApi;
    var personInfo;

    $.ajax({
        type: $scope.form.postType,
        url: getBaseEvaluationApiUrl,
        context: document.body,
        data: $scope.form.userData,
        success: function(data) {
                    if (data.statusCode == 2) {
                        $scope.$root.getErrorCodeMsg(data.msg,function(){ },data.statusCode);
                        return;
                    }
            $timeout(function() {
                var answerData = data.data;
                // 
               // if(answerData[3].answer[0].value==""){
                //     answerData[3].answer[0].value="3";
                // }
                // if(answerData[3].answer[1].value==""){
                //     answerData[3].answer[1].value="130";
                // }
                // 
                answerArray = answerData;
                if (answerArray && answerArray.length > 0) {
                    personInfo = makePersonInfo();
                    answerArray.push(personInfo);
                }
                $scope.form.answers = answerArray;

                var pages = rebuildForPages($scope.form.answers);
                for (var i = 0; i < pages.length; i++) {
                    pages[i].pagesId = i;
                };
                $scope.form.pages = pages;
                //console.log(pages);
                setTimeout(function() {

                    // 删除img为null的div
                    $("img").each(function() {
                        var imgUrl = this.src;
                        var imgUrlLast = imgUrl.lastIndexOf('/');
                        var newImgUrl = imgUrl.substring(imgUrlLast + 1, imgUrl.length);
                        if (newImgUrl == "null") {
                            $(this).parents(".img-show").addClass('hide');
                        };
                    });
                    $timeout(function() {
                        var olParent = $('ol').children();
                        for (var i = 0; i < olParent.length; i++) {
                            var liClass = "li" + i;
                            $(olParent[i]).find("a").addClass(liClass);
                        };
                        $('.loading').hide();
                    })


                });


            })

        },
        error: function(e) {
            $('.loading').hide();
            //alert(e.statusText + ":" + e.responseText);
        }
    });

    var rebuildForPages = function(answers) {

        var pageSetting = getSimpleQuePageMapping();
        var pages = [];
        newAnswersArray = rebuidAnswerArray(answers);
        var answersKey = '';
        for (var i = 0; i < pageSetting.length; i++) {
            var answersSeting = pageSetting[i].answer;
            var page = {};
            page.answers = [];

            for (var j = 0; j < answersSeting.length; j++) {
                var answerSetting = answersSeting[j];
                var answersKey = answerSetting.key;

                var answer = newAnswersArray[answersKey]; //each question item

                // set default value begin
                if (answer.hasOwnProperty("value")) {
                    if (answer.value == "") {
                        answer.value = answersSeting[j].defaultValue;
                    };
                };
                if (answersKey == "04_0401_0_0") {
                    answer.value = "160";
                }
                if (answersKey == "04_0401_0_1") {
                    answer.value = "55";
                }
                if(answersKey == "05_0502_1_0"){
                    answer.value = "3";
                }
                if(answersKey == "07_0701_0_1"){
                    answer.value = "6:30";
                }
                // if(answersKey == "06_0601_0_0"){
                //     answer.value = "0";
                // }

                if(answersKey == "07_0701_0_0"){
                    answer.value = "22:30";
                }
                // set default value end

                answer.type = answerSetting.type;
                answer.mainImg = answerSetting.mainImg=="null"?"":answerSetting.mainImg;
                answer.aidImg = answerSetting.aidImg=="null"?"":answerSetting.aidImg;
                answer.key = answerSetting.key;
                answer.placeholder = answerSetting.placeholder;
                page.answers.push(answer);
            };

            pages.push(page);


        }

        return pages;

    };


    //生成pages key
    var rebuidAnswerArray = function(answers) {
        var newAnswersArray = [];
        var key = '';
        var repeat = 0;
        var timesArray = [];
        var catRepeat = [];

        for (var i = 0; i < answers.length; i++) {

            // add a category repeat time counter start
            var repeatKey = answers[i].category + "_" + answers[i].subCategory

            if (catRepeat[repeatKey] == null) {
                catRepeat[repeatKey] = 0;
            } else {
                catRepeat[repeatKey] = catRepeat[repeatKey] + 1;
            }
            // add a category repeat time counter end 

            for (var j = 0; j < answers[i].answer.length; j++) {
                var repeat = catRepeat[repeatKey];

                key = answers[i].category + "_" + answers[i].subCategory + "_" + repeat + "_" + j;
                newAnswersArray[key] = answers[i].answer[j];
            };

        };

        return newAnswersArray;
    }
    var getAnswer = function(key) {
        // var catRepeat = [];
        // var key = category+"_"+subCategory;

        // for (var i=0; i<answers.length; i++) {
        //     var answersItem = answers[i];
        //     if (answersItem.category==category && subCategory==subCategory) {
        //         if (!catRepeat[key]) {
        //             catRepeat[key]=0;
        //         } else {
        //             catRepeat[key]=1;
        //         }

        //         if (catRepeat[key] != repeat) {continue;}

        //         for (var j=0; j<answersItem.answer.length; j++) {
        //             if (j==answerIndex) {
        //                 return answersItem.answer[j];
        //             }
        //         }

        //     }

        // }
        return arry[key];
    };

    var makePersonInfo = function() {
        return {
            "title": "个人信息",
            "category": "00",
            "subCategory": "0001",
            "type": 1,
            "isCheck": "",
            "answer": [{
                "content": "来者何人，报上名来！",
                "value": ""
            }, {
                "content": "生日",
                "value": ""
            }, {
                "content": "性别",
                "value": ""
            }]
        }
    }


    var setAppearAnimation = function(sliderNumber) {
        //init animation 
        //
        $('.up-appear').removeClass('up-appear');
        $('.down-appear').removeClass('down-appear');
        $('.left-appear').removeClass('left-appear');
        $('.right-appear').removeClass('right-appear');
        //image
        //$('.main-img').eq(sliderNumber).addClass("up-appear");
        //$('.aid-img').eq(sliderNumber).addClass("down-appear delay-1");
        //question form
        // var questionForm = $('.form-content').eq(sliderNumber);
        // 
        //  $(questionForm).find('.question-one .question-content').addClass("left-appear delay-1");
        //  $(questionForm).find('.question-one input').addClass("left-appear delay-1");
        // $(questionForm).find('.question-two .question-content').addClass("right-appear delay-2");
        // $(questionForm).find('.question-two input').addClass("right-appear delay-2");
        //$(questionForm).find(".question-three .question-content").addClass("left-appear delay-3");

        //$(questionForm).find(".question-one").find(".radio-btn a:eq(0)").addClass("left-appear delay-2");
        //$(questionForm).find(".question-one").find(".radio-btn a:eq(1)").addClass("right-appear delay-2");
        //$(questionForm).find(".question-two").find(".radio-btn a:eq(0)").addClass("left-appear delay-3");
        //$(questionForm).find(".question-two").find(".radio-btn a:eq(1)").addClass("right-appear delay-3");
        //$(questionForm).find(".question-three").find(".radio-btn a:eq(0)").addClass("left-appear delay-4");
        //$(questionForm).find(".question-three").find(".radio-btn a:eq(1)").addClass("right-appear delay-4");

        // radio-left left-appear
    }
    var setDisappearAnimation = function(sliderNumber) {
        $('.up-disappear').removeClass('up-disappear');
        $('.right-disappear').removeClass('right-disappear');

        $('.img-show').eq(sliderNumber).addClass('up-disappear');
        $('.form-content').eq(sliderNumber).addClass('right-disappear');
    }
    $scope.form.postData = {
        answer: []
    };
    var flexsliderIndex = 0;
    $scope.initQuestionAnimation = function($scope) {


        $('.flexslider').flexslider({
            animation: "slide",
            animationSpeed: 0,
            // controlNav: false,
            direction: "vertical",
            slideshow: false,
            directionNav: true,
            prevText: "上一页",
            nextText: "下一页",
            touch: false,
            // manualControlEvent: "hover",
            start: function(slider) {
                setAppearAnimation(slider.animatingTo + 1);
            },
            before: function(slider) {
                if (flexsliderIndex == slider.count) {
                    $timeout(function() {

                    })
                    return
                } else {
                    setAppearAnimation(slider.animatingTo + 1);
                }
            },
            end: function(slider) {
                flexsliderIndex = (slider.animatingTo + 1);
            }
        });
    }

    //set slide items height
    var slideRepeateLastFunc = $scope.$on('onRepeatLast', function(scope, element, attrs) {
        //if finished the question loading, set the question page height

        if (element.parent().hasClass("slides")) {
            $scope.initQuestionAnimation($scope);

            $('.slides').css('opacity', 1);
            $('.slides li').css('height', document.documentElement.clientHeight - 44);
            $('.slides li').css('overflow', 'auto');
            $('.slides li').css('-webkit-overflow-scrolling', 'touch');
             

            //初始化生日日期插件 开始

             var curDate =new Date();
                        var birthdayOpt = {
                            theme: 'ios',
                            mode: 'scroller',
                            display: 'bottom',
                            lang: 'zh',
                            dateOrder: 'yyyymmdd',
                            dateFormat: 'yy-mm-dd',
                            defaultValue: new Date('1990','0','1'),
                            maxDate: new Date(curDate.getTime() - 24*60*60*1000)
                        }

            setTimeout(function() {
                 $('.birthday').mobiscroll().date(birthdayOpt);
            })

            //初始化生日日期插件 结束

            var heightOpt={
                            theme: 'ios',
                            lang: 'zh',
                            display: 'bottom',
                            defaultValue: '160',
                            onSelect: function(val) {
                                angular.element($("#height-1")).scope().setHeightValue(angular.element($("#height-1")).scope().answer.value)
                            }
                        }               
            setTimeout(function() {
                 $('.height').mobiscroll().select(heightOpt);
            })

            var weightOpt={
                            theme: 'ios',
                            lang: 'zh',
                            display: 'bottom',
                            defaultValue: '55',
                            onSelect: function(val) {
                                angular.element($("#weight-1")).scope().setWeightValue(angular.element($("#weight-1")).scope().answer.value)
                            }
                        }               
            setTimeout(function() {
                 $('.weight').mobiscroll().select(weightOpt);
            })

            var waterOpt={
                            theme: 'ios',
                            lang: 'zh',
                            display: 'bottom',
                            defaultValue: '3',
                            onSelect: function(val) {
                                angular.element($("#water-1")).scope().setWaterValue(angular.element($("#water-1")).scope().answer.value);
                                angular.element($("#water-1")).scope().rulerChangeFn(angular.element($("#water-1")).scope().answer);
                            }
                        }               
            setTimeout(function() {
                 $('.water').mobiscroll().select(waterOpt);
            })

            var workWheel=[
                [
                    {
                        values:workTimeRuler
                    },
                    {
                        values:bicyclingTimeRuler
                    }
                ]
            ];
            var workOpt={
                            theme: 'ios',
                            lang: 'zh',
                            display: 'bottom',
                            wheels: workWheel,
                            parseValue: function (val) {
                                    return [0, 30];
                            },
                            onSelect: function(val) {
                                var selVal=val.split(' ')
                                $scope.form.work=selVal[0];
                                $scope.form.bicycling=selVal[1];
                                angular.element($("#work-1")).scope().setWorkValue(selVal[0]);
                                angular.element($("#bicycling-1")).scope().setBicyclingValue(selVal[1]);
                            }
                        }       
            $('.bicycling').click(function(){
                    $('.work').mobiscroll('show'); 
                }); 
            $('.workInput').click(function(){
                $('.work').mobiscroll('show'); 
            });     
                   
            setTimeout(function() {
                $('.work').mobiscroll().scroller(workOpt);                
            })


            //
             var sportWheel=[
                [
                    {
                        values:sportNumRuler
                    },
                    {
                        values:sportTimeRuler
                    }
                ]
            ];
            var sportOpt={
                            theme: 'ios',
                            lang: 'zh',
                            display: 'bottom',
                            wheels: sportWheel,
                            parseValue: function (val) {
                                    return [0, 0];
                            },
                            onSelect: function(val) {
                                var selVal=val.split(' ');
                                angular.element($("#sleepTime-1")).scope().form.answers[3].answer[0].value=selVal[0];
                                angular.element($("#sleepTime-1")).scope().form.answers[3].answer[1].value=selVal[1];
                                angular.element($("#sportNum-1")).scope().setSportNumValue(selVal[0]);
                                angular.element($("#sportTime-1")).scope().setSportTimeValue(selVal[1]);
                            }
                        }               
            setTimeout(function() {
                $('.sportNum').mobiscroll().scroller(sportOpt);
                $('.sportTime').click(function(){
                    $('.sportNum').mobiscroll('show'); 
                        return false;
                });
                $('.sportNumInput').click(function(){
                    $('.sportNum').mobiscroll('show'); 
                        return false;
                });
            }) 


            //初始化起床时间插件 开始
            $('.getUpTime').mobiscroll().time({
                theme: 'ios',
                mode: 'scroller',
                display: 'bottom',
                lang: 'zh',
                onSelect: function(val) {
                    angular.element($("#getUpTime-1")).scope().rulerChangeFn(angular.element($("#getUpTime-1")).scope().answer)
                }
            });
            //初始化起床时间插件 结束

            //初始化起床时间插件 开始
            $('.sleepTime').mobiscroll().time({
                theme: 'ios',
                mode: 'scroller',
                display: 'bottom',
                lang: 'zh',
                onSelect: function(val) {
                    //angular.element($("#sleepTime-1")).scope().answer.value="";
                    //angular.element($("#sleepTime-1")).scope().answer.value=val;
                    angular.element($("#sleepTime-1")).scope().rulerChangeFn(angular.element($("#sleepTime-1")).scope().answer)
                }
            });
            //初始化起床时间插件 结束
            $scope.$watch("form.work", function(newV, oldV) {
                //console.log(newV +" " +oldV);
                newV = newV || "0";
                if ($scope.form.bicycling == "") {
                    $scope.form.bicycling = 0
                };
                var minutes = parseInt(newV, 10) * 60;


                minutes = minutes + parseInt($scope.form.bicycling, 10);
                newAnswersArray["06_0601_0_0"].value = minutes;
            }, true)


            $scope.$watch("form.bicycling", function(newV, oldV) {
                if ($scope.form.work == "") {
                    $scope.form.work = 0
                };
                newV = newV || "0"
                var minutes = parseInt(newV, 10);


                minutes = minutes + parseInt($scope.form.work, 10) * 60;

                newAnswersArray["06_0601_0_0"].value = minutes;
            }, true)

            $scope.$watch("form.water", function(newV, oldV) {
                //console.log(newV +" " +oldV);   

                var reg = new RegExp("^[0-9]*$");
                if (newV == oldV && !reg.test(newV)) {
                    $scope.form.water = ""
                    newAnswersArray["05_0502_1_0"].value = '';
                } else if (newV != oldV && !reg.test(newV)) {
                    $scope.form.water = oldV;
                    newAnswersArray["05_0502_1_0"].value = oldV;
                } else {
                    $scope.form.water = newV
                    newAnswersArray["05_0502_1_0"].value = newV;
                }
                if (newV != oldV && newV != undefined && newV != 0) {
                    $("._05_0502_0_2").removeClass('hide');
                }
            })

            $scope.$watch("form.name", function(newV, oldV) {
                if (newV == undefined)
                    return
                var bytesCount = $scope.bytesCount(newV);
                var pat = new RegExp("[a-zA-Z\u4e00-\u9fa5 ]");
                if (newV != oldV && newV != '') {

                    for (var i = 0; i < newV.length; i++) {
                        var newChar = newV[i];
                        if (pat.test(newChar) && bytesCount <= 20) {
                            newAnswersArray["00_0001_0_0"].value = newV;
                        } else {
                            $scope.form.name = oldV;
                            newAnswersArray["00_0001_0_0"].value = oldV;
                            return;
                        }
                    };
                } else {
                    if (pat.test(newV) && bytesCount <= 20) {
                        newAnswersArray["00_0001_0_0"].value = newV;
                    } else {
                        $scope.form.name = "";
                        newAnswersArray["00_0001_0_0"].value = "";
                    }
                }
            }, true)
        }

        $scope.bytesCount = function(str) {
            var bytesCount = 0;
            for (var i = 0; i < str.length; i++) {
                var c = str.charAt(i);
                if (/^[\u0000-\u00ff]$/.test(c)) {
                    bytesCount += 1;
                } else {
                    bytesCount += 2;
                }
            }
            return bytesCount;
        }
        $timeout(function(){
            $(".li1").click();
            $(".li0").click();

            //$scope.$off('onRepeatLast');
            //slideRepeateLastFunc();
        },600);

    });

    
    

    $scope.getUpTimeClick=function(){
        $('.getUpTime').mobiscroll('show');
    }
    $scope.sleepTimeClick=function(){
        $('.sleepTime').mobiscroll('show');
    }
    $scope.birthdayClick=function(){
        $('.birthday').mobiscroll('show');
    }
    //查找josn中的需要的key.
    function getMappingValue(category, subCategory, times, defaultMappingValue) {
        var mapping = getQuestionMapping();
        for (var i = 0; i < mapping.length; i++) {
            var obj = mapping[i];

            if (!obj.times) {
                obj.times = 1
            };

            if (obj.category == category && obj.subCategory == subCategory && obj.times == times) {
                return obj;
            }
        }
        return defaultMappingValue;
    }

    $scope.checkButton = function(item, isCheck, event) {
        
        var closeDiv = $(event.target).offset().top;
        var closeLi = $($(event.target).closest("li")).offset().top;
        var height = closeDiv - closeLi;
        // $timeout(function() {
        //     $($(event.target).closest("li")).scrollTop(closeDiv - closeLi);
        // }, 400);
        // $($(event.target).closest("li")).stop().animate({
        //      'scrollTop': height
        // }, 400, 'swing');
        var aItem = $(event.target).closest("a");
        if (!(aItem.hasClass("on") || aItem.siblings().hasClass("on"))) {
            $($(event.target).closest("li")).stop().animate({
                 'scrollTop': height
            }, 400, 'swing');
        };
        
        if (item.key == "05_0502_0_2") {
            $("._05_0502_0_0").removeClass('hide');
        } else if (item.key == "05_0502_0_0") {
            $("._05_0502_0_1").removeClass('hide');
        } else if (item.key == "05_0502_0_1") {
            $("._05_0502_0_3").removeClass('hide');
        } else if (item.key == "05_0502_0_3") {
            $("._05_0502_0_4").removeClass('hide');
        }
        if (isCheck) {
            $timeout(function(){
                item.isCheck = "1";
                item.value = item.resultId;
            },1);
            

        } else {
            $timeout(function(){
                item.isCheck = "0";
                item.value = "";
            },1);
            
        }

        
    }

    $scope.rulerChangeFn = function(item) {
        //var closeLi = $($("._07_0701_0_1")[0].closest("li")).offset().top;
        //var moveLi = $("._07_0701_0_1")[0].closest("li");
        var closeLi = $($("._07_0701_0_1")[0]).closest("li").offset().top;
        var moveLi = $($("._07_0701_0_1")[0]).closest("li");

        var closeDiv = 0;
        if (item.key == '07_0701_0_1') {
            $timeout(function(){
                $scope.upTimeValue=item.value;
            })
            
            $("._07_0701_0_0").removeClass('hide');
            closeDiv = $($("._07_0701_0_0")[0]).offset().top;
            
            // 
        } else if (item.key == '07_0701_0_0') {
            $timeout(function(){
                $scope.sleepTimeValue=item.value;
            })
            
            $("._06_0601_0_0").removeClass('hide');
            $("._06_0601_0_0").parent("div").addClass("margin-bottom-90");
            closeDiv = $($("._06_0601_0_0")[0]).offset().top+90;
            $scope.walkTimeRefresh =true;//change the refresh value, let the scroll ui scroll to default value;
            $scope.bicyclingRefresh =true;//change the refresh value, let the scroll ui scroll to default value;

            
        } else if (item.key == '05_0502_1_0') {
            $("._05_0502_0_2").removeClass('hide');
            closeDiv = $($("._05_0502_0_2")[0]).offset().top;
        } else if (item.key == '06_0601_0_0') {
             $("._06_0602_0_0").removeClass('hide');
                $("._06_0602_0_1").removeClass('hide');
                closeDiv = $($("._06_0602_0_0")[0]).offset().top;
                $scope.sportNumRefresh = true;
                $scope.sportTimeRefresh = true;
        }else{
            closeDiv = $($("._06_0602_0_0")[0]).offset().top;
        }

        // $timeout(function() {
        //     $(moveLi).scrollTop(closeDiv - closeLi);
        // }, 400);
        var height = closeDiv - closeLi;
        $(moveLi).stop().animate({
             'scrollTop': height
        }, 400, 'swing');

        $scope.$watch("form.bicycling", function(newV, oldV) {
            if (newV != oldV && newV != undefined && newV != 0) {
                $("._06_0602_0_0").removeClass('hide');
                $("._06_0602_0_1").removeClass('hide');
                closeDiv = $($("._06_0602_0_0")[0]).offset().top;
                $scope.sportNumRefresh = true;
                $scope.sportTimeRefresh = true;

                var height = closeDiv - closeLi;
                $(moveLi).stop().animate({
                     'scrollTop': height
                }, 400, 'swing');

            }
        }, true)
        

    }

    $scope.rulerClass = function(item) {
        var className = '';
        var key = item.key;
        if (key == "07_0701_0_1") {
            className = "demo-cont";
        } else if (key == "07_0701_0_0") {
            className = "demo-cont hide";
        } else {
            className = "hide";
        }
        key = "_" + key;
        className = className + " " + key;
        return className;
    }

    $scope.checkClass = function(item) {
        var className = '';
        var key = item.key;
        key = "_" + key;
        className = "radio-btn hide " + " " + key;
        return className;
    }

    $scope.checkSexButton = function(item, isCheck) {
        if (isCheck) {
            item.isCheck = "1";
            item.value = 1;

        } else {
            item.isCheck = "0";
            item.value = 2;
        }
    }

    $scope.getRightButtonStatus = function(item) {
        if (item.isCheck == "1") {
            return "on";
        } else {
            return "";
        }
    }

    $scope.getWrongButtonStatus = function(item) {
        if (item.isCheck == "0") {
            return "on";
        } else if (item.isCheck == "") {
            return " ";
        } else {
            return " ";
        }
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

    $scope.setCupStatus = function(item, idx) {
        for (var i = 0; i < $scope.totleCups.totleCups.length; i++) {
            if (i < idx) {
                $scope.totleCups.totleCups[i].isEmpty = false;

            } else if (i == idx) {
                $scope.totleCups.totleCups[i].isEmpty = !$scope.totleCups.totleCups[i].isEmpty;

            } else if (i > idx) {
                $scope.totleCups.totleCups[i].isEmpty = true;

            }
        }

        $scope.form.water = $scope.totleCupsLength();

    }


    // 设置两条竖尺组合在一起
    $scope.getDivClass = function(item) {
        if (item.key == "06_0602_0_0") {
            return "text-right week-train question";
        };
        if (item.key == "06_0602_0_1") {
            return "motion-time text-left question";
        };
        return "question";
    }

    $scope.prevButtom = function(item) {
        $scope.backButton = item - 2;
        var clickItem = '';
        var clickItemIndex = item -1;
        clickItem = '.li' + clickItemIndex;
        $(clickItem).click();
        
    }
    $scope.prevClass = function(item) {
        if (item == 0) {
            return "hide";
        };
        return "question-button black-bg";

    }
    $scope.heightValue="";
    $scope.weightValue="";
    $scope.workValue="";
    $scope.bicyclingValue="";
    $scope.sportNumValue="";
    $scope.sportTimeValue="";
    $scope.waterValue="";
    $scope.birthdayValue="";

    $scope.setHeightValue=function(val){
        $timeout(function(){
            $scope.heightValue=val;
        })
        
    }
    $scope.setWeightValue=function(val){
        $timeout(function(){
            $scope.weightValue=val;
        })
    }
    $scope.setWorkValue=function(val){
        $timeout(function(){
            $scope.workValue=val;
        })
    }
    $scope.setBicyclingValue=function(val){
        $timeout(function(){
            $scope.bicyclingValue=val;
        })
    }
    $scope.setSportNumValue=function(val){
        $timeout(function(){
            $scope.sportNumValue=val;
        })
    }
    $scope.setSportTimeValue=function(val){
        $timeout(function(){
            $scope.sportTimeValue=val;
        })
    }
    $scope.setWaterValue=function(val){
        $timeout(function(){
            $scope.waterValue=val;
        })
    }
    $scope.setBirthdayValue=function(val){
        $scope.birthdayValue=val;
    }

    $scope.nextButtom = function(item, answer) {
        $scope.backButton = item;
        var checkItem = $scope.form.answers[4].answer;
        if (item == 0) {
            if($scope.heightValue==''||$scope.weightValue==''){
                // $scope.$root.showAlert("您还有题目没做完哦！");
                $('.healthy-question').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+"您还有题目没做完哦！"+'</span></div>')
                setTimeout(function(){
                    $('.errorMsgShow').remove();
                },2000)
                return;
            }
            $(".li1").click();
        } else if (item == 1) {
            for (var i = 0; i < checkItem.length; i++) {
                if (checkItem[i].isCheck=="-1") {
                    // $scope.$root.showAlert("您还有题目没做完哦！");
                $('.healthy-question').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+"您还有题目没做完哦！"+'</span></div>')
                setTimeout(function(){
                    $('.errorMsgShow').remove();
                },2000)
                    return;
                };
            };
            $(".li2").click();
        } else if (item == 2) {
            if ($scope.workValue+''==''||$scope.bicyclingValue+''==''||
                $scope.sportNumValue+''==''||$scope.sportTimeValue+''=='') {
                // $scope.$root.showAlert("您还有题目没做完哦！");
                $('.healthy-question').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+"您还有题目没做完哦！"+'</span></div>')
                setTimeout(function(){
                    $('.errorMsgShow').remove();
                },2000)
                return;
            };
            $(".li3").click();
        }
    }
$scope.submit="完成";
    $scope.sibmitClass = function(){
        var personItem = $scope.form.answers[6].answer;
        var sibmitClass = "";
        var submitTemp = false;
        if (personItem[0].value == "" ||$scope.birthdayValue==''|| !(personItem[2].hasOwnProperty("isCheck"))) {
            sibmitClass = "question-button disable";
            $scope.submitTemp = false;
        }else{
            sibmitClass = "question-button";
            submitTemp = true;
            $scope.submitTemp = submitTemp;
        }

        // if(!submitting){
        //     sibmitClass = "question-button disable";
        // }
        
        return sibmitClass;
    }
    $scope.submitting=true;
    $scope.sibmitButtom = function() {
        if ($scope.submitTemp) {
            $scope.backButton = "";
            $scope.submitting=false;
            var json = $scope.form.answers;
            var answers = $scope.form.postData.answer;

            var catSubCatTimes = [];
            for (var i = 0, l = json.length; i < l; i++) {
                //for(var key in json[i]){
                //alert(key+':'+json[i][key]);
                // alert('category'+':'+json[i].category);
                // alert('subCategory'+':'+json[i].subCategory);
                //alert('answer'+':'+json[i].answer[0].value);
                var qAnswer = json[i].answer;
                var timeKey = json[i].category + "_" + json[i].subCategory;
                if (catSubCatTimes[timeKey]) {
                    catSubCatTimes[timeKey] = catSubCatTimes[timeKey] + 1;
                } else {
                    catSubCatTimes[timeKey] = 1;
                }
                //catSubCatTimes[timeKey] = (!catSubCatTimes[timeKey])? 1:catSubCatTimes[timeKey]++;
                var values = '';
                var mapping = getMappingValue(json[i].category, json[i].subCategory, catSubCatTimes[timeKey], {
                    connector: "&&",
                    isResultId: false
                });
                var resultIds = '';
                for (var j = 0; j < qAnswer.length; j++) {
                    var connector = "";
                    var resultIdConnector = "";
                    if (values != "") {
                        connector = mapping.connector;
                    }

                    if (resultIds != "") {
                        resultIdConnector = mapping.connector;
                    }

                    values = values + connector + qAnswer[j].value;
                    resultIds = resultIds + resultIdConnector + qAnswer[j].resultId;

                }

                //Server Question and answer in 07_0701 is swap... History mistake...
                if (json[i].category + "_" + json[i].subCategory == "07_0701") {
                    var data = values.split("&&");
                    values = data[0] + "&&" + data[1];
                }


                answers[i] = {};
                if (json[i].category == 00) {
                    //var firstIndex = values.indexOf('&&');
                    //values = values.substring(firstIndex + 2, values.length);
                    //values in name, BOD, sexy, just use Sexy + BOD
                    var data = values.split("&&");
                    values = data[2] + "&&" + data[1];


                };
                answers[i].category = json[i].category;
                answers[i].subCategory = json[i].subCategory;
                answers[i].value = values;
                if (mapping.isResultId) {
                    //console.log(mapping);
                    answers[i].resultId = resultIds;
                }

            }

            var getSubmitEltResultApiUrl = cignaDomain + getSubmitBaseResultApi;
            // var getSubmitEltResultApiUrl = cignaDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getSubmitEltResultApi;
            $scope.form.questionResult = [];
            $.ajax({
                type: $scope.form.postType,
                url: getSubmitEltResultApiUrl,
                context: document.body,
                data: {
                    data: JSON.stringify($scope.form.postData)
                },
                success: function(data) {
                    $scope.submitting=true;
                    if (data.statusCode != 200) {
                        $scope.$root.getErrorCodeMsg(data.msg);
                        return;
                    }
                    $timeout(function() {
                        var answerList = $scope.form.pages;
                        for (var i = 0; i < answerList.length; i++) {
                            var answerItem = answerList[i].answers;
                            for (var j = 0; j < answerItem.length; j++) {
                                answerObj = answerItem[j];
                                if (answerObj.isCheck != undefined && answerObj.isCheck < 0) {
                                    $('.flexslider').flexslider(i);
                                    return;
                                }
                            }

                        };
                        //提取提交问题答案后数据
                        var submitData = data.data;
                        var suggestion = submitData.suggestion[0];
                        if (suggestion == undefined) {
                            submitData.suggestion = [];
                            submitData.suggestion[0] ={};
                            submitData.suggestion[0].title = "您属于正常人类，继续保持！";
                        }else if (suggestion.title == "") {
                            suggestion.title = "您属于正常人类，继续保持！";
                        };
                        $scope.form.questionResult = submitData;

                        localStorage.setItem("isAnswer", aesEncrypt(1, ys));
                        localStorage.setItem("nickName", aesEncrypt(personInfo.answer[0].value, ys));
                        localStorage.setItem("birthday", aesEncrypt(personInfo.answer[1].value, ys));
                        localStorage.setItem("sex", aesEncrypt(personInfo.answer[2].value, ys));
                        $location.path("/questionResult");
                        localStorage.setItem('answersList', aesEncrypt(JSON.stringify($scope.form.postData), ys));
                    })
                    // $scope.form.questionResult;
                    //console.log(data);
                    //
                },
                error: function(e) {
                      $scope.submitting=true;
                    $scope.$root.getReadyStateMsg(e.readyState);
                }
            });
        }else{
            return;
        }
    }

    $(".healthy-question").on("touchstart", function(e) {
        if (e.target.className.indexOf("myscrollE") >= 0) {
            e.preventDefault();
            isMyScrollE = true;
        }
    });

    $(document).on("touchend", function(e) {

        isMyScrollE = false;

    });

    $(".healthy-question").on("touchmove", function(e) {

        if (isMyScrollE) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
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

    return;
}];

app.directive('rulerChange', function() {
    return {
        restrict: 'A',
        scope: {},
        link: function(scope, elm, attr) {
            elm.on('change', function() {
                console.log(this.val());
            })
        }
    };
});


// HEALTHY QUESTION PAGE END
