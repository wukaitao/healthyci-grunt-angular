//HMS HEALTHY WESTERN QUIZ REPORT STRAT
var WesternQuizReportCtrl = ['$scope', '$location', 'form', '$http','$timeout', '$routeParams', function($scope, $location, form, $http,$timeout, $routeParams) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.form=form;
	$scope.id=$routeParams.testId;
    $scope.remark=[['亚健康','轻度亚健康','健康'],['偏瘦','标准','微胖','肥胖'],['亟待改进','有待改进','健康']];
    $scope.point=['分','BMI','分'];
    $scope.divide=[[50,100],[18.5,24,27],[50,100]];
    var title=['亚健康测评报告','体重BMI测评报告','饮食测评报告'];
    factoryVal.topBar.topBarTitle = title[$scope.id];
    trackerApi("3-西医评估报告-"+title[$scope.id],"页面进入",{UserID:$scope.form.getUserId()});

    $('.loading').hide();
    $scope.form.leftBtnClick = function() {
        $location.path("/testPortal");
    }
    $scope.healthyTaskFn = function() {
        trackerApi("3-西医评估报告","专属健康任务",{});
        $scope.form.isWQR=$scope.id;
        $location.path("/healthyTask");
    }
    $scope.showDetail=function(obj){
        $scope.form.reportDetail=obj;
        $location.path("/WQuizReportDetail/"+$scope.id);
    }
    $scope.showProduct=function(obj){
    	trackerApi("3-西医评估报告",obj.title,{UserID:$scope.form.getUserId()});
    	var link={'1LDG486DA7':'actBreast/td10.html','1LDG446HA1':'lgInsurance/index.html','1LDG446HA2':'lgInsurance/index2.html','1LDG446HA3':'lgInsurance/index4.html'}
    	location="http"+"://"+location.host+location.pathname.substring(0,location.pathname.indexOf("/app.html"))+"/http/"+link[obj.compaignCode]+"?remark="+encodeURIComponent("健康测评-"+obj.title)+"&userid="+$scope.form.getUserId()+"&backUrl="+encodeURIComponent(location.href);
    }

    $scope.reset=function(){
        trackerApi("3-西医评估报告","重评",{});
        $scope.form.isReset=1;

        $scope.form.height = '';
        $scope.form.weight = '';
        $scope.form.work = '';
        $scope.form.workMin = '';
        $scope.form.bicycling = '';
        $scope.form.sportsMinute = '';
        $scope.form.workingHours = '';
        $scope.form.sittingHours = '';
        $scope.form.readingHours = '';
        $scope.form.smoking = '';
        $scope.form.water = '';

        if(localStorage.getItem('setLocalAnswersList')){
            var list=eval(localStorage.getItem('setLocalAnswersList'));
            for (var i = 0; i < list.length; i++) {
                list[i].value.isShow=false;
                if(list[i].key==undefined){
                    continue                     
                }
                if(list[i].key.match("08_0802")||list[i].key.match("09_0901")){
                    
                    list[i].value.isCheck=0;
                }else{
                    switch (list[i].key) {
                        case "05_0502_1_0":
                             list[i].value.value="0";
                            break;    
                        case "00_0001_0_0":
                            // localStorage.setItem('WQsex',list[i].value.value);
                            list[i].value.value=" ";
                            break;      
                        case "00_0001_0_1":
                            list[i].value.value="";
                            break; 
                        case "09_0902_0_0":
                            list[i].value.value="0";   
                            break;
                        case "05_0501_0_12":
                        	list[i].value.value=""
                        	list[i].value.isCheck="";
                        	break; 	 
                        default:
                            list[i].value.value="";
                            list[i].value.isCheck=" ";
                            break;
                    }  
                }                              
            };
            localStorage.setItem('showList',''); 
            localStorage.setItem('setLocalAnswersList',JSON.stringify(list));
        }
        
        localStorage.setItem('gotowesternQuiz','/westernQuizReport/'+$scope.id);
        $location.path("/westernQuiz/"+$scope.id);
    }
    //http://hms-sit.test-cignacmb.com/cigna_hra/1/1/getEltResult
     // load healthy score svg end
    // var getEltResultApiUrl = cignaDomain + "/" +  100 + "/" + 1 + getEltResultApi;
    var getEltResultApiUrl = cignaDomain + "/" +  $scope.form.userData.userId + "/" + $scope.form.userData.session + getEltResultApi;
    $.ajax({
        type: $scope.form.postType,
        url: getEltResultApiUrl,
        context: document.body,
        data: {type: parseInt($scope.id,10)+1},
        success: function(data) {          
            if (data.statusCode == 2) {
                        $scope.$root.getErrorCodeMsg(data.msg,function(){  },data.statusCode);
            }else if(data.statusCode != 200){                        
                        if(data.statusCode == 1)
                        {
                            $scope.$root.showAlert(data.msg);
                        }else{
                            $scope.$root.showAlert('服务器错误');
                        }
            } else {
                $timeout(function() {
                    
                    $scope.returnReport= data.data;
                    
                    $scope.unusualArray=[];//异常
                    $scope.improveArray=[];//有待改进
                    $scope.beCarefulArray=[];//注意
                    $scope.recommendArray=data.data.product;//推荐产品
                    // 
//                  var desc=$scope.returnReport.desc;
//                  var value=data.data.level;
//                  if(value==1){
//                      $scope.returnReport.desc[0].isSelect=true; 
//                      $scope.returnReport.scale= 50;
//                  }else if(value==2){
//                      $scope.returnReport.desc[1].isSelect=true;  
//                      $scope.returnReport.scale= 50;
//                  }else if(value==3){
//                      $scope.returnReport.desc[2].isSelect=true;
//                      $scope.returnReport.scale= 50;
//                  }else{
//                      $scope.returnReport.desc[3].isSelect=true;
//                      $scope.returnReport.scale= 50;
//                  }
                    var isUnusual=false;
                    var categoryObj={};
                    $scope.reportList=new Array();
                    for (var i = 0; i < data.data.category.length; i++) {
                        var category=data.data.category[i];
                        if(category.categoryId=="02"){
                            $scope.beCarefulArray.push(category);
                        }else if(category.categoryId=="04"){
                            for (var j = 0; j < category.report.length; j++) {
                                var report=category.report[j]; 
                                if(report.id=="0402"){
                                    isUnusual=true;
                                }
                                categoryObj=category;
                            }                            
                        }else{
                            $scope.improveArray.push(category);
                        }
                    };
                        if(isUnusual){
                            $scope.unusualArray.push(categoryObj);
                        }else{
                            if(categoryObj.title!=undefined)
                            $scope.improveArray.push(categoryObj);                            
                        }
                        // for (var j = 0; j < category.report.length; j++) {
                        //     var report=category.report[j]; 
                        //     if(report.id=="0299"&&report.context!=""){
                        //         $scope.beCarefulArray.push(report);
                        //     }else if(report.id=="0402"&&report.context!=""){
                        //         $scope.unusualArray.push(report);
                        //     }else if(
                        //         ((report.id=="0502")||(report.id=="0602")||(report.id=="0702")||
                        //         (report.id=="0703")||(report.id=="0704")||(report.id=="0801")||
                        //         (report.id=="0802")||(report.id=="0902")||(report.id=="0903")||
                        //         (report.id=="0904"))&&report.context!=""
                        //         ){
                        //         $scope.improveArray.push(report);
                        //     }
                        // };
                  
                    // 
               
                })
            }
            
        },
        error: function(e) {
            $scope.$root.getReadyStateMsg(e.readyState);
        }
    });

    return;
}];
//HMS HEALTHY WESTERN QUIZ REPORT END