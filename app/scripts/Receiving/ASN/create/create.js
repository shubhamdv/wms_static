'use strict';

angular.module('wmsApp')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/asn/create', {
                templateUrl : 'scripts/Receiving/ASN/create/create.html',
                controller : 'CreateAsnCtrl',
                title : 'PAGE_TITLE.RCV.CRE_ASN',
                activeParent : 'Receiving',
                activeMenu : 'ASN-CRT',
                activeParentName : 'LEFT_MENU.RCV.MAIN_MENU',
                activeMenuName : 'LEFT_MENU.RCV.SUB_MENU_TEXT1',
                access : {
                    requiredLogin : true,
                    requiredPrecondition : true
                }
            }
        );
    }
);
