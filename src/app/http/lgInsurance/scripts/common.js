/**
 * Created by brave on 16/8/23.
 */
var app = angular.module('publicApp', []);
app.controller('myCtrl', function ($scope, $http, $timeout) {

    /**
     * 检测图片加载
     */
    var imgLoads = document.querySelectorAll("img");
    imagesLoaded(imgLoads, {background: true}, function () {
        cancelLoading();
        document.getElementById("slider").style.display = "block";
    });

    /**
     * 模型初始化
     */
    $scope.popUpAt = 0;
    $scope.sexSelected = 0;
    $scope.isAndirod = false;
    $scope.provinces = ['广东省', '北京市', '上海市', '浙江省', '江苏省', '山东省', '四川省', '重庆市', '湖北省', '陕西省', '辽宁省', '湖南省', '河南省', '其它省份'];
    $scope.provinceSlected = '请选择';
    $scope.provinceIsClicked = 0;
    $scope.bottomFixed = false;
    $scope.withHeader;
    //弹窗
    $scope.popUpAt = 0;
    var campaignCode;
    var campainIndex;
    var userId;

    /**
     * 页面初始化
     */
    !function onViewDid() {

        /**
         * 监听页面弹窗
         */
        $scope.$watch("popUpAt", function (value) {

            if (value != 0) {
                $("body").css("overflow", "hidden");
            } else {
                $("body").css("overflow", "scroll");
            }

        })

        /**
         * 获得产品代码,用于对应index1.html,index2.html  ...
         */
        campaignCode = $("#campaign").val();
        campainIndex = getCampaignIndex(campaignCode);


        /**
         * 获取路径参数
         */
        var request = new UrlSearch();
        var remark = request.remark;
        $("#remark").val(decodeURIComponent(remark));
        userId = request.userid;


        //执行埋点操作
        tdpEnterByUserId(campainIndex, userId);

        /**
         * iframe操作
         */
        doIframeIndex(campainIndex);
        //预约成功
        window.onload = function () {
            var iframe = $("#myiframe")[0];
            var bookingLoad = function () {
                var success = iframe.contentWindow.location.search.indexOf('status=200') != -1;
                if (success) {
                    // $("#myform")[0].reset();

                    tdpSuccessByUserId(campainIndex, userId);//执行埋点操作
                    $timeout(function () {
                        // $scope.provinceSlected = '请选择';
                        // $scope.sexSelected = 0;
                        $scope.popUpAt = 4;
                    });
                }
            }
            if (iframe.attachEvent) iframe.attachEvent("onload", bookingLoad);
            else iframe.onload = bookingLoad;
        };

        //测试用
        console.log("campainIndex:" + campainIndex);
        console.log("remark:" + remark);
        console.log("userid:" + userId);
        console.log("remarkInInput" + $("#remark").val());

    }();


    /**
     * 选择省份
     */
    $scope.getProvice = function (index) {
        $scope.provinceSlected = $scope.provinces[index];
        $scope.provinceIsClicked = index;
        $scope.popUpAt = 3;
        document.getElementById('province').value = $scope.provinceSlected;
    };

    /**
     * 处理弹窗
     */
    $scope.closePopupAt = function () {
        $scope.popUpAt = 3;
    };
    $scope.openPopupAt = function (index) {
        $scope.popUpAt = index;
    };
    $scope.closePopup = function () {
        $scope.popUpAt = 0;
    };
    $scope.showAreas = function () {
        $scope.popUpAt = 5;
    };

    /**
     * 选择性别
     */
    $scope.selectSex = function (index) {
        $scope.sexSelected = index;
        document.getElementById('gender').value = index === 0 ? 'M' : 'F';
    };

    /**
     * 点击左上角返回键事件
     */
    $scope.back = function () {
        var backUrl = getQueryString("backUrl");
        //以及encodeURI()

        if (backUrl != null) {
            backUrl = decodeURIComponent(backUrl);
            window.location.href = backUrl;
        } else {
            history.back();
        }
    };

    //获取路径特定名称参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)return unescape(r[2]);
        return null;
    }

    /**
     * 发送请求事件监听
     */
    $scope.submit = function () {
        var result_name = validateName($scope.cusName);//验证姓名字段
        var result_phone = validateMobile($scope.cusPhone);//验证手机字段
        var result_address = $scope.provinceSlected;//检查地区是否有输入

        if (!result_name.isValid) {
            beginTipsPopup("请输入正确的姓名");
            return false;
        }
        if (!result_phone.isValid) {
            beginTipsPopup("请输入正确的手机号码");
            return false;
        }
        if (result_address == "请选择") {
            beginTipsPopup("请选择所在地区");
            return false;
        }
        $("#myform").submit();
    };

    /**
     * 区分不同的产品代码
     *
     */
    function getCampaignIndex(campaignCode) {

        if (campaignCode == "1LDG446HA1") {
            return 1;
        }
        else if (campaignCode == "1LDG446HA2") {
            return 2;
        }
        else if (campaignCode == "1LDG446HA7") {
            return 3;
        }
        else if (campaignCode == "1LDG446HA3") {
            return 4;
        }
        else {
            return 5;
        }

    }

    /**
     * 针对不同的产品代码执行iframe操作
     */
    function doIframeIndex(n) {
        switch (n) {
            case 1:
                $('#url').val(window.location.href.replace(/index.html/, 'lgResult.html'));
                break;
            case 2:
                $('#url').val(window.location.href.replace(/index2.html/, 'lgResult.html'));
                break;
            case 3:
                $('#url').val(window.location.href.replace(/index3.html/, 'lgResult.html'));
                break;
            case 4:
                $('#url').val(window.location.href.replace(/index4.html/, 'lgResult.html'));
                break;
            case 5:
                $('#url').val(window.location.href.replace(/index5.html/, 'lgResult.html'));
                break;
        }
    }

    /**
     * 执行不同页面的userId埋点发送
     */
    function tdpSuccessByUserId(index, userId) {
        switch (index) {
            case 1:
                TDAPP.onEvent("LG产品预约页面", "重疾险:预约成功", {"UserID": userId});
                break;
            case 2:
                TDAPP.onEvent("LG产品预约页面", "住院险:预约成功", {"UserID": userId});
                break;
            case 3:
                TDAPP.onEvent("LG产品预约页面", "教育金:预约成功", {"UserID": userId});
                break;
            case 4:
                TDAPP.onEvent("LG产品预约页面", "年金:预约成功", {"UserID": userId});
                break;

        }
    }

    /**
     * 执行不同页面的userId埋点发送
     */
    function tdpEnterByUserId(index, userId) {
        switch (index) {
            case 1:
                TDAPP.onEvent("LG产品预约页面", "重疾险", {"UserID": userId});
                break;
            case 2:
                TDAPP.onEvent("LG产品预约页面", "住院险", {"UserID": userId});
                break;
            case 3:
                TDAPP.onEvent("LG产品预约页面", "教育金", {"UserID": userId});
                break;
            case 4:
                TDAPP.onEvent("LG产品预约页面", "年金", {"UserID": userId});
                break;

        }
    }
});
