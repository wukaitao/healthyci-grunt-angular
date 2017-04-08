//日期
var DateCtrl = ['$scope', '$location', 'form', '$http', function($scope, $location, form, $http) {
    $scope.form = form;
    $('#demo_date').mobiscroll().date({
        theme: 'ios',
        mode: 'scroller',
        display: 'modal',
        lang: 'zh'
    });
    $('#demo_date1').mobiscroll().date({
        theme: 'ios',
        mode: 'scroller',
        display: 'bottom',
        lang: 'zh'
    });

    $('#getUpTime').mobiscroll().time({
        theme: 'ios',
        mode: 'scroller',
        display: 'modal',
        lang: 'zh'
    });

    $('#demo').mobiscroll().select({
        theme: 'mobiscroll',
        display: 'inline',
        minWidth: 200
    });

    //$('#demo').mobiscroll('show');

    //$location.path('/useIntroduction');
    return;
}];

//日期