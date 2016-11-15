'use strict';

angular.module('wmsApp')
    .config(function($routeProvider) {
        $routeProvider
            .when('/select/station', {
                templateUrl: 'scripts/Utils/stationSelection/stationSelection.html',
                controller: 'selectStationCtrl',
                controllerAs: 'vm',
                title: 'PAGE_TITLE.STATION.SELECT',
                access: {
                    requiredLogin: true,
                    requiredPrecondition: true,
                    requiredPermission: true,
                }
            });
    });
