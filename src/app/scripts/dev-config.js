apiDomain="https://hms-sit.test-cignacmb.com/cp_cmb_api_web"
loginApi="/login";
getUserInfoApi="/getUserInfo";
getUserTaskInfoApi="/getUserTaskInfo";
rankListApi="/rankList";
genInviteCodeApi="/genInviteCode";
acceptInviteApi="/acceptInvite";
saveUserProfileApi="/saveUserProfile";
searchFriendApi="/searchFriends";
sendInviteApi="/sendInvite";
inviteListApi="/inviteList";
sendSMSApi="/sendSMS";
getSysTaskListApi="/getSysTaskList";
createTaskApi="/createTask";
uploadDaysDataApi="/uploadAppData";
//cigna

cignaDomain="https://hms-sit.test-cignacmb.com/cigna_hra";
getBaseEvaluationApi="/getBaseEvaluation";
getSubmitBaseResultApi="/submitBaseEltResult";
getSubmitEltResultApi="/submitEltResult";
getEltResultApi="/getEltResult";
getHealthyTaskSetApi="/getHealthPlan";
getHealthyTaskSetUpdateApi = "/updateHealthPlan";


if (!(location.host.match(/hms-sit.test-cignacmb.com/)))
		alert("Deploy error");