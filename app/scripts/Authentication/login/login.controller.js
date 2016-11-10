(function(){
    'use strict';
    /* jshint camelcase: false */
    angular.module('wmsApp')
        .controller('LoginCtrl', LoginCtrl);
    LoginCtrl.$inject = ['$scope', '$location', '$rootScope', '$window', '$cookies', 'loginService', 'sessionManagement'];    
        
    function LoginCtrl($scope, $location, $rootScope, $window, $cookies, loginService, sessionManagement) {
        var vm = this;

        vm.user = {};
        vm.errorMsg = 'LOGIN_PAGE.ERR1';
        vm.isInvalid = false;

        vm.googleAuth = googleAuth;
        vm.submit = submit;
        activate();

        /////////////////////////////////////


        function activate() {
            if( $cookies.get('isLogged') === 'false' || !$cookies.get('isLogged') ){
                sessionManagement.reNewSession();
            }
        }

        function googleAuth() {
            loginService.googleAuth($rootScope.locale)
            .success(function(data) {
                $window.location = data.url;
            })
            .error(handleError);
        }

        function submit() {
            vm.user.locale = $rootScope.locale;
            loginService.login(vm.user)
            .success(successOnSubmit)
            .error(handleError);
        }
        function successOnSubmit(data) {
            $location.path(data.url);
            $cookies.put('isLogged', true);
        }

        function handleError(error) {
            vm.isInvalid = true;
            if (typeof error.message !== 'undefined') {
                vm.errorMsg = error.message;
            }
            if (error.errors) {
                vm.errorMsg = data.errors[0].error_message;
            } else if (error.detail) {
                vm.errorMsg = data.detail;
            } else {
                vm.errorMsg = data.non_field_errors ? data.non_field_errors[0] : (data.message || 'ERR3');
            }
        }
    }
})();
