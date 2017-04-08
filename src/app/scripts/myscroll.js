(function(window, angular, undefined) {
    'use strict';

    var myScrollModule = angular.module("myScroll", ["hmTouchEvents"]);
    myScrollModule
        .directive('myScroll', function() {
            return {
                restrict: 'E',
                transclude: true,
                scope: {
                    myValues: '=',
                    ngModel: "=",
                    myScrollType: "=",
                    myRefresh:"="
                },
                templateUrl: function(elem, attrs) {

                    return 'ui/my-scroll.html'
                },
                link: function(scope, elem, attrs) {
                    scope.last, scope.orig = 0;

                    scope.getCenter = function() {
                        var ruleOuter = jQuery(".rule-scroll", elem);
                        var center = ruleOuter.offset().left + (ruleOuter.width() / 2);
                        return center;
                    }

                    // scope.$watch("ngModel", function() {
                    //     scope.moveToSelected();
                    // });

                    scope.moveToSelected = function() {
                        var model = scope.ngModel;
                        var ruleOuter = jQuery(".rule-scroll", elem);
                        var center = ruleOuter.offset().left + (ruleOuter.width() / 2);
                        setTimeout(
                            function() {
                                var found = false;
                                if (scope.ngModel != "") {
                                    var lis = $("li", elem);
                                    for (var i = 0; i < $("li", elem).length; i++) {
                                        var li = lis[i];
                                        var item = angular.element(li).scope().item;


                                        if (item == model) {
                                            found = true;
                                            var left = $(li).offset().left;
                                            left = left + $(li).width() / 2;
                                            var distance = 0 - (left - center);
                                            scope.orig = distance;

                                            $(".on", elem).removeClass("on");
                                            $(li).addClass("on");
                                            jQuery("li", elem).css({
                                                transform: "translateX(" + scope.orig + "px)"
                                            });
                                        }
                                    }
                                }

                                if (!found) {
                                    var lis = $("li", elem);
                                    var li = lis[0];
                                    var left = $(li).offset().left;
                                    left = left + $(li).width() / 2;
                                    var distance = 0 - (left - center);
                                    scope.orig = distance;

                                    $(".on", elem).removeClass("on");
                                    $(li).addClass("on");
                                    jQuery("li", elem).css({
                                        transform: "translateX(" + scope.orig + "px)"
                                    });

                                    var item = angular.element(jQuery(".on", elem)).scope().item;
                                    scope.ngModel = item;
                                }
                            }, 800)
                    }

                    //scope.moveToSelected();

                    scope.$watch("myRefresh", function() {
                        scope.moveToSelected();
                  });

                    scope.getNear = function() {
                        var itemCenter = $(".on", elem).offset().left + $(".on", elem).width() / 2;
                        var gap = 0 - (itemCenter - scope.getCenter());
                        return gap;
                    }

                    scope.highlightSelected = function() {
                        var ruleOuter = jQuery(".rule-scroll", elem);
                        var center = ruleOuter.offset().left + (ruleOuter.width() / 2);
                        var ruleLis = jQuery("li", elem);
                        for (var i = 0; i < ruleLis.length; i++) {
                            var ruleLi = ruleLis[i];
                            var left = $(ruleLi).offset().left
                            var right = left + $(ruleLi).width();
                            if (left <= center && right > center) {
                                if (!$(ruleLi).hasClass("on")) {
                                    $(".on", elem).removeClass("on");
                                    $(ruleLi).addClass("on");
                                }

                            }
                        }
                    }

                    scope.doMoveEnd = function(e) {
                        e.preventDefault();
                        e.srcEvent.stopImmediatePropagation()
                        e.srcEvent.stopPropagation();
                        scope.orig = scope.last;
                        var item = angular.element(jQuery(".on", elem)).scope().item;
                        scope.ngModel = item;
                        var near = scope.getNear();

                        scope.orig = scope.orig + near;
                        jQuery("li", elem).css({
                            transform: "translateX(" + scope.orig + "px)"
                        });
                        // scope.highlightSelected();
                    }

                    scope.doMove = function(e) {
                        e.preventDefault();
                        e.srcEvent.stopImmediatePropagation()
                        e.srcEvent.stopPropagation();

                        scope.last = scope.orig + e.deltaX;

                        jQuery("li", elem).css({
                            transform: "translateX(" + scope.last + "px)"
                        });

                        //  scope.checkOutBounder();
                        scope.highlightSelected();
                        //console.log(e.direction);
                    }

                    scope.checkOutBounder = function() {
                        var lis = jQuery("li", elem);
                        var firstLi = lis[0];
                        var lastLi = lis[lis.length - 1];
                        if ($(firstLi).offset().left > scope.getCenter()) {

                            var offset = scope.getCenter() - $(firstLi).offset().left;
                            scope.last = scope.last + offset;
                            lis.css({
                                transform: "translateX(" + scope.last + "px)"
                            });
                        }

                        var right = $(lastLi).offset().left + $(lastLi).width();

                        if (right < scope.getCenter()) {
                            var offset = scope.getCenter() - right;
                            scope.last = scope.last + offset;
                            lis.css({
                                transform: "translateX(" + scope.last + "px)"
                            });
                        }
                    }

                }
            };
        })
        .directive('myScrollv', function() {
            return {
                restrict: 'E',
                transclude: true,
                scope: {
                    myValues: '=',
                    ngModel: "=",
                    myText: "=",
                    myRefresh:"="
                },
                templateUrl: function(elem, attrs) {

                    return 'ui/my-scrollv.html'
                },
                link: function(scope, elem, attrs) {
                    scope.last, scope.orig = 0;

                    scope.getCenter = function() {
                        var ruleOuter = jQuery(".scroll-input", elem);

                        var center = ruleOuter.offset().top + (ruleOuter.height() / 2);
                        return center;
                    }

                    // scope.$watch("ngModel", function() {
                    //     scope.moveToSelected();
                    // });
                
                  

                    scope.moveToSelected = function(model) {
                        if (model == null) {
                            model = scope.ngModel;
                        }

                        setTimeout(
                            function() {
                                var found = false;
                                if (model != "") {
                                    var lis = $("li", elem);
                                    for (var i = 0; i < $("li", elem).length; i++) {
                                        var li = lis[i];
                                        var item = angular.element(li).scope().item;


                                        if (item == model) {
                                            found = true;
                                            var top = $(li).offset().top;

                                            top = top + $(li).innerHeight() / 2;

                                            var center = scope.getCenter();

                                            var distance = 0 - (top - center);
                                            scope.orig = distance;
                                            $(".on", elem).removeClass("on");
                                            $(li).addClass("on");
                                            jQuery("li", elem).css({
                                                transform: "translateY(" + scope.orig + "px)",
                                            });
                                        }
                                    }
                                    //not found set the first one is selected
                                }

                                if (!found) {
                                    var lis = $("li", elem);
                                    var li = lis[0];
                                    var top = $(li).offset().top;

                                    top = top + $(li).innerHeight() / 2;

                                    var center = scope.getCenter();

                                    var distance = 0 - (top - center);
                                    scope.orig = distance;
                                    $(".on", elem).removeClass("on");
                                    $(li).addClass("on");
                                    jQuery("li", elem).css({
                                        transform: "translateY(" + scope.orig + "px)",
                                    });

                                    var item = angular.element(jQuery(".on", elem)).scope().item;
                                    scope.ngModel = item;
                                }
                            }, 400)
                    }

                    scope.$watch("myRefresh", function(newV, oldV) {
                        if (newV) {
                            scope.moveToSelected();
                        }
                  });

                    //scope.moveToSelected();



                    scope.highlightSelected = function() {
                        var center = scope.getCenter();

                        var ruleLis = jQuery("li", elem);
                        for (var i = 0; i < ruleLis.length; i++) {
                            var ruleLi = ruleLis[i];
                            var top = $(ruleLi).offset().top

                            var bottom = top + $(ruleLi).innerHeight();
                            //console.log("center"+center+"top"+top+"bottom"+bottom);
                            if (top <= center && bottom > center) {
                                //console.log("on");
                                if (!$(ruleLi).hasClass("on")) {
                                    //  console.log("on");
                                    $(".on", elem).removeClass("on");
                                    $(ruleLi).addClass("on");
                                }

                            }
                        }
                    }

                    scope.getNear = function() {
                        var itemCenter = $(".on", elem).offset().top + $(".on", elem).innerHeight() / 2;
                        var gap = 0 - (itemCenter - scope.getCenter());
                        return gap;
                    }

                    scope.doMoveEnd = function(e) {
                        e.preventDefault();
                        e.srcEvent.stopImmediatePropagation()
                        e.srcEvent.stopPropagation();

                        scope.orig = scope.last;
                        var item = angular.element(jQuery(".on", elem)).scope().item;
                        scope.ngModel = item;
                        //console.log(item);
                        //scope.highlightSelected();
                        var near = scope.getNear();

                        scope.orig = scope.orig + near;
                        jQuery("li", elem).css({
                            transform: "translateY(" + scope.orig + "px)",
                        });
                        // scope.highlightSelected();
                    }

                    scope.doMove = function(e) {
                        e.preventDefault();
                        //debugger;
                        e.srcEvent.stopImmediatePropagation()
                        e.srcEvent.stopPropagation();
                        scope.last = scope.orig + e.deltaY;

                        jQuery("li", elem).css({
                            transform: "translateY(" + scope.last + "px)"
                        });

                        scope.checkOutBounder();

                        scope.highlightSelected();
                        //console.log(e.direction);
                    }

                    scope.checkOutBounder = function() {
                        var lis = jQuery("li", elem);
                        var firstLi = lis[0];
                        var lastLi = lis[lis.length - 1];
                        if ($(lis[0]).offset().top > scope.getCenter()) {

                            var offset = scope.getCenter() - $(firstLi).offset().top;
                            scope.last = scope.last + offset;
                            lis.css({
                                transform: "translateY(" + scope.last + "px)"
                            });
                        }

                        var bottom = $(lastLi).offset().top + $(lastLi).innerHeight() + $(lastLi).innerHeight();

                        if (bottom < scope.getCenter()) {
                            var offset = scope.getCenter() - bottom;
                            scope.last = scope.last + offset;
                            lis.css({
                                transform: "translateY(" + scope.last + "px)"
                            });
                        }
                    }

                }
            };
        })

})(window, window.angular);
