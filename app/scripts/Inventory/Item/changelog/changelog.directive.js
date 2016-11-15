'use strict';
    angular.module('wmsApp')
       .directive('printChangelogitem', function () {
        return {
            controller: function($scope){
                $scope.printPage = function(){
                  window.print();
                };
            }
        };
    }
);
