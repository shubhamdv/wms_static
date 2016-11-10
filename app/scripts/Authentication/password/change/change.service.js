(function(){
    'use strict';
    /* jshint camelcase: false */
    angular.module('wmsApp')
        .service('changePasswordService', ChangePasswordService);
    ChangePasswordService.$inject = ['$http', 'settings'];
    
    function ChangePasswordService($http, settings) {
        this.changePassword = changePassword;

        ///////////////////////////////////////////

        function changePassword(data) {
            // return http promise object attempting changePassword
            return $http({
                'url': settings.API_URI.CHANGE_PASSWORD,
                'method': 'POST',
                'data': {
                    password1: data.newPass,
                    password2: data.confirmPass,
                    current_password: data.currentPass
                }
            });
        }

    }
})();
