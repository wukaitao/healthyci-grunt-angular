var WQuizReportDetailCtrl = ['$scope', '$location', 'form', '$http', '$timeout', '$routeParams', function($scope, $location, form, $http, $timeout, $routeParams) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "专业健康评估报告";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.form = form;
    var id=$routeParams.testId;

    trackerApi("4-西医改进建议","",{});

    if ($scope.form.reportDetail == null || $scope.form.reportDetail == undefined) {
        $location.path("/westernQuizReport/"+id);
    }

    $scope.reset=function(){

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
        
        localStorage.setItem('gotowesternQuiz','/westernQuizReport/'+id);
        $location.path("/westernQuiz/"+id);
    }
    // debugger;
    var value=$scope.form.reportDetail.value;

    switch ($scope.form.reportDetail.categoryId) {
        case "04":
            var desc=$scope.form.reportDetail.desc;
            value = parseFloat(value,10);
            var desc0 = parseFloat(desc[0].value,10);
            var desc1 = parseFloat(desc[1].value,10);
            var desc2 = parseFloat(desc[2].value,10);
            var desc3 = parseFloat(desc[3].value,10);
            if(value<=desc0){
                $scope.form.reportDetail.desc[0].isSelect=true; 
                $scope.form.reportDetail.scale=value/desc0*10;
            }else if(value>desc0&&value<=desc1){
                $scope.form.reportDetail.desc[1].isSelect=true; 
                $scope.form.reportDetail.scale=value/desc1*10;
            }else if(value>desc1&&value<=desc2){
                $scope.form.reportDetail.desc[2].isSelect=true; 
                $scope.form.reportDetail.scale=value/desc2*10;
            }else{
                $scope.form.reportDetail.desc[3].isSelect=true; 
                $scope.form.reportDetail.scale=value-desc2>10?100-2:(value-desc2)*10;
            }
            $scope.form.reportDetail.value=parseInt(value,10);
            break;
        case "05":
            
        
            if(value<=75){
                $scope.form.reportDetail.desc[0].isSelect=true; 
                $scope.form.reportDetail.scale= value;
            }else if(value>75&&value<=85){
                $scope.form.reportDetail.desc[1].isSelect=true;  
                $scope.form.reportDetail.scale= value;
            }else{
                $scope.form.reportDetail.desc[2].isSelect=true;
                $scope.form.reportDetail.scale= value;
            }
            break;
        case "06":
            if(value<=30){
                $scope.form.reportDetail.desc[0].isSelect=true; 
                $scope.form.reportDetail.scale=value/30*100;
            }else if(value>30&&value<=60){
                $scope.form.reportDetail.desc[1].isSelect=true;  
                $scope.form.reportDetail.scale=value/60*100;
            }else{
                $scope.form.reportDetail.desc[2].isSelect=true;
                $scope.form.reportDetail.scale= value>=150?100:value/150*100;
            }
            break;
        case "07":
            if(value<=6){
                $scope.form.reportDetail.desc[0].isSelect=true; 
                $scope.form.reportDetail.scale= value*10;
            }else if(value>6&&value<=7){
                $scope.form.reportDetail.desc[1].isSelect=true;  
                $scope.form.reportDetail.scale= value*10;
            }else{
                $scope.form.reportDetail.desc[2].isSelect=true;
                $scope.form.reportDetail.scale= value>10?100:value*10;
            }
            break;
        case "08":
            if($scope.form.reportDetail.desc.length>3){
                if(value==0){
                    $scope.form.reportDetail.desc[0].isSelect=true; 
                    $scope.form.reportDetail.scale= 50;
                }else if(value>0&&value<=10){
                    $scope.form.reportDetail.desc[1].isSelect=true;  
                    $scope.form.reportDetail.scale= value*10;
                }else if(value>10&&value<=20){
                    $scope.form.reportDetail.desc[2].isSelect=true;
                    $scope.form.reportDetail.scale= (value-10)*10;
                }else{
                    $scope.form.reportDetail.desc[3].isSelect=true;
                    $scope.form.reportDetail.scale= (value-20)>10?100:(value-20)*10;
                }
            }else{
                for (var i = 0; i < $scope.form.reportDetail.desc.length; i++) {
                    var desc=$scope.form.reportDetail.desc[i];
                    if((i+1)==value){
                        $scope.form.reportDetail.desc[i].isSelect=true;
                        $scope.form.reportDetail.scale= 50; 
                    }
                }
            }
            break;
        case "09":
            for (var i = 0; i < $scope.form.reportDetail.desc.length; i++) {
                var desc=$scope.form.reportDetail.desc[i];
                if((5-i)==value){
                    $scope.form.reportDetail.desc[i].isSelect=true;
                    $scope.form.reportDetail.scale= 50; 
                }
            }
            break;
        default:
            break;
    }
    $scope.form.leftBtnClick = function() {
        $location.path("/westernQuizReport/"+id);
    }
    return;
}];
