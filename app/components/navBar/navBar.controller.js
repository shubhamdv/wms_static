'use strict';
/* jshint camelcase: false */

angular.module('wmsApp')
    .controller('NavbarCtrl', function($scope, $location, sessionManagement, navBarService, settings, $rootScope, $window, $cookies, $route, genericService) {

        $scope.isStationPage = false;
        if ($location.path() === settings.ROUTES.SELECT_FC_URL) {
            $scope.hideIcon = true;
        } else {
            $scope.hideIcon = false;
        }

        if (($location.path() !== settings.ROUTES.GOOGLE_OAUTH_URL) &&
            ($location.path() !== settings.ROUTES.SELECT_FC_URL)) {
            $scope.isStationPage = true;
        }

        $scope.logout = function() {
            sessionManagement.forgetSession();
        };

        $scope.resetFC = function(data) {
            var fcData = {
                sk: data.sk[0],
                name: data.name[0],
                fulfillment_center_num: data.fulfillment_center_num[0]
            };
            $cookies.put(settings.FC_NUM, data.fulfillment_center_num);
            $cookies.put(settings.FC_SK, data.sk);
            $rootScope.fcNum = data.fulfillment_center_num;
            /*Reset fulfillment center and store detail in session*/

            navBarService.getUserPermission(fcData)
                .success(function(response) {
                    $rootScope.fcDetail = fcData;
                    $rootScope.$broadcast('fcChange', {
                        permissions: response.data
                    });
                    if (!$scope.profileData.default_landing_page || settings.DEFAULT_LANDING_URL_MAP[$scope.profileData.default_landing_page]) {
                        $location.path('/select/station');
                        $route.reload();
                    } else {
                        $location.path($scope.profileData.default_landing_page.trim());
                    }
                })
            // Bad credentials sent, ok let's inform to try again
            .error(function() {
                $window.alert('Some error occurred. Please try again later.');
            });
        };

        $scope.getFC = function(typed) {
            var data = {
                query: typed,
                model_name: 'FC',
                noModeRequired: true
            };
            genericService.getAutoCompleteData(data).then(function(res) {
                var data = res.data;
                if(_.isArray(data.data) && !_.isEmpty(data.data)){
                    $scope.fcAutoData = res.data.data;
                } else{
                    $scope.fcAutoData = '';
                    $scope.norecord = true;
                }
            })
            .catch(function(){
                $scope.fcAutoData = '';
                $scope.norecord = true;
            });
        };
    });
