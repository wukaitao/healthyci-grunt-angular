var ChallengeRankingCtrl = ['$scope', '$location', 'form', '$http', function($scope, $location, form, $http) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "组团战";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.userEndHour = 0;
    $scope.userEndMinutes = 0;
    $scope.userEndSecond = 0;
    trackerApi("3-团战详情","",{});
    $(document).scrollTop(0);

    $scope.form = form;
    if ($scope.form.userTask.taskId == null) {
        $location.path("/myCommunity");
    }
    $scope.form.leftBtnClick = function() {
        $location.path("/myCommunity");
    }
     
    var userId = $scope.form.userData.userId;
    $scope.userTaskMember = {};
    $scope.targetCount=0;
    $scope.pleyerCount=0;
    for (var i = 0; i < $scope.form.taskMembers.length; i++) {
        if( $scope.form.taskMembers[i].status!=0){
            $scope.pleyerCount++;
        }
        if (userId == $scope.form.taskMembers[i].userId) {
            $scope.userTaskMember = $scope.form.taskMembers[i];
        }
        if($scope.form.taskMembers[i].steps>=$scope.form.userTask.targetStepNum){
          $scope.targetCount++;
        }
    };

    var friend = $scope.form.rankList.rankList;
    if(friend.length>0){
        for (var i = 0; i < $scope.form.taskMembers.length; i++) {
        var taskMember=$scope.form.taskMembers[i];
        
                for (var j = 0; j < friend.length; j++) {
                    if(friend[j].userId==taskMember.userId){
                        $scope.form.taskMembers[i].isFriend=true;
                        break;
                    }
                };
            

        }
    };
    

     $scope.addFriendFn = function(self, userId) {
    
        if (self.target.status) {
            return
        }
        trackerApi("3-团战详情","团战详情-添加好友",{});
        var sendInviteApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + sendInviteApi;
        var sendInvitePostData = copyData($scope.form.userData);
        sendInvitePostData.type = 1;
        sendInvitePostData.inviteUserId = userId;
        $.ajax({
            type: $scope.form.postType,
            url: sendInviteApiUrl,
            context: document.body,
            data: sendInvitePostData,
            success: function(data) {
                if (data.errorCode == -6 || data.errorCode == -100) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage,function(){},data.errorCode);
                    //$location.path('/bind')
                    return;
                } else if (data.errorCode < 0) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                } else {
                    if (data.result == 1) {
                        //$scope.$root.showAlert("发送邀请成功！");        
                        $('.challenge-ranking').append('<div class="submit-success text-center saveSuccess"><span class="success-icon"><i class="icon-right"></i></span><span>'+"发送邀请成功！"+'</span></div>')
                                setTimeout(function(){
                                    $('.saveSuccess').remove();
                                },2000)
                    } else {
                        if (data.result == 3) {
                            //$scope.$root.showAlert("已发送过邀请！");
                        $('.challenge-ranking').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+"已发送过邀请！"+'</span></div>')
                                setTimeout(function(){
                                    $('.errorMsgShow').remove();
                                },2000)
                            // self.target.status = 1;
                            // self.target.innerHTML = "已发送邀请";
                        }else if(data.result == 4){
                            // $scope.$root.showAlert("已经是好友");
                        $('.challenge-ranking').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+"已经是好友"+'</span></div>')
                                setTimeout(function(){
                                    $('.errorMsgShow').remove();
                                },2000)
                            // self.target.status=1;
                            // self.target.innerHTML="已发送邀请";
                        }else if(data.result == 5){
                            $scope.$root.showAlert("该用户已发好友邀请给您，请到收件箱接受");
                            // self.target.status=1;
                            // self.target.innerHTML="已发送邀请";
                        } else {
                            // $scope.$root.showAlert("发送邀请失败！");                            
                        $('.challenge-ranking').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+"发送邀请失败！"+'</span></div>')
                                setTimeout(function(){
                                    $('.errorMsgShow').remove();
                                },2000)
                        }
                    }
                }
            },
            error: function(e) {
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
    }

    $scope.isShow = function(item){
        if (item.userId == $scope.form.userData.userId) {
            return false;
        }else{
            return true;
        }
    }
    
    $scope.getCRBgClass = function(item){
        if (item == '1') {
            return "list-head yi-bg";
        }else if (item == '2') {
            return "list-head qian-bg";
        }else{
            return "list-head";
        };
    }
    $scope.shareId;
    $scope.shareRankingUrl="";
    $scope.isSharing=false;
    $scope.getShareUrlRanking=function(){        

        if($scope.isSharing)
            return
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
        //shareMessage.taskMembers = $scope.form.taskMembers;
        postData.shareMessage=JSON.stringify(shareMessage);
        $.ajax({ 
            type: $scope.form.postType,
            url: shareApiUrl,
            context: document.body,
            data: postData,
            success: function(data) {
                if(data.errorCode==0)
                {
                    $scope.isSharing=false;
                    $scope.shareId=data.result.shareId;
                    //alert(delQueStr(window.location.href)+'share.html?shareId='+$scope.shareId)
                     window.location.href="http://CMBLS/socialShare?id=22&type=url&title="+textStr+"&text="+textStr+"&url="+delQueStr(window.location.href)+'share.html?shareId='+$scope.shareId;
                }else{
                    $scope.isSharing=false;
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                }                                
            },
            error: function(e) {
                $scope.isSharing=false;
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
    }

    var endDate = form.userTask.endDate;
    var presentTime = form.userTask.presentTime;
   
    var rankingTimeHandle = setInterval(function(){
        if (!$scope.$root) {
                       clearInterval(rankingTimeHandle);
            }
        //$scope.userEndDay = parseInt((endDate - presentTime) / (1000 * 60 * 60 * 24))
        $scope.userEndHour = parseInt((endDate - presentTime) / (1000 * 60 * 60),10);
        $scope.userEndMinutes = parseInt((endDate - presentTime) % (1000 * 60 * 60 * 24) % (1000 * 60 * 60) / (1000 * 60),10)
        $scope.userEndSecond = parseInt((endDate - presentTime) % (1000 * 60 * 60 * 24) % (1000 * 60 * 60) % (1000 * 60) / 1000,10)
        presentTime += 1000;
        $scope.$apply();
    },1000);

    return;
}];