'use strict';
/*jshint camelcase: false */
angular.module('wmsApp')
    .service('batchHistoryService', function($http, settings) {
        // get ASN Detail
        this.getAsnBatch = function(params) {
            // return http promise object attempting authentication
            return $http({
                'url': settings.API_URI.ASN_BATCH_DETAIL,
                'method': 'GET',
                'params': params,
            });
        };

        // get Batch History
        this.getBatchHis = function(params) {
            // return http promise object attempting authentication
            return $http({
                'url': settings.API_URI.ASN_BATCH_HISTORY,
                'method': 'GET',
                'params': params,
            });
        };
    });
