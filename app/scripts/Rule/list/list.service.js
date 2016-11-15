(function() {
    'use strict';
    /*jshint camelcase: false */
    angular.module('wmsApp')
        .service('ruleListService', RuleListService);
    RuleListService.$inject = ['$http', 'settings'];

    function RuleListService($http, settings) {
        this.getRuleList = getRuleList;

        /////////////////////////////////

        function getRuleList(data) {
            return $http({
                'url': settings.API_URI.RULE_SEARCH_LIST,
                'method': 'POST',
                'data': data,
            });

        }

    }


})();
