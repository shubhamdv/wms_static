(function() {
    'use strict';

    angular.module('wmsApp')
        .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/product', {
                templateUrl: 'scripts/Inventory/manageProduct/list/list.html',
                controller: 'productListCtrl',
                controllerAs: 'vm',
                title: 'PAGE_TITLE.TITLE14',
                activeParent: 'INVENTORY',
                activeMenu: 'PROD',
                activeParentName: 'LEFT_MENU.INVENTORY.PRODUCT_TEXT',
                activeMenuName: 'LEFT_MENU.INVENTORY.SUB_MENU_TEXT1',
                access: {
                    requiredLogin: true,
                    requiredPrecondition: true,
                }
            });
    }
})();