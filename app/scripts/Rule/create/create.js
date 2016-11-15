(function() {
  'use strict';
  angular.module('wmsApp')
    .config(config);
  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
    $routeProvider
      .when('/rule/create', {
        templateUrl: 'scripts/Rule/create/create.html',
        controller: 'createRuleCtrl',
        controllerAs: 'vm',
        title: 'PAGE_TITLE.RULE.CREAT_RL',
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
