(function() {
  'use strict';
  /*jshint camelcase: false */
  angular.module('wmsApp')
    .service('updateRuleService', UpdateRuleService);
  UpdateRuleService.$inject = ['$http', 'settings'];

  function UpdateRuleService($http, settings) {
    this.updateRule = updateRule;

    /////////////////////////////////
    function updateRule(data) {
      return $http({
        'url': settings.API_URI.RULE_UPDATE,
        'method': 'PUT',
        'data': data
      });
    }

  }


})();
