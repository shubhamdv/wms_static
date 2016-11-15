'use strict';

angular.module('wmsApp')
    .config(function($routeProvider) {
        $routeProvider
            .when('/product/item/:serial/changelog', {
                templateUrl: 'scripts/Inventory/Item/changelog/changelog.html',
                controller: 'itemChangeLogCtrl',
                title: 'PAGE_TITLE.TITLE13',
                activeParent: 'PRODUCT',
                activeMenu: 'PROD-ITEM',
                activeParentName: 'LEFT_MENU.PRODUCT.PRODUCT_TEXT',
                activeMenuName: 'LEFT_MENU.PRODUCT.SUB_MENU_TEXT2',
                access: {
                    requiredLogin: true,
                    requiredPrecondition: true,
                }
            });
    });
