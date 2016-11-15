(function() {
    'use strict';

    angular.module('wmsApp')
        .config(config);
    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        var templateOblect = {
            templateUrl: 'scripts/Inventory/manageProduct/detail/detail.html',
            controller: 'productDetailCtrl',
            controllerAs: 'vm',
            title: 'PAGE_TITLE.TITLE14',
            activeParent: 'INVENTORY',
            activeMenu: 'PROD',
            activeParentName: 'LEFT_MENU.INVENTORY.PRODUCT_TEXT',
            activeMenuName: 'LEFT_MENU.INVENTORY.SUB_MENU_TEXT2',
            access: {
                requiredLogin: true,
                requiredPrecondition: true,
            }
        };

        $routeProvider
            .when('/product/:master_prod_sk', templateOblect)
            .when('/product/:master_prod_sk/:child_prod_sk', templateOblect);
    }
})();