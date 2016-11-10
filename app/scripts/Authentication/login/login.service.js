(function(){
    'use strict';

    angular.module('wmsApp')
        .service('loginService', LoginService);
    LoginService.$inject = ['$http', 'settings'];

    function LoginService($http, settings) {
        this.googleAuth = googleAuth;
        this.login = login;

        ///////////////////////////////

        function googleAuth(locale) {
            // return http promise object attempting authentication
            return $http.post(settings.API_URI.LOGIN_GID, {
                data: {
                    locale: locale
                }
            });
        }

        function login(data) {
            // return http promise object attempting authentication
            return $http({
                'url': settings.API_URI.LOGIN,
                'method': 'POST',
                'data': data,
            });
        }
    }
})();