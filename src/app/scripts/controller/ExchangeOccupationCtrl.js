var ExchangeOccupationCtrl = ['$rootScope', '$scope', 'form', '$location', '$timeout', '$routeParams', 'baseDataService',
    function($rootScope, $scope, form, $location, $timeout, $routeParams, baseDataService) {
	factoryVal.topBar.showTopBar = true;
	factoryVal.topBar.showLeftBtn = true;
	factoryVal.topBar.leftBtnType = setting.btn.backBtn;
	$scope.form = form;
	//初始化
	var productCode = $routeParams.detailId;
	$scope.form.topBar.topBarTitle = productCode=='ZD'?'安心宝':productCode=='ELCA'?'行路宝':productCode=='ACMB'?'航空宝':productCode=='YYTI'?'悠游宝':'';
	$scope.occupationList = [
	    {
	    	occupationCode: 'K',
	    	occupationName: '金融业'
	    },
	    {
	    	occupationCode: 'I',
	    	occupationName: '水陆空交通运输业、邮政、水电、燃气、通讯等公共事业，计算机与互联网'
	    },
	    {
	    	occupationCode: 'C1',
	    	occupationName: '旅游、餐饮、零售'
	    },
	    {
	    	occupationCode: 'J',
	    	occupationName: '文教业、新闻出版广告业；卫生保健业；清洁或家政、物业管理、物流、美容美发、摄影、殡葬等服务业'
	    },
	    {
	    	occupationCode: 'A',
	    	occupationName: '公务员'
	    },
	    {
	    	occupationCode: 'C4',
	    	occupationName: '房屋中介、律师、公证人员、会计师'
	    },
	    {
	    	occupationCode: 'G',
	    	occupationName: '矿石开采业、建筑工程业、装潢业'
	    },
	    {
	    	occupationCode: 'F',
	    	occupationName: '农牧业、渔业、木材森林业'
	    },
	    {
	    	occupationCode: 'D4',
	    	occupationName: '自营投资者'
	    },
	    {
	    	occupationCode: 'C2',
	    	occupationName: '娱乐场所、博彩、影视娱乐业'
	    },
	    {
	    	occupationCode: 'H',
	    	occupationName: '五金电子电器、日用品、化工建材等制造业，机电及其他设备维修'
	    },
	    {
	    	occupationCode: 'C3',
	    	occupationName: '废品收购；艺术品收藏、考古及文物保护、拍卖、典当、贵金属和珠宝交易商'
	    },
	    {
	    	occupationCode: 'D1',
	    	occupationName: '无业、待业及无固定职业人员---家庭主妇'
	    },
	    {
	    	occupationCode: 'D2',
	    	occupationName: '无业、待业及无固定职业人员---离退休人员'
	    },
	    {
	    	occupationCode: 'D3',
	    	occupationName: '无业、待业及无固定职业人员---除家庭主妇及离退休人员以外'
	    },
	    {
	    	occupationCode: 'L',
	    	occupationName: '学生、学龄前儿童'
	    },
	    {
	    	occupationCode: 'B',
	    	occupationName: '外国政要'
	    },
	    {
	    	occupationCode: 'M',
	    	occupationName: '企事业单位、民间组织和社会团体等工作人员，宗教业'
	    }
    ];
	//返回
	$scope.form.leftBtnClick = function() {
		$location.path('/exchangeDetail/'+productCode);
	};
	//选择职业
	$scope.selectOccupation = function(item){
		$scope.form.insure.occupationCode = item.occupationCode;
		$scope.form.insure.occupationName = item.occupationName;
		$location.path('/exchangeDetail/'+productCode);
	};
}];