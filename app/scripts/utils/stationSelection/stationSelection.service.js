'use strict';
/*jshint camelcase: false */
angular.module('wmsApp')
    .service('selectStationService', function($http, settings) {
        // get All FC
        this.getAllStation = function(data) {
            return $http({
                'url': settings.API_URI.GET_FC_STATION,
                'method': 'GET',
                'params': data,
            });
        };

    });
