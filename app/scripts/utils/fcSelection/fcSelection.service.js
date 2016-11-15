'use strict';

angular.module('wmsApp')
    .service('fcClientService', function($http, settings) {

        /*Set fulfillment center and store detail in session after getting user permission*/

        this.getUserPermission = function(fc) {
            // return http promise object attempting permissions
            return $http({
                'url': settings.API_URI.GET_USER_PERMISSION,
                'method': 'GET',
                'params': {
                    sk: fc.sk[0],
                    fcDetail: fc
                }
            });
        };

    });
