(function(){
    'use strict';

    angular.module('wmsApp')
        .config(router);
    router.$inject = ['$routeProvider'];
    function router($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'scripts/Authentication/login/login.html',
                resolve: { 
                    "check" : check
                },
                controller: 'LoginCtrl',
                controllerAs: 'vm',
                title: 'LOGIN_PAGE.PAGE_TITLE',
                access: {
                    requiredLogin: false
                }
            });
            
            check.$inject = ['$location', 'sessionManagement', '$cookies', 'settings'];
                function check($location, sessionManagement, $cookies, settings){
                    if(sessionManagement.isSessionSet() && $cookies.get(settings.FC_NUM)){
                        $location.path('/asn');
                    } else if( sessionManagement.isSessionSet() && !$cookies.get(settings.FC_NUM) && $cookies.get('isLogged') ) { 
                        $location.path('/select/fc');
                    }
                }
        }
})();