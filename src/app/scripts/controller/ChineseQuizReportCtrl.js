//HMS HEALTHY CHINESE QUIZ REPORT STRAT
var ChineseQuizReportCtrl = ['$scope', '$location', 'form', '$http','$timeout', '$routeParams', function($scope, $location, form, $http, $timeout, $routeParams) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "中医体质评估报告";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $('.loading').hide();
    $(document).scrollTop(0);
    $scope.act=$routeParams.act;
    $scope.actParam=0;

    trackerApi("3-中医评估报告","",{UserID:$scope.form.getUserId()});

    var getCmEvaResultApiUrl =  cignaDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session +  getCmEvaResultApi;
    //var getBaseEvaluationApiUrl = cignaDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getBaseEvaluationApi;
    
    $.ajax({
        type: $scope.form.postType,
        url: getCmEvaResultApiUrl,
        context: document.body,
        data: $scope.form.userData,
        success: function(data) {
	    	$timeout(function() {
                if (data.statusCode == 2) {
                    $scope.$root.getErrorCodeMsg(data.msg,function(){  },data.statusCode);
                    return;
                }
                var chineseQuizResult = data.data;
                $scope.recommendArray=data.product;
                //console.log(chineseQuizResult);
                //debugger
                var chineseQuizResultTemp = 0;
                for (var i = 0; i < chineseQuizResult.length; i++) {
                    
                	for(var key in chineseQuizResult[i]){
                		if(!$scope.actParam) $scope.actParam=parseInt(chineseQuizResult[i][key].result,10);
                        if (chineseQuizResult[i][key].description != "") {
                            chineseQuizResultTemp = chineseQuizResultTemp + 1;
                    		var allDescription = chineseQuizResult[i][key].description;

                    		var morphologicalCharacteristics = '形体特征：';
                    		var morphologicalCharacteristicsDes = '';
                    		var morphologicalCharacteristicsIndex = allDescription.search(morphologicalCharacteristics);

                    		var CommonManifestations = '常见表现：';
                    		var CommonManifestationsDes = '';
                    		var CommonManifestationsIndex = allDescription.search(CommonManifestations);

                    		var psychologicalCharacteristics = '心理特征：';
                    		var psychologicalCharacteristicsDes = '';
                    		var psychologicalCharacteristicsIndex = allDescription.search(psychologicalCharacteristics);

                    		var Predisposed = '发病倾向：';
                    		var PredisposedDes = '';
                    		var PredisposedIndex = allDescription.search(Predisposed);

                    		var Adaptability = '对外界环境适应能力：';
                    		var AdaptabilityDes = '';
                    		var AdaptabilityIndex = allDescription.search(Adaptability);

                    		morphologicalCharacteristicsDes = allDescription.substring(morphologicalCharacteristicsIndex+morphologicalCharacteristics.length,CommonManifestationsIndex);
                    		CommonManifestationsDes =allDescription.substring(CommonManifestationsIndex+psychologicalCharacteristics.length,psychologicalCharacteristicsIndex);
                    		psychologicalCharacteristicsDes =allDescription.substring(psychologicalCharacteristicsIndex+psychologicalCharacteristics.length,PredisposedIndex);
                    		PredisposedDes =allDescription.substring(PredisposedIndex+Predisposed.length,AdaptabilityIndex);
                    		AdaptabilityDes =allDescription.substring(AdaptabilityIndex+Adaptability.length);

    // debugger
                    		chineseQuizResult[i][key].description=[];
                    		var morphologicalCharacteristicsObj={},
                    			CommonManifestationsObj={},
                    			psychologicalCharacteristicsObj={},
                    			PredisposedObj={},
                    			AdaptabilityObj={};

                    			//形体特征：
                    			morphologicalCharacteristicsObj.title=morphologicalCharacteristics;
                    			morphologicalCharacteristicsObj.descriptionItem=morphologicalCharacteristicsDes;
                    			chineseQuizResult[i][key].description.push(morphologicalCharacteristicsObj);
                    			//常见表现：
                    			CommonManifestationsObj.title=CommonManifestations;
                    			CommonManifestationsObj.descriptionItem=CommonManifestationsDes;
                    			chineseQuizResult[i][key].description.push(CommonManifestationsObj);
                    			//心理特征：
                    			psychologicalCharacteristicsObj.title=psychologicalCharacteristics;
                    			psychologicalCharacteristicsObj.descriptionItem=psychologicalCharacteristicsDes;
                    			chineseQuizResult[i][key].description.push(psychologicalCharacteristicsObj);
                    			//发病倾向：
                    			PredisposedObj.title=Predisposed;
                    			PredisposedObj.descriptionItem=PredisposedDes;
                    			chineseQuizResult[i][key].description.push(PredisposedObj);
                    			//对外界环境适应能力：
                    			AdaptabilityObj.title=Adaptability;
                    			AdaptabilityObj.descriptionItem=AdaptabilityDes;
                    			chineseQuizResult[i][key].description.push(AdaptabilityObj);

                    	}
                    };
                };
                //alert(chineseQuizResultTemp);
                if (chineseQuizResultTemp >1) {
                    //debugger;
                    for(key in chineseQuizResult[0]){
                        if (key == "yes") {
                            chineseQuizResult[0][key].title = "基本是" + chineseQuizResult[0][key].title;
                        }else{
                            chineseQuizResult[0][key].title = "有" + chineseQuizResult[0][key].title +"倾向";
                        }
                    }
                }
                $scope.form.chineseQuizResultData = chineseQuizResult;
            	//console.log(chineseQuizResult);
            	//debugger;
            });

        },
        error: function(e) {
            //alert(e.statusText + ":" + e.responseText);
        }
    });
    $scope.reset=function(){
        localStorage.removeItem("CItemID");
        localStorage.removeItem("CItemList");
        $scope.form.progresscount = 0;
        $scope.form.pageTemp = 1;
        $scope.form.answerTemp = 1;
        $location.path("/chineseQuiz");
    }

    $scope.chineseQuizPepotrDetails = function(item){
        $scope.form.detailsId = item.result;
        $location.path("/CQuizReportDetail");
    }

    $scope.form.leftBtnClick = function() {
    	if(!$scope.act) $location.path("/testPortal");
    	else location="/hms-cmb-act/hmc_bodycode_web/page3.html?userId="+$scope.form.userData.userId+"&token="+$scope.form.userData.session;
    }

	$scope.showProduct=function(obj,s){
    	trackerApi("3-中医评估报告",s+"-"+obj.title,{UserID:$scope.form.getUserId()});
    	var link={'1LDG486DA7':'actBreast/td10.html','1LDG446HA1':'lgInsurance/index.html','1LDG446HA2':'lgInsurance/index2.html','1LDG446HA3':'lgInsurance/index4.html'}
    	location="http"+"://"+location.host+location.pathname.substring(0,location.pathname.indexOf("/app.html"))+"/http/"+link[obj.compaignCode]+"?remark="+encodeURIComponent("健康测评-"+obj.title)+"&userid="+$scope.form.getUserId()+"&backUrl="+encodeURIComponent(location.href);
    }

    return;
}];
//HMS HEALTHY CHINESE QUIZ REPORT END