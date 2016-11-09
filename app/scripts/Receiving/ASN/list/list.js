(function() {
    'use strict';
    angular.module('wmsApp')
        .config(config);
    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/asn', {
                templateUrl: 'scripts/Receiving/ASN/list/list.html',
                controller: 'manageAsnCtrl',
                controllerAs: 'vm'
            });
    }
})();