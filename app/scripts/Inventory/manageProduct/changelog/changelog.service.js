'use strict';
/*jshint camelcase: false */
angular.module('wmsApp')
    .service('productChangeLogService', function($http, settings) {
        this.getProductChangeLogList = function(params) {
            return $http({
                'url': settings.API_URI.PROD_CHANGE_LOG,
                'method': 'GET',
                'params': params,
            });
        };
    });
