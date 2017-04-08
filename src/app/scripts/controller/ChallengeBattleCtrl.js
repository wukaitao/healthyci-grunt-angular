var ChallengeBattleCtrl = ['$scope', '$location', 'form', '$http', function($scope, $location, form, $http) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "组团战";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.form = form;
    $scope.form.leftBtnClick = function() {
        $location.path("/myCommunity");
    }
    if ($scope.form.userTask.taskId == null) {
        $location.path("/myCommunity");
    }
    var userId = $scope.form.userData.userId;
    $scope.userTaskMember = {};
    for (var i = 0; i < $scope.form.taskMembers.length; i++) {
        if (userId == $scope.form.taskMembers[i].userId) {
            $scope.userTaskMember = $scope.form.taskMembers[i];
        }
    };

    // localStorage.setItem("taskId", aesEncrypt(form.userTask.taskId, ys));

    $scope.getCBBgClass = function(item){
        if (item.id == '1') {
            return "brttleGroup-content team-yi-bg";
        }else if (item.id == '2') {
            return "brttleGroup-content team-qian-bg";
        }else{
            return "brttleGroup-content";
        };
    }

    $scope.shareId;
    $scope.shareBattleUrl="";
    $scope.isSharing=false;
    $scope.getShareUrlBattle=function(){  
        if($scope.isSharing)
            return
        trackerApi("3-团战详情","分享",{});
        $scope.isSharing=true;
        var n=Math.floor(Math.random()*10);
        var textStr='';
        switch(n){
            case 1:
                  textStr="【直播】"+$scope.form.userInfo.nickName+"正准备移步登天，汪疯又没法儿上头条了";
                  break;
            case 2:
                  textStr="我要去找嫦娥求婚！邀您来见证！我已向她迈进了"+format_number($scope.userTaskMember.steps)+"步！";
                  break;
            case 3:
                  textStr="逆天了！组团登天居然这么简单有趣！";
                  break;
            case 4:
                  textStr=$scope.form.userInfo.nickName+"正在组团去月球溜达，有钱人真是任性！";
                  break;
            case 5:
                  textStr="【重大新闻】据报道，已经有大批人类登上了月球。";
                  break;
            case 6:
                  textStr=$scope.form.userInfo.nickName+"邀您私奔到月球，登月不止，不止登月…";
                  break;
            case 7:
                  textStr="他对她说：约Pao吗？她说：约…";
                  break;
            case 8:
                  textStr="他对他说：约Pao吗？他说：约…";
                  break;
            case 9:
                  textStr=$scope.form.userInfo.nickName+"正在练比凌波微步更碉堡的武功-移步登天，这是要屌炸天的节奏啊！";
                  break;
            default:
                  textStr="还在用老招数约Pao？教您个新招，还不用担心被老婆发现";
                  break;
        }     

        var shareApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + shareApi;
        var postData=copyData($scope.form.userData);
        var shareMessage={};
        shareMessage.text=textStr;
        shareMessage.type='team';
        shareMessage.today=localStorage.getItem('today');
        shareMessage.taskId=$scope.form.userTask.id;
        shareMessage.taskName=$scope.form.userTask.taskName
        shareMessage.nickName=$scope.form.userInfo.nickName;
        shareMessage.steps=$scope.userTaskMember.steps;
        
        shareMessage.taskMembers=[];
        for(var i=0;i<$scope.form.taskMembers.length;i++)
        {
            shareMessage.taskMembers[i]={}
            shareMessage.taskMembers[i].userName=$scope.form.taskMembers[i].userName;
            shareMessage.taskMembers[i].status=$scope.form.taskMembers[i].status;
            shareMessage.taskMembers[i].userRank=$scope.form.taskMembers[i].userRank;
            shareMessage.taskMembers[i].score=$scope.form.taskMembers[i].score;
            shareMessage.taskMembers[i].steps=$scope.form.taskMembers[i].steps;
        }
        postData.shareMessage=JSON.stringify(shareMessage);

        $.ajax({
            type: $scope.form.postType,
            url: shareApiUrl,
            context: document.body,
            data: postData,
            success: function(data) {

                if (data.errorCode == -6 || data.errorCode == -100) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage,function(){},data.errorCode);
                    $scope.isSharing=false;
                    //$location.path('/bind')
                    return;
                } else if (data.errorCode == 0) {
                    $scope.isSharing=false;
                    $scope.shareId = data.result.shareId;
                    window.location.href = "http://CMBLS/socialShare?id=22&type=url&title=" + textStr + "&text=" + textStr + "&url=" + delQueStr(window.location.href) + 'share.html?shareId=' + $scope.shareId;
                } else {
                    $scope.isSharing=false;
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                }

            },
            error: function(e) {
                $scope.isSharing=false;
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
        //return textStr;
    }

    var updateTaskIsShowApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + updateTaskIsShowApi;
    var postData = copyData($scope.form.userData);
    postData.isShow = 1; 
    var taskMembers = $scope.form.taskMembers;
    for (var i = 0; i < taskMembers.length; i++) {
        if (taskMembers[i].userId == postData.userId) {
            postData.memberId = taskMembers[i].id;
        };
    };
    $.ajax({
        // type: $scope.form.postType,
        url: updateTaskIsShowApiUrl,
        context: document.body,
        data: postData,
        success: function(data) {
            if (data.errorCode == -6 || data.errorCode == -100) {
                $scope.$root.getErrorCodeMsg(data.errorMessage,function(){},data.errorCode);
                return;
            } else if (data.errorCode != 0) {
                $scope.$root.getErrorCodeMsg(data.errorMessage);
            }
        },
        error: function(e) {

            $scope.$root.getReadyStateMsg(e.readyState);
        }
    });

    return;
}];