(function(){
    'use strict';
    /* jshint camelcase: false */
    angular.module('wmsApp')
        .controller('ForgotPasswordCtrl', ForgotPasswordCtrl);
    ForgotPasswordCtrl.$inject = ['$scope', '$location', 'forgotPasswordService', '$rootScope'];

    function ForgotPasswordCtrl($scope, $location, forgotPasswordService, $rootScope) {
        var vm = this;
        var siteUrl = 'https://' + $location.host();
            
        vm.showSuccessMessage = false;
        vm.errormessage = 'ERR3';

        vm.recover = recover;

        //////////////////////////////////////

        function recover(data) {
            forgotPasswordService.recover({
                    'site': siteUrl,
                    'locale': $rootScope.locale,
                    'email': data.emailId.$modelValue
                })
                .success(successOnRecover)
                .error(handelError);
        }

        function successOnRecover(){
            vm.showErrorMessage = false;
            vm.showSuccessMessage = true;
        }

        function handleError(data){
            vm.showSuccessMessage = false;
            vm.showErrorMessage = true;
            if (data.errors) {
                vm.errormessage = data.errors[0].error_message;
            } else if (data.detail) {
                vm.errormessage = data.detail;
            } else {
                vm.errormessage = data.message || 'ERR3';
            }
        }

    }
})();

