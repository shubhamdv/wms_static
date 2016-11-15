(function() {
  'use strict';
  angular.module('wmsApp')
    .config(config);
  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
    $routeProvider
      .when('/rule/:index', {
        templateUrl: 'scripts/Rule/update/update.html',
        controller: 'updateRuleCtrl',
        controllerAs: 'vm',
        title: 'PAGE_TITLE.RULE.UPDATE_RL',
        activeParent: 'RULE',
        activeMenu: 'CREATE',
        activeParentName: 'LEFT_MENU.RULE.RULE_TEXT',
        activeMenuName: 'LEFT_MENU.RULE.SUB_MENU_TEXT1',
        access: {
          requiredLogin: true,
          requiredPrecondition: true,
        }
      });
  }
})();
