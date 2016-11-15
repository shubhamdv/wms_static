(function(){

    'use strict';

    angular.module('wmsApp')
        .service('sessionManagement', SessionManagement);
    SessionManagement.$inject = ['$http', '$cookies', '$location', '$window', '$rootScope', 'settings'];

        function SessionManagement($http, $cookies, $location, $window, $rootScope, settings) {
            var serviceObject = this;
            serviceObject.currentSessionValue = $cookies.get(settings.SESSION_KEY_NAME);

            serviceObject.isSessionSet = isSessionSet;
            serviceObject._setSessionValue = setSessionValue;
            serviceObject.setSessionValueInHeaders = setSessionValueInHeaders;
            serviceObject._deleteSessionValue = deleteSessionValue;
            serviceObject.verifySession = verifySession;
            serviceObject.isProfileDataSet = isProfileDataSet;
            serviceObject.getRandomSessionValue = getRandomSessionValue;
            serviceObject.reNewSession = reNewSession;
            serviceObject.forgetSession = forgetSession;

            ///////////////////////////////////////////

            // boolean flag to check whether session is set in the cookie
            function isSessionSet() {
                return angular.isDefined(serviceObject.currentSessionValue);
            }

            // set session value in the cookies
            function setSessionValue(value) {
                $cookies.put(settings.SESSION_KEY_NAME, value);
                serviceObject.currentSessionValue = value;
                serviceObject.setSessionValueInHeaders();
            }

            // set session value in the headers
            function setSessionValueInHeaders() {
                // Set common headers to be injected for every xhr request
                $http.defaults.headers.common[settings.SESSION_KEY_NAME] =
                    serviceObject.currentSessionValue;
            }

            // delete session value from the cookie
            function deleteSessionValue() {
                $cookies.remove(settings.FC_NUM);
                $cookies.remove(settings.FC_SK);
            }

            // verify saved sessionkey in the cookies
            function verifySession() {
                // return http promise object handling session verification
                return $http.head(settings.API_URI.VERIFY_SESSION);
            }

            function isProfileDataSet() {
                return $http({
                    'url': settings.API_URI.USER_PROFILE,
                    'method': 'GET'
                });
            }

            // generates random id usable as session value
            // starting with the session value prefix
            // from settings
            function getRandomSessionValue() {
                // Function to generate random id
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return (function() {
                    return settings.SESSION_VALUE_PREFIX + s4() + s4() + s4() + s4() +
                        s4() + s4() + s4() + s4();
                })();
            }

            // renews session stored in the cookies
            function reNewSession() {

                // delete any old session key saved
                serviceObject._deleteSessionValue();
                // set newly generated session value in the cookie and in headers
                serviceObject._setSessionValue(serviceObject.getRandomSessionValue());
            }

            // forgets authenticated session;
            function forgetSession() {

                // return mature http promise object handling forget action
                return $http.delete(settings.API_URI.LOGOUT)
                    .success(function() {
                        // renew session
                        serviceObject.reNewSession();
                        $cookies.remove('prevUrl');
                        $cookies.remove(settings.FC_NUM);
                        $cookies.remove(settings.FC_SK);
                        $cookies.remove('isLogged');
                        delete $rootScope.fcDetail;
                        delete $rootScope.prevUrl;
                        $rootScope.permissions = null;
                        // redirect to location in the settings for post logout action
                        $location.path(settings.POST_LOGOUT_LOCATION);
                    })
                    .error(function(error) {
                        // uhhuhh.. could not logout
                        if ($location.path() === '/login-gid/callback') {
                            return false;
                        } else {
                            $window.alert(error ? error.message : 'ERR3');
                            $location.path(settings.ROUTES.SELECT_FC_URL)
                                .search({
                                    logoutSuccess: false
                                });
                        }
                    });
            }
        }
})();
