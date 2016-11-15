(function() {
  'use strict';
  /*jshint camelcase: false */
  angular.module('wmsApp')
    .service('createRuleService', CreateRuleService);
  CreateRuleService.$inject = ['$http', 'settings'];

  function CreateRuleService($http, settings) {
    this.getAttributesFromPCM = getAttributesFromPCM;
    this.getReasonsAndInstructions = getReasonsAndInstructions;
    this.createRule = createRule;

    /////////////////////////////////
    function getAttributesFromPCM(params) {
      return $http({
        'url': settings.API_URI.PCM_ATTRIBUTE_LISTING,
        'method': 'GET',
        'params': params,
      });

    }

    function getReasonsAndInstructions(type) {
      var params = {
        version: '0.1',
        type: type
      };
      return $http({
        'url': settings.API_URI.GODAM_INSTRUCTIONS,
        'method': 'GET',
        'params': params,
      });
    }

    function createRule(data) {
      return $http({
        'url': settings.API_URI.RULE_CREATE,
        'method': 'POST',
        'data': data
      });
    }

  }


})();
