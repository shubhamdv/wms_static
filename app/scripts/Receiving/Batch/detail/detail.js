(function() {
    'use strict';
    angular.module('wmsApp')
        .config(config);
    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/batch/:number', {
                templateUrl: 'scripts/Receiving/Batch/detail/detail.html',
                controller: 'batchDetailCtrl',
                controllerAs: 'vm',
                title: 'PAGE_TITLE.RCV.BATCH_DETAIL',
                activeParent: 'Receiving',
                activeMenu: 'BATCH-MNG',
                activeParentName: 'LEFT_MENU.RCV.MAIN_MENU',
                activeMenuName: 'LEFT_MENU.RCV.SUB_MENU_TEXT3',
                access: {
                    requiredLogin: true,
                    requiredPrecondition: true,
                }
            });
    }
})();