var BindCtrl = ['$scope', '$location', 'form', '$http', '$timeout', 'createDialog', function($scope, $location, form, $http, $timeout, createDialogService ) {

    /*$('input').on('focus', function() {
        $('.top-menu').css('position', 'absolute');
        $('.bind-telphone').css('position', 'absolute');
    })                    
    $('input').on('blur', function() {
        $('.top-menu').css('position', 'fixed');
        $('.bind-telphone').css('position', 'fixed');
    })*/

    var isLoginVar=aesDecrypt(localStorage.getItem("isLogin"), ys);
    $scope.isLogin = !isLoginVar ? 0 : isLoginVar - 0;
    
    if($scope.isLogin)
    {
        factoryVal.topBar.topBarTitle = "登录";
        factoryVal.topBar.showLeftBtn = true;
        factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    }else{
        factoryVal.topBar.topBarTitle = "创建个人健康档案";
    }
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.showRightBtn = true;
    // factoryVal.topBar.rightBtnType = setting.btn.closeBtn;

    $scope.form.leftBtnClick=function(){        
        if(browser.versions.ios){
            window.location.href="http://cmbiphone/tool";
        }else if(browser.versions.android){
            window.location.href="http://cmbandroid/tool";
        }else{            
            $location.path("/useIntroduction");
        }
        
    }

    $scope.$watch("phoneNumber", function(newV, oldV) {
        //console.log(newV +" " +oldV);
        var reg = new RegExp("^[0-9]*$");  
        var checkPhoneNumber=$scope.form.checkPhoneNumber;
        if(newV!=oldV){
            if(!reg.test(newV)){
                $scope.phoneNumber=oldV;
            } 
        }
        if(!checkPhoneNumber.test(newV)){
            $scope.phoneNumberError=true;
        }else{
            $scope.phoneNumberError=false;
        }

        if(newV.length>11){
            $scope.phoneNumber=oldV;
        }
    }, true)

    $scope.form = form;
    $scope.phoneNumber = '';
    $scope.isAccept = 1;
    $scope.validate = '';
    $scope.timeLabel='获取验证码';
    $scope.labelText='获取验证码';
    $scope.noDisable=true;
    $scope.isClickSubmit=false;
    // $scope.form.rightBtnClick = function() {
    //     $location.path('/myHealthy');
    // }
    $scope.newPhoneNumAlert=function(msg){
    $timeout(function() {
        createDialogService({
            id: 'editPersonalPopup',
            title: '',
            template: '<div class="healthyAssess-popup text-center">'+msg+'<div class="button-area"><button class="line-twobutton" ng-click="$modalCancel()">取消</button><button class="line-twobutton" ng-click="$modalSuccess()">立即评估</button></div></div>',
            backdrop: true,
            controller: null,
            success: {
                fn: function(){
                        $location.path("/healthyQuestion");                    
                }
            },
            cancel:{
                fn:function(){
                    timeNum=0;
                    return;
                }
            }
        }); 
        
    });
}
    var isNew;
    $scope.sendSMSFn = function() {
        $scope.noDisable=false;
        $scope.timeCount();
        var sendSMSApiUrl = apiDomain + sendSMSApi;
        var sendSMSPostData = copyData($scope.form.userData);
        sendSMSPostData.phoneNum = $scope.phoneNumber;   
        if(aesDecrypt(localStorage.getItem("birthday"), ys)!="")     
           sendSMSPostData.birthday=aesDecrypt(localStorage.getItem("birthday"), ys);
        if(aesDecrypt(localStorage.getItem("sex"), ys)!="")   
           sendSMSPostData.sex=aesDecrypt(localStorage.getItem("sex"), ys);
        if(aesDecrypt(localStorage.getItem("nickName"), ys)!="")   
           sendSMSPostData.nickName=aesDecrypt(localStorage.getItem("nickName"), ys);
        if($scope.isLogin) sendSMSPostData.isloginUser=$scope.isLogin;   
        $.ajax({
            url: sendSMSApiUrl,
            type: $scope.form.postType,
            context: document.body,
            data: sendSMSPostData,
            success: function(data) {
                var nickNameStr=aesDecrypt(localStorage.getItem("nickName"), ys);
                var answerList =aesDecrypt(localStorage.getItem("answersList"),ys);
                isNew=data.result.isNew;
                if(data.errorCode==-100)
                {
                    $scope.newPhoneNumAlert('1分钟完成健康评估，为您的新账户建立健康档案');
                }else if(isNew==1&&(nickNameStr==""||nickNameStr==null||answerList==""||answerList==null)){
                    $scope.newPhoneNumAlert('1分钟完成健康评估，为您的新账户建立健康档案');
                }else
                {                    
                    if (data.errorCode == -6 || data.errorCode == -100) {
                        $scope.$root.getErrorCodeMsg(data.errorMessage,function(){$location.path('/bind')});
                        //$location.path('/bind')
                        return;
                    } else if (data.errorCode < 0) {
                        $scope.$root.getErrorCodeMsg(data.errorMessage);
                    }  else if (data.errorCode ==-119) {
                        $scope.$root.getErrorCodeMsg("一小时同一号码只能获取"+data.errorMessage+"次验证码。")
                    } else if(data.errorCode ==0){
                        $timeout(
                            function() {
                                $scope.form.userData.phoneNum = data.result.phoneNum;
                                $scope.form.userData.userId = data.result.userId;                                
                                $('#validateSuccess').removeClass('hide');
                                setTimeout(function(){
                                    $('#validateSuccess').addClass('hide');
                                },2000)
                            }
                            )
                    }else{                        
                        $('#validateError').removeClass('hide');
                        setTimeout(function(){
                            $('#validateError').addClass('hide');
                        },2000)
                    }
                }
            },
            error: function(e) {
                //alert(e.statusText + ":" + e.responseText);                
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
}
var timeNum=60;
$scope.timeCount=function(){
    $scope.timeLabel='重新获取('+timeNum+')';        
    var timeInter = setInterval(function(){
        $timeout(
            function(){
                $scope.timeLabel="重新获取("+timeNum+')';
            }
            )

        timeNum--;
        if(timeNum<0)
        {
            $timeout(
                function(){
                    $scope.labelText= '重新获取';
                    $scope.timeLabel = '重新获取';
                    $scope.noDisable=true;
                    clearInterval(timeInter)
                    timeNum=60;
                }
                )
        }
    },1000)
}
var isFirst=true;
var isUpdate;
$scope.btnConfirm = function() {
    $scope.isClickSubmit=true;
    var apiUrl = apiDomain + loginApi;
    var postData = copyData($scope.form.userData);
    postData.code = $scope.validate;      

    if($scope.form.cmbUserId)
    {
        postData.cmbUserId=$scope.form.cmbUserId;
    }
    dAlert(JSON.stringify(postData))
    $.ajax({
        url: apiUrl,
        type: $scope.form.postType,
        context: document.body,
        data: postData,
        success: function(data) {
            dAlert(data.errorCode)
            if (data.errorCode == -6 || data.errorCode == -100) {
                $scope.$root.getErrorCodeMsg(data.errorMessage,function(){$location.path('/bind')});
                //$location.path('/bind')
                $scope.isClickSubmit=false;
                return;
            } else if (data.errorCode <0) {
                // $scope.$root.getErrorCodeMsg(data.errorMessage);
                    $('.showError').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+data.errorMessage+'</span></div>')
                    setTimeout(function(){
                        $('.errorMsgShow').remove();
                    },2000)
                   $scope.isClickSubmit=false;
               } else  if (data.errorCode ==0){
                $scope.form.userData.session = data.result.userSession;
                $scope.form.userData.userId = data.result.userId;   
                localStorage.setItem("isBind", aesEncrypt(1, ys));
                localStorage.setItem('userId', aesEncrypt($scope.form.userData.userId, ys));
                localStorage.setItem('userSession', aesEncrypt($scope.form.userData.session, ys));
                localStorage.setItem('phoneNum', aesEncrypt($scope.phoneNumber, ys));

                if(isNew){
                   localStorage.setItem("isNew", aesEncrypt(true, ys));
                   isUpdate=true;
                   $scope.nextSubmit();
               }else{
                   localStorage.setItem("isNew", aesEncrypt(false, ys));
                   if(isFirst&&!$scope.isLogin)
                   {
                       $scope.showConfirmAlert("是否使用新的简评报告？"); 
                       //isUpdate=a;                                       
                   }else
                   {
                    isUpdate=false;
                    $scope.nextSubmit();
                   }            
                   isFirst=false;
               }
                }else{
                    $scope.isClickSubmit=false;
                    $scope.$root.showAlert('服务器连接失败')
                }

            },
            error: function(e) {
                $scope.isClickSubmit=false;
                $scope.$root.getReadyStateMsg(e.readyState);              
            }
        });
}

$scope.termsPopup = function() {
    createDialogService('popup/termsPopup.html', {
        id: 'termsPopup',
        title: '使用条款',
        backdrop: true,
        controller: null,
        success: {
            label: 'Success',
            fn: function() {
                console.log('Complex modal closed');
            }
        }
    });
};
$scope.acceptContent=function(){
    if($scope.isAccept==0){
        $scope.isAccept=1;
    }else{
        $scope.isAccept=0;
    }
}
$scope.saveSuccess=false;
$scope.getSubmitSuccess=false;
$scope.gotoMyHealthy=function(){
    if($scope.saveSuccess==true&&$scope.getSubmitSuccess==true)
    {
        localStorage.setItem('setLocalAnswersList',"")
        localStorage.setItem('showList',"")
        localStorage.setItem('answersList', '');  
        localStorage.setItem("isLogin", aesEncrypt(1, ys));  
        $location.path('/myHealthy');
        $scope.isClickSubmit=false;
    }
}
$scope.nextSubmit=function(){
    
    
    var saveUserProfileApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + saveUserProfileApi;
    var postData=copyData($scope.form.userData);
    if(isUpdate) 
    {   
       postData.birthday=aesDecrypt(localStorage.getItem("birthday"), ys);
       postData.sex=aesDecrypt(localStorage.getItem("sex"), ys);
       postData.nickName=aesDecrypt(localStorage.getItem("nickName"), ys);
   }
   $timeout(
    function() {
        var answersList =aesDecrypt(localStorage.getItem("answersList"),ys);

        var getSubmitEltResultApiUrl = cignaDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + getSubmitEltResultApi;
        $scope.form.questionResult = [];

        if(isUpdate)
        {    
            $.ajax({
                type: "POST",
                url: saveUserProfileApiUrl,
                context: document.body,
                data: postData,
                success: function(data) {
                    
                    if (data.errorCode == -6 || data.errorCode == -100) {
                     $scope.$root.getErrorCodeMsg(data.errorMessage,function(){                                            
                         $timeout(function() {
                             $location.path('/bind')
                         });
                     });
                       $scope.isClickSubmit=false;
                     return;
                 } else if (data.errorCode < 0) {
                     $scope.$root.getErrorCodeMsg(data.errorMessage);
                       $scope.isClickSubmit=false;
                 } else {                 
                    $scope.saveSuccess=true;
                    $scope.gotoMyHealthy();
                 }
             },
             error: function(e) {
                $scope.$root.getReadyStateMsg(e.readyState);
                  $scope.isClickSubmit=false;
            }
        });                         
            var data ={userId:$scope.form.userData.userId, token:$scope.form.userData.session, data:answersList};
            dAlert("data:   "+JSON.stringify(data))
            $.ajax({
                type: $scope.form.postType,
                url: getSubmitEltResultApiUrl,
                context: document.body,
                data: data,
                success: function(data) {
                    dAlert("success:   "+ JSON.stringify(data))
                    if (data.statusCode == 2) {
                        $scope.$root.getErrorCodeMsg(data.msg,function(){                                           
                         $timeout(function() {
                             $location.path('/bind')
                         });
                     });
                          $scope.isClickSubmit=false;
                            return;
                    }else if(data.statusCode != 200){
                        
                        if(data.statusCode == 1)
                        {
                            $scope.$root.getErrorCodeMsg(data.msg);
                        }else{
                            $scope.$root.getErrorCodeMsg('服务器错误');
                        }
                          $scope.isClickSubmit=false;
                        return;
                    }

                    $timeout(function() {       
                        $scope.getSubmitSuccess=true;   
                        $scope.gotoMyHealthy()                          
                        //$location.path('/myHealthy');
                    })
                },
                error: function(e) {
                    $scope.$root.getReadyStateMsg(e.readyState);
                    $scope.isClickSubmit=false;
                }
            });
        }else{
            localStorage.removeItem("answersList"); 
            localStorage.setItem("isLogin", aesEncrypt(1, ys));
            $location.path('/myHealthy');            
            $scope.isClickSubmit=false;
        }
    }
    )
}
$scope.showConfirmAlert=function(msg){
    $timeout(function() {
        // if($('.healthyAssess-popup'))
        //     $('.healthyAssess-popup').remove();
        // $('#showAlertPopupTemplate').append('<div class="healthyAssess-popup text-center">'+msg+'<div class="button-area"><button class="middle-button" ng-click="$modalCancel()">取消</button><button class="middle-button" ng-click="$modalSuccess()">确定</button></div></div>')
        createDialogService({
            id: 'editPersonalPopup',
            title: '',
            template: '<div class="healthyAssess-popup text-center">'+msg+'<div class="button-area"><button class="line-twobutton" ng-click="$modalCancel()">取消</button><button class="line-twobutton" ng-click="$modalSuccess()">确定</button></div></div>',
            backdrop: true,
            controller: null,
            success: {
                fn: function(){
                    isUpdate=true;
                    $scope.nextSubmit();
                    }
            },
            cancel:{
                fn:function(){
                    isUpdate=false;
                    $scope.nextSubmit();
                }
            }
        }); 
        
    });
}
return;
}];