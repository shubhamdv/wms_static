// 'use strict';

// angular
//   .module('wmsApp', [
//     'ngAnimate',
//     'ngCookies',
//     'ngResource',
//     'ngRoute',
//     'ngSanitize',
//     'ngTouch'
//   ])
//   .config(function ($routeProvider) {
//     $routeProvider
//       .when('/', {
//         templateUrl: 'views/main.html',
//         controller: 'MainCtrl',
//         controllerAs: 'main'
//       })
//       .when('/about', {
//         templateUrl: 'views/about.html',
//         controller: 'AboutCtrl',
//         controllerAs: 'about'
//       })
//       .otherwise({
//         redirectTo: '/'
//       });
//   });


(function(){
    'use strict';

    angular.module('wmsApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ui.bootstrap',
        'pascalprecht.translate',
        'angular-loading-bar',
        'focus-if',
        'ngTagsInput',
        'daterangepicker',
        '720kb.datepicker',
        'cfp.hotkeys',
        'LocalStorageModule',
    ])
    .config(config)
    .run(run);

    config.$inject = [ '$routeProvider', '$locationProvider', '$httpProvider', 'cfpLoadingBarProvider', 'localStorageServiceProvider'];

    function config($routeProvider, $locationProvider, $httpProvider, cfpLoadingBarProvider, localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('GM');
        $routeProvider
            .otherwise('/');
        // $locationProvider.html5Mode({
        //     enabled: false,
        //     requireBase: false
        // });
        $locationProvider.html5Mode(true);

        cfpLoadingBarProvider.includeSpinner = true;
        cfpLoadingBarProvider.includeBar = true;

        $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
            return {
                responseError: function(response) {
                    // Check precondition is satisfy or not
                    if (response.status === 403 && response.config.method === 'HEAD') {
                        console.log("In app.js redirecting to fc");
                        $location.path('/select/fc');
                    }
                    // login or not
                    else if (response.status === 401 && response.config.method !== 'HEAD') {
                        $location.path('/login');
                    }
                    return $q.reject(response);
                }
            }
        }]);
    }

    run.$inject = ['$http', '$location', '$rootScope', '$translate', '$cookies', 'settings', 'sessionManagement'];
    function run($http, $location, $rootScope, $translate, $cookies, settings, sessionManagement) {
        $rootScope.$on('$routeChangeStart', function(event, nextRoute, previous) {
            var loc = $location.url(),
                index = loc.indexOf('?');

            if (index > 0) {
                $rootScope.authParam = nextRoute.params.authParam;
                $rootScope.userName = nextRoute.params.userName;
                $location.url($location.path());
                return false;
            }

            if($location.path() === '/'){
                console.log('222227777777777777777');
                $location.path('/login');
            }

            /*No need to verify session after google auth callback*/
            if ($location.path() === '/account/google-oauth2') {
                return false;
            }

            if(previous && previous.$$route) {
                var _prevUrl = previous.$$route.originalPath;
                $cookies.put('prevUrl', _prevUrl);
                $rootScope.prevUrl = _prevUrl;
            }

            $rootScope.route = nextRoute.$$route;

            if (nextRoute && nextRoute.access) {
                $rootScope.fcNum = $cookies.get(settings.FC_NUM);
                $rootScope.fcSk = $cookies.get('fcSk');
                if (sessionManagement.isSessionSet()) {
                    sessionManagement.setSessionValueInHeaders();
                    if( ['/login'].indexOf( $location.path() ) < 0) {
                        sessionManagement.verifySession()
                            .success(verificationSuccess)
                            .error(verificationError);
                    }
                } else {
                    console.log("1111111111111111");
                    $location.path('/login');
                }
            }

            //////////////////////////////////////////////////////

            function checkStation(){
                if (!$rootScope.station && settings.DEFAULT_LANDING_URL_MAP[$location.path().trim()]) {
                    $location.path('/select/station');
                }
            }

            function verificationSuccess(res){
                $cookies.put('isLogged', true);
                if (nextRoute.access.requiredLogin) {
                    preConditionCheck();
                } else {
                    setDataError();
                }
            }

            function preConditionCheck (){
                var permissions = $rootScope.permissions && $rootScope.permissions.length > 0;
                if (nextRoute.access.requiredPrecondition && !permissions) {
                    sessionManagement.isProfileDataSet()
                    .success(setDataSuccess)
                    .error(setDataError);
                } else {
                    checkStation();
                }
            }

            function setDataSuccess(data) {
                $rootScope.fcDetail = data.fcDetail ? JSON.parse(data.fcDetail) : null;
                $rootScope.permissions = data.userPermission ? data.userPermission.split(',') : [];
                $rootScope.profileData = data.client ? JSON.parse(data.client).data[0] : '';
                $rootScope.station = data.station ? data.station : null;
                $rootScope.locale = data.locale;
                $translate.use(data.locale);
                if (typeof $rootScope.profileData === 'object') {
                    _.each(settings.ROUTES, function(item) {
                        if (item === $location.path()) {
                            $location.url(item).replace();
                            return false;
                        }
                    });
                    checkStation();
                } else {
                    console.log("333333333333333");
                    $location.path('/login').replace();
                    setDataError();
                }
            }

            function verificationError(response, status) {
                var isRestricted = false;
                console.log(response)
                if (status === 401) {
                    if( settings.NON_RESTRICTED_URLS.indexOf($location.path()) < 0 ) {
                        console.log("55555555555555")
                        $location.path('/login');
                    }
                } else {
                    setDataError();
                }
            }

            function setDataError(){
                console.log('hererereez the buggggg')
                sessionManagement.forgetSession();
            }
        });
        // It can be easily used in templates.
        $rootScope.location = $location;
        // $rootScope.$broadcast('loading-complete');
    }
})();

