var loadingHtml = $('.loading').html();
var app = angular.module("app", ['ngRoute','ngIOS9UIWebViewPatch', 'ngSanitize', 'ngResource', 'chart.js', 'myScroll', 'fundoo.services','hmTouchEvents']);
var configFn = ['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'empty.html',
        controller: TopGradeCtrl
    }).
    when('/useIntroduction', {
        templateUrl: 'useIntroduction.html',
        controller: UseIntroductionCtrl
    }).
    when('/date', {
        templateUrl: 'date.html', //日期
        controller: DateCtrl
    }).
    when('/bind', {
        templateUrl: 'bind.html',
        controller: BindCtrl
    }).
    when('/healthyQuestion', {//已移除
        templateUrl: 'healthyQuestion.html',
        controller: HealthyQuestionCtrl
    }).
    when('/questionResult', {
        templateUrl: 'questionResult.html',
        controller: QuestionResultCtrl
    }).
    when('/myHealthy', {
        templateUrl: 'myHealthy.html',
        controller: MyHealthyCtrl
    }).
    when('/healthyStatus', {
        templateUrl: 'healthyStatus.html',
        controller: HealthyStatusCtrl
    }).
    when('/healthyTask', {
        templateUrl: 'healthyTask.html',
        controller: HealthyTaskCtrl
    }).
    when('/healthyTaskSet', {
        templateUrl: 'healthyTaskSet.html',
        controller: HealthyTaskSetCtrl
    }).
    when('/westernQuiz/:testId', {
        templateUrl: 'westernQuiz.html',
        controller: WesternQuizCtrl
    }).
    when('/westernQuizReport/:testId', {
        templateUrl: 'westernQuizReport.html',
        controller: WesternQuizReportCtrl
    }).
    when('/WQuizReportDetail/:testId', {
        templateUrl: 'WQuizReportDetail.html',
        controller: WQuizReportDetailCtrl
    }).
    when('/chineseQuiz', {
        templateUrl: 'chineseQuiz.html',
        controller: ChineseQuizCtrl
    }).
    when('/chineseQuizReport', {
        templateUrl: 'chineseQuizReport.html',
        controller: ChineseQuizReportCtrl
    }).
    when('/CQuizReportDetail', {
        templateUrl: 'CQuizReportDetail.html',
        controller: CQuizReportDetailCtrl
    }).
    when('/myCommunity', {//我的社区
        templateUrl: 'myCommunity.html',
        controller: MyCommunityCtrl
    }).
    // when('/share', {
    //     templateUrl: 'share.html',
    //     controller: ShareCtrl
    // }).
    when('/personalFile', {
        templateUrl: 'personalFile.html',
        controller: PersonalFileCtrl
    }).
    when('/addFriend', {
        templateUrl: 'addFriend.html',
        controller: AddFriendCtrl
    }).
    when('/friendMycode', {
        templateUrl: 'friendMycode.html',
        controller: FriendMycodeCtrl
    }).
    when('/addFriendcode', {
        templateUrl: 'addFriendcode.html',
        controller: AddFriendcodeCtrl
    }).
//  when('/mailBox', {
//      templateUrl: 'mailBox.html',
//      controller: MailBoxCtrl
//  }).
    when('/line', {
        templateUrl: 'line.html',
        controller: LineCtrl
    }).
    when('/demo', {
        templateUrl: 'demo.html',
        controller: DemoCtrl
    }).
    when('/rankingList', {
        templateUrl: 'rankingList.html',
        controller: RankingListCtrl
    }).
    when('/bankCard', {
        templateUrl: 'bankCard.html',
        controller: BankCardCtrl
    }).
    when('/battleGroup', {
        templateUrl: 'battleGroup.html',
        controller: BattleGroupCtrl
    }).
    when('/popup', {
        templateUrl: 'popup.html',
        controller: PopupCtrl
    }).
    when('/challengeRanking', {
        templateUrl: 'challengeRanking.html',
        controller: ChallengeRankingCtrl
    }).
    when('/communityCreate', {
        templateUrl: 'communityCreate.html',
        controller: communityCreateCtrl
    }).
    when('/choosePlayer', {
        templateUrl: 'choosePlayer.html',
        controller: ChoosePlayerCtrl
    }).
    when('/createDetails', {
        templateUrl: 'createDetails.html',
        controller: CreateDetailsCtrl
    }).
    when('/challengeAdmin', {
        templateUrl: 'challengeAdmin.html',
        controller: ChallengeAdminCtrl
    }).
    when('/challengeUser', {
        templateUrl: 'challengeUser.html',
        controller: ChallengeUserCtrl
    }).
    when('/challengeBattle', {
        templateUrl: 'challengeBattle.html',
        controller: ChallengeBattleCtrl
    }).
    when('/feedBack', {
        templateUrl: 'feedBack.html',
        controller: FeedBackCtrl
    }).
    when('/managemant', {
        templateUrl: 'managemant.html',
        controller: ManagemantCtrl
    }).
    when('/tutorial', {
        templateUrl: 'tutorial.html',
        controller: TutorialCtrl
    }).
    when('/healthyTroubleList', {
        templateUrl: 'htList.html',
        controller: HTListCtrl
    }).
    when('/healthyTroubleDetail/:detailId', {
        templateUrl: 'htDetail.html',
        controller: HTDetailCtrl
    }).
    when('/healthyTroubleInfo/:detailId/:infoId', {
        templateUrl: 'htInfo.html',
        controller: HTInfoCtrl
    }).
    when('/topicList', {
        templateUrl: 'topicList.html',
        controller: topicListCtrl
    }).
    when('/topicDetail/:detailId', {
        templateUrl: 'topicDetail.html',
        controller: topicDetailCtrl
    }).
    when('/exchangeList', {
        templateUrl: 'exchangeList.html',
        controller: ExchangeListCtrl
    }).
    when('/exchangeDetail/:detailId', {
        templateUrl: 'exchangeDetail.html',
        controller: ExchangeDetailCtrl
    }).
    when('/exchangeOccupation/:detailId', {
        templateUrl: 'exchangeOccupation.html',
        controller: ExchangeOccupationCtrl
    }).
    when('/exchangeResult', {
        templateUrl: 'exchangeResult.html',
        controller: ExchangeResultCtrl
    }).
    when('/exchangeNotice/:detailId', {
        templateUrl: 'exchangeNotice.html',
        controller: ExchangeNoticeCtrl
    }).
    when('/exchangeClause/:detailId', {
        templateUrl: 'exchangeClause.html',
        controller: ExchangeClauseCtrl
    }).
    when('/healthyQuestionnaires', {
        templateUrl: 'healthyQuestionnaires.html',
        controller: HealthyQuestionnairesCtrl
    }).
    when('/healthyQuestionnairesSuccess', {
        templateUrl: 'healthyQuestionnairesSuccess.html',
        controller: HealthyQuestionnairesSuccessCtrl
    }).
    //跑团
    //跑团入口
    when('/jogGroup', {
        templateUrl: 'jog/JogGroup.html',
        controller: JogGroupCtrl
    }).
    //加入跑团
    when('/joinJogGroup', {
        templateUrl: 'jog/JoinJogGroup.html',
        controller: JoinJogGroupCtrl
    }).
    //更多跑团
    when('/moreJogGroup', {
        templateUrl: 'jog/MoreJogGroup.html',
        controller: MoreJogGroupCtrl
    }).
    //查找跑团
    when('/searchJogGroup', {
        templateUrl: 'jog/SearchJogGroup.html',
        controller: SearchJogGroupCtrl
    }).
    //创建跑团
    when('/createJogGroup', {
        templateUrl: 'jog/CreateJogGroup.html',
        controller: CreateJogGroupCtrl
    }).
    //跑团详情
    when('/jogGroupDetails/:groupId', {
        templateUrl: 'jog/JogGroupDetails.html',
        controller: JogGroupDetailsCtrl
    }).
    //跑团成员
    when('/jogGroupMembers/:groupId', {
        templateUrl: 'jog/JogGroupMembers.html',
        controller: JogGroupMembersCtrl
    }).
    //指定团长
    when('/selectLeader/:groupId', {
        templateUrl: 'jog/SelectLeader.html',
        controller: SelectLeaderCtrl
    }).
    //跑团排行
    when('/jogGroupTop', {
        templateUrl: 'jog/JogGroupTop.html',
        controller: JogGroupTopCtrl
    }).
    //排行榜（团员）
    when('/joggersTop/:groupId', {
        templateUrl: 'jog/JoggersTop.html',
        controller: JoggersTopCtrl
    }).
    //消息
    when('/messagePortal', {
        templateUrl: 'jog/message/MessagePortal.html',
        controller: MessagePortalCtrl
    }).
    //好友请求
    when('/friendApplyMessage', {
        templateUrl: 'jog/message/FriendApplyMessage.html',
        controller: FriendApplyMessageCtrl
    }).
    //跑团消息
    when('/jogGroupMessage', {
        templateUrl: 'jog/message/JogGroupMessage.html',
        controller: JogGroupMessageCtrl
    }).
    //团战消息
    when('/groupPkMessage', {
        templateUrl: 'jog/message/GroupPkMessage.html',
        controller: GroupPkMessageCtrl
    }).
    //END 跑团
    //评测门户
    when('/testPortal', {
        templateUrl: 'testPortal.html',
        controller: TestPortalCtrl
    }).
    when('/ageGender/:testId', {
        templateUrl: 'ageGender.html',
        controller: AgeGender
    }).
    otherwise({
        redirectTo: '/'
    });
}]
app.config(configFn);

//ng-repeat循环最后一次时触发onRepeatLast事件
app.directive('onLastRepeat', function() {
    return function(scope, element, attrs) {
        if (scope.$last) setTimeout(function() {
            scope.$emit('onRepeatLast', element, attrs);
        }, 1);
    };
})

//input的邮箱校验
app.directive('validateEmail', function() {
  var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

  return {
    require: 'ngModel',
    restrict: '',
    link: function(scope, elm, attrs, ctrl) {
      // only apply the validator if ngModel is present and Angular has added the email validator
      if (ctrl && ctrl.$validators.email) {

        // this will overwrite the default Angular email validator
        ctrl.$validators.email = function(modelValue) {
          return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
        };
      }
    }
  };
});

//三种过滤器，万以上缩写、补齐十位0、万以上小数点2位缩写
app.filter('convertMyriabitFilter', function(){
    return function(input){
        return input<10000?format_number(input):parseInt(input/10000) + '万';
    }
}).filter('addZeroFilter', function(){
    return function(input){
        return input>=10?input:'0'+input;
    }
}).filter('formatSteps', function(){    
    return function(input){
        return input<100000?format_number(input):input%10000==0?format_number(input/10000)+ '万':(input/10000).toFixed(2)>=1000?format_number((input/10000).toFixed(2)) + '万':(input/10000).toFixed(2) + '万';
    }
}).filter('formatSum',function(){
	//跑团里程数格式化
	return function(input){
		function _toDecimal2(num){
			if(num == 0) return num;
			var num = num.toString();
			var index = num.indexOf('.');
			if(index < 0){
				index = num.length;
				num += '.'; 
			};
			while(num.length <= index+2){
				num += '0';
			};
			return num;
		};
		return input > 10000000000 ? _toDecimal2(Math.floor((input/10000000000)*100)/100)+'百亿公里' : input > 10000000 ? _toDecimal2(Math.floor((input/10000000)*100)/100)+'千万公里' : input > 10000 ? _toDecimal2(Math.floor((input/10000)*100)/100)+'万公里' : _toDecimal2(Math.floor(input*100)/100)+'公里';
	};
});

//ios9的shim模组
angular.module('ngIOS9UIWebViewPatch', ['ng']).config(['$provide', function($provide) {
  'use strict';

  $provide.decorator('$browser', ['$delegate', '$window', function($delegate, $window) {

    if (isIOS9UIWebView($window.navigator.userAgent)) {
      return applyIOS9Shim($delegate);
    }

    return $delegate;

    function isIOS9UIWebView(userAgent) {
      return /(iPhone|iPad|iPod).* OS 9_\d/.test(userAgent) && !/Version\/9\./.test(userAgent);
    }

    function applyIOS9Shim(browser) {
      var pendingLocationUrl = null;
      var originalUrlFn= browser.url;

      browser.url = function() {
        if (arguments.length) {
          pendingLocationUrl = arguments[0];
          return originalUrlFn.apply(browser, arguments);
        }

        return pendingLocationUrl || originalUrlFn.apply(browser, arguments);
      };

      window.addEventListener('popstate', clearPendingLocationUrl, false);
      window.addEventListener('hashchange', clearPendingLocationUrl, false);

      function clearPendingLocationUrl() {
        pendingLocationUrl = null;
      }

      return browser;
    }
  }]);
}]);

//图表配置
var chartJsConfigFn = ['ChartJsProvider', function(ChartJsProvider) {
    ChartJsProvider.setOptions({
        colours: ["#5ecacc"],
        // datasets: [{
        //    fillColor: "rgba(94,202,204,0.2)",
        //    strokeColor: "rgba(94,202,204,1)",
        //    pointColor: "rgba(94,202,204,1)",
        //    pointStrokeColor: "rgba(94,202,204,0)",
        //    pointHighlightFill: "rgba(94,202,204,1)",
        //    pointHighlightStroke: "rgba(94,202,204,0.3)"
        // }],        
        bezierCurve: false,
        scaleOverride: false,
        maintainAspectRatio: false,
        scaleShowVerticalLines: false,
        datasetStrokeWidth : 1
    });
}]

app.config(chartJsConfigFn);

//初始化
var runFn = ['$rootScope', '$location', 'form','createDialog','$timeout', '$route',function($rootScope, $location, form, createDialogService,$timeout,$route) {

	//路由改变时加载loading界面
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        $('.loading').html(loadingHtml);
        $('.loading').show();
        $rootScope.form = form;
        $rootScope.form.isLoad = true;
    });

    $rootScope.$on("$routeChangeError", function(event, next, current){
        $('.loading').hide();
         $rootScope.showReload("网络不给力，请检查网络后再试试吧！"); 
    });

	//加载完成时初始化数据和隐藏loading界面
    $rootScope.$on("$routeChangeSuccess", function(event, next, current) {

        $rootScope.form = form;
        $rootScope.form.isLoad = false;
        $rootScope.form.topBar = {
                "showTopBar": false,
                "topBarTitle": "",
                "showLeftBtn": false,
                "leftBtnType": "",
                "leftBtnTitle": "",
                "showRightBtn": false,
                "rightBtnType": "",
                "rightBtnTitle": ""
            }
        $rootScope.form.userData.lang="zh_CN";
                    // 
        $rootScope.form.userData.phoneNum = aesDecrypt(localStorage.getItem('phoneNum'), ys);
        $rootScope.form.userData.userId = aesDecrypt(localStorage.getItem('userId'), ys);
        $rootScope.form.userData.session = aesDecrypt(localStorage.getItem('userSession'), ys);
        $rootScope.form.canShow=true;
        $rootScope.form.peopleIsRuning = false;
        // debugger;
        if(window.location.href.indexOf('#/')>0&&
			'loadedTemplateUrl' in next &&
            !next.loadedTemplateUrl.match('healthyQuestion')&&
            !next.loadedTemplateUrl.match('healthyTask')&&
            !next.loadedTemplateUrl.match('healthyStatus')&&
            !next.loadedTemplateUrl.match('westernQuiz')&&
            !next.loadedTemplateUrl.match('chineseQuiz')


            ){            
            $('.loading').hide();
        }
        
    });

    $rootScope.showReload=function(msg){       
        $timeout(function() {
            // if($('.healthyAssess-popup'))
            //     $('.healthyAssess-popup').remove();
            // $('#showAlertPopupTemplate').append('')
            createDialogService({
                id: 'editPersonalPopup',
                title: '',
                template: '<div class="healthyAssess-popup text-center">'+msg+'<div class="button-area"><button class="line-twobutton" ng-click="$modalCancel()">关闭页面</button><button class="line-twobutton" ng-click="$modalSuccess()">重试</button></div></div>',
                backdrop: true,
                controller: null,
                success: {
                    fn: function(){
                        $route.reload()
                    }
                },
                cancel:{
                    fn:function(){                               
                        if(browser.versions.ios){
                            window.location.href="http://cmbiphone/tool";
                        }else if(browser.versions.android){
                            window.location.href="http://cmbandroid/tool";
                        }      
                    }
                }
            }); 
        });
    }

    
    //自定义弹窗提示1

    $rootScope.showConfirmAlert = function(msg, success, cancel) {
        $timeout(function() {
            createDialogService({
                id: 'editPersonalPopup',
                title: '',
                template: '<div class="healthyAssess-popup text-center">' + msg + '<div class="button-area"><button class="line-twobutton" ng-click="$modalCancel()">取消</button><button class="line-twobutton" ng-click="$modalSuccess()">确定</button></div></div>',
                backdrop: true,
                controller: null,
                success: {
                    fn: function() {
                        if(success) success();
                    }
                },
                cancel: {
                    fn: function() {
                        if(cancel) cancel();
                    }
                }
            });

        });
    };

    $rootScope.showAlert=function(msg,callBack){       
        $timeout(function() {
            // if($('.healthyAssess-popup'))
            //     $('.healthyAssess-popup').remove();
            // $('#showAlertPopupTemplate').append('')
            createDialogService({
                id: 'editPersonalPopup',
                title: '',
                template: '<div class="healthyAssess-popup text-center">'+msg+'<div class="button-area"><button class="long-button" ng-click="$modalSuccess()">确定</button></div></div>',
                backdrop: true,
                controller: null,
                success: {
                    fn: function(){
                        if($rootScope.errorCode==-6||$rootScope.errorCode==-100||$rootScope.errorCode==2)
                        {          
                            localStorage.setItem('userId', '');               
                            if (browser.versions.ios) {
                                window.location.href = "http://cmbiphone/tool";
                            } else if (browser.versions.android) {
                                window.location.href = "http://cmbandroid/tool";
                            } 
                            return;
                        }
                        if(callBack!=undefined){
                        var callFn=callBack;
                        callFn();
                        }                    
                        $rootScope.oldValue='';
                    }
                },
                cancel:{
                    fn:function(){
                        if($rootScope.errorCode==-6||$rootScope.errorCode==-100||$rootScope.errorCode==2)
                        {                 
                            localStorage.setItem('userId', '');           
                            if (browser.versions.ios) {
                                window.location.href = "http://cmbiphone/tool";
                            } else if (browser.versions.android) {
                                window.location.href = "http://cmbandroid/tool";
                            } 
                            return;
                        }
                        if(callBack!=undefined){
                        var callFn=callBack;
                        callFn();
                        }
                        $rootScope.oldValue='';
                    }
                }
            }); 

             $rootScope.form.msg=msg; 
        });
    }
	//自定义弹窗提示2

    $rootScope.addlog = function(msg) {
        $rootScope.form.log = msg+"\n" +$rootScope.form.log ;
    }

    $rootScope.showMsg=function(msg,callBack){
        $timeout(function() {
            // if($('.healthyAssess-popup'))
            //     $('.healthyAssess-popup').remove();
            // $('#showAlertPopupTemplate').append('')
            $('.choose-player-popup').css('z-index','999');
            createDialogService({
                id: 'msgPopup',
                title: '',
                template: '<div class="healthyAssess-popup text-center" >'+msg+'<div class="button-area"><button class="long-button" ng-click="$modalSuccess()">确定</button></div></div>',
                backdrop: true,
                controller: null,
                success: {
                    fn: callBack
                },
                cancel:{
                    fn:callBack
                }
            }); 

             $rootScope.form.msg=msg; 
        });
    }

    $rootScope.showToast=function(msg, finish){
        if(msg != undefined && msg.length > 0) {
            $('.toast .msg').html(msg);
            $('.toast').fadeIn('fast', function() {
                setTimeout(function() {
                    $('.toast').fadeOut('slow');
                    if(finish) finish();
                }, 2000);
            });
        }
    }
    //连接提示
    var canShow=true;
    $rootScope.getReadyStateMsg=function(readyState,callback){  
        if(canShow)
        {
            canShow=false;
            if(readyState==0)
            {
                $rootScope.showAlert("网络不给力，请检查网络设置",function(){canShow=true;if(callback) callback();});
            }else{
                $rootScope.showAlert("服务器连接失败",function(){canShow=true;});
            } 
        }
    }
    
    //存疑
    $rootScope.oldValue="";
    $rootScope.newValue="";
    $rootScope.watchFn=function(){  
            $timeout(function() {                
                if($rootScope.newValue!=''&&$rootScope.newValue!=$rootScope.oldValue)
                {
                    $rootScope.oldValue=$rootScope.newValue;
                    $rootScope.newValue="";
                    $rootScope.showAlert($rootScope.oldValue,$rootScope.callbackFn);
                }  
            })           
    }
    //错误信息处理
    $rootScope.errorCode=0;
    $rootScope.callbackFn=function(){}
    $rootScope.getErrorCodeMsg=function(msg,callback,errorCode){            
        
        if(msg!="lang Input parameter is null")
        {
            $rootScope.callbackFn=callback;         
            $rootScope.newValue=msg;
            $rootScope.watchFn();
            $rootScope.errorCode=errorCode;  
        }
        
    }

    $rootScope.getVersionUpdateMsg=function() {
        /*$rootScope.showAlert("更新了应用，需要重新加载。",function(){
            window.location.reload(true);
        }); */
    }
    $rootScope.formatName = function(name,num) {
        return name.substr(0,num)+name.length>num?"...":"";
    }

}]

//注入form的配置
var factoryVal = {
    "topBar": {
        "showTopBar": false,
        "topBarTitle": "",
        "showLeftBtn": false,
        "leftBtnType": "",
        "leftBtnTitle": "",
        "showRightBtn": false,
        "rightBtnType": "",
        "rightBtnTitle": ""
    },
    "version":'3.3.0',
    "msg":'',
    "cmbUserId":"",
    "todayStep":0,
    // "postType":"POST",
    "postType":"POST",
    "peopleIsRuning": false,
    "checkPhoneNumber": /^1[3|4|5|7|8][0-9]{9}$/,
    "userData": {
        "lang": 'zh_CN',
        "device": 'device',
        "appVerNum": '4.0.0',
        "deviceVerNum": '1.0.0',
        "userId": "",
        "phoneNum": "",
        "session": "",
        "userAgent":""
    },
    "userInfo": {

    },
    "rankList": {

    },
    "worldList": {

    },
    "showRankList": {

    },
    "task": {

    },
    "sysTask": {

    },
    "userTask": {

    },
    "taskMembers": {

    },
    "isOwn": "0",
    getUserId:function() {
        if (this.userData && this.userData.userId && this.userData.userId!="") {
            return this.userData.userId;
        }  
        return "";
    }
}
app.run(runFn)
var setting = {
    "btn": {
        "backBtn": "back-button",
        "shareBtn": "share-button",
        "closeBtn": "close-button",
        "fontBtn": "font-button"
    }
}
var factoryFn = function() {
    return factoryVal;
};
app.factory("form", factoryFn);

//设置存入数据库标准
function getQuestionMapping() {

    var a = [{
        "category": "00",
        "subCategory": "0001",
        "isResultId": false,
        "connector": "&&"
    }, {
        "category": "02",
        "subCategory": "0299",
        "isResultId": false,
        "connector": ','
    }, {
        "category": "04",
        "subCategory": "0401",
        "isResultId": false,
        "connector": "&&"
    }, {
        "category": "04",
        "subCategory": "0402",
        "isResultId": false,
        "connector": ""
    }, {
        "category": "05",
        "subCategory": "0501",
        "isResultId": false,
        "connector": ","
    }, {
        "category": "05",
        "subCategory": "0502",
        "times": 1,
        "isResultId": false,
        "connector": ","
    }, {
        "category": "05",
        "subCategory": "0502",
        "times": 2,
        "isResultId": true,
        "connector": ""
    }, {
        "category": "06",
        "subCategory": "0601",
        "isResultId": false,
        "connector": ""
    }, {
        "category": "06",
        "subCategory": "0602",
        "isResultId": false,
        "connector": "&&"
    }, {
        "category": "07",
        "subCategory": "0701",
        "isResultId": false,
        "connector": "&&"
    }, {
        "category": "08",
        "subCategory": "0801",
        "isResultId": false,
        "connector": "&&"
    }, {
        "category": "08",
        "subCategory": "0802",
        "isResultId": false,
        "connector": ""
    }, {
        "category": "09",
        "subCategory": "0901",
        "isResultId": false,
        "connector": ""
    }, {
        "category": "09",
        "subCategory": "0902",
        "isResultId": false,
        "connector": ""
    }, {
        "category": "09",
        "subCategory": "0903",
        "isResultId": false,
        "connector": ""
    }]
    return a;
}

//一层深copy
function copyData(scopeObj) {
    var newObj = {};
    for (var obj in scopeObj) {
        newObj[obj] = scopeObj[obj]
    }
    return newObj;
}

//常亮配置
function getSimpleQuePageMapping() {
    var pages = [{
            "answer": [{
                "key": "04_0401_0_0",
                "type": "heightRuler",
                "mainImg": "question-1-main-img.png",
                "aidImg": "question-1-aid-img.png",
                "defaultValue": "160"
            }, {
                "key": "04_0401_0_1",
                "type": "weightRuler",
                "mainImg": "null",
                "aidImg": "null",
                "defaultValue": ""
            }]
        }, {
            "answer": [{
                "key": "05_0502_1_0",
                "type": "waterRuler",
                "mainImg": "question-2-main-img.png",
                "aidImg": "question-2-aid-img.png",
                "defaultValue": ""
            }, {
                "key": "05_0502_0_2",
                "type": "check",
                "mainImg": "null",
                "aidImg": "null",
                "defaultValue": ""
            }, {
                "key": "05_0502_0_0",
                "type": "check",
                "mainImg": "null",
                "aidImg": "null",
                "defaultValue": ""
            }, {
                "key": "05_0502_0_1",
                "type": "check",
                "mainImg": "null",
                "aidImg": "null",
                "defaultValue": ""
            }, {
                "key": "05_0502_0_3",
                "type": "check",
                "mainImg": "null",
                "aidImg": "null",
                "defaultValue": ""
            }, {
                "key": "05_0502_0_4",
                "type": "check",
                "mainImg": "null",
                "aidImg": "null",
                "defaultValue": ""
            }]
        }, {
            "answer": [{
                "key": "07_0701_0_1",
                "type": "getUpTime",
                "mainImg": "question-5-main-img.png",
                "aidImg": "question-5-aid-img.png",
                "defaultValue": ""
            }, {
                "key": "07_0701_0_0",
                "type": "sleepTime",
                "mainImg": "null",
                "aidImg": "null",
                "defaultValue": ""
            },{
                "key": "06_0601_0_0",
                "type": "walkBicycling",
                "mainImg": "null",
                "aidImg": "null",
                "defaultValue": ""
            }, {
                "key": "06_0602_0_0",
                "type": "sportNum",
                "mainImg": "null",
                "aidImg": "null",
                "defaultValue": ""
            }, {
                "key": "06_0602_0_1",
                "type": "sportTime",
                "mainImg": "null",
                "aidImg": "null",
                "defaultValue": ""
            }]
        }, {
            "answer": [{
                "key": "00_0001_0_2",
                "type": "sex",
                "mainImg": "question-7-main-img.png",
                "aidImg": "question-7-aid-img.png",
                "defaultValue": ""
            }, {
                "key": "00_0001_0_1",
                "type": "birthday",
                "mainImg": "null",
                "aidImg": "null",
                "defaultValue": ""
            }, {
                "key": "00_0001_0_0",
                "type": "name",
                "mainImg": "null",
                "aidImg": "null",
                "defaultValue": "",
                "placeholder":"请填写真实姓名"
            }]
        },

    ]

    return pages;
}
//取链接中参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}

// debugger setting, alert the message, when set the localstorage debugg=1
function dAlert(msg){
    var isDebugger = localStorage.getItem("debugg");
    var isDebug = !isDebugger ? 0 : isDebugger-0;
    if(isDebug)
    {
        alert(msg)
    }
}
CMBLS = {};
CMBLS.socialShare={};

CMBLS.socialShare.successCallback=function(id,input){
         // do something to message yourself
    //alert('successCallback:id: '+ id+"   input: "+input)
}

 CMBLS.socialShare.failCallback=function(id,input){
// do something to message yourself
//alert('failCallback:id: '+ id+"   input: "+input)
}
//截取url
function delQueStr(url) {
    var urlStr = "";
    if(url.indexOf('app')!=-1)
    {
      urlStr= url.substr(0,url.indexOf('app'));
      return urlStr;
    }
}

//数字加逗号方法
function format_number(n){
   var b=parseInt(n).toString();
   var len=b.length;
   if(len<=3){return b;}
   var r=len%3;
   return r>0?b.slice(0,r)+","+b.slice(r,len).match(/\d{3}/g).join(","):b.slice(r,len).match(/\d{3}/g).join(",");
 }


function getErrorMsg(errorCode,errorMSG) {
    var error = [];
       error["-300"]="网络不给力，请检查网络设置";
    // error["-100"]="此用户不存在";
    // error["-104"]="团战开始日期需要大于今天";
    // error["-105"]="此玩家正在团战中";
    // error["-106"]="验证码错误！";    
    // error["-107"]="手机号码已绑定";
    // error["-108"]="请先绑定手机号码";
    // error["-109"]="玩家健康币不足";
    // error["-110"]="团战人数已满";
    // error["-111"]="团战最大天数超出范围";
    // error["-113"]="任务进行中，无法删除团战";
    // error["-114"]="已有玩家参团，无法删除团战";
    // error["-115"]="找不到该任务";
    // error["-116"]="亲，只有团长才可删除团战哦";
    // error["-117"]="请输入验证码";
    // error["-6"]="您的账号已在其它设备上登录！";
    if(error[errorCode]!=undefined){
        return error[errorCode];
    }else{
        return errorMSG;
    }

}

function checkCache() {
    var appCache = window.applicationCache;

switch (appCache.status) {
  case appCache.UNCACHED: // UNCACHED == 0
    console.log('UNCACHED');
    break;
  case appCache.IDLE: // IDLE == 1
   console.log('IDLE');
    break;
  case appCache.CHECKING: // CHECKING == 2
    console.log('CHECKING');
    break;
  case appCache.DOWNLOADING: // DOWNLOADING == 3
    console.log('DOWNLOADING');
    break;
  case appCache.UPDATEREADY:  // UPDATEREADY == 4
    console.log('UPDATEREADY');
    break;
  case appCache.OBSOLETE: // OBSOLETE == 5
    console.log( 'OBSOLETE');
    break;
  default:
    console.log( 'UKNOWN CACHE STATUS');
    break;
};
}


checkCache();    

function updateSite(event) {

    /*window.applicationCache.swapCache();

    setTimeout(
        function(){
            angular.element($("body")).scope().$root.getVersionUpdateMsg();
        }, 1000
    )*/
}
window.applicationCache.addEventListener('updateready',
    updateSite, false);
var iframeLoadEnd =function(){
    $('.loading').hide();
}

app.factory('baseDataService', ['$http', '$q', 'form', function($http, $q, form){
	var service = {};
	service.originalHttp = function(url, param, config){
		var url = url || '';
		var param = param || null;
		var config = config && typeof config == 'object' ? config : {};
		var method = config.method || 'post';
		var timeout = config.timeout || 60000;
		var dataType = config.dataType || 'json';
		var async = config.async==undefined ? true : config.async;
		var cache = config.cache==undefined ? true : config.cache;
		var beforeSend = config.beforeSend || function(){};
		var complete = config.complete || function(){};
		var contentType = config.contentType || 'application/x-www-form-urlencoded';
		/*
		var headers = config.headers || {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
		var transformRequest = config.headers || function(data){return $.param(data);};
		var msg = config.msg || '加载中...';
		var option = {method: method,url: url,timeout: timeout,headers: headers};
		var options = method.toLowerCase() == 'post' ? $.extend({},option,{data: param,transformRequest: transformRequest}) : $.extend({},option,{params: param});
		var defer = $q.defer();
		var promise = defer.promise;
		$http(options).success(function(data){
			defer.resolve(data);
		}).error(function(data){
			defer.reject(data);
		});
		*/
		var defer = $q.defer();
		var promise = defer.promise;
		var option = {
				type: method,
				data: param,
				url: url,
				timeout: timeout,
				dataType: dataType,
				async: async,
				cache: cache,
				contentType: contentType,
				beforeSend: beforeSend,
				complete: complete,
				success: function(data){defer.resolve(data);},
				error: function(err){defer.reject(err);}
			};
		$.ajax(option);
		return promise;
	};
	service.http = function(url, param, config){
		$('.loading').show();
		var promise = this.originalHttp(url, param, config);
		promise.then(function(data){
			$('.loading').hide();
		},function(error){
			$('.loading').hide();
		});
		return promise;
	};
	return service;
}]);

app.directive("carousel",function(){
	var auto;
	var screenw=document.body.clientWidth;
	return {
		restrict: 'EA',
		transclude: true,
		replace: true,
		scope: {size: '=', height: '@', mark: '@'},
		template: '<div class="carousel" ng-style="style" hm-panstart="panStart" hm-panend="panEnd" hm-pancancel="panEnd" hm-panmove="panMove" hm-recognizer-options=\'[{"type":"pan","directions":"DIRECTION_HORIZONTAL"}]\'><div class="carousel-body" ng-style="{width: size*200+\'vw\', maxHeight: height, transform: \'translate(\'+scroll_pos+\'px,0)\'}" ng-class="{\'carousel-anime\': isAnime}"><span ng-transclude></span><span ng-transclude></span></div><div ng-if="mark&&size>1" class="carousel-mark"></div></div>',
		controller: ['$scope', '$element', '$attrs', '$transclude', '$timeout', '$compile', function($scope, $element, $attrs, $transclude, $timeout, $compile){
			$scope.cur=0;
			if($scope.mark) var mark=$scope.mark.split("/");
			//校正位置，到达边界时、起手时
			function reviseScroll() {
				$timeout(function(){
					$scope.isAnime=false;
					if($scope.cur>=$scope.size-1){
						$scope.cur-=$scope.size;
					}else if($scope.cur<-1){
						$scope.cur+=$scope.size;
					}
					$scope.scroll_pos=-($scope.cur+$scope.size)*screenw;
				});
			}
			$(".carousel .carousel-body")[0].addEventListener("webkitTransitionEnd", reviseScroll);
			//对应外部改变了列表长度时的处理
			$scope.$watch('size', function(new_v){
				$timeout(function(){
					clearInterval(auto);
					$scope.isAnime=false;
					$scope.cur=0;
					$scope.scroll_pos=-new_v*screenw;
					if(new_v>1){
						autoplay();
						$scope.panStart=panStart;
						$scope.panMove=panMove;
						$scope.panEnd=panEnd;
						var ele=$element.find(".carousel-mark");
						ele.empty();
						for(var i=0;i<new_v;i++){
							ele.append($compile('<i ng-style="{backgroundColor: (cur+size)%size=='+i+'?\''+mark[1]+'\':\''+mark[0]+'\'}"></i>')($scope));
						}
					}else{
						$scope.panStart=$scope.panMove=$scope.panEnd=function(){};
					}
				});
			});
			//防止后台动画被关闭引起计数问题
			$scope.$watch('cur', function(newV, oldV) {
				if(newV>=$scope.size){
					$scope.isAnime=false;
					$scope.cur=$scope.cur%$scope.size;
					$scope.scroll_pos=-($scope.cur+$scope.size)*screenw;
				}
			});
			//动画播放
			var play=function(tar){
				$timeout(function(){
					$scope.isAnime=true;
					$scope.cur=tar;
					$scope.scroll_pos=-(tar+$scope.size)*screenw;
				});
			};
			//自动播放，如有设置的话
			var autoplay=!$attrs.auto?function(){}:function(){
				auto = setInterval(function(){
					play($scope.cur+1);
				},$attrs.auto);
			};
			//起手
			var panStart=function(e){
				clearInterval(auto);
				e.preventDefault();
				$scope.isAnime=false;
				reviseScroll();
			}
			//拖动
			var panMove = function(e){
				e.preventDefault();
				$scope.scroll_pos=e.deltaX-($scope.cur+$scope.size)*screenw;
			};
			//结束
			var panEnd = function(e){
				e.preventDefault();
				autoplay();
				if(e.deltaX>screenw/2){
					play($scope.cur-1);
				}else if(e.deltaX<-screenw/2){
					play($scope.cur+1);
				}else{
					play($scope.cur);
				}
			};
		}]
	};
});
