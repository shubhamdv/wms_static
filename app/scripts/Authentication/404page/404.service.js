(function(){
    'use strict';

    angular.module('wmsApp')
        .service('pageNotFoundService', PageNotFoundService);
    PageNotFoundService.$inject = ['$http', 'settings'];
    
    function PageNotFoundService($http, settings) {
    }
})();