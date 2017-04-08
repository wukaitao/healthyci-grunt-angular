var pId = 1;

var host = "";
var app_name = "/hmc_omc_server";
var isWechat;

var Storage;
var formFriends;
var passAuthorization;
var hasOvertime;
//判断是否在微信
!function () {
  var agent = window.navigator.userAgent.toLowerCase();
  isWechat = agent.match(/MicroMessenger/i) == 'micromessenger';
}();

if (isWechat) {
  Storage = window.sessionStorage;
} else {
  Storage = window.localStorage;
}

function addUrlParam(name, value) {
  var Request = new UrlSearch();
  var url = location.href;
  //console.log(url);
  var num = url.lastIndexOf("?");
  var path = url.slice(0, num);
  var params = url.slice(num);
  //console.log(url);
  if (!Request[name]) {
    if (num < 0) {
      //console.log(url);
      window.location.href = url + "#?" + name + "=" + value;
      return false;
    }
    if (url.lastIndexOf('#?') > -1) {
      window.location.href = url + "&" + name + "=" + value;
    } else {
      window.location.href = path + "#" + params + "&" + name + "=" + value;
    }
    //
  }
}

function getUrlParam(name) {
  //构造一个含有目标参数的正则表达式对象
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  //匹配目标参数

  // var path = window.location.toString();
  //
  // alert("路径" + path);
  //
  // var exclude = new RegExp("#");
  //
  // var excludePath = path.replace(exclude);
  //
  // alert("路径" + excludePath);

  var r = window.location.search.substr(1).match(reg);
  //返回参数值
  if (r != null) return unescape(r[2]);
  return null;
}
function UrlSearch() {
  var name, value;
  var str = location.href; //取得整个地址栏
  var num = str.lastIndexOf("?");
  str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

  var arr = str.split("&"); //各个参数放到数组里
  for (var i = 0; i < arr.length; i++) {
    num = arr[i].indexOf("=");
    if (num > 0) {
      name = arr[i].substring(0, num);
      value = arr[i].substr(num + 1);
      this[name] = value;
    }
  }
}


//导航栏返回按钮与首页按钮的事件绑定
if (document.getElementById("back")) {
  document.getElementById("back").addEventListener("click", function () {
    console.log("back clicked!");
    window.history.back();
  });

}
if (document.getElementById("backIndex")) {
  document.getElementById("backIndex").addEventListener("click", function () {
    console.log("backToIndex clicked!");
    window.location.href = "../index.html";
  });
}

//底栏事件绑定
if (document.getElementById("1_recommendation")) {
  document.getElementById("1_recommendation").addEventListener("click", function () {
    console.log("jump to 1_PersonalInfo");
    window.location.href = "1_recommendation.html";
  });
}

if (document.getElementById("1_PersonalInfo")) {
  document.getElementById("1_PersonalInfo").addEventListener("click", function () {
    console.log("jump to 1_PersonalInfo");
    window.location.href = "1_PersonalInfo.html";
  });

}

//开启loading
function beginLoading() {

  document.getElementsByClassName("loading_gif")[0].setAttribute("style", "display:block");

}

//关闭loading
function cancelLoading() {
  document.getElementsByClassName("loading_gif")[0].setAttribute("style", "display:none");
}


//开启提示框
function beginTipsPopup(value) {
  document.getElementsByClassName("popupTips-bg")[0].setAttribute("style", "display:block");
  document.getElementById("tipsFont").innerText = value;
}

//关闭提示框
function cancelTipsPopup() {
  document.getElementsByClassName("popupTips-bg")[0].setAttribute("style", "display:none");
}

//开启网络超时提示框
function beginTimeOutTipsPopup(value) {
  document.getElementsByClassName("timeOutPopupTips-bg")[0].setAttribute("style", "display:block");
  document.getElementById("timeOutTipsFont").innerText = "网络超时,请重试";
}

//关闭网络超时提示框
function cancelTimeOutTipsPopup() {
  document.getElementsByClassName("timeOutPopupTips-bg")[0].setAttribute("style", "display:none");
}

//验证工具函数
//姓名验证
function validateName(value) {
  var result = {isValid: true, tips: ''};

  var patt1 = new RegExp("^[\u4e00-\u9fa5]{1,}$");//验证只能中文输入
  if (!patt1.test(value)) {
    result.isValid = false;
    result.tips = "请填写中文名字";
  }
  return result;
}

//手机号码验证
function validateMobile(value) {
  var result = {isValid: true, tips: ''};
  if(!/^1[34578]\d{9}$/.test(value)){
    result.isValid = false;
    result.tips = "手机号码需为11位数字，请重新输入";
  }
  return result;
}

var httpConfig = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 10000
};


var firstNode = document.createElement("div");
var secondNode = document.createElement("div");

secondNode.innerText = "请竖屏浏览获得更好体验";

firstNode.appendChild(secondNode);
document.body.appendChild(firstNode);
firstNode.className = "screenProcessing";
secondNode.className = "screenProcessingFont";
//横竖屏切换
var evt = "onorientationchange" in window ? "orientationchange" : "resize";
window.addEventListener(evt, function () {
  var landscape = Math.abs(this.orientation) == 90;
  if (landscape) {//横屏
    firstNode.setAttribute("style", "display:block");
  } else {//竖屏
    firstNode.setAttribute("style", "display:none");
  }
});


!function isFormFriends() {
  var Request = new UrlSearch();
  if (Request.recommendCusId) {
    formFriends = true;
  } else {
    formFriends = false;
  }

}();

!function authorize() {
  if (Storage.cusId && Storage.vertifyCode) {
    passAuthorization = true;
  } else {
    passAuthorization = false;
  }
}();

!function isOvertime() {
  var url = host + app_name + "/tMRCus/getUserBaseInfo";


  var xhr = new XMLHttpRequest();


  if (Storage.cusId && Storage.vertifyCode) {
    // alert("检验cusId:" + Storage.cusId)
    var postToString = "cusId=" + Storage.cusId + "&vertifyCode=" + Storage.vertifyCode;
    // alert(postToString);
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {//回调函数
      var req = xhr;
      if (req.readyState == 4) {
        if (req.status == 200) {
          var data = req.responseText;
          console.log(data);
          if (data.statusCode === 603) {
            hasOvertime = false;
            console.log("no overtime");
          } else {
            hasOvertime = true;
            console.log("has overtime");
          }
        }
      } else {
        hasOvertime = false;
        console.log("no overtime");
      }
    };
    xhr.send(postToString);

  }


}();

