(function() {
    'use strict';
    angular.module('wmsApp')
        .config(config);
    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/receiving/shipment', {
                templateUrl: 'scripts/Receiving/Shipment/shipment.html',
                controller: 'shipmentReceivedCtrl',
                controllerAs: 'vm',
                title: 'PAGE_TITLE.RCV.RCV_SHIP',
                activeParent: 'Receiving',
                activeMenu: 'SHP-RECEIVING',
                activeParentName: 'LEFT_MENU.RCV.MAIN_MENU',
                activeMenuName: 'LEFT_MENU.RCV.SUB_MENU_TEXT3',
                access: {
                    requiredLogin: true,
                    requiredPrecondition: true,
                }
            });
    }
})();