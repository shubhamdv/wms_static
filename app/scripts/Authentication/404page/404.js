(function(){
    'use strict';
    angular.module('wmsApp')
        .config(config);
    config.$inject = ['$routeProvider']
        function config($routeProvider) {
            $routeProvider
                .when('/404-not-found', {
                    templateUrl: 'app/Authentication/404page/404.html',
                    controller: 'pageNotFoundCtrl',
                    controllerAs : 'vm',
                    title: 'PAGE_TITLE.PAGE_404',
                    access: {
                        requiredLogin: true,
                        requiredPrecondition: true
                    }
                });
        }
})();
