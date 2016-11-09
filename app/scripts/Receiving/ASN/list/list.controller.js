(function() {
    'use strict';
    /* jshint camelcase: false */
    angular.module('wmsApp')
        .controller('manageAsnCtrl', ManageAsnCtrl);
    ManageAsnCtrl.$inject = ['$scope', '$rootScope'];

    function ManageAsnCtrl($scope, $rootScope) {
        var vm = this;
        this.title = 'World';
    }
    
})();