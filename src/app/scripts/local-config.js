apiDomain="http://172.168.11.41:8080/cp_cmb_api_web"

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
getSysAdvertisingApi='/getSysAdvertising';
delInviteApi='/delInvite';
sendSMSForUserApi='/sendSMSForUser';
saveUserPhoneApi='/saveUserPhone';
shareApi='/share';
updateTaskIsShowApi='/updateTaskIsShow';
cancelUserTaskApi='/cancelUserTask';
addUserSuggestApi='/addUserSuggest';

//cigna
cignaDomain="https://hms-sit.test-cignacmb.com/cigna_hra";
getBaseEvaluationApi="/getBaseEvaluation";
getSubmitBaseResultApi="/submitBaseEltResult";
getSubmitEltResultApi="/submitAllEltResult";
getEltResultApi="/getHealthReport";
getHealthyTaskSetApi="/getHealthPlan";
getHealthyTaskSetUpdateApi = "/updateHealthPlan";
getHealthyTaskRecordApi = "/getHealthRecord";
getHealthyTaskRecordUpdateApi = "/updateHealthRecord";
getAllEvaluationApi="/getAllEvaluation";
getCmEvaluationApi='/getCmEvaluation';
submitCmEvaResultApi='/submitCmEvaResult';
getCmEvaResultApi='/getCmEvaResult';
getHealthSuggestionApi='/getHealthSuggestion';
getHealthStatusApi="/getHealthStatus";


// if (!(location.host.match(/hms-sit.test-cignacmb.com/)))
//         alert("Deploy error");


if (!(location.host.match(/172.168.11/)))
		alert("Deploy error");