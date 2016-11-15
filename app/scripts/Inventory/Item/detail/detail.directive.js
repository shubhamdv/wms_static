'use strict';
    angular.module('wmsApp')
       .directive('printItemdetail', function () {
        return {
            controller: function($scope){
                $scope.printPage = function(){
                  window.print();
                };
            }
        };
    }
);
