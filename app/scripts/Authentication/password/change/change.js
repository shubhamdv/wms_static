(function(){
    'use strict';

    angular.module('wmsApp')
        .config(router);
    router.$inject = ['$routeProvider'];

    function router($routeProvider) {
        $routeProvider
            .when('/password/change', {
                templateUrl: 'scripts/Authentication/password/change/change.html',
                controller: 'ChangePasswordCtrl',
                controllerAs: 'vm',
                title: 'CHANGE_PASSWORD_PAGE.PAGE_TITLE',
                access: {
                    requiredLogin: true,
                    requiredStation: false,
                    requiredPrecondition: true
                }
            });
    }

})();
