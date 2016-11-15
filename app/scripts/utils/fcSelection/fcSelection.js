(function() {
    'use strict';

    angular.module('wmsApp')
        .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/select/fc', {
                templateUrl: 'scripts/Utils/fcSelection/fcSelection.html',
                controller: 'selectFcCtrl',
                controllerAs: 'vm',
                title: 'PAGE_TITLE.FC_PAGE.FC',
                access: {
                    requiredLogin: true,
                    requiredPrecondition: true,
                    isFulmilmentCenter : true
                }
            });
    }
})();
