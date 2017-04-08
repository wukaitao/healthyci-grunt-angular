var HealthyQuestionnairesCtrl = ['$scope', '$location', 'form', 'baseDataService', 'createDialog', function($scope, $location, form, baseDataService, createDialogService){
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "健康管理";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.form = form;
	$scope.form.leftBtnClick = function(){
		if($scope.page.isUsecache){
			var templateHtml = '<div class="questionnaires-popup text-center">确认退出？' +
							       '<div class="button-area">' +
							           '<button class="line-twobutton" ng-click="$modalCancel();">取消</button>' +
							           '<button class="line-twobutton" ng-click="$modalSuccess();">确定</button>' +
							       '</div>' +
							   '</div>';
            createDialogService({
                id: 'questionnairesPopup',
                title: '',
                template: templateHtml,
                backdrop: true,
                controller: null,
                success: {
                    fn: function(){
                    	localStorage.setItem('questionJSONCache', JSON.stringify($scope.page.questionList));
            			$location.path('myHealthy');
                    }
                },
                cancel: {
                    fn: function(){
                        return;
                    }
                }
            });
		}else{
			$location.path('myHealthy');
		};
	};
    //初始化问题列表
    var questionJSON = [
        {
        	title: '您的年龄：',
        	name: 'age',
        	type: 'radio',
        	list: [
        	    {content: '19-24',value:'1'},
        	    {content: '25-49',value:'2'},
        	    {content: '50-60',value:'3'},
        	    {content: '其他',value:'4'}
        	],
        	value: ''
        },
        {
        	title: '您的年收入水平？',
        	name: 'income',
        	type: 'radio',
        	list: [
        	    {content: '10万以下',value:'1'},
        	    {content: '10-30万',value:'2'},
        	    {content: '30万以上',value:'3'}
        	],
        	value: ''
        },
        {
        	title: '您是否购买过商业保险？（多选）',
        	name: 'insurance',
        	type: 'checkbox',
        	list: [
           	    {content: '财险（车险除外）',value:'1'},
           	    {content: '寿险',value:'2'},
           	    {content: '意外伤害保险',value:'3'},
           	    {content: '重大疾病险',value:'4'},
           	    {content: '没有',value:'5'}
           	],
        	value: ''
        },
        {
        	title: '您身边是否有人罹患重大疾病？',
        	name: 'diseases',
        	type: 'radio',
        	list: [
        	    {content: '没有',value:'1'},
        	    {content: '有',value:'2'}
        	],
        	value: ''
        },
        {
        	title: '您是否有养老或者少儿教育金储备计划？',
        	name: 'hasPlan',
        	type: 'radio',
        	list: [
        	    {content: '两者兼有计划',value:'1'},
        	    {content: '有少儿教育金计划',value:'2'},
        	    {content: '有养老储备计划',value:'3'},
        	    {content: '两者都没有计划',value:'4'}
        	],
        	value: ''
        },
	    {
	    	"title": "感谢您的参与，请留下手机号码以便参与话费充值！(每个手机号码只有一次充值机会)",
	    	"name": "mobile",
	    	"type": "fill",
	    	"rule": {
	    		"type": "tel",
	    		"maxlength": "11",
	    		"reg": "^[1][3,4,5,7,8][0-9]{9}$",
	    		"tips": "",
	    		"tipsError": "手机号不正确",
	    		"tipsEmpty": "手机号码不能为空"
	    	},
	    	"value": ""
	    }
	];
    //是否拥有上一次回答记录
    var hasAnswerCache = !!localStorage.getItem('questionJSONCache');
    //已经回答的问题列表
    var hasAnswer = [];
    //格式化问题答案
    var mapKv = function(list){
    	var resultObj = {};
    	resultObj.date = '20160501';
    	angular.forEach(list,function(item,index){
    		resultObj[item.name] = item.value;
    	});
    	return resultObj;
    };
    //过滤掉问卷手机号码选项
    var filterQuestion = function(list){
    	var mobileIndex = -1;
    	list.forEach(function(item,index){
    		item.name == 'mobile' && (mobileIndex = index);
    		!!item.list && (function(){
    			item.list.forEach(function(subItem,subIndex){
    				subItem.isChecked = false;
    			});
    		})();
    	});
    	mobileIndex != -1 && (function(){
    		list.splice(mobileIndex,1);
    	})();
    	return list;
    };
    //更改全局apiDomain为本活动apiDomain
    var restApiDomain = function(string){
    	var string = string || '';
    	var splitIndex = string.lastIndexOf('/');
    	string = string.slice(0,splitIndex);
    	string = string + '/hmc_questionnaire_server';
    	return string;
    };
    $scope.page = {};
    $scope.page.isComplete = false;//是否完成问卷
    $scope.page.isUsecache = false;//是否启用缓存
    $scope.page.title = '1分钟参与调研,赢100个健康币+5元话费';
    $scope.page.tips = '';
    //$scope.page.questionList = $scope.page.isUsecache && hasAnswerCache ? JSON.parse(localStorage.getItem('questionJSONCache')) : questionJSON;
    $scope.page.questionList = localStorage.getItem('cacheQuestion') ? JSON.parse(aesDecrypt(localStorage.getItem('cacheQuestion'),ys)) : questionJSON;
    //启用缓存状态下对已回答问题列表和完成状态的重置
    $scope.page.isUsecache && (function(){
    	angular.forEach($scope.page.questionList,function(item,index){
    		item.value != '' && item.value.length != 0 && hasAnswer.push(item.name);
    	});
    	hasAnswer.length == $scope.page.questionList.length && ($scope.page.isComplete = true);
    })();
    //单选事件
    $scope.chooseRadio = function(parentObj,childObj){
    	parentObj.value= childObj.value;
    	angular.forEach(parentObj.list,function(item,index){
    		item.value == childObj.value && (item.isChecked = true);
    		item.value != childObj.value && (item.isChecked = false);
    	});
    	hasAnswer.indexOf(parentObj.name) == -1 && hasAnswer.push(parentObj.name);
    	hasAnswer.length == $scope.page.questionList.length && ($scope.page.isComplete = true);
    };
    //多选事件
    $scope.chooseCheckbox = function(parentObj,childObj){
    	childObj.isChecked = !childObj.isChecked;
    	var valueList = [];
    	angular.forEach(parentObj.list,function(item,index){
    		item.isChecked && valueList.push(item.value);
    	});
    	parentObj.value = valueList;
    	hasAnswer.indexOf(parentObj.name) == -1 && hasAnswer.push(parentObj.name);
    	hasAnswer.length == $scope.page.questionList.length && ($scope.page.isComplete = true);
    	parentObj.value.length == 0 && (function(){
    		var index = hasAnswer.indexOf(parentObj.name);
    		index != -1 && hasAnswer.splice(index,1);
    		$scope.page.isComplete = false;
    	})();
    };
    //输入填空
    $scope.checkBlur = function(one){
		var dataReg = one.rule.reg;
		var dataError = one.rule.tipsError;
		var dataEmpty = one.rule.tipsEmpty;
		var index = hasAnswer.indexOf(one.name);
		if(one.value == '' && !!dataEmpty){
			$scope.$root.getErrorCodeMsg(dataEmpty);
			//console.log(dataEmpty);
    		index != -1 && hasAnswer.splice(index,1);
		}else if(one.value != '' && !!dataReg){
			var reg = new RegExp(dataReg);
			if(!reg.test(one.value)){
				$scope.$root.getErrorCodeMsg(dataError);
	    		index != -1 && hasAnswer.splice(index,1);
			}else{
		    	index == -1 && hasAnswer.push(one.name);
			};
		}else{
	    	index == -1 && hasAnswer.push(one.name);
		};
		$scope.page.isComplete = hasAnswer.length == $scope.page.questionList.length;
    };
    //提交表单
    $scope.submitForm = function(){
    	angular.forEach($scope.page.questionList,function(item,index){
    		(item.type == 'text' || item.type == 'fill') && $scope.checkBlur(item);
    	});
    	if($scope.page.isComplete){
			$scope.page.isComplete = false;
    		var param = mapKv($scope.page.questionList);
    		var apiDomain = restApiDomain(window.apiDomain);
    		var url = apiDomain + '/' + $scope.form.userData.userId + '/' + $scope.form.userData.session + '/submitResult';
    		//提交表单
    		var promise = baseDataService.originalHttp(url,param);
    		promise.then(function(data){
    			if(data.statusCode == 0){
    				//提交成功
        			localStorage.removeItem('questionJSONCache');
    				localStorage.setItem('cacheQuestion', aesEncrypt(JSON.stringify(filterQuestion(questionJSON)),ys));
    	    		$location.path('healthyQuestionnairesSuccess');
    			}else if(data.statusCode == 3){
					//手机号码重复
    				$scope.$root.getErrorCodeMsg('该手机号已存在，不能重复提交');
    				$scope.page.isComplete = true;
    			}else if(data.statusCode == 4){
					//已经提交过手机号码
    				$scope.$root.getErrorCodeMsg('您已经提交过手机号码，不能重复提交');
    				$scope.page.isComplete = false;
    				hasAnswer = [];
    				localStorage.setItem('cacheQuestion', aesEncrypt(JSON.stringify(filterQuestion(questionJSON)),ys));
    				$scope.page.questionList = filterQuestion(questionJSON);
    			}else{
    				//提交失败
                    $scope.$root.getErrorCodeMsg(data.msg);
    				$scope.page.isComplete = true;
    			};
    		},function(err){
				//请求失败
    			$scope.$root.getErrorCodeMsg('网络不给力，请检查网络后再试试吧！');
    		});
    	};
    };
    
    $('.loading').hide();
	return;
}];