(function() {
    'use strict';
    angular.module('wmsApp')
        .config(config);
    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/rules', {
                templateUrl: 'scripts/Rule/list/list.html',
                controller: 'ruleListCtrl',
                controllerAs: 'vm',
                title: 'PAGE_TITLE.RULE.SRCH_RL',
                activeParent: 'RULE',
                activeMenu: 'SEARCH',
                activeParentName: 'LEFT_MENU.RULE.RULE_TEXT',
                activeMenuName: 'LEFT_MENU.RULE.SUB_MENU_TEXT2',
                access: {
                    requiredLogin: true,
                    requiredPrecondition: true,
                }
            });
    }
})();
