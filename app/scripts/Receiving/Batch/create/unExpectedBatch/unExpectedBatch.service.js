'use strict';
/* jshint camelcase: false */

angular.module('wmsApp')
    .service('CreateUnExpctedBatchServices', function($http, settings) {

        this.createBatch = function(params, data) {
            return $http({
                'url' : settings.API_URI.CREATE_UNEXP_BATCH,
                'method' : 'post',
                'data' : data,
                'params' : params
            });
        };
    }
);
