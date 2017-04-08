var FeedBackCtrl = ['$scope', '$location', 'form', '$http','$timeout', function($scope, $location, form, $http, $timeout) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "意见反馈";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.form = form;
    $scope.suggestMessage="";
    trackerApi("3-意见反馈","",{});
    $scope.form.leftBtnClick = function() {
        $location.path("/managemant");
    }
    $scope.submitSuggest=function(){
        var addUserSuggestApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + addUserSuggestApi;
        var postData=copyData($scope.form.userData);
        postData.suggestMessage=$scope.suggestMessage;
        //alert(JSON.stringify(postData))
        $.ajax({
            type: $scope.form.postType,
            url: addUserSuggestApiUrl,
            context: document.body,
            data: postData,
            success: function(data) {
                if(data.errorCode==0)
                {
                    $('#validateSuccess').removeClass('hide');
                    $timeout(function(){                        
                        $('#validateSuccess').addClass('hide');
                        $location.path("/managemant");
                    },2000)               
                }else if (data.errorCode == -6 || data.errorCode == -100) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage, function() {},data.errorCode);
                }else{
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                }                                
            },
            error: function(e) {
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
    }
    return;
}];