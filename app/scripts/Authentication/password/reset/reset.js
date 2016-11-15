(function(){
	'use strict';

	angular.module('wmsApp')
	    .config(router);
	router.$inject = ['$routeProvider'];

    function router($routeProvider) {
        $routeProvider
            .when('/:lang/password/reset/:token', {
                templateUrl: 'scripts/Authentication/password/reset/reset.html',
                controller: 'ResetPasswordCtrl',
                controllerAs: 'vm',
                title: 'RESET_PASSWORD_PAGE.PAGE_TITLE'
            });
    }
})();
