var PersonalFileCtrl = ['$scope', '$rootScope', '$location', 'form', '$http', '$timeout', 'createDialog', function($scope, $rootScope, $location, form, $http, $timeout, createDialogService) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "个人信息";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.form = form;
    $scope.isEdit = false;
    $scope.userInfo = copyData($scope.form.userInfo);
    $scope.form.phoneNumber = $scope.userInfo.phone;
    $scope.form.userInfo.hasCheckMobile = false;//设置当前页默认手机检验状态
    $(document).scrollTop(0);
    $scope.emailTipShow=false;
    trackerApi("2-个人信息","",{UserID:$scope.form.getUserId()});
    $scope.setPersonalHeight=function(){
        var h=$('.list-head').height()+$('.ranking-content').height()+$('.button-area').height();
        $('.personal-file').height(h*1.6);
    }
    $scope.setPersonalHeight();
    $scope.sexList = [{id:1,text:'男'},{id:2,text:'女'}];
    $scope.sex = $scope.sexList[$scope.userInfo.sex-1].text;
    $scope.ageList = ['其他','70后','80后','90后','00后'];
    var screenh=document.documentElement.clientHeight;
    $scope.editFn = function() {
        trackerApi("2-个人信息","修改",{});
        $scope.isEdit = true;
        $timeout(function() {
		    //性别/年龄段
			$('#sex').mobiscroll().select({
				theme: 'ios',
				display: 'bottom',
				mode: 'scroller',
				lang: 'zh',
				onShow: function(a,b,c){
					var temp=a.find(".dw-slideup");
					temp.focus();
					setTimeout(function(){
						temp.css("top",(screenh+document.body.scrollTop-temp.height())+"px");
					},100);
				},
				onSelect: function(val){
					$timeout(function(){
						$scope.sex = val;
					});
				}
			});
			$('#age').val($scope.userInfo.age||"80后");
			$('#age').mobiscroll().select({
				theme: 'ios',
				display: 'bottom',
				mode: 'scroller',
				lang: 'zh',
				placeholder: '年龄段',
//				onBeforeShow: function(a){
//					console.debug();
//				},
				onShow: function(a,b,c){
					var temp=a.find(".dw-slideup");
					temp.focus();
					setTimeout(function(){
						temp.css("top",(screenh+document.body.scrollTop-temp.height())+"px");
					},100);
				},
//				onPosition: function(a,b,c,d){
//					var temp=a.find(".dw-slideup");
//					alert(temp.height()+"/"+temp.css("top")+"/"+c);
//				},
				onSelect: function(val){
					$timeout(function(){
						$scope.userInfo.age = val;
					});
				}
			});
            $('#age_dummy').val($scope.userInfo.age);

			$('#demo_treelist').mobiscroll().treelist({
                theme: 'ios',
                mode: 'scroller',
                display: 'bottom',
                lang: 'zh',
                placeholder: '城市',
				onShow: function(a,b,c){
					var temp=a.find(".dw-slideup");
					temp.focus();
					setTimeout(function(){
						temp.css("top",(screenh+document.body.scrollTop-temp.height())+"px");
					},100);
				},
                labels: ['Country', 'City']
            });
            
            $('#demo_treelist_dummy').css("text-align", "left");
            $('#demo_treelist_dummy').css("color", "#5d5d5d");
            $('#demo_treelist_dummy').attr("value", form.userInfo.city);
            $('#email').on('focus',function(){ 
                $('.top-menu').css('position','absolute');      
                //$(document).scrollTop(150); 
                $timeout(function() {
                    $scope.emailTipShow=false;
                })
            })
            $('#email').on('blur',function(){
                $('.top-menu').css('position','fixed');
                ///$(document).scrollTop(-150); 
                $timeout(function() {
                    $scope.emailTipShow=true;
                })
            })
            $('#detailAddress').on('focus',function(){    
                $('.top-menu').css('position','absolute');        
                //$(document).scrollTop(250); 
            })
            $('#detailAddress').on('blur',function(){
                $('.top-menu').css('position','fixed');
                //$(document).scrollTop(-250); 
            })
            $('#name').on('focus',function(){ 
                $('.top-menu').css('position','absolute');
            })
            $('#name').on('blur',function(){
                //$(document).scrollTop(0); 
                $('.top-menu').css('position','fixed');
            })
            $(document).scrollTop(0); 
        }, 10);
       $scope.setPersonalHeight();

    }

    $scope.form.leftBtnClick = function() {
        $location.path($scope.form.intoPersonalFile?$scope.form.intoPersonalFile:"/myCommunity");
    }


    $scope.bytesCount = function(str) {
        if (str == undefined)
            return 0
        var bytesCount = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            if (/^[\u0000-\u00ff]$/.test(c)) {
                bytesCount += 1;
            } else {
                bytesCount += 2;
            }
        }
        return bytesCount;
    }
   
    $scope.$watch("userInfo.nickName", function(newV, oldV) {
        var bytesCount = $scope.bytesCount(newV);
        var pat = new RegExp("[a-zA-Z\u4e00-\u9fa5 ]");
        if (newV != oldV && newV != '') {
            for (var i = 0; i < newV.length; i++) {
                var newChar = newV[i];
                    if (pat.test(newChar) && bytesCount <= 20) {
                    $scope.userInfo.nickName = newV;
                } else {
                    $scope.userInfo.nickName = oldV;
                    return;
                }
            };
            
            
        } else {
            if (pat.test(newV) && bytesCount <= 20) {
                $scope.userInfo.nickName = newV;
            } else {
                $scope.userInfo.nickName = "";
            }
        }
    }, true);
    $scope.$watch("userInfo.detailAddress", function(newV, oldV) {
        var bytesCount = $scope.bytesCount(newV);
        // var pat = new RegExp("[a-zA-Z\u4e00-\u9fa5 ]");
        if (newV != oldV && newV != '') {
            for (var i = 0; i < newV.length; i++) {
                var newChar = newV[i];
                    if (bytesCount <= 100) {
                    $scope.userInfo.detailAddress = newV;
                } else {
                    $scope.userInfo.detailAddress = oldV;
                    return;
                }
            };
        } else {
            if (bytesCount <= 100) {
                $scope.userInfo.detailAddress = newV;
            } else {
                $scope.userInfo.detailAddress = "";
            }
        }
    }, true);

    $scope.isSaveClick=true;
    $scope.saveFn = function() {
        trackerApi("2-个人信息","保存",{});
        if(!$scope.isSaveClick)
            return;
        if($scope.userInfo.nickName.length==0){
            $('#validateError').removeClass('hide');
            setTimeout(function(){
                $('#validateError').addClass('hide');
            },2000)
            return;
        }else if($scope.userInfo.nickName=='游客'){
            $('.personal-file').append('<div class="submit-success text-center errorMsgShow"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+'姓名不能为游客'+'</span></div>')
            setTimeout(function(){
                $('.errorMsgShow').remove();
            },2000)
            return;
        }else if(!$scope.userInfo.age){
        	//校验年龄段
            $('.personal-file').append('<div class="submit-success text-center errorMsgShow"><span class="success-icon error"><i class="icon-wrong"></i></span><span>请选择年龄段</span></div>')
            setTimeout(function(){
                $('.errorMsgShow').remove();
            },2000);
            return;
        }else if($scope.form.phoneNumber==''||$scope.form.phoneNumber==null){
            $('.personal-file').append('<div class="submit-success text-center errorMsgShow"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+'请输入正确的手机号码'+'</span></div>')
            setTimeout(function(){
                $('.errorMsgShow').remove();
            },2000)
            return;
        }else if($scope.userInfo.sex!=$scope.form.userInfo.sex){
	        $timeout(function() {
	            createDialogService({
	                id: 'confirmPersonalFileEdit',
	                title: '',
	                template: '<div class="healthyAssess-popup text-center">您好！检测到您修改了性别，<br>为了保证测评结果的准确性，建议您重新进行亚健康测评！<div class="button-area"><button class="line-twobutton" ng-click="$modalCancel()">取消</button><button class="line-twobutton" ng-click="$modalSuccess()">确定</button></div></div>',
	                backdrop: true,
	                controller: null,
	                success: {
	                    fn: saveFn
	                },
	                cancel: {
	                    fn: function() {
	                        return;
	                    }
	                }
	            });
	
	        });
        }else saveFn();
    };
	var saveFn=function(){
        $scope.isSaveClick=false;
        var saveUserProfileApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + saveUserProfileApi;
        var postData = copyData($scope.form.userData);
        postData.city = $('#demo_treelist_dummy').val();
        postData.email = $scope.userInfo.email;
        postData.nickName = $scope.userInfo.nickName;
        postData.detailAddress = $scope.userInfo.detailAddress;
        postData.phone = $scope.form.phoneNumber;
        postData.sex = $scope.userInfo.sex;
        postData.age = $scope.userInfo.age;
        $.ajax({
            type: $scope.form.postType,
            url: saveUserProfileApiUrl,
            context: document.body,
            data: postData,
            success: function(data) {
                if (data.errorCode == -6 || data.errorCode == -100) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage,function(){},data.errorCode);
                    $scope.isSaveClick=true;
                    //$location.path('/bind')
                    return;
                } else if (data.errorCode < 0) {
                    $scope.$root.getErrorCodeMsg(data.errorMessage);
                    $scope.isSaveClick=true;
                } else {
                    $timeout(function() {
                        if (data.result && data.errorCode == 0) {
                            $scope.form.userInfo = copyData($scope.userInfo);
                            localStorage.setItem("gender",$scope.form.userInfo.sex);
                            localStorage.setItem("age",!!$scope.form.userInfo.age);
                            $scope.form.userInfo.city = $('#demo_treelist_dummy').val();
                            $scope.isEdit = false;
                            $('#demo_treelist_dummy').css("text-align", "right");
                            $('#demo_treelist_dummy').css("color", "#0d7db5");
                            $scope.isSaveClick=true;
                        }else{
                            $scope.isSaveClick=true;
                        }
                        $(document).scrollTop(0); 
                    })
                }
            },
            error: function(e) {
                $scope.isSaveClick=true;
                $scope.$root.getReadyStateMsg(e.readyState);
            }
        });
        
        $scope.setPersonalHeight();
	};

    $scope.editPersonalPopup = function(self, phone) {
        angular.element(self.target).blur();
        createDialogService('popup/editPersonalPopup.html', {
            id: 'editPersonalPopup',
            title: '手机验证',
            backdrop: true,
            controller: 'EditPersonalPopupController',
            success: {
                label: 'Success',
                fn: function() {
                    console.log('Complex modal closed');
                    $('.top-menu').css('position','fixed');
                }
            },
            cancel:{
                fn:function(){
                    $('.top-menu').css('position','fixed');
                    $(document).scrollTop(0); 
                }
            }
        }, {
            data: {
                self: self,
                phone: phone,
                close: $scope.$modalCancel,
                reopen: $scope.editPersonalPopup
            }
        });
    };



    if ($scope.form.openEditMode) {
        //when open edit mode is true change to edit personal page
        $scope.form.openEditMode = false;
        $scope.editFn();
    }

    //set citys
    // var city = [ 
    //   { CityCode: '0101',
    //     CityName: '北京',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '010101',
    //     CityName: '北京',
    //     ParentCode: '0101',
    //     WeatherCode: '101010100' },
    //   { CityCode: '0201',
    //     CityName: '上海',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '020101',
    //     CityName: '上海',
    //     ParentCode: '0201',
    //     WeatherCode: '101020100' },
    //   { CityCode: '28',
    //     CityName: '广东',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '280101',
    //     CityName: '广州',
    //     ParentCode: '2801',
    //     WeatherCode: '101280101' },
    //   { CityCode: '280601',
    //     CityName: '深圳',
    //     ParentCode: '2806',
    //     WeatherCode: '101280601' },
    //   { CityCode: '281501',
    //     CityName: '潮州',
    //     ParentCode: '2815',
    //     WeatherCode: '101281501' },
    //   { CityCode: '281601',
    //     CityName: '东莞',
    //     ParentCode: '2816',
    //     WeatherCode: '101281601' },
    //   { CityCode: '280801',
    //     CityName: '佛山',
    //     ParentCode: '2808',
    //     WeatherCode: '101280800' },
    //   { CityCode: '281201',
    //     CityName: '河源',
    //     ParentCode: '2812',
    //     WeatherCode: '101281201' },
    //   { CityCode: '280301',
    //     CityName: '惠州',
    //     ParentCode: '2803',
    //     WeatherCode: '101280301' },
    //   { CityCode: '281101',
    //     CityName: '江门',
    //     ParentCode: '2811',
    //     WeatherCode: '101281101' },
    //   { CityCode: '281901',
    //     CityName: '揭阳',
    //     ParentCode: '2819',
    //     WeatherCode: '101281901' },
    //   { CityCode: '282001',
    //     CityName: '茂名',
    //     ParentCode: '2820',
    //     WeatherCode: '101282001' },
    //   { CityCode: '280401',
    //     CityName: '梅州',
    //     ParentCode: '2804',
    //     WeatherCode: '101280401' },
    //   { CityCode: '281301',
    //     CityName: '清远',
    //     ParentCode: '2813',
    //     WeatherCode: '101281301' },
    //   { CityCode: '280501',
    //     CityName: '汕头',
    //     ParentCode: '2805',
    //     WeatherCode: '101280501' },
    //   { CityCode: '282101',
    //     CityName: '汕尾',
    //     ParentCode: '2821',
    //     WeatherCode: '101282101' },
    //   { CityCode: '280201',
    //     CityName: '韶关',
    //     ParentCode: '2802',
    //     WeatherCode: '101280201' },
    //   { CityCode: '281801',
    //     CityName: '阳江',
    //     ParentCode: '2818',
    //     WeatherCode: '101281801' },
    //   { CityCode: '281401',
    //     CityName: '云浮',
    //     ParentCode: '2814',
    //     WeatherCode: '101281401' },
    //   { CityCode: '281001',
    //     CityName: '湛江',
    //     ParentCode: '2810',
    //     WeatherCode: '101281001' },
    //   { CityCode: '280901',
    //     CityName: '肇庆',
    //     ParentCode: '2809',
    //     WeatherCode: '101280901' },
    //   { CityCode: '281701',
    //     CityName: '中山',
    //     ParentCode: '2817',
    //     WeatherCode: '101281701' },
    //   { CityCode: '280701',
    //     CityName: '珠海',
    //     ParentCode: '2807',
    //     WeatherCode: '101280701' },
    //   { CityCode: '22',
    //     CityName: '安徽',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '220601',
    //     CityName: '安庆',
    //     ParentCode: '2206',
    //     WeatherCode: '101220601' },
    //   { CityCode: '220201',
    //     CityName: '蚌埠',
    //     ParentCode: '2202',
    //     WeatherCode: '101220201' },
    //   { CityCode: '220901',
    //     CityName: '亳州',
    //     ParentCode: '2209',
    //     WeatherCode: '101220901' },
    //   { CityCode: '221601',
    //     CityName: '巢湖',
    //     ParentCode: '2216',
    //     WeatherCode: '101221601' },
    //   { CityCode: '221701',
    //     CityName: '池州',
    //     ParentCode: '2217',
    //     WeatherCode: '101221701' },
    //   { CityCode: '221101',
    //     CityName: '滁州',
    //     ParentCode: '2211',
    //     WeatherCode: '101221101' },
    //   { CityCode: '220801',
    //     CityName: '阜阳',
    //     ParentCode: '2208',
    //     WeatherCode: '101220801' },
    //   { CityCode: '220101',
    //     CityName: '合肥',
    //     ParentCode: '2201',
    //     WeatherCode: '101220101' },
    //   { CityCode: '221201',
    //     CityName: '淮北',
    //     ParentCode: '2212',
    //     WeatherCode: '101221201' },
    //   { CityCode: '220401',
    //     CityName: '淮南',
    //     ParentCode: '2204',
    //     WeatherCode: '101220401' },
    //   { CityCode: '2210',
    //     CityName: '黄山',
    //     ParentCode: '22',
    //     WeatherCode: '101221001' },
    //   { CityCode: '221501',
    //     CityName: '六安',
    //     ParentCode: '2215',
    //     WeatherCode: '101221501' },
    //   { CityCode: '220501',
    //     CityName: '马鞍山',
    //     ParentCode: '2205',
    //     WeatherCode: '101220501' },
    //   { CityCode: '220701',
    //     CityName: '宿州',
    //     ParentCode: '2207',
    //     WeatherCode: '101220701' },
    //   { CityCode: '221301',
    //     CityName: '铜陵',
    //     ParentCode: '2213',
    //     WeatherCode: '101221301' },
    //   { CityCode: '220301',
    //     CityName: '芜湖',
    //     ParentCode: '2203',
    //     WeatherCode: '101220301' },
    //   { CityCode: '221401',
    //     CityName: '宣城',
    //     ParentCode: '2214',
    //     WeatherCode: '101221401' },
    //   { CityCode: '33',
    //     CityName: '澳门',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '330101',
    //     CityName: '澳门',
    //     ParentCode: '3301',
    //     WeatherCode: '101330101' },
    //   { CityCode: '0401',
    //     CityName: '重庆',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '040101',
    //     CityName: '重庆',
    //     ParentCode: '0401',
    //     WeatherCode: '101040100' },
    //   { CityCode: '23',
    //     CityName: '福建',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '230101',
    //     CityName: '福州',
    //     ParentCode: '2301',
    //     WeatherCode: '101230101' },
    //   { CityCode: '230701',
    //     CityName: '龙岩',
    //     ParentCode: '2307',
    //     WeatherCode: '101230701' },
    //   { CityCode: '230901',
    //     CityName: '南平',
    //     ParentCode: '2309',
    //     WeatherCode: '101230901' },
    //   { CityCode: '230301',
    //     CityName: '宁德',
    //     ParentCode: '2303',
    //     WeatherCode: '101230301' },
    //   { CityCode: '230401',
    //     CityName: '莆田',
    //     ParentCode: '2304',
    //     WeatherCode: '101230401' },
    //   { CityCode: '230501',
    //     CityName: '泉州',
    //     ParentCode: '2305',
    //     WeatherCode: '101230501' },
    //   { CityCode: '230801',
    //     CityName: '三明',
    //     ParentCode: '2308',
    //     WeatherCode: '101230801' },
    //   { CityCode: '230201',
    //     CityName: '厦门',
    //     ParentCode: '2302',
    //     WeatherCode: '101230201' },
    //   { CityCode: '230601',
    //     CityName: '漳州',
    //     ParentCode: '2306',
    //     WeatherCode: '101230601' },
    //   { CityCode: '16',
    //     CityName: '甘肃',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '161301',
    //     CityName: '白银',
    //     ParentCode: '1613',
    //     WeatherCode: '101161301' },
    //   { CityCode: '160201',
    //     CityName: '定西',
    //     ParentCode: '1602',
    //     WeatherCode: '101160201' },
    //   { CityCode: '1612',
    //     CityName: '甘南',
    //     ParentCode: '16',
    //     WeatherCode: '101161201' },
    //   { CityCode: '161401',
    //     CityName: '嘉峪关',
    //     ParentCode: '1614',
    //     WeatherCode: '101161401' },
    //   { CityCode: '160601',
    //     CityName: '金昌',
    //     ParentCode: '1606',
    //     WeatherCode: '101160601' },
    //   { CityCode: '160801',
    //     CityName: '酒泉',
    //     ParentCode: '1608',
    //     WeatherCode: '101160801' },
    //   { CityCode: '160101',
    //     CityName: '兰州',
    //     ParentCode: '1601',
    //     WeatherCode: '101160101' },
    //   { CityCode: '161101',
    //     CityName: '临夏',
    //     ParentCode: '1611',
    //     WeatherCode: '101161101' },
    //   { CityCode: '1610',
    //     CityName: '陇南',
    //     ParentCode: '16',
    //     WeatherCode: '101161001' },
    //   { CityCode: '160301',
    //     CityName: '平凉',
    //     ParentCode: '1603',
    //     WeatherCode: '101160301' },
    //   { CityCode: '1604',
    //     CityName: '庆阳',
    //     ParentCode: '16',
    //     WeatherCode: '101160401' },
    //   { CityCode: '160901',
    //     CityName: '天水',
    //     ParentCode: '1609',
    //     WeatherCode: '101160901' },
    //   { CityCode: '160501',
    //     CityName: '武威',
    //     ParentCode: '1605',
    //     WeatherCode: '101160501' },
    //   { CityCode: '160701',
    //     CityName: '张掖',
    //     ParentCode: '1607',
    //     WeatherCode: '101160701' },
    //   { CityCode: '30',
    //     CityName: '广西',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '301001',
    //     CityName: '百色',
    //     ParentCode: '3010',
    //     WeatherCode: '101301001' },
    //   { CityCode: '301301',
    //     CityName: '北海',
    //     ParentCode: '3013',
    //     WeatherCode: '101301301' },
    //   { CityCode: '300201',
    //     CityName: '崇左',
    //     ParentCode: '3002',
    //     WeatherCode: '101300201' },
    //   { CityCode: '301401',
    //     CityName: '防城港',
    //     ParentCode: '3014',
    //     WeatherCode: '101301401' },
    //   { CityCode: '300801',
    //     CityName: '贵港',
    //     ParentCode: '3008',
    //     WeatherCode: '101300801' },
    //   { CityCode: '300501',
    //     CityName: '桂林',
    //     ParentCode: '3005',
    //     WeatherCode: '101300501' },
    //   { CityCode: '301201',
    //     CityName: '河池',
    //     ParentCode: '3012',
    //     WeatherCode: '101301201' },
    //   { CityCode: '300701',
    //     CityName: '贺州',
    //     ParentCode: '3007',
    //     WeatherCode: '101300701' },
    //   { CityCode: '300401',
    //     CityName: '来宾',
    //     ParentCode: '3004',
    //     WeatherCode: '101300401' },
    //   { CityCode: '300301',
    //     CityName: '柳州',
    //     ParentCode: '3003',
    //     WeatherCode: '101300301' },
    //   { CityCode: '300101',
    //     CityName: '南宁',
    //     ParentCode: '3001',
    //     WeatherCode: '101300101' },
    //   { CityCode: '301101',
    //     CityName: '钦州',
    //     ParentCode: '3011',
    //     WeatherCode: '101301101' },
    //   { CityCode: '300601',
    //     CityName: '梧州',
    //     ParentCode: '3006',
    //     WeatherCode: '101300601' },
    //   { CityCode: '300901',
    //     CityName: '玉林',
    //     ParentCode: '3009',
    //     WeatherCode: '101300901' },
    //   { CityCode: '26',
    //     CityName: '贵州',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '260301',
    //     CityName: '安顺',
    //     ParentCode: '2603',
    //     WeatherCode: '101260301' },
    //   { CityCode: '260701',
    //     CityName: '毕节',
    //     ParentCode: '2607',
    //     WeatherCode: '101260701' },
    //   { CityCode: '260101',
    //     CityName: '贵阳',
    //     ParentCode: '2601',
    //     WeatherCode: '101260101' },
    //   { CityCode: '2608',
    //     CityName: '六盘水',
    //     ParentCode: '26',
    //     WeatherCode: '101260801' },
    //   { CityCode: '2605',
    //     CityName: '黔东南',
    //     ParentCode: '26',
    //     WeatherCode: '101260501' },
    //   { CityCode: '2604',
    //     CityName: '黔南',
    //     ParentCode: '26',
    //     WeatherCode: '101260401' },
    //   { CityCode: '2609',
    //     CityName: '黔西南',
    //     ParentCode: '26',
    //     WeatherCode: '101260901' },
    //   { CityCode: '260601',
    //     CityName: '铜仁',
    //     ParentCode: '2606',
    //     WeatherCode: '101260601' },
    //   { CityCode: '260201',
    //     CityName: '遵义',
    //     ParentCode: '2602',
    //     WeatherCode: '101260201' },
    //   { CityCode: '31',
    //     CityName: '海南',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '310801',
    //     CityName: '白沙',
    //     ParentCode: '3108',
    //     WeatherCode: '101310207' },
    //   { CityCode: '311401',
    //     CityName: '保亭',
    //     ParentCode: '3114',
    //     WeatherCode: '101310214' },
    //   { CityCode: '310701',
    //     CityName: '昌江',
    //     ParentCode: '3107',
    //     WeatherCode: '101310206' },
    //   { CityCode: '310501',
    //     CityName: '澄迈',
    //     ParentCode: '3105',
    //     WeatherCode: '101310204' },
    //   { CityCode: '310601',
    //     CityName: '儋州',
    //     ParentCode: '3106',
    //     WeatherCode: '101310205' },
    //   { CityCode: '311001',
    //     CityName: '定安',
    //     ParentCode: '3110',
    //     WeatherCode: '101310209' },
    //   { CityCode: '310301',
    //     CityName: '东方',
    //     ParentCode: '3103',
    //     WeatherCode: '101310202' },
    //   { CityCode: '310101',
    //     CityName: '海口',
    //     ParentCode: '3101',
    //     WeatherCode: '101310101' },
    //   { CityCode: '311901',
    //     CityName: '乐东',
    //     ParentCode: '3119',
    //     WeatherCode: '101310221' },
    //   { CityCode: '310401',
    //     CityName: '临高',
    //     ParentCode: '3104',
    //     WeatherCode: '101310203' },
    //   { CityCode: '311601',
    //     CityName: '陵水',
    //     ParentCode: '3116',
    //     WeatherCode: '101310216' },
    //   { CityCode: '311801',
    //     CityName: '南沙',
    //     ParentCode: '3118',
    //     WeatherCode: '101310220' },
    //   { CityCode: '311201',
    //     CityName: '琼海',
    //     ParentCode: '3112',
    //     WeatherCode: '101310211' },
    //   { CityCode: '310901',
    //     CityName: '琼中',
    //     ParentCode: '3109',
    //     WeatherCode: '101310208' },
    //   { CityCode: '310201',
    //     CityName: '三亚',
    //     ParentCode: '3102',
    //     WeatherCode: '101310201' },
    //   { CityCode: '311101',
    //     CityName: '屯昌',
    //     ParentCode: '3111',
    //     WeatherCode: '101310210' },
    //   { CityCode: '311501',
    //     CityName: '万宁',
    //     ParentCode: '3115',
    //     WeatherCode: '101310215' },
    //   { CityCode: '311301',
    //     CityName: '文昌',
    //     ParentCode: '3113',
    //     WeatherCode: '101310212' },
    //   { CityCode: '312001',
    //     CityName: '五指山',
    //     ParentCode: '3120',
    //     WeatherCode: '101310222' },
    //   { CityCode: '311701',
    //     CityName: '西沙',
    //     ParentCode: '3117',
    //     WeatherCode: '101310217' },
    //   { CityCode: '09',
    //     CityName: '河北',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '090201',
    //     CityName: '保定',
    //     ParentCode: '0902',
    //     WeatherCode: '101090201' },
    //   { CityCode: '090701',
    //     CityName: '沧州',
    //     ParentCode: '0907',
    //     WeatherCode: '101090701' },
    //   { CityCode: '090401',
    //     CityName: '承德',
    //     ParentCode: '0904',
    //     WeatherCode: '101090402' },
    //   { CityCode: '091001',
    //     CityName: '邯郸',
    //     ParentCode: '0910',
    //     WeatherCode: '101091001' },
    //   { CityCode: '090801',
    //     CityName: '衡水',
    //     ParentCode: '0908',
    //     WeatherCode: '101090801' },
    //   { CityCode: '090601',
    //     CityName: '廊坊',
    //     ParentCode: '0906',
    //     WeatherCode: '101090601' },
    //   { CityCode: '091101',
    //     CityName: '秦皇岛',
    //     ParentCode: '0911',
    //     WeatherCode: '101091101' },
    //   { CityCode: '090101',
    //     CityName: '石家庄',
    //     ParentCode: '0901',
    //     WeatherCode: '101090101' },
    //   { CityCode: '090501',
    //     CityName: '唐山',
    //     ParentCode: '0905',
    //     WeatherCode: '101090501' },
    //   { CityCode: '090901',
    //     CityName: '邢台',
    //     ParentCode: '0909',
    //     WeatherCode: '101090901' },
    //   { CityCode: '090301',
    //     CityName: '张家口',
    //     ParentCode: '0903',
    //     WeatherCode: '101090301' },
    //   { CityCode: '18',
    //     CityName: '河南',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '180201',
    //     CityName: '安阳',
    //     ParentCode: '1802',
    //     WeatherCode: '101180201' },
    //   { CityCode: '181201',
    //     CityName: '鹤壁',
    //     ParentCode: '1812',
    //     WeatherCode: '101181201' },
    //   { CityCode: '181801',
    //     CityName: '济源',
    //     ParentCode: '1818',
    //     WeatherCode: '101181801' },
    //   { CityCode: '181101',
    //     CityName: '焦作',
    //     ParentCode: '1811',
    //     WeatherCode: '101181101' },
    //   { CityCode: '180801',
    //     CityName: '开封',
    //     ParentCode: '1808',
    //     WeatherCode: '101180801' },
    //   { CityCode: '180901',
    //     CityName: '洛阳',
    //     ParentCode: '1809',
    //     WeatherCode: '101180901' },
    //   { CityCode: '181501',
    //     CityName: '漯河',
    //     ParentCode: '1815',
    //     WeatherCode: '101181501' },
    //   { CityCode: '180701',
    //     CityName: '南阳',
    //     ParentCode: '1807',
    //     WeatherCode: '101180701' },
    //   { CityCode: '180501',
    //     CityName: '平顶山',
    //     ParentCode: '1805',
    //     WeatherCode: '101180501' },
    //   { CityCode: '181301',
    //     CityName: '濮阳',
    //     ParentCode: '1813',
    //     WeatherCode: '101181301' },
    //   { CityCode: '181701',
    //     CityName: '三门峡',
    //     ParentCode: '1817',
    //     WeatherCode: '101181701' },
    //   { CityCode: '181001',
    //     CityName: '商丘',
    //     ParentCode: '1810',
    //     WeatherCode: '101181001' },
    //   { CityCode: '180301',
    //     CityName: '新乡',
    //     ParentCode: '1803',
    //     WeatherCode: '101180301' },
    //   { CityCode: '180601',
    //     CityName: '信阳',
    //     ParentCode: '1806',
    //     WeatherCode: '101180601' },
    //   { CityCode: '180401',
    //     CityName: '许昌',
    //     ParentCode: '1804',
    //     WeatherCode: '101180401' },
    //   { CityCode: '180101',
    //     CityName: '郑州',
    //     ParentCode: '1801',
    //     WeatherCode: '101180101' },
    //   { CityCode: '181401',
    //     CityName: '周口',
    //     ParentCode: '1814',
    //     WeatherCode: '101181401' },
    //   { CityCode: '181601',
    //     CityName: '驻马店',
    //     ParentCode: '1816',
    //     WeatherCode: '101181601' },
    //   { CityCode: '05',
    //     CityName: '黑龙江',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '050901',
    //     CityName: '大庆',
    //     ParentCode: '0509',
    //     WeatherCode: '101050901' },
    //   { CityCode: '050701',
    //     CityName: '大兴安岭',
    //     ParentCode: '0507',
    //     WeatherCode: '101050701' },
    //   { CityCode: '050101',
    //     CityName: '哈尔滨',
    //     ParentCode: '0501',
    //     WeatherCode: '101050101' },
    //   { CityCode: '051201',
    //     CityName: '鹤岗',
    //     ParentCode: '0512',
    //     WeatherCode: '101051201' },
    //   { CityCode: '050601',
    //     CityName: '黑河',
    //     ParentCode: '0506',
    //     WeatherCode: '101050601' },
    //   { CityCode: '051101',
    //     CityName: '鸡西',
    //     ParentCode: '0511',
    //     WeatherCode: '101051101' },
    //   { CityCode: '050401',
    //     CityName: '佳木斯',
    //     ParentCode: '0504',
    //     WeatherCode: '101050401' },
    //   { CityCode: '050301',
    //     CityName: '牡丹江',
    //     ParentCode: '0503',
    //     WeatherCode: '101050301' },
    //   { CityCode: '051001',
    //     CityName: '七台河',
    //     ParentCode: '0510',
    //     WeatherCode: '101051002' },
    //   { CityCode: '050201',
    //     CityName: '齐齐哈尔',
    //     ParentCode: '0502',
    //     WeatherCode: '101050201' },
    //   { CityCode: '051301',
    //     CityName: '双鸭山',
    //     ParentCode: '0513',
    //     WeatherCode: '101051301' },
    //   { CityCode: '050501',
    //     CityName: '绥化',
    //     ParentCode: '0505',
    //     WeatherCode: '101050501' },
    //   { CityCode: '050801',
    //     CityName: '伊春',
    //     ParentCode: '0508',
    //     WeatherCode: '101050801' },
    //   { CityCode: '20',
    //     CityName: '湖北',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '200301',
    //     CityName: '鄂州',
    //     ParentCode: '2003',
    //     WeatherCode: '101200301' },
    //   { CityCode: '201001',
    //     CityName: '恩施',
    //     ParentCode: '2010',
    //     WeatherCode: '101201001' },
    //   { CityCode: '200501',
    //     CityName: '黄冈',
    //     ParentCode: '2005',
    //     WeatherCode: '101200501' },
    //   { CityCode: '200601',
    //     CityName: '黄石',
    //     ParentCode: '2006',
    //     WeatherCode: '101200601' },
    //   { CityCode: '201401',
    //     CityName: '荆门',
    //     ParentCode: '2014',
    //     WeatherCode: '101201401' },
    //   { CityCode: '200801',
    //     CityName: '荆州',
    //     ParentCode: '2008',
    //     WeatherCode: '101200801' },
    //   { CityCode: '201701',
    //     CityName: '潜江',
    //     ParentCode: '2017',
    //     WeatherCode: '101201701' },
    //   { CityCode: '201201',
    //     CityName: '神农架',
    //     ParentCode: '2012',
    //     WeatherCode: '101201201' },
    //   { CityCode: '201101',
    //     CityName: '十堰',
    //     ParentCode: '2011',
    //     WeatherCode: '101201101' },
    //   { CityCode: '201301',
    //     CityName: '随州',
    //     ParentCode: '2013',
    //     WeatherCode: '101201301' },
    //   { CityCode: '201501',
    //     CityName: '天门',
    //     ParentCode: '2015',
    //     WeatherCode: '101201501' },
    //   { CityCode: '200101',
    //     CityName: '武汉',
    //     ParentCode: '2001',
    //     WeatherCode: '101200101' },
    //   { CityCode: '201601',
    //     CityName: '仙桃',
    //     ParentCode: '2016',
    //     WeatherCode: '101201601' },
    //   { CityCode: '200701',
    //     CityName: '咸宁',
    //     ParentCode: '2007',
    //     WeatherCode: '101200701' },
    //   { CityCode: '200201',
    //     CityName: '襄阳',
    //     ParentCode: '2002',
    //     WeatherCode: '101200201' },
    //   { CityCode: '200401',
    //     CityName: '孝感',
    //     ParentCode: '2004',
    //     WeatherCode: '101200401' },
    //   { CityCode: '200901',
    //     CityName: '宜昌',
    //     ParentCode: '2009',
    //     WeatherCode: '101200901' },
    //   { CityCode: '25',
    //     CityName: '湖南',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '250101',
    //     CityName: '长沙',
    //     ParentCode: '2501',
    //     WeatherCode: '101250101' },
    //   { CityCode: '250601',
    //     CityName: '常德',
    //     ParentCode: '2506',
    //     WeatherCode: '101250601' },
    //   { CityCode: '250501',
    //     CityName: '郴州',
    //     ParentCode: '2505',
    //     WeatherCode: '101250501' },
    //   { CityCode: '250401',
    //     CityName: '衡阳',
    //     ParentCode: '2504',
    //     WeatherCode: '101250401' },
    //   { CityCode: '251201',
    //     CityName: '怀化',
    //     ParentCode: '2512',
    //     WeatherCode: '101251201' },
    //   { CityCode: '250801',
    //     CityName: '娄底',
    //     ParentCode: '2508',
    //     WeatherCode: '101250801' },
    //   { CityCode: '250901',
    //     CityName: '邵阳',
    //     ParentCode: '2509',
    //     WeatherCode: '101250901' },
    //   { CityCode: '250201',
    //     CityName: '湘潭',
    //     ParentCode: '2502',
    //     WeatherCode: '101250201' },
    //   { CityCode: '2514',
    //     CityName: '湘西',
    //     ParentCode: '25',
    //     WeatherCode: '101251501' },
    //   { CityCode: '250701',
    //     CityName: '益阳',
    //     ParentCode: '2507',
    //     WeatherCode: '101250700' },
    //   { CityCode: '251301',
    //     CityName: '永州',
    //     ParentCode: '2513',
    //     WeatherCode: '101251401' },
    //   { CityCode: '251001',
    //     CityName: '岳阳',
    //     ParentCode: '2510',
    //     WeatherCode: '101251001' },
    //   { CityCode: '251101',
    //     CityName: '张家界',
    //     ParentCode: '2511',
    //     WeatherCode: '101251101' },
    //   { CityCode: '250301',
    //     CityName: '株洲',
    //     ParentCode: '2503',
    //     WeatherCode: '101250301' },
    //   { CityCode: '06',
    //     CityName: '吉林',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '060601',
    //     CityName: '白城',
    //     ParentCode: '0606',
    //     WeatherCode: '101060601' },
    //   { CityCode: '060901',
    //     CityName: '白山',
    //     ParentCode: '0609',
    //     WeatherCode: '101060901' },
    //   { CityCode: '060101',
    //     CityName: '长春',
    //     ParentCode: '0601',
    //     WeatherCode: '101060101' },
    //   { CityCode: '060201',
    //     CityName: '吉林',
    //     ParentCode: '0602',
    //     WeatherCode: '101060201' },
    //   { CityCode: '060701',
    //     CityName: '辽源',
    //     ParentCode: '0607',
    //     WeatherCode: '101060701' },
    //   { CityCode: '060401',
    //     CityName: '四平',
    //     ParentCode: '0604',
    //     WeatherCode: '101060401' },
    //   { CityCode: '060801',
    //     CityName: '松原',
    //     ParentCode: '0608',
    //     WeatherCode: '101060801' },
    //   { CityCode: '060501',
    //     CityName: '通化',
    //     ParentCode: '0605',
    //     WeatherCode: '101060501' },
    //   { CityCode: '060301',
    //     CityName: '延边',
    //     ParentCode: '0603',
    //     WeatherCode: '101060301' },
    //   { CityCode: '19',
    //     CityName: '江苏',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '191101',
    //     CityName: '常州',
    //     ParentCode: '1911',
    //     WeatherCode: '101191101' },
    //   { CityCode: '190901',
    //     CityName: '淮安',
    //     ParentCode: '1909',
    //     WeatherCode: '101190901' },
    //   { CityCode: '191001',
    //     CityName: '连云港',
    //     ParentCode: '1910',
    //     WeatherCode: '101191001' },
    //   { CityCode: '190101',
    //     CityName: '南京',
    //     ParentCode: '1901',
    //     WeatherCode: '101190101' },
    //   { CityCode: '190501',
    //     CityName: '南通',
    //     ParentCode: '1905',
    //     WeatherCode: '101190501' },
    //   { CityCode: '190401',
    //     CityName: '苏州',
    //     ParentCode: '1904',
    //     WeatherCode: '101190401' },
    //   { CityCode: '191301',
    //     CityName: '宿迁',
    //     ParentCode: '1913',
    //     WeatherCode: '101191301' },
    //   { CityCode: '191201',
    //     CityName: '泰州',
    //     ParentCode: '1912',
    //     WeatherCode: '101191201' },
    //   { CityCode: '190201',
    //     CityName: '无锡',
    //     ParentCode: '1902',
    //     WeatherCode: '101190201' },
    //   { CityCode: '190801',
    //     CityName: '徐州',
    //     ParentCode: '1908',
    //     WeatherCode: '101190801' },
    //   { CityCode: '190701',
    //     CityName: '盐城',
    //     ParentCode: '1907',
    //     WeatherCode: '101190701' },
    //   { CityCode: '190601',
    //     CityName: '扬州',
    //     ParentCode: '1906',
    //     WeatherCode: '101190601' },
    //   { CityCode: '190301',
    //     CityName: '镇江',
    //     ParentCode: '1903',
    //     WeatherCode: '101190301' },
    //   { CityCode: '24',
    //     CityName: '江西',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '240401',
    //     CityName: '抚州',
    //     ParentCode: '2404',
    //     WeatherCode: '101240401' },
    //   { CityCode: '240701',
    //     CityName: '赣州',
    //     ParentCode: '2407',
    //     WeatherCode: '101240701' },
    //   { CityCode: '240601',
    //     CityName: '吉安',
    //     ParentCode: '2406',
    //     WeatherCode: '101240601' },
    //   { CityCode: '240801',
    //     CityName: '景德镇',
    //     ParentCode: '2408',
    //     WeatherCode: '101240801' },
    //   { CityCode: '240201',
    //     CityName: '九江',
    //     ParentCode: '2402',
    //     WeatherCode: '101240201' },
    //   { CityCode: '240101',
    //     CityName: '南昌',
    //     ParentCode: '2401',
    //     WeatherCode: '101240101' },
    //   { CityCode: '240901',
    //     CityName: '萍乡',
    //     ParentCode: '2409',
    //     WeatherCode: '101240901' },
    //   { CityCode: '240301',
    //     CityName: '上饶',
    //     ParentCode: '2403',
    //     WeatherCode: '101240301' },
    //   { CityCode: '241001',
    //     CityName: '新余',
    //     ParentCode: '2410',
    //     WeatherCode: '101241001' },
    //   { CityCode: '240501',
    //     CityName: '宜春',
    //     ParentCode: '2405',
    //     WeatherCode: '101240501' },
    //   { CityCode: '241101',
    //     CityName: '鹰潭',
    //     ParentCode: '2411',
    //     WeatherCode: '101241101' },
    //   { CityCode: '07',
    //     CityName: '辽宁',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '070301',
    //     CityName: '鞍山',
    //     ParentCode: '0703',
    //     WeatherCode: '101070301' },
    //   { CityCode: '070501',
    //     CityName: '本溪',
    //     ParentCode: '0705',
    //     WeatherCode: '101070501' },
    //   { CityCode: '071201',
    //     CityName: '朝阳',
    //     ParentCode: '0712',
    //     WeatherCode: '101071201' },
    //   { CityCode: '070201',
    //     CityName: '大连',
    //     ParentCode: '0702',
    //     WeatherCode: '101070201' },
    //   { CityCode: '070601',
    //     CityName: '丹东',
    //     ParentCode: '0706',
    //     WeatherCode: '101070601' },
    //   { CityCode: '070401',
    //     CityName: '抚顺',
    //     ParentCode: '0704',
    //     WeatherCode: '101070401' },
    //   { CityCode: '070901',
    //     CityName: '阜新',
    //     ParentCode: '0709',
    //     WeatherCode: '101070901' },
    //   { CityCode: '071401',
    //     CityName: '葫芦岛',
    //     ParentCode: '0714',
    //     WeatherCode: '101071401' },
    //   { CityCode: '070701',
    //     CityName: '锦州',
    //     ParentCode: '0707',
    //     WeatherCode: '101070701' },
    //   { CityCode: '071001',
    //     CityName: '辽阳',
    //     ParentCode: '0710',
    //     WeatherCode: '101071001' },
    //   { CityCode: '071301',
    //     CityName: '盘锦',
    //     ParentCode: '0713',
    //     WeatherCode: '101071301' },
    //   { CityCode: '070101',
    //     CityName: '沈阳',
    //     ParentCode: '0701',
    //     WeatherCode: '101070101' },
    //   { CityCode: '071101',
    //     CityName: '铁岭',
    //     ParentCode: '0711',
    //     WeatherCode: '101071101' },
    //   { CityCode: '070801',
    //     CityName: '营口',
    //     ParentCode: '0708',
    //     WeatherCode: '101070801' },
    //   { CityCode: '08',
    //     CityName: '内蒙古',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '0812',
    //     CityName: '阿拉善盟',
    //     ParentCode: '08',
    //     WeatherCode: '101081201' },
    //   { CityCode: '0808',
    //     CityName: '巴彦淖尔',
    //     ParentCode: '08',
    //     WeatherCode: '101080801' },
    //   { CityCode: '080201',
    //     CityName: '包头',
    //     ParentCode: '0802',
    //     WeatherCode: '101080201' },
    //   { CityCode: '080601',
    //     CityName: '赤峰',
    //     ParentCode: '0806',
    //     WeatherCode: '101080601' },
    //   { CityCode: '080701',
    //     CityName: '鄂尔多斯',
    //     ParentCode: '0807',
    //     WeatherCode: '101080701' },
    //   { CityCode: '080101',
    //     CityName: '呼和浩特',
    //     ParentCode: '0801',
    //     WeatherCode: '101080101' },
    //   { CityCode: '0810',
    //     CityName: '呼伦贝尔',
    //     ParentCode: '08',
    //     WeatherCode: '101081001' },
    //   { CityCode: '080501',
    //     CityName: '通辽',
    //     ParentCode: '0805',
    //     WeatherCode: '101080501' },
    //   { CityCode: '0803',
    //     CityName: '乌海',
    //     ParentCode: '-1',
    //     WeatherCode: 'null\t' },
    //   { CityCode: '080301',
    //     CityName: '乌海',
    //     ParentCode: '0803',
    //     WeatherCode: '101080301' },
    //   { CityCode: '0804',
    //     CityName: '乌兰察布',
    //     ParentCode: '08',
    //     WeatherCode: '101080401' },
    //   { CityCode: '0809',
    //     CityName: '锡林郭勒',
    //     ParentCode: '08',
    //     WeatherCode: '101080901' },
    //   { CityCode: '0811',
    //     CityName: '兴安盟',
    //     ParentCode: '08',
    //     WeatherCode: '101081101' },
    //   { CityCode: '17',
    //     CityName: '宁夏',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '170401',
    //     CityName: '固原',
    //     ParentCode: '1704',
    //     WeatherCode: '101170401' },
    //   { CityCode: '170201',
    //     CityName: '石嘴山',
    //     ParentCode: '1702',
    //     WeatherCode: '101170201' },
    //   { CityCode: '170301',
    //     CityName: '吴忠',
    //     ParentCode: '1703',
    //     WeatherCode: '101170301' },
    //   { CityCode: '170101',
    //     CityName: '银川',
    //     ParentCode: '1701',
    //     WeatherCode: '101170101' },
    //   { CityCode: '170501',
    //     CityName: '中卫',
    //     ParentCode: '1705',
    //     WeatherCode: '101170501' },
    //   { CityCode: '15',
    //     CityName: '青海',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '150901',
    //     CityName: '格尔木',
    //     ParentCode: '1509',
    //     WeatherCode: '101150901' },
    //   { CityCode: '150501',
    //     CityName: '果洛',
    //     ParentCode: '1505',
    //     WeatherCode: '101150501' },
    //   { CityCode: '150801',
    //     CityName: '海北',
    //     ParentCode: '1508',
    //     WeatherCode: '101150801' },
    //   { CityCode: '150201',
    //     CityName: '海东',
    //     ParentCode: '1502',
    //     WeatherCode: '101150201' },
    //   { CityCode: '150401',
    //     CityName: '海南',
    //     ParentCode: '1504',
    //     WeatherCode: '101150401' },
    //   { CityCode: '150701',
    //     CityName: '海西',
    //     ParentCode: '1507',
    //     WeatherCode: '101150701' },
    //   { CityCode: '150301',
    //     CityName: '黄南',
    //     ParentCode: '1503',
    //     WeatherCode: '101150301' },
    //   { CityCode: '150101',
    //     CityName: '西宁',
    //     ParentCode: '1501',
    //     WeatherCode: '101150101' },
    //   { CityCode: '150601',
    //     CityName: '玉树',
    //     ParentCode: '1506',
    //     WeatherCode: '101150601' },
    //   { CityCode: '12',
    //     CityName: '山东',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '121101',
    //     CityName: '滨州',
    //     ParentCode: '1211',
    //     WeatherCode: '101121101' },
    //   { CityCode: '120401',
    //     CityName: '德州',
    //     ParentCode: '1204',
    //     WeatherCode: '101120401' },
    //   { CityCode: '121201',
    //     CityName: '东营',
    //     ParentCode: '1212',
    //     WeatherCode: '101121201' },
    //   { CityCode: '121001',
    //     CityName: '菏泽',
    //     ParentCode: '1210',
    //     WeatherCode: '101121001' },
    //   { CityCode: '120101',
    //     CityName: '济南',
    //     ParentCode: '1201',
    //     WeatherCode: '101120101' },
    //   { CityCode: '120701',
    //     CityName: '济宁',
    //     ParentCode: '1207',
    //     WeatherCode: '101120701' },
    //   { CityCode: '121601',
    //     CityName: '莱芜',
    //     ParentCode: '1216',
    //     WeatherCode: '101121601' },
    //   { CityCode: '121701',
    //     CityName: '聊城',
    //     ParentCode: '1217',
    //     WeatherCode: '101121701' },
    //   { CityCode: '120901',
    //     CityName: '临沂',
    //     ParentCode: '1209',
    //     WeatherCode: '101120901' },
    //   { CityCode: '120201',
    //     CityName: '青岛',
    //     ParentCode: '1202',
    //     WeatherCode: '101120201' },
    //   { CityCode: '121501',
    //     CityName: '日照',
    //     ParentCode: '1215',
    //     WeatherCode: '101121501' },
    //   { CityCode: '120801',
    //     CityName: '泰安',
    //     ParentCode: '1208',
    //     WeatherCode: '101120801' },
    //   { CityCode: '121301',
    //     CityName: '威海',
    //     ParentCode: '1213',
    //     WeatherCode: '101121301' },
    //   { CityCode: '120601',
    //     CityName: '潍坊',
    //     ParentCode: '1206',
    //     WeatherCode: '101120601' },
    //   { CityCode: '120501',
    //     CityName: '烟台',
    //     ParentCode: '1205',
    //     WeatherCode: '101120501' },
    //   { CityCode: '121401',
    //     CityName: '枣庄',
    //     ParentCode: '1214',
    //     WeatherCode: '101121401' },
    //   { CityCode: '120301',
    //     CityName: '淄博',
    //     ParentCode: '1203',
    //     WeatherCode: '101120301' },
    //   { CityCode: '10',
    //     CityName: '山西',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '100501',
    //     CityName: '长治',
    //     ParentCode: '1005',
    //     WeatherCode: '101100501' },
    //   { CityCode: '100201',
    //     CityName: '大同',
    //     ParentCode: '1002',
    //     WeatherCode: '101100201' },
    //   { CityCode: '100601',
    //     CityName: '晋城',
    //     ParentCode: '1006',
    //     WeatherCode: '101100601' },
    //   { CityCode: '100401',
    //     CityName: '晋中',
    //     ParentCode: '1004',
    //     WeatherCode: '101100401' },
    //   { CityCode: '100701',
    //     CityName: '临汾',
    //     ParentCode: '1007',
    //     WeatherCode: '101100701' },
    //   { CityCode: '101101',
    //     CityName: '吕梁',
    //     ParentCode: '1011',
    //     WeatherCode: '101101100' },
    //   { CityCode: '100901',
    //     CityName: '朔州',
    //     ParentCode: '1009',
    //     WeatherCode: '101100901' },
    //   { CityCode: '100101',
    //     CityName: '太原',
    //     ParentCode: '1001',
    //     WeatherCode: '101100101' },
    //   { CityCode: '101001',
    //     CityName: '忻州',
    //     ParentCode: '1010',
    //     WeatherCode: '101101001' },
    //   { CityCode: '100301',
    //     CityName: '阳泉',
    //     ParentCode: '1003',
    //     WeatherCode: '101100301' },
    //   { CityCode: '100801',
    //     CityName: '运城',
    //     ParentCode: '1008',
    //     WeatherCode: '101100801' },
    //   { CityCode: '11',
    //     CityName: '陕西',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '110701',
    //     CityName: '安康',
    //     ParentCode: '1107',
    //     WeatherCode: '101110701' },
    //   { CityCode: '110901',
    //     CityName: '宝鸡',
    //     ParentCode: '1109',
    //     WeatherCode: '101110901' },
    //   { CityCode: '110801',
    //     CityName: '汉中',
    //     ParentCode: '1108',
    //     WeatherCode: '101110801' },
    //   { CityCode: '110601',
    //     CityName: '商洛',
    //     ParentCode: '1106',
    //     WeatherCode: '101110601' },
    //   { CityCode: '111001',
    //     CityName: '铜川',
    //     ParentCode: '1110',
    //     WeatherCode: '101111001' },
    //   { CityCode: '110501',
    //     CityName: '渭南',
    //     ParentCode: '1105',
    //     WeatherCode: '101110501' },
    //   { CityCode: '110101',
    //     CityName: '西安',
    //     ParentCode: '1101',
    //     WeatherCode: '101110101' },
    //   { CityCode: '110201',
    //     CityName: '咸阳',
    //     ParentCode: '1102',
    //     WeatherCode: '101110200' },
    //   { CityCode: '110301',
    //     CityName: '延安',
    //     ParentCode: '1103',
    //     WeatherCode: '101110300' },
    //   { CityCode: '111101',
    //     CityName: '杨凌',
    //     ParentCode: '1111',
    //     WeatherCode: '101111101' },
    //   { CityCode: '110401',
    //     CityName: '榆林',
    //     ParentCode: '1104',
    //     WeatherCode: '101110401' },
    //   { CityCode: '27',
    //     CityName: '四川',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '271901',
    //     CityName: '阿坝',
    //     ParentCode: '2719',
    //     WeatherCode: '101271901' },
    //   { CityCode: '270901',
    //     CityName: '巴中',
    //     ParentCode: '2709',
    //     WeatherCode: '101270901' },
    //   { CityCode: '270101',
    //     CityName: '成都',
    //     ParentCode: '2701',
    //     WeatherCode: '101270101' },
    //   { CityCode: '270601',
    //     CityName: '达州',
    //     ParentCode: '2706',
    //     WeatherCode: '101270601' },
    //   { CityCode: '272001',
    //     CityName: '德阳',
    //     ParentCode: '2720',
    //     WeatherCode: '101272001' },
    //   { CityCode: '271801',
    //     CityName: '甘孜',
    //     ParentCode: '2718',
    //     WeatherCode: '101271801' },
    //   { CityCode: '270801',
    //     CityName: '广安',
    //     ParentCode: '2708',
    //     WeatherCode: '101270801' },
    //   { CityCode: '272101',
    //     CityName: '广元',
    //     ParentCode: '2721',
    //     WeatherCode: '101272101' },
    //   { CityCode: '271401',
    //     CityName: '乐山',
    //     ParentCode: '2714',
    //     WeatherCode: '101271401' },
    //   { CityCode: '271601',
    //     CityName: '凉山',
    //     ParentCode: '2716',
    //     WeatherCode: '101271601' },
    //   { CityCode: '271001',
    //     CityName: '泸州',
    //     ParentCode: '2710',
    //     WeatherCode: '101271001' },
    //   { CityCode: '271501',
    //     CityName: '眉山',
    //     ParentCode: '2715',
    //     WeatherCode: '101271501' },
    //   { CityCode: '270401',
    //     CityName: '绵阳',
    //     ParentCode: '2704',
    //     WeatherCode: '101270401' },
    //   { CityCode: '271201',
    //     CityName: '内江',
    //     ParentCode: '27',
    //     WeatherCode: '101271201' },
    //   { CityCode: '270501',
    //     CityName: '南充',
    //     ParentCode: '2705',
    //     WeatherCode: '101270501' },
    //   { CityCode: '270201',
    //     CityName: '攀枝花',
    //     ParentCode: '2702',
    //     WeatherCode: '101270201' },
    //   { CityCode: '270701',
    //     CityName: '遂宁',
    //     ParentCode: '2707',
    //     WeatherCode: '101270701' },
    //   { CityCode: '271701',
    //     CityName: '雅安',
    //     ParentCode: '2717',
    //     WeatherCode: '101271701' },
    //   { CityCode: '271101',
    //     CityName: '宜宾',
    //     ParentCode: '2711',
    //     WeatherCode: '101271101' },
    //   { CityCode: '271301',
    //     CityName: '资阳',
    //     ParentCode: '2713',
    //     WeatherCode: '101271301' },
    //   { CityCode: '270301',
    //     CityName: '自贡',
    //     ParentCode: '2703',
    //     WeatherCode: '101270301' },
    //   { CityCode: '34',
    //     CityName: '台湾',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '340201',
    //     CityName: '高雄',
    //     ParentCode: '3402',
    //     WeatherCode: '101340201' },
    //   { CityCode: '340101',
    //     CityName: '台北',
    //     ParentCode: '3401',
    //     WeatherCode: '101340101' },
    //   { CityCode: '340301',
    //     CityName: '台中',
    //     ParentCode: '3403',
    //     WeatherCode: '101340401' },
    //   { CityCode: '0301',
    //     CityName: '天津',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '030101',
    //     CityName: '天津',
    //     ParentCode: '0301',
    //     WeatherCode: '101030100' },
    //   { CityCode: '14',
    //     CityName: '西藏',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '140701',
    //     CityName: '阿里',
    //     ParentCode: '1407',
    //     WeatherCode: '101140701' },
    //   { CityCode: '140501',
    //     CityName: '昌都',
    //     ParentCode: '1405',
    //     WeatherCode: '101140501' },
    //   { CityCode: '140101',
    //     CityName: '拉萨',
    //     ParentCode: '1401',
    //     WeatherCode: '101140101' },
    //   { CityCode: '140401',
    //     CityName: '林芝',
    //     ParentCode: '1404',
    //     WeatherCode: '101140401' },
    //   { CityCode: '140601',
    //     CityName: '那曲',
    //     ParentCode: '1406',
    //     WeatherCode: '101140601' },
    //   { CityCode: '140201',
    //     CityName: '日喀则',
    //     ParentCode: '1402',
    //     WeatherCode: '101140201' },
    //   { CityCode: '140301',
    //     CityName: '山南',
    //     ParentCode: '1403',
    //     WeatherCode: '101140301' },
    //   { CityCode: '32',
    //     CityName: '香港',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '320101',
    //     CityName: '香港',
    //     ParentCode: '3201',
    //     WeatherCode: '101320101' },
    //   { CityCode: '13',
    //     CityName: '新疆',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '130801',
    //     CityName: '阿克苏',
    //     ParentCode: '1308',
    //     WeatherCode: '101130801' },
    //   { CityCode: '130701',
    //     CityName: '阿拉尔',
    //     ParentCode: '1307',
    //     WeatherCode: '101130701' },
    //   { CityCode: '131401',
    //     CityName: '阿勒泰',
    //     ParentCode: '1314',
    //     WeatherCode: '101131401' },
    //   { CityCode: '1306',
    //     CityName: '巴音郭楞',
    //     ParentCode: '13',
    //     WeatherCode: '101130601' },
    //   { CityCode: '1316',
    //     CityName: '博尔塔拉',
    //     ParentCode: '13',
    //     WeatherCode: '101131601' },
    //   { CityCode: '130401',
    //     CityName: '昌吉',
    //     ParentCode: '1304',
    //     WeatherCode: '101130401' },
    //   { CityCode: '131201',
    //     CityName: '哈密',
    //     ParentCode: '1312',
    //     WeatherCode: '101131201' },
    //   { CityCode: '131301',
    //     CityName: '和田',
    //     ParentCode: '1313',
    //     WeatherCode: '101131301' },
    //   { CityCode: '130901',
    //     CityName: '喀什',
    //     ParentCode: '1309',
    //     WeatherCode: '101130901' },
    //   { CityCode: '130201',
    //     CityName: '克拉玛依',
    //     ParentCode: '1302',
    //     WeatherCode: '101130201' },
    //   { CityCode: '1315',
    //     CityName: '克州',
    //     ParentCode: '13',
    //     WeatherCode: '101131501' },
    //   { CityCode: '130301',
    //     CityName: '石河子',
    //     ParentCode: '1303',
    //     WeatherCode: '101130301' },
    //   { CityCode: '131101',
    //     CityName: '塔城',
    //     ParentCode: '1311',
    //     WeatherCode: '101131101' },
    //   { CityCode: '130501',
    //     CityName: '吐鲁番',
    //     ParentCode: '1305',
    //     WeatherCode: '101130501' },
    //   { CityCode: '130101',
    //     CityName: '乌鲁木齐',
    //     ParentCode: '1301',
    //     WeatherCode: '101130101' },
    //   { CityCode: '1310',
    //     CityName: '伊犁',
    //     ParentCode: '13',
    //     WeatherCode: '101131001' },
    //   { CityCode: '29',
    //     CityName: '云南',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '290501',
    //     CityName: '保山',
    //     ParentCode: '2905',
    //     WeatherCode: '101290501' },
    //   { CityCode: '290801',
    //     CityName: '楚雄',
    //     ParentCode: '2908',
    //     WeatherCode: '101290801' },
    //   { CityCode: '290201',
    //     CityName: '大理',
    //     ParentCode: '2902',
    //     WeatherCode: '101290201' },
    //   { CityCode: '291501',
    //     CityName: '德宏',
    //     ParentCode: '2915',
    //     WeatherCode: '101291501' },
    //   { CityCode: '2913',
    //     CityName: '迪庆',
    //     ParentCode: '29',
    //     WeatherCode: '101291301' },
    //   { CityCode: '290301',
    //     CityName: '红河',
    //     ParentCode: '2903',
    //     WeatherCode: '101290301' },
    //   { CityCode: '290101',
    //     CityName: '昆明',
    //     ParentCode: '2901',
    //     WeatherCode: '101290101' },
    //   { CityCode: '291401',
    //     CityName: '丽江',
    //     ParentCode: '2914',
    //     WeatherCode: '101291401' },
    //   { CityCode: '291101',
    //     CityName: '临沧',
    //     ParentCode: '2911',
    //     WeatherCode: '101291101' },
    //   { CityCode: '291201',
    //     CityName: '怒江',
    //     ParentCode: '2912',
    //     WeatherCode: '101291201' },
    //   { CityCode: '290901',
    //     CityName: '普洱',
    //     ParentCode: '2909',
    //     WeatherCode: '101290901' },
    //   { CityCode: '290401',
    //     CityName: '曲靖',
    //     ParentCode: '2904',
    //     WeatherCode: '101290401' },
    //   { CityCode: '290601',
    //     CityName: '文山',
    //     ParentCode: '2906',
    //     WeatherCode: '101290601' },
    //   { CityCode: '2916',
    //     CityName: '西双版纳',
    //     ParentCode: '29',
    //     WeatherCode: '101291601' },
    //   { CityCode: '290701',
    //     CityName: '玉溪',
    //     ParentCode: '2907',
    //     WeatherCode: '101290701' },
    //   { CityCode: '291001',
    //     CityName: '昭通',
    //     ParentCode: '2910',
    //     WeatherCode: '101291001' },
    //   { CityCode: '21',
    //     CityName: '浙江',
    //     ParentCode: '-1',
    //     WeatherCode: 'null' },
    //   { CityCode: '210101',
    //     CityName: '杭州',
    //     ParentCode: '2101',
    //     WeatherCode: '101210101' },
    //   { CityCode: '210201',
    //     CityName: '湖州',
    //     ParentCode: '2102',
    //     WeatherCode: '101210201' },
    //   { CityCode: '210301',
    //     CityName: '嘉兴',
    //     ParentCode: '2103',
    //     WeatherCode: '101210301' },
    //   { CityCode: '210901',
    //     CityName: '金华',
    //     ParentCode: '2109',
    //     WeatherCode: '101210901' },
    //   { CityCode: '210801',
    //     CityName: '丽水',
    //     ParentCode: '2108',
    //     WeatherCode: '101210801' },
    //   { CityCode: '210401',
    //     CityName: '宁波',
    //     ParentCode: '2104',
    //     WeatherCode: '101210401' },
    //   { CityCode: '211001',
    //     CityName: '衢州',
    //     ParentCode: '2110',
    //     WeatherCode: '101211001' },
    //   { CityCode: '210501',
    //     CityName: '绍兴',
    //     ParentCode: '2105',
    //     WeatherCode: '101210501' },
    //   { CityCode: '210601',
    //     CityName: '台州',
    //     ParentCode: '2106',
    //     WeatherCode: '101210601' },
        // { CityCode: '210601',
        //     CityName: '温州',
        //     ParentCode: '2106',
        //     WeatherCode: '101210601' },
        // { CityCode: '210701',
        //     CityName: '舟山',
        //     ParentCode: '2107',
        //     WeatherCode: '101210701' }];

    // var provinceList =[];
    // var cityList = [];
    // for (var i = 0; i < city.length; i++) {
    //     var provinceListObj = {};
    //     var cityListObj = {};
    //     var ParentCode = city[i].ParentCode;
    //     if (ParentCode == -1) {
    //         provinceListObj.province = city[i].CityName;
    //         provinceListObj.cityCode = city[i].CityCode;
    //         provinceListObj.city = [];
    //         provinceList.push(provinceListObj);
    //     }
    //     if (ParentCode != -1){
    //         cityListObj.cityName = city[i].CityName;
    //         cityListObj.cityCode = city[i].CityCode;
    //         cityList.push(cityListObj);
    //     }
    // };
    // for (var j = 0; j < provinceList.length; j++) {
    //     var provinceCode = provinceList[j].cityCode;
    //     for (var k = 0; k < cityList.length; k++) {
    //         var cityCode = cityList[k].cityCode;

    //         if (parseInt(cityCode.substring(0,provinceCode.length))==parseInt(provinceCode)) {
    //             provinceList[j].city.push(cityList[k]);
    //         };
    //     };
    // };

    // $scope.provinceList = provinceList;
    // console.log($scope.provinceList);
    return;
}];

app.controller('EditPersonalPopupController', ['$scope', '$location', 'form', '$http', '$timeout', 'data',
    function($scope, $location, form, $http, $timeout, data) {
        $scope.data = data;
        $scope.form = form;
        $scope.data.validate = '';
        $scope.timeLabel = '发送验证码';
        $scope.labelText= '发送验证码';
        $scope.sMsBtnMsg="";
        $scope.noDisable = true;
//        $scope.data.phone="";
        $scope.$watch("data.phone", function(newV, oldV) {
            //             if(!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(mobile))
            // {
            //   alert('error');
            // }
            // $scope.phoneNumberError=true;
            // $scope.form.checkPhoneNumber
            var reg = new RegExp("^[0-9]*$");
            var checkPhoneNumber = $scope.form.checkPhoneNumber;
            if (newV != oldV) {
                if (!reg.test(newV)) {
                    $scope.data.phone = oldV;
                }
                if (!checkPhoneNumber.test(newV)) {
                    $scope.phoneNumberError = true;
                } else {
                    $scope.phoneNumberError = false;
                }
                if(newV.length>11){
                    $scope.data.phone=oldV;
                }
            }
        }, true)


        $scope.sendSMSforpersonalFileFn = function(self) { 
            if(!$scope.noDisable) 
              return;          
            $scope.noDisable = false;
            $scope.timeCount();  
            var sendSMSApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + sendSMSForUserApi;
            var sendSMSPostData = copyData($scope.form.userData);
            sendSMSPostData.phoneNum = null;
            sendSMSPostData.newPhoneNum = data.phone;
            if ($scope.isLogin) sendSMSPostData.isloginUser = $scope.isLogin;
            $.ajax({
                url: sendSMSApiUrl,
                type: $scope.form.postType,
                context: document.body,
                data: sendSMSPostData,
                success: function(data) {
                    var isNew = data.result.isNew;
                    if (data.errorCode == -6 || data.errorCode == -100) {                        
                        $('.bind-telphone').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+data.errorMessage+'</span></div>')
                                setTimeout(function(){
                                    $('.errorMsgShow').remove();
                                   // $location.path('/bind')
                                },2000)
                       // $scope.$root.showAlert(getErrorMsg(data.errorCode, data.errorMessage),function(){$location.path('/bind')});
                       // $location.path('/bind')
                        return;
                    } else if (data.errorCode < 0) {
                        $('.bind-telphone').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+data.errorMessage+'</span></div>')
                                setTimeout(function(){
                                    $('.errorMsgShow').remove();
                                },2000)
                        
                    } else {
                        $timeout(function() {
                            //$scope.form.userInfo = data.result;                                                          
                            $('#validateSuccess').removeClass('hide');
                            setTimeout(function(){
                                $('#validateSuccess').addClass('hide');
                            },2000)
                        });
                    }
                },
                error: function(e) {
                	$scope.$modalCancel();
                    $scope.$root.getReadyStateMsg(e.readyState,function(){
                    	$scope.data.reopen($scope.data.self,$scope.data.phone);
                    });
                }
            });
        }

        $scope.saveUserPhoneforpersonalFileFn = function(self) {
            var saveUserPhoneApiUrl = apiDomain + "/" + $scope.form.userData.userId + "/" + $scope.form.userData.session + saveUserPhoneApi;
            var sendSMSPostData = copyData($scope.form.userData);
            sendSMSPostData.phoneNum = null;
            sendSMSPostData.newPhone = data.phone;
            sendSMSPostData.verifyCode = data.validate;
            if ($scope.isLogin) sendSMSPostData.isloginUser = $scope.isLogin;
            $.ajax({
                url: saveUserPhoneApiUrl,
                type: $scope.form.postType,
                context: document.body,
                data: sendSMSPostData,
                success: function(data) {
                    var isNew = data.result.isNew;

                    if (data.errorCode == -6 || data.errorCode == -100) {
                        $('.bind-telphone').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+data.errorMessage+'</span></div>')
                                setTimeout(function(){
                                    $('.errorMsgShow').remove();
                                   // $location.path('/bind')
                                },2000)
                        //$scope.$root.showAlert(getErrorMsg(data.errorCode, data.errorMessage),function(){$location.path('/bind')});
                        //$location.path('/bind')
                        return;
                    } else if (data.errorCode < 0) {
                        $('.bind-telphone').append('<div class="submit-success text-center errorMsgShow" id="subBtnError"><span class="success-icon error"><i class="icon-wrong"></i></span><span>'+data.errorMessage+'</span></div>')
                                setTimeout(function(){
                                    $('.errorMsgShow').remove();
                                },2000)
                        //$scope.$root.showAlert(getErrorMsg(data.errorCode, data.errorMessage));
                    } else {
                        $timeout(function() {
                            if (data.result) {
                                $scope.$modalCancel();
                                $scope.form.phoneNumber = $scope.data.phone;
                                $scope.form.userInfo.hasCheckMobile = true;
                                localStorage.setItem('phoneNum', aesEncrypt($scope.data.phone, ys));
                                                                                       
                                $('#saveSuccess').removeClass('hide');
                                setTimeout(function(){
                                    $('#saveSuccess').addClass('hide');
                                },2000)
                            }
                        });
                    }
                },
                error: function(e) {
                    $scope.$root.getReadyStateMsg(e.readyState);
                }
            });
        }

        var timeNum = 60;
        $scope.timeCount = function() {
            $scope.timeLabel = timeNum + '秒后重发';
            var timeInter = setInterval(function() {
                $timeout(
                    function() {
                        $scope.timeLabel = timeNum + '秒后重发';
                        timeNum--;
                if (timeNum < 0) {
                    $scope.labelText= '重新发送';
                    $scope.timeLabel = '重新发送';
                    $scope.noDisable = true;                    
                    clearInterval(timeInter)
                    timeNum = 60;
                }
                    }
                )


            }, 1000)
        }

    }
]);
