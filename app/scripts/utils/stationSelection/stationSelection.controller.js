'use strict';
/*jshint camelcase: false */

angular.module('wmsApp')
    .controller('selectStationCtrl', function($scope, $rootScope, selectStationService, $location) {
        var vm = this;

        vm.showErrorMessage = false;
        vm.errormessage = 'ERR3';

        vm.getStation = getStation;

        // For Auto Complete of Product Numbers
        function getStation() {
            selectStationService.getAllStation({
                'station': vm.stationName,
                'fulfillment_center_num': $rootScope.fcNum
            })
                .success(function(response) {
                    if (response.errors.length !== 0) {
                        vm.showErrorMessage = true;
                        vm.errormessage = response.errors[0].error_message;
                    } else {
                        if (!$rootScope.profileData.default_landing_page) {
                            vm.showErrorMessage = true;
                            vm.errormessage = "ERR_MSG.NO_DEFAULT_LANDING"
                        } else if ($rootScope.prevUrl === '/select/fc' || !$rootScope.prevUrl) {
                            $location.path($rootScope.profileData.default_landing_page.trim());
                            $rootScope.station = vm.stationName;
                            vm.showErrorMessage = false;
                        } else {
                            $location.path($rootScope.prevUrl);
                            $rootScope.station = vm.stationName;
                            vm.showErrorMessage = false;
                        }
                    }
                }).error(function(data) {
                    vm.showErrorMessage = true;
                    if (typeof data.errors !== 'undefined') {
                        vm.errormessage = data.errors[0].error_message;
                    } else if (typeof data.message !== 'undefined') {
                        vm.errormessage = data.message;
                    } else if (data.detail) {
                        vm.errormessage = data.detail;
                    } else {
                        vm.errormessage = 'ERR3';
                    }
                });
        };
    });