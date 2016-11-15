'use strict';

angular.module('wmsApp')
    .config(function($routeProvider) {
        $routeProvider
            .when('/procurement/asn/:id/history', {
                templateUrl: 'scripts/Receiving/Batch/history/history.html',
                controller: 'batchHistoryCtrl',
                title: 'PAGE_TITLE.TITLE4',
                activeParent: 'ASN',
                activeMenu: 'ASN-MNG',
                activeParentName: 'LEFT_MENU.ASN.ASN_TEXT',
                activeMenuName: 'LEFT_MENU.ASN.SUB_MENU_TEXT2',
                access: {
                    requiredLogin: true,
                    requiredPrecondition: true,
                }
            });
    });
