//判断访问终端
var browser;
var isMobile;
var isIos;

function judgeTerminal() {
    browser = {
        versions: function() {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
    isMobile = browser.versions.mobile;
    isIos = browser.versions.ios;
    localStorage.setItem("isIos", isIos);
    if (!isMobile) return;
    var items = browser.versions.ios == true ? document.getElementsByClassName("aos") : document.getElementsByClassName("ios");
    for (var i = 0; i < items.length; ++i) {
        var item = items[i];
        item.style.display = "none"
    }

}
var scheme = "http://CMBLS/cmbstep?";

//CMBLS = {};
CMBLS.cmbstep = {};

CMBLS.cmbstep.successCallback = function(id, data) {
    // do something to message yourself
    var xmlDoc;
    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(data, "text/xml");
    } else // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(data);
    }
    if (!xmlDoc) return;

    if (id == 10 || (id == 3 && browser.versions.ios)) {
        var steps = xmlDoc.getElementsByTagName("steps")[0].firstChild.nodeValue;
        var hour = xmlDoc.getElementsByTagName("hour")[0].firstChild.nodeValue;
        onStep(steps, hour);
    } else if (id == 5) {
        var steps = xmlDoc.getElementsByTagName("steps")[0].firstChild.nodeValue;
        var hour = xmlDoc.getElementsByTagName("hour")[0].firstChild.nodeValue;
        //onStep(steps, hour);
       
        updateTodayStep(steps, hour);
    } else if (id == 6) {
        var result = xmlDoc.getElementsByTagName("result")[0].firstChild.nodeValue;

        updateDaysData(result);
    } else if (id == 1) {
        if (isSettingOn) {
            startStepCounter();
        } else {
            stopStepCounter();
        }

    } else {
        //alert("Success: id:" + id + ", data:" + data);
    }
}

CMBLS.cmbstep.failCallback = function(id, data) {
    // do something to message yourself
  //  alert("Failed: id:" + id + ", data:" + data);
    if (id == 6) {
        //var result = xmlDoc.getElementsByTagName("result")[0].firstChild.nodeValue;      
        //updateDaysData("[]");
    }
    //alert("获取步数失败！")
}

function isPedometerSupport() {
    var param = "id=12&cmd=check_pedometer_support";
    window.location.href = scheme + param;
}

function isPedometerAvailable() {
    var param = "id=13&cmd=check_pedometer_available";
    window.location.href = scheme + param;
}

function syncData() {
    var param = "id=14&cmd=sync_data";
    window.location.href = scheme + param;
}
var isSettingOn = false;
//设置计步器开关状态
function setStepCounterSettingOn(on) {
    if (!isMobile) return;
    isSettingOn = on;
    var param = "id=1&cmd=set_step_counter_setting_on&on=" + on;
    window.location.href = scheme + param;
}

//获取当前计步器开关状态
function isStepCounterSettingOn() {
    var param = "id=2&cmd=is_step_counter_setting_on";
    window.location.href = scheme + param;
}

//开启计步功能
function startStepCounter() {
    if (!isMobile) return;
    var param = "id=3&cmd=start_step_counter";
    window.location.href = scheme + param;
}

//实时步数回调
function onStep(steps, time) {
    if (!isMobile) return;
    document.getElementById('step_value').innerHTML = steps;
}

//停止计步功能
function stopStepCounter() {
    //var r = confirm("确定要停止计步功能？");
    //if (r == true) {
    if (!isMobile) return;
    var param = "id=4&cmd=stop_step_counter";
    window.location.href = scheme + param;
    //}
}

//注册实时步接收器
function regStepCountReceiver() {
    if (!isMobile) return;
    window.location.href = scheme + "id=9&cmd=reg_step_counter_receiver";
}

//注销实时步数接收器
function unregStepCountReceiver() {
    window.location.href = scheme + "id=11&cmd=unreg_step_counter_receiver";
}

var today;
var date;
var year;
var month;
var day;
var lastDate;
var maxSteps;

//获取今天的步数
function getTodayStepData(maxStep) {
    maxSteps = maxStep;
    if (!isMobile) return;
    var param = "id=5&cmd=today_step";
    window.location.href = scheme + param;
}

//获取最近30天数据
function getDaysData() {
    if (!isMobile) return;
    date = new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    today = year + (month < 10 ? '0' + month : month + '') + (day < 10 ? '0' + day : day + '');
    localStorage.setItem('today', today);
    var params;
    if (localStorage.getItem('LastEndDate')) {
        lastDate = localStorage.getItem('LastEndDate');
        params = "id=6&cmd=days_step&fromDate=" + lastDate + "&toDate=" + today;
    } else {
        params = "id=6&cmd=days_step&fromDate=20150101&toDate=" + today;
    }
    if (aesDecrypt(localStorage.getItem("isNew"), ys) == 'true')
        params = "id=6&cmd=days_step&fromDate=" + today + "&toDate=" + today;
    window.location.href = scheme + params;
}

//获取今天数据回调
function updateTodayStep(steps, hour) {
   dAlert('updateTodayStep: ' + steps)

    steps = steps.replace(/\D/g, '');
    steps = parseInt(steps, 10);
    //      percent= parseInt(steps/maxSteps*100);

    //$('#percent').text(percent);
    //$('.big-size-font').text(steps);

   angular.element("body").scope().$broadcast('updateTodayStep', [steps, 2, 3]);
    
}

//获取最近30数据回调
function updateDaysData(data) {
    if (data != "[]" && data != "(null)") {
        dAlert('updateDaysData: ' + data)
        var dataStr = '{"walkingData":' + data + '}';
        var dataArray = {
            "session": factoryVal.userData.session,
            "phoneNum": factoryVal.userData.phoneNum,
            "device": "1",
            "deviceVerNum": "1.0.0",
            "appVerNum": "4.0.0",
            "userId": factoryVal.userData.userId,
            "type": "1",
            "lang": "CN",
            "appData": dataStr
        };

        
        
        $.ajax({
            url: apiDomain + uploadDaysDataApi,
            type: "post",
            traditional: true, //必须设成 true  
            data: dataArray,
            dataType: "text",
            success: function(msg) {
                var data = JSON.parse(msg)
                if (data.errorCode == 0) {
                    dAlert('上传步数成功')
                    localStorage.setItem("LastEndDate", today);
                    setTimeout(function() {
                        angular.element("body").scope().$broadcast('dataUploadReadyEvent', [1, 2, 3]);
                    })
                } else {
                    angular.element($("body")).scope().$root.showMsg(data.errorMessage, function() {});
                }
            },
            error: function(e) {
                angular.element($("body")).scope().$root.getReadyStateMsg(e.readyState);
            }
        });
    } else {
        angular.element("body").scope().$broadcast('dataUploadReadyEvent', [1, 2, 3]);
    }
}
//检测计步服务是否运行
function isServiceRunning() {
    var param = "id=7&cmd=is_step_counter_service_running";
    window.location.href = scheme + param;
}

//检测计步服务是否运行 Callback
function isServiceRunningCallback(isRun) {
    alert(isRun);
}

//清除DB数据
function resetDB() {
    var r = confirm("确定要清除本地DB数据？");
    if (r == true) {
        window.location.href = scheme + "id=8&cmd=reset_db&date=20150803";
    }
}

judgeTerminal();




//var method = "id=5&cmd=today_step";
//window.location.href = scheme + method;　　

//注册实时步数接收器
// setTimeout(function() {
//     regStepCountReceiver();
// },2000);
