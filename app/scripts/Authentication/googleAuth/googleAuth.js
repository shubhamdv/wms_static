(function() {
    'use strict';

    angular.module('wmsApp')
        .config(router);

    router.$inject = [ '$routeProvider' ];

    function router($routeProvider) {
        $routeProvider.when('/account/google-oauth2', {
            templateUrl: 'app/Authentication/googleAuth/googleAuth.html',
            controller: 'GoogleAuthCtrl',
            controllerAs: 'googleAuth',
            title: 'HOME_PAGE.PAGE_TITLE',
            access: {
                requiredLogin: false,
                requiredStation: false
            }
        });
    }
})();