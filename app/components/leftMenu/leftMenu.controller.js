(function() {

    'use strict';

    angular.module('wmsApp')
        .controller('LeftMenuCtrl', LeftMenuCtrl);

    LeftMenuCtrl.$inject = ['$rootScope', 'settings', 'leftMenuService', '$location', '$route'];

    function LeftMenuCtrl($rootScope, settings, leftMenuService, $location, $route) {
        var vm = this;

        /*Making list for left menu bar on basis of permission given*/
        vm.leftMenu = settings.LEFT_MENU;

        vm.hasPermissions = hasPermissions;
        vm.targetPage = targetPage;

        activate();

        //////////////////

        function activate() {
            _.each(vm.leftMenu, function(menu, idx) {
                menu.subLinks = [];
                var _submenu = menu.submenu;
                if(_submenu && _submenu.length) {
                    var _count = _submenu.length;
                    var _idx;
                    for(_idx=0; _idx < _count; _idx++) {
                        menu.subLinks.push(_submenu[_idx].link);
                    }
                }
            });
        }

        /*TO change left menu bar permissions when fc change;*/
        $rootScope.$on('fcChange', function(event, arg) {
            $rootScope.permissions = arg.permissions;
        });

        /*Check if Permission is given or not for a module or submodule*/
        function hasPermissions(permissions) {
            return leftMenuService.checkForPermission(permissions, $rootScope.permissions);
        };

        function targetPage(event, link){
            if(event.metaKey || event.ctrlKey) {
                return;
            }

            if( $location.path() === link ){
                $route.reload();
            } else {
                $location.path(link);
            }

        };
    }
})();
