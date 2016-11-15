'use strict';
/* jshint camelcase: false */

angular.module('wmsApp')
    .service('createAsnService', function($http, settings) {
        this.createASN = function(params, data) {
            return $http({
                'url' : settings.API_URI.CREATE_ASN,
                'method' : 'post',
                'data' : data,
                'params' : params
            });
        };
    }
);
