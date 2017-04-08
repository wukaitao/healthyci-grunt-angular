var TutorialCtrl = ['$scope', '$location', 'form', '$http', function($scope, $location, form, $http) {
    factoryVal.topBar.showTopBar = true;
    factoryVal.topBar.topBarTitle = "帮助";
    factoryVal.topBar.showLeftBtn = true;
    factoryVal.topBar.leftBtnType = setting.btn.backBtn;
    $scope.form = form;
    trackerApi("3-帮助","",{});
    $scope.form.leftBtnClick = function() {
        $location.path("/managemant");
    }

    $(document).ready(function() {
        $('.content').hide();
        $('.title').find('span').addClass('icon-down');
        $('.title').click(function(){
                        $(this).find('span').toggleClass('icon-down icon-up').end().next('.content').slideToggle(300);
                    }); 
    });

    return;
}];
