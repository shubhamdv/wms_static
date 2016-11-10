(function() {
    'use strict';
    angular.module('wmsApp').controller('ChangePasswordCtrl', ChangePasswordCtrl);

    ChangePasswordCtrl.$inject = ['$scope', 'changePasswordService', 'sessionManagement', '$timeout', 'settings'];

    function ChangePasswordCtrl($scope, changePasswordService, sessionManagement, $timeout, settings) {
        var vm = this;
        var timeCount = settings.PASS_CHANGE_SUCCESS_TIMEOUT; //In seconds
        
        
        vm.regex = '^(?=.*[a-z])(?=.*[A-Z]).+$';
        vm.showSuccessMessage = false;
        vm.errormessage = 'FORGOT_PASSWORD_PAGE.H1';
        vm.userData = {};
        vm.showErrorMessage = false;
        vm.isMatch = true;

        var originalSetInterval = window.setInterval;
        vm.changePassword = changePassword;
        vm.matchPass = matchPass;

        ///////////////////////////////////////////////
        
        //Modifying original setinterval
        
        window.setInterval = function(fn, delay, runImmediately) {
            if (runImmediately) {
                fn();
            }
            originalSetInterval(fn, delay);
        };

        function decrementCounter() {
            //Angular is not seeing changes here, applying timeout
            $timeout(function() {
                vm.redirectionMsg = $scope.$eval(" 'CHANGE_PASSWORD_PAGE.P2' | translate").replace('<time>', timeCount);
                timeCount = Math.max(timeCount - 1, 0);
            });
        }

        function changePassword() {
            changePasswordService.changePassword(vm.userData)
                .success(sucessOnPasswordChnage).error(handleError);
        }

        function successOnPasswordChange() {
            vm.showErrorMessage = false;
            vm.showSuccessMessage = true;
            var timerInterval = window.setInterval(decrementCounter, 1000, true); //Create counter interval
            $timeout(function() {
                window.clearInterval(timerInterval); //Clear the counter interval
                sessionManagement.forgetSession();
            }, 1000 * timeCount);
        }

        function handleError(data) {
            vm.errormessage = (data.current_password) ? data.current_password[0] : (data.email ? data.email.toString() : 'FORGOT_PASSWORD_PAGE.ERR4');
            vm.showSuccessMessage = false;
            vm.showErrorMessage = true;
        }

        function matchPass() {
            if (vm.userData.newPass === vm.userData.confirmPass) {
                vm.isMatch = true;
            } else {
                vm.isMatch = vm.userData.confirmPass ? false : true;
            }
        };
    }
})();