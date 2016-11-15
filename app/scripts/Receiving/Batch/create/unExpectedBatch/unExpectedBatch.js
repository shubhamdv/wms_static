'use strict';

angular.module('wmsApp')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/procurement/batch/create/unexpected', {
                templateUrl : 'scripts/Receiving/Batch/create/unExpectedBatch/unExpectedBatch.html',
                controller : 'CreateUnExpctedBatchCtrl',
                title : 'PAGE_TITLE.TITLE7',
                activeParent : 'BATCH',
                activeMenu : 'BATCH-UNEXP',
                activeParentName : 'LEFT_MENU.BATCH.BATCH_TEXT',
                activeMenuName : 'LEFT_MENU.BATCH.SUB_MENU_TEXT1',
                access : {
                    requiredLogin : true,
                    requiredPrecondition : true
                }
            }
        );
    }
);
