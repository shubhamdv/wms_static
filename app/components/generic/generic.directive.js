(function() {

    'use strict';

    var keyCodes = {
        esc: 27,
        reject: 82,
        accept: 65,
        quarantine: 81,
        space: 32,
        enter: 13,
        tab: 9,
        backspace: 8,
        shift: 16,
        ctrl: 17,
        alt: 18,
        capslock: 20,
        numlock: 144,
        em: 77
    };
    angular.module('wmsApp')
    .directive('validNumber', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                var clean = '';
                ngModel.$parsers.push(function(val) {
                    if (val < 1) {
                        clean = val.replace(0, '');
                    } else {
                        clean = val.replace(/[^0-9]/g, '');
                    }

                    if (val !== clean) {
                        ngModel.$setViewValue(clean);
                        ngModel.$render();
                    }
                    return clean;
                });

                element.bind('keypress', function(event) {
                    if (event.keyCode === 32) {
                        event.preventDefault();
                    }
                });
            }
        };
    })
    // valid float and number directive
    .directive('validFloat', function() {
        return {
            require: '?ngModel',
            link: function(scope, element, attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }

                ngModelCtrl.$parsers.push(function(val) {
                    if (angular.isUndefined(val)) {
                        val = '';
                    }
                    var clean = val.replace(/[^0-9\.]/g, '');
                    var decimalCheck = clean.split('.');
                    if (!angular.isUndefined(decimalCheck[1])) {
                        decimalCheck[1] = decimalCheck[1].slice(0, 3);
                        clean = decimalCheck[0] + '.' + decimalCheck[1];
                    }

                    if (val !== clean) {
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                    return clean;
                });

                element.bind('keypress', function(event) {
                    if (event.keyCode === 32) {
                        event.preventDefault();
                    }
                });
            }
        };
    })

    .directive('validAlphabet', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attr, ngModelCtrl) {
                var pattern = /[^a-zA-Z]*/g;

                function fromUser(text) {
                    if (!text)
                        return text;

                    var transformedInput = text.replace(pattern, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    })

    .directive('keyBind', function() {
        function map(obj) {
            var mapped = {};
            for (var key in obj) {
                var action = obj[key];
                if (keyCodes.hasOwnProperty(key)) {
                    mapped[keyCodes[key]] = action;
                }
            }
            return mapped;
        }

        return function(scope, element, attrs) {
            var bindings = map(scope.$eval(attrs.keyBind));
            element.bind('keydown keypress', function(event) {
                var keyCode = event.which || event.keyCode;
                var isAlt = event.altKey;
                if ((bindings.hasOwnProperty(keyCode) && isAlt)) {
                    scope.$apply(function() {
                        scope.$eval(bindings[event.which]);
                    });
                    event.preventDefault();
                }
            });
        };
    })

    .directive('autofocus', function($timeout) {
        return function(scope, element) {
            var input = element.find('input');
            $timeout(function() {
                input[0].focus();
            });
        };
    })

    .directive('singlekeyBind', function() {
        function map(obj) {
            var mapped = {};
            for (var key in obj) {
                var action = obj[key];
                if (keyCodes.hasOwnProperty(key)) {
                    mapped[keyCodes[key]] = action;
                }
            }
            return mapped;
        }

        return function(scope, element, attrs) {
            var bindings = map(scope.$eval(attrs.singlekeyBind));
            element.bind('keydown keypress', function(event) {
                var keyCode = event.which || event.keyCode;
                if (bindings.hasOwnProperty(keyCode)) {
                    scope.$apply(function() {
                        scope.$eval(bindings[event.which]);
                    });
                    event.preventDefault();
                }
            });
        };
    })

    .directive('customPopover', function($compile, $templateCache, $document) {
        return {
            restrict: 'A',
            template: '<span popup="true">{{label}}</span>',
            link: function(scope, el, attrs) {
                scope.label = attrs.popoverLabel;
                $document.find('body').on('click', function(e) {
                    if (!e.target.hasAttribute('popup')) {
                        $document.find('[popup="true"]').popover('hide');
                    }
                });
                var popoverHtml = '<div class="custom_css_pop"><div class="row" ng-if="detail.date" ng-repeat= "detail in dates | orderBy :sortByDate :!asec" ng-class="{active : $index<1}"><div class="col-lg-12"><dl ><dt>{{detail.name | translate}}</dt><dd>{{detail.date| date:"yyyy-MM-dd"}}&nbsp;{{detail.date| date : "mediumTime"}}</dd></dl></div></div></div>';
                popoverHtml = $compile(popoverHtml)(scope);
                $(el).popover({
                    trigger: 'click',
                    html: true,
                    content: popoverHtml,
                    placement: attrs.popoverPlacement
                });
            }
        };
    })

    .directive('selectpicker', function($parse, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                $timeout(function() {
                    element.selectpicker($parse(attrs.selectpicker)());
                    element.selectpicker('refresh');
                });

                scope.$watch(attrs.ngModel, function(newVal) {
                    element.closest('.bootstrap-select').find('.dropdown-toggle').blur();
                    scope.$parent[attrs.ngModel] = newVal;
                    scope.$evalAsync(function() {
                        if (!attrs.ngOptions || /track by/.test(attrs.ngOptions)) {
                            // If newVal is an object type, add ng-object-key in template which corresponds to value of options.
                            element.val(_.isObject(newVal) ? newVal[attrs.ngObjectKey] || newVal : newVal);
                        }
                        element.selectpicker('refresh');
                    });
                });

                // If Options list is rendered through ajax, put ng-render-model=<list in the scope>
                if (attrs.hasOwnProperty('ngRenderModel')) {
                    scope.$watch(attrs.ngRenderModel, function() {
                        $timeout(function() {
                            element.selectpicker('refresh');
                        });
                    });
                }

                scope.$on('$destroy', function() {
                    scope.$evalAsync(function() {
                        element.selectpicker('destroy');
                    });
                });
            },
        };
    })

    .directive('ngEnter', function() {
        return {
            link: function(scope, element, attrs) {
                var isDisabled = 'true';
                attrs.$observe('ngEnter', function(value) {
                    isDisabled = value;
                });
                angular.element(window).bind("keypress", function(event) {
                    if (event.which === 13 && isDisabled === 'false') {
                        element.click();
                    }
                });
            }
        }
    });
})();
