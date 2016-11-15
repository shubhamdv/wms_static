(function() {
    'use strict';
    angular.module('wmsApp')
        .config(config);
    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/receiving/item', {
                templateUrl: 'scripts/Receiving/Item/item.html',
                controller: 'itemReceivingCtrl',
                controllerAs: 'vm',
                title: 'PAGE_TITLE.RCV.RCV_ITEM',
                activeParent: 'Receiving',
                activeMenu: 'ITEM-RECEIVING',
                activeParentName: 'LEFT_MENU.RCV.MAIN-MENU',
                activeMenuName: 'LEFT_MENU.RCV.SUB_MENU_TEXT4',
                access: {
                    requiredLogin: true,
                    requiredPrecondition: true,
                }
            });
    }
})();