(function(){
'use strict';
    /*jshint camelcase: false */
    angular.module('wmsApp')
        .controller('ResetPasswordCtrl', ResetPasswordCtrl);
    ResetPasswordCtrl.$inject = ['$scope', '$location', 'resetPasswordService', '$routeParams', '$translate'];

    function ResetPasswordCtrl($scope, $location, resetPasswordService, $routeParams, $translate) {
        var vm = this;
        var siteUrl = 'https://' + $location.host();
        var token = $routeParams.token;
        $translate.use($routeParams.lang);

        vm.user = {};
        vm.errMsg = 'ERR3';
        vm.regex = '^(?=.*[a-z])(?=.*[A-Z]).+';
        vm.error = false;
        vm.showSuccessMessage = false;
        vm.isMatch = true;
        vm.isValidToken = true;
        vm.notValidTokenMsg = 'ERR_MSG.MSG9';

        vm.matchPass = matchPass;
        vm.recover = recover;
        validateToken();

        /////////////////////////////

        function matchPass() {
            if(vm.user.newpwd === vm.user.oldpwd){
                vm.isMatch = true;
            }else{
                vm.isMatch = vm.user.newpwd ? false : true;
            }
        }

        function validateToken(){
            var params = {token: token, locale: $routeParams.lang};
            resetPasswordService.validateToken(params)
                .success(function() {
                    vm.isValidToken = true;
                }).error(handleError.bind(null, 'validToken'));
        }

        function recover() {
            resetPasswordService.recover({
                  'site': siteUrl,
                  'locale':  $routeParams.lang,
                  'token': token,
                  'password1': vm.user.oldpwd,
                  'password2': vm.user.newpwd
                })
                .success(function() {
                    vm.error = false;
                    vm.showSuccessMessage = true;
                }).error(handleError.bind(this, 'recoverPassword'));
        }

        function handleError(errorFrom, response) {
            if(errorFrom === 'validToken') {
                vm.isValidToken = false;
                if (response.errors) {
                    vm.notValidTokenMsg = response.errors[0].error_message;
                } else if (response.detail) {
                    vm.notValidTokenMsg = response.detail;
                } else {
                    vm.notValidTokenMsg = response.message || 'ERR_MSG.MSG9';
                }
            } else if(errorFrom === 'recoverPassword'){
                vm.error = true;
                if (response.errors) {
                    vm.errMsg = response.errors[0].error_message;
                } else if (response.detail) {
                    vm.errMsg = response.detail;
                } else {
                    vm.errMsg = response.message ? response.message : (response.email ? response.email.toString() : 'ERR3');
                }
            }
        }
    }
})();