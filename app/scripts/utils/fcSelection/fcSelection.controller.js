(function() {

    'use strict';

    angular.module('wmsApp')
        .controller('selectFcCtrl', SelectFcCtrl);

    SelectFcCtrl.$inject = ['fcClientService', 'genericService', '$location', 'settings', '$cookies', '$rootScope'];

    function SelectFcCtrl(fcClientService, genericService, $location, settings, $cookies, $rootScope) {
        var vm = this;

        vm.norecord = false;
        vm.error = false;
        /*generic error message for any server error */
        vm.errMsg = 'ERR3';
        vm.fcNames = [];


        vm.setValue = setValue;
        vm.removeTag = removeTag;
        vm.getFC = getFC;
        vm.selectStation = selectStation;
        console.log("in fc");

        ///////////////////////

        function setValue(tag) {
            vm.norecord = false;
            $('.tags input').addClass('hide');
            $rootScope.fcDetail = tag;
            $cookies.put(settings.FC_NUM, tag.fulfillment_center_num);
            $cookies.put(settings.FC_SK, tag.sk);
        };

        $(window).bind('keypress', function(e) {
            if ( e.keyCode === 13 ) {
                $( '#submit' ).click();
            }
        });

        function removeTag(){
          $rootScope.fcDetail = null;
          $('.tags input').removeClass('hide');
          console.log("remove tag");
          $cookies.remove(settings.FC_NUM);
          $cookies.remove(settings.FC_SK);
        };

        // For Auto Complete of FC_SK
        function getFC(typed) {
            var data = {
                query: typed,
                model_name: 'FC',
                noModeRequired: true
            };
            return genericService.getAutoCompleteData(data).then(function(res) {
                var _data = res.data.data;
                if (_data.length > 0) {
                    vm.norecord = false;
                    var tagsData = genericService.tagInputData(_data);
                    return tagsData;
                } else {
                    vm.norecord = true;
                   return [];
                }
            })
            .catch(function(){
                vm.norecord = true;
                return [];
            });
        };

        /*Set fulfillment center and store detail in session after getting user permission*/
        function selectStation() {
            fcClientService.getUserPermission($rootScope.fcDetail)
                .success(function() {
                    if (!$rootScope.profileData.default_landing_page || settings.DEFAULT_LANDING_URL_MAP[$rootScope.profileData.default_landing_page]) {
                        $location.path('/select/station');
                    } else {
                        $location.path($rootScope.profileData.default_landing_page.trim());
                    }
                })
                // Bad credentials sent, ok let's inform to try again
                .error(function(data) {
                    vm.error = true;
                    if (typeof data.errors !== 'undefined') {
                        vm.errMsg = data.errors[0].error_message;
                    } else if (typeof data.message) {
                        vm.errMsg = data.message;
                    }
                });
        };

    }
})();
