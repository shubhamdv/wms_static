(function(){
	'use strict';

	angular.module('wmsApp')
	    .service('forgotPasswordService', forgotPasswordService);
	forgotPasswordService.$inject = ['$http', 'settings'];
	    
    function forgotPasswordService($http, settings) {
    	this.recover = recover;

    	/////////////////////////////

        function recover(data) {
            return $http.post(settings.API_URI.FORGOT_PASSWORD, data);
        }
    }
})();

