(function(){
'use strict';

    angular.module('wmsApp')
        .service('resetPasswordService', resetPasswordService);

        resetPasswordService.$inject = ['$http', 'settings'];

        function resetPasswordService($http, settings) {
            this.recover = recover;
            this.validateToken = validateToken;

            ////////////////////////////

            function recover(data) {
                return $http.post(settings.API_URI.RESET_PASSWORD, data);
            }

            function validateToken(params) {
                return $http({
                    url: settings.API_URI.VALIDATE_TOKEN,
                    method: 'GET',
                    params: params
                });
            }
        }
})();
