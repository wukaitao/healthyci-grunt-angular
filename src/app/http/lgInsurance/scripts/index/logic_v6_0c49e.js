var app = angular.module('publicApp', []);
app.controller('myCtrl', function ($scope, $http) {


  var imgLoads = document.querySelectorAll("img");
  imagesLoaded(imgLoads, {background: true}, function () {
    cancelLoading();
  });

  $scope.popUpAt = 0;
  $scope.sexSelected = 0;
  $scope.isAndirod = false;
  $scope.provinces = ['请选择', '广东', '浙江', '北京', '上海', '湖北', '山东', '四川', '辽宁', '重庆', '陕西', '湖南', '河南', '江苏', '其它'];
  $scope.provinceSlected = '请选择';
  $scope.provinceIsClicked = 0;
  //$scope.femaleSelected=false;
  $scope.getProvice = function (index) {
    $scope.provinceSlected = $scope.provinces[index];
    $scope.provinceIsClicked = index;
    $scope.popUpAt = 3;
    document.getElementById('province').value = $scope.provinceSlected;
  };

  $scope.closePopupAt = function () {
    $scope.popUpAt = 3;
  };

  $scope.withHeader;

  //弹窗
  $scope.popUpAt = 0;

  var campaign = document.getElementById('campaign');
  var urlSearch = new UrlSearch();

  if (urlSearch.source) {
    $scope.withHeader = false;
    campaign.value = '1UIIHISHK2';// 糖医生
  } else {
    $scope.withHeader = true;
    campaign.value = '1UIIS2SHK1';// 糖无忧
  }
  // campaign code
  if(urlSearch.cc){
    campaign.value = urlSearch.cc;
  }

  $scope.openPopupAt = function (index) {
    $scope.popUpAt = index;
  };
  $scope.closePopup = function () {
    $scope.popUpAt = 0;
  };
  $scope.showAreas = function () {
    $scope.popUpAt = 5;
  };
  $scope.selectSex = function (index) {
    $scope.sexSelected = index;
    document.getElementById('gender').value = index === 0 ? 'M' : 'F';
  };
 

//往上检验
//模糊检验
  // document.querySelector("#name").addEventListener('blur', function () {
  //   var result_name = validateName($scope.cusName);
  //   if (!$scope.cusName) {
  //     beginTipsPopup("姓名不能为空");
  //     return false;
  //   }
  //   if (!result_name.isValid) {
  //     beginTipsPopup(result_name.tips);
  //     return false;
  //   }
  // });
  // document.querySelector("#tel").addEventListener("blur", function () {
  //   var result_phone = validateMobile($scope.cusPhone);
  //   if (!$scope.cusPhone) {
  //     beginTipsPopup("手机号码不能为空");
  //     return false;
  //   }
  //   if (!result_phone.isValid) {
  //     beginTipsPopup(result_phone.tips);
  //     return false;
  //   }
  // });

  /**
   * 点击左上角返回键事件
   */
  $scope.back = function () {
    location.href = 'cmd://return_app';
  };

  /**
   * 发送请求事件监听
   */
  $scope.submit = function () {

    var result_name = validateName($scope.cusName);//验证姓名字段
    var result_phone = validateMobile($scope.cusPhone);//验证手机字段
    var result_address = $scope.provinceSlected;//检查地区是否有输入

    if (!result_name.isValid){
      beginTipsPopup("请输入正确的姓名");
      return false;
    }
    if(!result_phone.isValid){
      beginTipsPopup("请输入正确的手机号码");
      return false;
    }
    if(!result_address){
      beginTipsPopup("请选择所在地区");
      return false;
    }

      $("#myform").submit();
      $scope.popUpAt = 4;
      $("#myform")[0].reset();
  };

});
