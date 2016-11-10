(function(){
    'use strict';
    /* jshint camelcase: false */
    angular.module('wmsApp')
        .controller('pageNotFoundCtrl', PageNotFoundCtrl);
    PageNotFoundCtrl.$inject = ['$scope', '$rootScope', '$location'];

    function PageNotFoundCtrl($scope, $rootScope, $location){
    	var vm = this;
    	vm.redirectPage = redirectPage;

    	/////////////////////////////////////////
    	
    	function redirectPage(){
    		if(!$rootScope.fcNum){
    			$location.path('/select/fc');
    		} else {
    			$location.path($rootScope.profileData.default_landing_page);
    		}
    	}
    }
})();