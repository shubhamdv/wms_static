(function() {
    'use strict';
    angular.module('wmsApp')
        .config(config);
        
    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/item', {
                templateUrl: 'scripts/Inventory/Item/list/list.html',
                controller: 'manageItemCtrl',
                controllerAs: 'vm',
                title: 'PAGE_TITLE.TITLE13',
                activeParent: 'INVENTORY',
                activeMenu: 'PROD-ITEM',
                activeParentName: 'LEFT_MENU.INVENTORY.PRODUCT_TEXT',
                activeMenuName: 'LEFT_MENU.INVENTORY.SUB_MENU_TEXT3',
                access: {
                    requiredLogin: true,
                    requiredPrecondition: true,
                }
            });
    }
})();