'use strict';

angular.module('wmsApp')
    .service('navBarService', function($http, settings) {

        /*Reset fulfillment center and store detail in session after getting user permission*/
        this.getUserPermission = function(fc) {
            // return http promise object attempting permissions
            return $http({
                'url': settings.API_URI.GET_USER_PERMISSION,
                'method': 'GET',
                'params': {
                    fcDetail: fc
                }
            });
        };
    });
