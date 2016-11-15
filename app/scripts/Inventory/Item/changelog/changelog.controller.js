'use strict';
/* jshint camelcase: false */
angular.module('wmsApp')
    .controller('itemChangeLogCtrl', function($scope, settings, itemChangeLogService, genericService, $route, $routeParams) {

        $scope.itemStatusList = settings.ITEM_STATUS;

        /*To set Module and submodule name in breadcrumb*/
        $scope.isNoRecord = false;
        if($routeParams.serial){
            $scope.serialNum = $routeParams.serial;
        }
        //Show all Item
        $scope.itemChangeLogList = function() {
            var params = {
                serial : $scope.serialNum,
                fulfillment_center_num: ($scope.fcDetail ? $scope.fcDetail.fulfillment_center_num : $scope.fcNum),
            };
            itemChangeLogService.getItemChangeLogList(params)
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
        $scope.itemChangeLogList();
    });
