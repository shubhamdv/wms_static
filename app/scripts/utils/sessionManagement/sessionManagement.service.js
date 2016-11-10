(function(){

    'use strict';

    angular.module('wmsApp')
        .service('sessionManagement', SessionManagement);
    SessionManagement.$inject = ['$http', '$cookies'];

    function SessionManagement($http, $cookies) {
        var serviceObject = this;

        serviceObject.isSessionSet = isSessionSet;
        serviceObject.setSessionValueInHeaders = setSessionValueInHeaders;

        ///////////////////////

        function isSessionSet() {
            return false;
        }

        function setSessionValueInHeaders() {
            return false;
        }
    }
})();
