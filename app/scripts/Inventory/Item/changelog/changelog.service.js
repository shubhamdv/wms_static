'use strict';
/*jshint camelcase: false */
angular.module('wmsApp')
    .service('itemChangeLogService', function($http, settings) {
        this.getItemChangeLogList = function(params) {
            return $http({
                'url': settings.API_URI.ITEM_CHANGE_LOG,
                'method': 'GET',
                'params': params,
            });
        };
    });
