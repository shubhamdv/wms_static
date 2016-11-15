(function() {
    'use strict';
    angular.module('wmsApp')
        .config(config);
    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/asn/:id', {
                templateUrl: 'scripts/Receiving/ASN/detail/detail.html',
                controller: 'asnDetailCtrl',
                controllerAs: 'vm',
                title: 'PAGE_TITLE.RCV.ASN_DETAIL',
                activeParent: 'Receiving',
                activeMenu: 'ASN-LIST',
                activeParentName: 'LEFT_MENU.RCV.MAIN_MENU',
                activeMenuName: 'LEFT_MENU.RCV.SUB_MENU_TEXT2',
                access: {
                    requiredLogin: true,
                    requiredPrecondition: true,
                }
            });
    }
})();