(function(){
    'use strict';

    angular.module('wmsApp')
        .config(router);
    router.$inject = ['$routeProvider'];

    function router($routeProvider) {
        $routeProvider
            .when('/password/recovery', {
                templateUrl: 'scripts/Authentication/password/forgot/forgot.html',
                controller: 'ForgotPasswordCtrl',
                controllerAs: 'vm',
                title: 'PAGE_TITLE.F_PASS_PAGE.FORGOT_PASSWORD',
                access: {
                    requiredLogin: false,
                    requiredStation: false
                }
            });
    }
})();

