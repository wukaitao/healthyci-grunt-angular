var quizQuestion = function(){
	this.init();
};
quizQuestion.prototype={
	init: function(){
		this.renderPage();
	},
	renderPage: function(){
		var that = this;
		var version = '1.0';
		var userId = aesDecrypt(localStorage.getItem('userId'),ys);
		var oldUserId = aesDecrypt(localStorage.getItem('olduserId'),ys);
		var isNewUser = userId !== oldUserId;
		that.cacheQuestionName = 'questionData' + getQueryString('date') + '_' + version;
		var cacheQuestion = localStorage.getItem(that.cacheQuestionName) ? JSON.parse(aesDecrypt(localStorage.getItem(that.cacheQuestionName),ys)) : null;
		that.quizDate = getQueryString('date');
		!that.quizDate && (window.location.href = history.back());
		//加载模板/数据
		$.when(
			$.get('template/tp_content.html'),
			$.getJSON('data/q' + that.quizDate + '.json?v=' + version)
		).done(function(tp,data){
			that.template = tp[0];
			if(isNewUser){
				//新用户
				if(that.quizDate == '20160801'&&aesDecrypt(localStorage.getItem('phoneNum'),ys)!=='null'){
					//问卷编号为20160801且个人信息里已经有联系手机号码
					that.data = that.filterQuestion(data[0]);
				}else{
					//个人信息里没有联系手机号码
					that.data = data[0];
				};
			}else{
				//旧用户
				if(!!cacheQuestion){
					//已做过问卷
					that.data = cacheQuestion;
				}else{
					//没做过问卷
					if(that.quizDate == '20160801'&&aesDecrypt(localStorage.getItem('phoneNum'),ys)!=='null'){
						//问卷编号为20160801且个人信息里已经有联系手机号码
						that.data = that.filterQuestion(data[0]);
					}else{
						//个人信息里没有联系手机号码
						that.data = data[0];
					};
				};
			};
			$('.top-menu h1').html(that.data.menu);
            $('.healthy-container').html(easyTemplate(that.template,that.data).toString());
            hideLoading();
            that.hasAnswer = [];
            that.isComplete = false;
            that.createEvent();
            setTimeout(function(){$(window).scrollTop(0);},200);
		});
	},
	filterQuestion: function(obj){
	    //过滤掉问卷手机号码选项
    	var objList = obj.list;
    	var mobileIndex = -1;
    	objList.forEach(function(item,index){
    		item.name == 'mobile' && (mobileIndex = index);
    		item.value = '';
    	});
    	mobileIndex != -1 && (function(){
    		objList.splice(mobileIndex,1);
    		obj.list = objList;
    	})();
    	return obj;
	},
	createEvent: function(){
		var that = this;
	    //格式化问题答案
	    var mapKv = function(list){
	    	var resultObj = {};
	    	var answerObj = {};
	    	list.forEach(function(item,index){
	    		if(item.name == 'mobile') resultObj.mobile = item.value;
	    		else answerObj[item.name] = item.value;
	    	});
	    	resultObj.menu = that.data.menu;
	    	resultObj.title = that.data.title;
	    	resultObj.date = that.quizDate;
	    	resultObj.answer = JSON.stringify(answerObj);
	    	return resultObj;
	    };
	    //更改全局apiDomain为本活动apiDomain
	    var restApiDomain = function(string){
	    	var string = string || '';
	    	var splitIndex = string.lastIndexOf('/');
	    	string = string.slice(0,splitIndex);
	    	string = string + '/hmc_questionnaire_server';
	    	return string;
	    };
	    //返回处理
	    $('#backBtn').on('click',function(){
	    	window.location.href = pageDomain + '/app.html';
	    });
	    //单选事件/多选事件
		$('.ipt-item').on('click',function(){
			var $this = $(this);
			var isRadio = $(this).parent().is('.radio-button');
			var isCheckbox = $(this).parent().is('.checkbox-button');
			var dataIndex = $(this).attr('data-index');
			var dataSubIndex = $(this).attr('data-subindex');
			if(isRadio){
				//单选
				that.data.list[dataIndex].value = that.data.list[dataIndex].list[dataSubIndex].value;
				$(this).addClass('show').siblings().removeClass('show');
		    	that.hasAnswer.indexOf(that.data.list[dataIndex].name) == -1 && that.hasAnswer.push(that.data.list[dataIndex].name);
		    	that.hasAnswer.length == that.data.list.length && (that.isComplete = true);
		    	$this.parent().siblings().removeClass('error');
			}else if(isCheckbox){
				//多选
		    	var valueList = [];
		    	var isChecked = !($(this).is('.show'));
		    	isChecked && $(this).addClass('show');
		    	!isChecked && $(this).removeClass('show');
		    	that.data.list[dataIndex].list[dataSubIndex].isChecked = isChecked;
		    	that.data.list[dataIndex].list.forEach(function(item,index){
		    		item.isChecked && valueList.push(item.value);
		    	});
		    	that.data.list[dataIndex].value = valueList;
		    	that.hasAnswer.indexOf(that.data.list[dataIndex].name) == -1 && that.hasAnswer.push(that.data.list[dataIndex].name);
		    	that.hasAnswer.length == that.data.list.length && (that.isComplete = true);
		    	$this.parent().siblings().removeClass('error');
		    	that.data.list[dataIndex].value.length == 0 && (function(){
		    		var index = that.hasAnswer.indexOf(that.data.list[dataIndex].name);
		    		index != -1 && that.hasAnswer.splice(index,1);
		    		that.isComplete = false;
		    		$this.parent().siblings().addClass('error');
		    	})();
		    	that.data.list[dataIndex].value = that.data.list[dataIndex].value.toString();
			};
			if (that.isComplete) $('.submit-button').removeClass('disabled');
			else $('.submit-button').addClass('disabled');
		});
		//输入填空
		$('.ipt-text,.ipt-fill').on('blur',function(){  
			var value = $(this).val();
			var dataIndex = $(this).attr('data-index');
			var dataReg = $(this).attr('data-reg');
			var dataError = $(this).attr('data-error');
			var dataEmpty = $(this).attr('data-empty');
    		var index = that.hasAnswer.indexOf(that.data.list[dataIndex].name);
			if(value == '' && !!dataEmpty){
				showTips(dataEmpty);
	    		index != -1 && that.hasAnswer.splice(index,1);
				$(this).parent().siblings().addClass('error');
			}else if(value != '' && !!dataReg){
				var reg = new RegExp(dataReg);
				if(!reg.test(value)){
					showTips(dataError);
		    		index != -1 && that.hasAnswer.splice(index,1);
					$(this).parent().siblings().addClass('error');
				}else{
			    	that.data.list[dataIndex].value = value;
			    	index == -1 && that.hasAnswer.push(that.data.list[dataIndex].name);
					$(this).parent().siblings().removeClass('error');
				};
			}else{
		    	that.data.list[dataIndex].value = value;
		    	index == -1 && that.hasAnswer.push(that.data.list[dataIndex].name);
				$(this).parent().siblings().removeClass('error');
			};
			that.isComplete = that.hasAnswer.length == that.data.list.length;
			if (that.isComplete) $('.submit-button').removeClass('disabled');
			else $('.submit-button').addClass('disabled');
		});
		//提交表单
		$('.submit-button').on('click',function(){
			$('.ipt-text,.ipt-fill').trigger('blur');
			that.data.list.forEach(function(item,index){
				item.value == '' && $('.list').eq(index).find('.t').addClass('error');
			});
			var $btnSubmit = $(this);
			var isDisabled = $btnSubmit.is('.disabled');
			if (isDisabled) return;
    		var param = mapKv(that.data.list);
    		var apiDomain = restApiDomain(window.apiDomain);
    		var userId = aesDecrypt(localStorage.getItem('userId'), ys) || getQueryString('identity');
    		var session = aesDecrypt(localStorage.getItem('userSession'), ys) || getQueryString('magic');
    		var url = apiDomain + '/' + userId + '/' + session + '/submitReport';
    		$.ajax({
    			url: url,
    			type: 'post',
    			data: param,
    			dataType: 'json',
    			beforeSend: function(){
    				$btnSubmit.addClass('disabled');
					showLoading('加载中...');
    			},
    			success: function(result){
	    			if(result.statusCode == 0){
	    				//提交成功
	    				var resultData = {};
	    				resultData.menu = that.data.menu;
	    				resultData.resultMessage = that.data.resultMessage;
	    				localStorage.setItem('resultData',JSON.stringify(resultData));
	    				localStorage.setItem(that.cacheQuestionName, aesEncrypt(JSON.stringify(that.filterQuestion(that.data)),ys));
	    				localStorage.setItem('olduserId', aesEncrypt(userId, ys));
	    				var pageUrl = window.location.href;
	    				var targetUrl = pageUrl.replace(/question/,'result');
	    				window.location.href = targetUrl;
	    			}else if(result.statusCode == 3){
    					//手机号码重复
    					showTips('该手机号已存在，不能重复提交');
	    			}else if(result.statusCode == 4){
    					//已经提交过手机号码
    					showTips('您已经提交过手机号码，不能重复提交');
    					localStorage.setItem(that.cacheQuestionName, aesEncrypt(JSON.stringify(that.filterQuestion(that.data)),ys));
    					localStorage.setItem('olduserId', aesEncrypt(userId, ys));
    					window.setTimeout(function(){
    						that.renderPage();
    						$btnSubmit.addClass('disabled');
    					},2000);
	    			}else{
	    				//提交失败
	    				showTips(result.msg);
	    			};
    			},
    			complete: function(){
    				$btnSubmit.removeClass('disabled');
					hideLoading();
    			},
				error: function(err){
					//请求失败
					showTips('网络不给力，请检查网络后再试试吧！');
				}
    		});
		});
	}
};

$(function(){
	showLoading();
	new quizQuestion();
});