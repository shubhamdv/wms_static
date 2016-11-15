'use strict';
angular.module('wmsApp')
    .directive('printBatchhis', function() {
        return {
            controller: function($scope) {
                $scope.printbatches = function() {
                    window.print();
                };
            }
        };
    });
