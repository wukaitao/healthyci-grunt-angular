var UseIntroductionCtrl = ['$scope', '$location', 'form', '$http', function($scope, $location, form, $http) {
    $scope.form = form;
    window.ontouchmove = function(e) {
        e.preventDefault && e.preventDefault();
        e.returnValue = false;
        e.stopPropagation && e.stopPropagation();
        return false;
    }
    $scope.btnNext = function() {
        localStorage.setItem("isUseIntroduction", aesEncrypt(1, ys));
        $location.path('/healthyQuestion');
    }
    $scope.btnLogin = function() {
        localStorage.setItem("isUseIntroduction", aesEncrypt(1, ys));
        localStorage.setItem("isLogin", aesEncrypt(1, ys));
        $location.path('/bind');
    }

    $scope.form.leftBtnClick=function(){        
        if(browser.versions.ios){
            window.location.href="http://cmbiphone/tool";
        }else if(browser.versions.android){
            window.location.href="http://cmbandroid/tool";
        }else{            
            //$location.path("/useIntroduction");
        }
        
    }
    // var myVideo = document.getElementsByTagName('video')[0];
    //         if (myVideo.paused)
    //             myVideo.play();
    $(function() {
        setTimeout(function() {
            $('.part-one').addClass("hide");
            $('.part-two').addClass("hide");
            window.ontouchmove = function(e) {
        e.preventDefault && e.preventDefault();
        e.returnValue = true;
        e.stopPropagation && e.stopPropagation();
        return true;
    }
        }, 11000)
    });
    return;
}];
