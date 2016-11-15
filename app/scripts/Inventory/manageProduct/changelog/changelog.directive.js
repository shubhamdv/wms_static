'use strict';
    angular.module('wmsApp')
       .directive('printChangelogproduct', function () {
        return {
            controller: function($scope){
                $scope.printPage = function(){
                  window.print();
                };
            }
        };
    }
);
