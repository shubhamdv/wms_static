'use strict';
/*jshint camelcase: false */
angular.module('wmsApp')
    .service('leftMenuService', function() {

        /*Check if Permission is given or not for a module or submodule*/

        this.checkForPermission = function(givenPermission, allowedPermission) {
            var isPermission = false;
            _.each(givenPermission, function(p) {
                _.each(allowedPermission, function(p1) {
                    if (p === p1 || p === 'noPermission') {
                        isPermission = true;
                        return false;
                    }
                });
                if (isPermission) {
                    return false;
                }
            });
            return isPermission;
        };

    });
