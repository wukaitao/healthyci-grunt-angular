var MyHealthyCtrl = ['$scope', '$location', 'form', '$http', '$timeout', '$sce', 'createDialog', 'baseDataService', function($scope, $location, form, $http, $timeout, $sce, createDialogService, baseDataService) {

    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "健康管理";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    // factoryVal.topBar.showRightBtn = true;
    // factoryVal.topBar.rightBtnType = setting.btn.shareBtn;
    // factoryVal.topBar.rightBtnTitle = "分享";
    factoryVal.peopleIsRuning = true;
    $scope.form = form;
    $scope.form.todayStep = null;
    //用作顺序弹窗的各promise对象
	var d_act=$.Deferred();//请求活动，关闭弹窗或不需要弹窗则done
	var d_down=$.Deferred();//下载新版本，关闭弹窗或不需要弹窗则done
	var d_user=$.Deferred();//完善用户信息，数据准备好则done
	var d_today=$.Deferred();//获取当天记步，获得后done
	var d_upload=$.Deferred();//上传记步信息，成功后done
	var d_init=$.Deferred();//初始化，不需要或已完成后done
	var d_user_need=false;//是否需要完善用户信息弹窗
	var after_init;//需要在初始化后进行的跳转

	//轮播栏数据准备
	$scope.banners=form.banners||[];
	$scope.path=function(url,title){
		trackerApi("1-我的健康","活动banner:"+title,{"UserId":$scope.form.getUserId()});
		if(url[0]=="#") $location.path(url.substring(1));
		else if(url.indexOf("?")==-1){
			location=url + "?identity=" + $scope.form.userData.userId + "&phoneNum=" + $scope.form.userData.phoneNum + "&magic=" + $scope.form.userData.session;
		}else{
			location=url + "&identity=" + $scope.form.userData.userId + "&phoneNum=" + $scope.form.userData.phoneNum + "&magic=" + $scope.form.userData.session;
		}
	};

    var percent;
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
    var iframehidden = 0;
    
    trackerApi("1-我的健康","",{UserID:$scope.form.getUserId()});

    var hidden = setInterval(function() {
        iframehidden = iframehidden+1; 
        if (!$scope.$root) {
            clearInterval(hidden);
        }
       
        if ($("iframe").closest("div").length > 0 || iframehidden==20) {
            $($("iframe").closest("div")).css("overflow", "hidden");
            clearInterval(hidden);
            
        };
    }, 200);
    $scope.healthyStatusFn = function() {
    	if(d_init.state()!="resolved") after_init=$scope.healthyStatusFn;
    	else{
	        trackerApi("1-我的健康","健康状态区域",{});
	        $location.path("/healthyStatus");
    	}
    };
    $scope.goHealthyTaskSet = function() {
    	if(d_init.state()!="resolved") after_init=$scope.goHealthyTaskSet;
    	else{
	        trackerApi("1-我的健康","目标步数区域",{});
	        $location.path("/healthyTaskSet");
	    }
    };
    $scope.totleCupsLength = function() {
        var count = 0;
        var cups = $scope.totleCups.totleCups;
        for (var i = 0; i < cups.length; i++) {
            count += ((cups[i].isEmpty ? "0" : "1") - 0);
        };
        return count;
    };

    if (!localStorage.getItem("switchControl"))
        localStorage.setItem("switchControl", 'on');
    if (localStorage.getItem("switchControl") == 'on'&& !browser.versions.ios) {
        //开启计步功能
        setStepCounterSettingOn(true);
    }

    $timeout(function() {
        //get today step. set timeout for executing after the setStepCounterSetting on.
        getTodayStepData();
    }, 300);

    $scope.$on('updateTodayStep', function(event, mass) {
        //alert(mass);
        // var maxSteps = $scope.maxStep;
        var steps = mass[0]; // steps pass from sdk

        /*if (maxSteps) {
            percent = parseInt(steps / maxSteps * 100);
        } else {
            percent = 0;
        }*/

        //$('#percent').text(percent);
        //$('.big-size-font').text(steps);             
        //  percent = $('#percent').html();
        //$scope.form.percent = percent;
//        $('.big-size-font').text(steps);
        $scope.form.todayStep = steps;
        d_today.resolve();
    })


    var presentDate = new Date();

	var getSysAdvertisingApiUrl = apiDomain + getSysAdvertisingApi;
    var AdpostData = copyData($scope.form.userData);
    AdpostData.lang = "zh_CN";
    var uid = AdpostData.userId;
    var tel = AdpostData.phoneNum;
    var token = AdpostData.session;
    $timeout(function() {

        $.ajax({
            type: $scope.form.postType,
            url: getSysAdvertisingApiUrl,
            context: document.body,
            data: AdpostData,
            success: function(data) {
                if (data.errorCode != 0) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                    d_act.resolve();
                } else {

                    var addList = data.result;
                    var banners=[]

                	var noPopup=true;
					addList.forEach(function(o,i){
						if(o.type==0){
							noPopup=false;
							$scope.urlPath = o.urlPath;
							$scope.imgPath = o.imagePath;
							$scope.desc = o.desc;
	                        if(!$scope.urlPath[0]=="#") $scope.urlPath = $scope.urlPath + "?identity=" + uid + "&phoneNum=" + tel + "&magic=" + token;
	                        var lastDate=localStorage.getItem("lastDate");
	                        var nowDate=presentDate.toDateString();
	                        if (!lastDate || lastDate!=nowDate) {
	                        	localStorage.setItem("lastDate",nowDate);
	                        	activityPopup();
	                        }else{
	                        	d_act.resolve();
	                        }
						}else if(o.type==1){
							banners.push({title:o.desc,url:o.urlPath,img:o.imagePath});
						}else if(o.type==2){
							$timeout(function(){
								$scope.form.act_ad=o;
							});
						}
					});
					if(noPopup) d_act.resolve();
					$scope.banners=form.banners=banners;
                }

            },
            error: function(e) {
            	d_act.resolve();
                $scope.showShareBtn();
                // if(e.readyState==0){
                //     $scope.errorCountA++;
                // }else{
                $scope.$root.getReadyStateMsg(e.readyState);
                // } 
            }
        });
    });

    $scope.testPortalFn = function() {
    	if(d_init.state()!="resolved") after_init=$scope.testPortalFn;
    	else{
	        trackerApi("1-我的健康","健康测评列表",{});
            $location.path("/testPortal");
		}
    }
    $scope.form.leftBtnClick = function() {
        if (browser.versions.ios) {
            window.location.href = "http://cmbiphone/tool";
        } else if (browser.versions.android) {
            window.location.href = "http://cmbandroid/tool";
        } else {
            // $location.path("/bind");
        }
    }
    $scope.form.rightBtnClick = function() {
        $location.path("/share");
    }

    $scope.goMyCommunity = function() {
        trackerApi("1-我的健康","我的社区Tab",{});
        $location.path("/myCommunity");
    }
    $scope.goHealthyTask = function() {
    	if(d_init.state()!="resolved") after_init=$scope.goHealthyTask;
    	else{
	        trackerApi("1-我的健康","健康任务区域",{});
	        $location.path("/healthyTask");
	    }
    }
    $scope.goManagement = function() {
        trackerApi("1-我的健康","活动&帮助",{});
        $location.path("/managemant");
    }
    $scope.goHealtyTrouble = function() {
        trackerApi("1-我的健康","健康困扰",{"UserID":$scope.form.getUserId()});
    	$location.path('/healthyTroubleList');
    }
    $scope.goHotTopic = function() {
        trackerApi("1-我的健康","健康热门话题",{"UserID":$scope.form.getUserId()});
    	$location.path('/topicList');
    }
	$scope.htDetail=function(link,title){
		localStorage.setItem("intoHTDetail",'/myHealthy');
		trackerApi("1-我的健康","健康困扰:"+title,{"UserID":$scope.form.getUserId()});
		$location.path("/healthyTroubleDetail/"+link);
	};
	$scope.topicDetail=function(link,title){
		localStorage.setItem("intoTopicDetail",'/myHealthy');
		trackerApi("1-我的健康","健康热门话题:"+title,{"UserID":$scope.form.getUserId()});
		$location.path("/topicDetail/"+link);
	};
    $scope.getHealthImg = function() {
        var percent = $scope.form.percent;
        var sex = $scope.form.sex;
        var leavelClass = '';
        if (percent > 80) {
            leavelClass = 'leavel-5';
        } else if (percent > 60 && percent < 81) {
            leavelClass = 'leavel-4';
        } else if (percent > 40 && percent < 61) {
            leavelClass = 'leavel-3';
        } else if (percent > 20 && percent < 41) {
            leavelClass = 'leavel-2';
        } else {
            leavelClass = 'leavel-1';
        }

        if (sex == 1) {
            leavelClass = leavelClass + '-man' + ' ' + 'running-img';
        }
        if (sex == 2) {
            leavelClass = leavelClass + '-girl' + ' ' + 'running-img';
        }
        //alert(leavelClass);
        return leavelClass;
    }




    $scope.$root.isLoadMap = false;

    function runngingPathLoaded(f) {
        $scope.$root.isLoadMap = true;
        this.appendChild(f.node);
        
        var gr = Snap.select("svg");
        var pth = gr.select("#flight");
        var pln = gr.select("#plane");
        var pathGradient = gr.paper.gradient("l(0,0,1,0)#daff95-#adffff"); //线性渐变


        pth.attr({
            display: "" //不隐藏轨迹
        });

        pln = gr.g(pln, pln.clone());//组队
        pln.attr({
            display: "none"
        });
        // pln[0].attr({
        //     stroke: "#000",
        //     strokeWidth: 15
        // });

        var flight = gr.path().attr({
            fill: "none", //填充
            stroke: pathGradient, //运动路线的颜色
            strokeWidth: 25, //运动路线的宽度
            strokeDasharray: "5 1", //1表示实线
            strokeLinecap: "round"
        }).insertBefore(pln);

        function fiy() {
            setTimeout(function() {
                pln.attr({
                    display: "" //不隐藏飞机
                });
                var len = Snap.path.getTotalLength(pth.attr("d"));
                Snap.animate(0, len, function(l) {
                    var dot = pth.getPointAtLength(l);
                    var dotx = parseInt(dot.x) - 30;
                    var lengx;
                    var percentNow;
                    if (dotx > 225) {
                        lengx = dotx - 225;
                        percentNow = 100 - Math.acos(lengx / 225) / 3.1415 * 100;
                    } else {
                        lengx = 225 - dotx;
                        percentNow = Math.acos(lengx / 225) / 3.1415 * 100;
                    }
                    //var percentNow = dotx / 450 * 100; 
                    //alert(percentNow)              
                    if (percentNow <= percent) {
                        flight.attr({
                            d: pth.getSubpath(0, l)
                        });
                        pln.attr({
                            transform: "t" + [dot.x - 30, dot.y - 45] +
                                "r" + (dot.alpha - 20)
                        });
                    }
                }, 3500);
            }, 500)
        }


        //draw fly, wait for the today step get from sdk,  ideally today step is get back very sonn, no need to delay
        var drawTime = 0;
        if ($scope.form.todayStep != null) {
            percent = parseInt($scope.form.todayStep / $scope.maxStep * 100);
            $scope.form.percent = percent;
//            $('#percent').text(percent);
            fiy();
        } else {
            var drawHdl = setInterval(function() {
                if (!$scope.$root) {
                         clearInterval(drawHdl);
                }

                drawTime = drawTime + 1; // if drawTime >10, around 1 second cannot get today step. stop the internval 
                if (drawTime > 10 || $scope.form.todayStep != null) {
                    clearInterval(drawHdl);
                    percent = parseInt($scope.form.todayStep / $scope.maxStep * 100);
                    $scope.form.percent = percent;
//                    $('#percent').text(percent);
                    fiy();
                }

            }, 300);
        }
        
        //draw fly end
    }
    //$scope.$on('dataUploadReadyEvent', function(event, mass) { alert('dataUploadReadyEvent') });
	$scope.$on('dataUploadReadyEvent', function(event, mass) {
        var getUserInfoApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getUserInfoApi;
        var userDataPostApi = copyData($scope.form.userData);
        userDataPostApi.lang = "zh_CN";
        var dateString = presentDate.toLocaleDateString();
        var localRecord = localStorage.getItem("lastUpdateStep");
        if(!localRecord || localRecord!=dateString){
        	userDataPostApi.gainScore=1;
        }
        $.ajax({
            type: $scope.form.postType,
            url: getUserInfoApiUrl,
            context: document.body,
            data: userDataPostApi,
            success: function(data) {
                $scope.$root.isSharing = false;
                d_upload.resolve();
                if (data.errorCode == -6 || data.errorCode == -100) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage, function() {}, data.errorCode);
                    //$location.path('/bind')
                    return;
                } else if (data.errorCode < 0) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                } else {
                    $timeout(function() {
                        $scope.form.userInfo = data.result;
                        if (data.result.totalStep == null) {
                            $scope.form.userInfo.totalStep = 0;
                        }
                        localStorage.setItem("lastUpdateStep",dateString);
                    });
                }
            },
            error: function(e) {
                $scope.$root.isSharing = false;
                d_upload.reject();
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
    });

    //healthy task slides start
    $timeout(function() {
        $('.flexslider').flexslider({
            animation: "slide",
            direction: "horizontal",
            animationSpeed: 200,
            directionNav: false,
            slideshowSpeed: 7000,
        });
    })

	//分享内容
    $scope.shareUrl = "";
    $scope.shareId;
    $scope.$root.isSharing = true;
    $scope.getShareUrls = function() {

        if ($scope.$root.isSharing)
            return
        trackerApi("1-我的健康","分享",{});
        $scope.$root.isSharing = true;
        var n = Math.floor(Math.random() * 4);
        var textStr = '';
        switch (n) {
            case 1:
                textStr = "天哪！我居然完成了您无法做到的事！";
                break;
            case 2:
                textStr = "我已把您虐得体无完肤甩出80几条街了，不服再战！";
                break;
            case 3:
                textStr = "走路都可以走得如此High逼格的估计也就只有我了！";
                break;
            default:
                textStr = "我今天走了" + format_number($scope.form.todayStep) + "步，已经是第" + (Math.floor(Math.random() * 100 + 1)) + "次刷新个人记录了！";
                break;
        }
        var shareApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + shareApi;
        var postData = copyData($scope.form.userData);
        var shareMessage = {};
        shareMessage.text = textStr;
        shareMessage.type = 'healthy';
        shareMessage.nickName = $scope.form.userInfo.nickName;
        shareMessage.people = $scope.getHealthImg();
        shareMessage.todayStep = $scope.form.todayStep;
        shareMessage.totalStep = $scope.form.userInfo.totalStep || 0;
        shareMessage.today = localStorage.getItem('today');
        postData.shareMessage = JSON.stringify(shareMessage)
        $.ajax({
            type: $scope.form.postType,
            url: shareApiUrl,
            context: document.body,
            data: postData,
            async: false,
            success: function(data) {
                if (data.errorCode == 0) {
                    $scope.shareId = data.result.shareId;
                    //alert(delQueStr(window.location.href)+'share.html?shareId='+$scope.shareId)
                    _getTaskInfo(function(){
                    	$scope.showNextTask = false;
                    	window.location.href = "http://CMBLS/socialShare?id=22&type=url&title=" + textStr + "&text=" + textStr + "&url=" + delQueStr(window.location.href) + 'share.html?shareId=' + $scope.shareId;
                    });
                    $scope.$root.isSharing = false;
                } else {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                    $scope.$root.isSharing = false;
                }
            },
            error: function(e) {
                // if(e.readyState==0){
                //     $scope.errorCountA++;
                // }else{
                $scope.$root.getReadyStateMsg(e.readyState);
                $scope.$root.isSharing = false;
                // } 
            }
        });
    }

    CMBLS.socialShare = {};

    CMBLS.socialShare.successCallback = function(id, input) {
        // do something to message yourself
        //alert('successCallback:id: '+ id+"   input: "+input)
    }

    CMBLS.socialShare.failCallback = function(id, input) {
        // do something to message yourself
        //alert('failCallback:id: '+ id+"   input: "+input)
    }

    $scope.showChangeTip=function(msg){
        $timeout(function() {
         createDialogService({
            id: 'editPersonalPopup',
            title: '',
            template: msg,
            backdrop: true,
            controller: null,
            success: {
                fn: function(){
                    $scope.form.openEditMode =  true;
                    $scope.form.intoPersonalFile = '/myHealthy';
                    $location.path('/personalFile');
                }
            },
            cancel:{
                fn:function(){
                }
            }
        });            
     });
    }

    $scope.showDownTip = function(msg) {
        $timeout(function() {
            createDialogService({
                id: 'editPersonalPopup',
                title: '',
                template: msg,
                backdrop: true,
                controller: null,
                success: {
                    fn: function() {
                        if (browser.versions.ios) {
                            window.location.href = "http://itunes.apple.com/cn/app/id392899425?mt=8";
                        } else if (browser.versions.android) {
                            window.location.href = "http://szdl.cmbchina.com/download/PB/CMBMobileBank.apk";
                        }
                    }
                },
                cancel: {
                    fn: function() {
                    	d_down.resolve();
                    }
                }
            });
        });
    }
    $scope.showDownApp = function() {
        if (!$scope.$root.isShowDownPopup && $location.$$path == "/myHealthy") {
            var message = '<div class="healthyAssess-popup text-center">' + '亲，您当前版本不支持计步哦，赶快更新到最新版本走起吧！' + '<div class="button-area"><button class="line-twobutton" ng-click="$modalCancel()">暂不更新</button><button class="line-twobutton" ng-click="$modalSuccess()">立即更新</button></div></div>'
            $scope.$root.isShowDownPopup = true;
            $scope.showDownTip(message);
        }
    }
    $scope.activityPopup = function() {
    	trackerApi("1-我的健康","活动悬浮按钮",{"UserID":$scope.form.getUserId()});
    	activityPopup();
    };
    var activityPopup = function() {
        createDialogService({
            id: 'activityPopup',
            title: '最新活动',
            backdrop: true,
            controller: null,
            template: '<img src="'+$scope.imgPath+'" style="width: 100%;" ng-click="$modalSuccess()">',
            success: {
                label: 'Success',
                fn: function() {
                	trackerApi($scope.desc);
                    if($scope.urlPath[0]=="#"){
                    	var strs=$scope.urlPath.substring(1).split("?");
                    	if(strs.length>1){
                    		strs[1].split("&").forEach(function(o){
                    			var param=o.split("=");
                    			$location.search(param[0],param[1]);
                    		});
                    	}
                    	$location.path(strs[0]);
                    }else location=$scope.urlPath;
                }
            },
            cancel: {
                fn: function() {
                	d_act.resolve();
                }
            }
        });
    };
    $scope.coinPopup = function(){
        trackerApi("1-我的健康","每日健康币领取弹窗",{});
        var temphtml='<div class="healthyAssess-popup text-center"><div class="total">'+($scope.form.userInfo.gainScore+$scope.form.userInfo.extraScore)+'</div><div class="detail"><span>昨日'+$scope.form.userInfo.gainStep+'步</span>&nbsp;≈&nbsp;'+$scope.form.userInfo.gainScore+'健康币';
        if($scope.form.userInfo.extraState) temphtml+='<br><span>跑团赠送</span>&nbsp;≈&nbsp;'+$scope.form.userInfo.extraScore+'健康币';
        temphtml+='</div><button ng-click="$modalSuccess()">领&nbsp;&nbsp;取</button><div class="remark">每日步数兑换上限200，';
        if($scope.form.userInfo.extraState) temphtml+='跑团赠送上限40</div></div>';
        else temphtml+='加入跑团有额外赠送</div></div>';
        $timeout(function() {
            createDialogService({
                id: 'coinPopup',
                title: '每日健康币领取',
                template: temphtml,
                backdrop: true,
                controller: null,
                success: {
                    fn: getCoin
                }
            });
        });
    };
    var getCoin = function(){
        trackerApi("1-我的健康","每日健康币领取",{});
        var request=copyData($scope.form.userData);
		$.ajax({
			type: factoryVal.postType,
			url: apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + gainScoreApi,
			dataType: "json",
			data: request,
			success: function(data){
		        $timeout(function() {
		        	$scope.form.userInfo.scoreState=0;
		            createDialogService({
		                id: 'coinSuccessPopup',
		                title: '',
		                template: '<div class="healthyAssess-popup text-center"><div class="detail">已成功领取<span>'+data.result+'</span>健康币</div><button ng-click="$modalSuccess()">健康币兑换</button></div>',
		                backdrop: true,
		                controller: null,
		                success: {
		                    fn: $scope.exchangeList
		                }
		            });
		        });
			},
			error: function(e){
				$('.loading').hide();
				$scope.$root.getReadyStateMsg(e.readyState);
			}
		});
    };
    //悬赏任务
    var _getTaskInfo = function(callback){
		$scope.isReceiving = true;
    	var callback = callback || function(){};
    	var param = copyData($scope.form.userData);
    	var url = apiDomain + '/' + $scope.form.userData.userId + '/' + $scope.form.userData.session + getTaskInfoApi;
		var promise = baseDataService.originalHttp(url,param);
		promise.then(function(data){
    		$scope.isReceiving = false;
			if(data.errorCode == 0){
				$scope.taskInfo = data.result;
			};
			callback.call(this);
		},function(err){
    		$scope.isReceiving = false;
			$scope.$root.getReadyStateMsg(err.readyState);
		});
    };
    //_getTaskInfo();
    $scope.goRewardTask = function(){
    	//获取任务status:0
    	//领取奖励status:1
    	//任务完成status:2
    	//进入下一个任务$scope.showNextTask=true
    	var template0 = '<div class="healthyAssess-popup text-center step-one">' +
    						'<div class="title">' + $scope.taskInfo.taskName + '</div>' +
    						'<div class="total">' +
    							'<div class="image">' +
    								'<img src="images/reward-task.png"/>' +
    							'</div>' +
    							'<div class="text">奖励：<img src="images/coin.png"/> +' + $scope.taskInfo.taskScore + '</div>' +
    						'</div>' +
    						'<div class="detail">' + $scope.taskInfo.taskDesc + '</div>' +
    						'<button class="btn" ng-click="$modalSuccess();">立即去做</button>' +
    						($scope.taskInfo.taskId==1?'<div class="remark">Tips:除了任务奖励外，完善用户资料将获得200健康币</div>':$scope.taskInfo.taskId==4?'<div class="remark">Tips:每记录一个每日任务将获得2个健康币</div>':'') + 
    					'</div>';
    	var template1 = '<div class="healthyAssess-popup text-center step-two">' +
    						'<div class="title">任务已完成</div>' +
    						'<div class="total">' +
    							'<div class="image">' +
    								'<img src="images/reward-task.png"/>' +
    							'</div>' +
    							'<div class="text"><img src="images/coin.png"/> +' + $scope.taskInfo.taskScore + '</div>' +
							'</div>' +
							'<div class="detail">' + $scope.taskInfo.taskDesc + '</div>' +
							'<button class="btn" ng-click="$modalSuccess();">领取奖励</button>' +
						'</div>';
    	var template2 = '<div class="healthyAssess-popup text-center step-three">' +
    						'<div class="total">' +
    							'<div class="image">' +
    								'<img src="images/reward-task.png"/><i class="icon-right"></i>' +
    							'</div>' +
    						'</div>' +
    						'<div class="detail">太棒了！你已完成阶段性悬赏任务！<br>更多精彩任务，即将开启！</div>' +
    						'<button class="btn" ng-click="$modalSuccess();">确定</button>' +
    					'</div>';
    	var template3 = '<div class="healthyAssess-popup text-center step-four">' +
					        '<div class="title">您成功领取健康币</div>' +
					        '<div class="total">' +
					            '<div class="text">' +
					                '<img src="images/coin.png"/> +' + $scope.prevTaskScore +
					            '</div>' +
					        '</div>' +
					        '<div class="detail">健康币可以用来兑换<br>保险、话费、神秘礼物</div>' +
					        '<button class="btn" ng-click="$modalSuccess();">继续做任务</button>' +
					    '</div>';
    	var oTemplate = {'0': template0,'1': template1,'2': template2,'3': template3};
    	if($scope.isReceiving || d_user.state()!='resolved') return;
        createDialogService({
            id: 'rewardTaskPopup',
            title: '任务卡',
            template: $scope.showNextTask ? oTemplate['3'] : oTemplate[$scope.taskInfo.status],
            backdrop: true,
            controller: null,
            success: {
                fn: function(){
                	if($scope.showNextTask || $scope.taskInfo.status == 0){
                		if($scope.taskInfo.taskId == 3){
                			//分享
                			$scope.getShareUrls();
                		}else if($scope.taskInfo.taskId == 7){
                			//目标步数
                			var numStep = !$scope.form.userInfo.todayStep ? $scope.maxStep : ($scope.maxStep-$scope.form.userInfo.todayStep);
                			if(numStep<=0){
                				_getTaskInfo($scope.goRewardTask);
                			}else{
                				$scope.$root.showAlert('任务已领取，离任务完成还有 ' + numStep + ' 步');
                			}
                		}else{
                			$location.path($scope.taskInfo.taskLink)
                		};
                	}else if($scope.taskInfo.status == 1){
                		$scope.prevTaskScore = $scope.taskInfo.taskScore;
                		$scope.isReceiving = true;
                    	var param = copyData($scope.form.userData);
                    	param.taskId = $scope.taskInfo.taskId;
                    	var url = apiDomain + '/' + $scope.form.userData.userId + '/' + $scope.form.userData.session + getTaskScoreApi;
                		var promise = baseDataService.originalHttp(url,param);
                		promise.then(function(data){
                			$scope.isReceiving = false;
                			if(data.errorCode == 0){
                    			$scope.taskInfo = data.result;
                    			if($scope.taskInfo.status == 0) $scope.showNextTask = true;
                    			else $scope.showNextTask = false;
                    			$scope.goRewardTask();
                			};
                		},function(err){
                			$scope.isReceiving = false;
                			$scope.$root.getReadyStateMsg(err.readyState);
                		});
                	}else if($scope.taskInfo.status == 2) return;
	            }
            },
            cancel:{
                fn:function(){
                	$scope.showNextTask = false;
                }
            }
        });
    };
    $scope.exchangeList = function(){
        trackerApi("1-我的健康","健康币兑换",{});
        $location.path("/exchangeList");
    };

	//活动加载完成或关闭
	$.when(d_act).done(function(){
		//检测版本，如有必要提示下载
        dAlert('appVersion: ' + $scope.$root.appVersion + '   version: ' + $scope.form.version)
        if ($scope.$root.appVersion < $scope.form.version) {
			$scope.showDownApp();
		}else{
			d_down.resolve();
		}
		//用getUserInfo获取用户信息需要的初始化数据
		var getUserInfoApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getUserInfoApi;
	    var userDataPostData3 = copyData($scope.form.userData);
	    $timeout(function() {
	        $.ajax({
	            type: $scope.form.postType,
	            url: getUserInfoApiUrl,
	            context: document.body,
	            data: userDataPostData3,
	            success: function(data) {
	                if (data.errorCode == -6 || data.errorCode == -100) {
	                	d_user.reject();
	                    $scope.$root.getErrorCodeMsg(data.errorMessage, function() {}, data.errorCode);
	                    //$location.path('/bind')
	                    return;
	                } else if (data.errorCode < 0) {
	                	d_user.reject();
	                    $scope.$root.getErrorCodeMsg(data.errorMessage);
	                } else {
	                    $timeout(function() {
	                        $scope.form.userInfo = data.result;
	                        localStorage.setItem('phoneNum', aesEncrypt(data.result.phone, ys));
	                        if (data.result.totalStep == null) {
	                            $scope.form.userInfo.totalStep = 0;
	                        }
	                        $scope.form.sex = data.result.sex;
	                        if($scope.d_user_need=localStorage.getItem("d_user_need")){
	                        	$scope.d_user_need = JSON.parse($scope.d_user_need);
	                        	d_user_need = aesDecrypt($scope.d_user_need.uid, ys)!=$scope.form.userData.userId || $scope.d_user_need.count<1 || $scope.d_user_need.lastDate!=presentDate.toLocaleDateString();
	                        }else{
	                        	d_user_need = true;
	                        	localStorage.setItem("d_user_need",JSON.stringify($scope.d_user_need={"uid":aesEncrypt($scope.form.userData.userId, ys),"count":0,"lastDate":presentDate.toLocaleDateString()}));
	                        }
	                        d_user_need = d_user_need && $location.$$path == "/myHealthy" && (data.result.phone==""||data.result.phone==null||data.result.nickName==null||data.result.nickName==""||data.result.nickName=="游客");
	                        var maxStep = data.result.maxStep;
	                        var maxStepTryTime = 0;
	                        var maxStepText = setInterval(function() {
	                            if (!$scope.$root) {
	                                clearInterval(maxStepText);
	                            }
	                           
	                            maxStepTryTime =  maxStepTryTime + 1;
	                            $('#maxStep').text(maxStep+"步");
	                            if ($('#maxStep').length > 0 || maxStepTryTime==50)  {
	                                clearInterval(maxStepText);
	                            };
	                        }, 300);
	                        $('#maxStep').off("click").on("click", function(e) {
	                            e.preventDefault();
	                            e.stopImmediatePropagation();
	                            e.stopPropagation();
	                            $timeout(function() {
	                                $location.path('/healthyTaskSet');
	                            }, 10);
	
	                        });
	                        $scope.maxStep = maxStep;
	                        if (!$scope.$root.isLoadMap) Snap.load("images/map.svg", runngingPathLoaded, document.getElementById("runningPath"));
	                        d_user.resolve();
	                        if(data.result.submitState){
	                        	d_init.resolve();
	                        }
	                    });
	                }
	            },
	            error: function(e) {
	            	d_user.reject();
	                $scope.$root.getReadyStateMsg(e.readyState);
	            }
	        });

	    });
        $.ajax({
			url: htListApi,
			dataType: "json",
			success: function(data){
				$timeout(function(){
					$scope.htlist=data.index.map(function(v){
						return data.list[v];
					});
				});
			}
		});
        $.ajax({
			url: topicListApi,
			dataType: "json",
			success: function(data){
				$timeout(function(){
					$scope.topiclist=[data.list[data.top]];
				});
			}
		});
	});
	//初始化完成或不需要初始化，并且当天记步获取完成
	$.when(d_init,d_today).done(function(){
        getDaysData();
	});
	//获取用户信息完成，并且检测版本通过或关闭
	$.when(d_down,d_user).done(function(){
		if(d_user_need){
			var message = '<div class="healthyAssess-popup text-center">'+'亲，资料没完善会影响活动领奖哦，快来完善资料吧！还有健康币奖励哦！'+'<div class="button-area"><button class="line-twobutton" ng-click="$modalCancel()">暂不完善</button><button class="line-twobutton" ng-click="$modalSuccess()">立即完善</button></div></div>';
	        $scope.showChangeTip(message);
	        if(aesDecrypt($scope.d_user_need.uid, ys)==$scope.form.userData.userId && $scope.d_user_need.lastDate==presentDate.toLocaleDateString()){
	        	$scope.d_user_need.count ++;
	        }else{
	        	$scope.d_user_need={"uid":aesEncrypt($scope.form.userData.userId, ys),"count":1,"lastDate":presentDate.toLocaleDateString()};
	        }
	        localStorage.setItem('d_user_need', JSON.stringify($scope.d_user_need));
		}
	});
	//获取用户信息完成
	$.when(d_user).done(function(){
		//悬赏任务
		_getTaskInfo();
		//西医
        var completeWQ = new Array(3);
        completeWQ[0] = $scope.form.userInfo.haState;//亚健康
        completeWQ[1] = $scope.form.userInfo.weightState;//体重BMI
        completeWQ[2] = $scope.form.userInfo.dnState;//饮食
        localStorage.setItem("completeWQ",JSON.stringify(completeWQ));
        localStorage.setItem("gender",$scope.form.userInfo.sex);
        localStorage.setItem("age",!!$scope.form.userInfo.age);
        //中医
        localStorage.setItem("completeCQ",$scope.form.userInfo.cmState);
		//初始化
		if(!$scope.form.userInfo.submitState){
	        var answersList = {
	            'answer': [{
	                'category': '00',
	                'subCategory': '0001',
	                'value': '1&&1990-01-01'
	            }]
	        };
	        answersListStr = JSON.stringify(answersList);
	        var getSubmitEltResultApiUrl = cignaDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getSubmitEltResultApi;
	        var data = {
	            userId: $scope.form.userData.userId,
	            token: $scope.form.userData.session,
	            data: answersListStr
	        };
	        dAlert("data:   " + JSON.stringify(data))
	        $.ajax({
	            type: $scope.form.postType,
	            url: getSubmitEltResultApiUrl,
	            context: document.body,
	            data: data,
	            success: function(data) {
	                dAlert("success:   " + JSON.stringify(data))
	                if (data.statusCode == 2) {
	                    $scope.$root.getErrorCodeMsg(data.msg);
	                    d_init.reject();
	                    return;
	                } else if (data.statusCode != 200) {
	                    if (data.statusCode == 1) {
	                        $scope.$root.getErrorCodeMsg(data.msg);
	                    } else {
	                        $scope.$root.getErrorCodeMsg('服务器错误');
	                    }
	                    d_init.reject();
	                    return;
	                } else {
	                    $timeout(function() {
	                        d_init.resolve();
	                    })
	                }
	            },
	            error: function(e) {
	            	d_init.reject();
	                $scope.$root.getReadyStateMsg(e.readyState);
	            }
	        });
		}
	});
	//初始化完成或不需要初始化
	$.when(d_init).done(function(){
		if(after_init) after_init();
	})
	//初始化、上传记步都结束之后
	$.when(d_init,d_upload).always(function(){
		$('.share').removeClass('hide');
	});

    return;
}];
