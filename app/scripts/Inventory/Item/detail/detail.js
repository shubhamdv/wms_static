'use strict';

angular.module('wmsApp')
    .config(function($routeProvider) {
        $routeProvider
            .when('/item/:serial', {
                templateUrl : 'scripts/Inventory/Item/detail/detail.html',
                controller : 'itemDetailCtrl',
                controllerAs : 'vm',
                title: 'PAGE_TITLE.TITLE13',
                activeParent: 'INVENTORY',
                activeMenu: 'PROD-ITEM',
                activeParentName: 'LEFT_MENU.INVENTORY.PRODUCT_TEXT',
                activeMenuName: 'LEFT_MENU.INVENTORY.SUB_MENU_TEXT2',
                access : {
                    requiredLogin : true,
                    requiredPrecondition : true,
                }
            });
    });
