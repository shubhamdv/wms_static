(function() {
    'use strict';
    angular.module('wmsApp')
        .config(config);
    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/batches', {
                templateUrl: 'scripts/Receiving/Batch/list/list.html',
                controller: 'manageBatchCtrl',
                controllerAs: 'vm',
                title: 'PAGE_TITLE.RCV.SEARCH_BATCH',
                activeParent: 'Receiving',
                activeMenu: 'BATCH-MNG',
                activeParentName: 'LEFT_MENU.RCV.MAIN_MENU',
                activeMenuName: 'LEFT_MENU.BATCH.SUB_MENU_TEXT3',
                access: {
                    requiredLogin: true,
                    requiredPrecondition: true,
                }
            });
    }
})();
