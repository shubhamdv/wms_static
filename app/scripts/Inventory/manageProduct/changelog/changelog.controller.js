'use strict';
/* jshint camelcase: false */
angular.module('wmsApp')
    .controller('productChangeLogCtrl', function($scope, settings, productChangeLogService, genericService, $route, $routeParams) {

        $scope.itemStatusList = settings.ITEM_STATUS;

        /*To set Module and submodule name in breadcrumb*/
        $scope.isNoRecord = false;
        if($routeParams.prod_sk){
            $scope.prodSK = $routeParams.prod_sk;
            var prodskLast = $scope.prodSK.slice($scope.prodSK.lastIndexOf('_'));
            var lastNumber = prodskLast.split('_');
            $scope.prodNumber = lastNumber[1];
        }
        //Show all Item
        $scope.productChangeLogList = function() {
            var params = {
                prod_sk : $scope.prodSK,
                fulfillment_center_num: ($scope.fcDetail ? $scope.fcDetail.fulfillment_center_num : $scope.fcNum),
            };
            productChangeLogService.getProductChangeLogList(params)
                .success(function(response) {
                    var data = response.data;
                    if (data) {
                        $scope.data = data.results;
                        $scope.error = false;
                        $scope.isNoRecord = false;
                    } else {
                        $scope.isNoRecord = true;
                    }
                })
                .error(function(error) {
                    $scope.error = true;
                    $scope.isNoRecord = false;
                    if (error.errors) {
                        $scope.errorMsg = error.errors[0].error_message;
                    } else if (error.detail) {
                        $scope.errorMsg = error.detail;
                    } else {
                        $scope.errorMsg = error.message || 'ERR3';
                    }
                });
        };

        // Default function called
        $scope.productChangeLogList();
    });
