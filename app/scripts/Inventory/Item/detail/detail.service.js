(function() {
    'use strict';
    /*jshint camelcase: false */
    angular.module('wmsApp')
        .service('itemDetailService', ItemDetailService);
    ItemDetailService.$inject = ['$http', 'settings'];

    function ItemDetailService($http, settings) {
        this.getItemDetail = getItemDetail;
        this.getItemProDetail = getItemProDetail;
        this.getManageLookUp = getManageLookUp;
        this.updateAttr = updateAttr;

        //////////////////////////////////////////

        function getItemDetail(params) {
            // return http promise object attempting authentication
            return $http({
                'url': settings.API_URI.GET_QC_ITEM,
                'method': 'GET',
                'params': params
            });
        }

        function getItemProDetail(params) {
            return $http({
                'url': settings.API_URI.GET_QC_PROD_DETAIL,
                'method': 'GET',
                'params': params
            });
        }

        function getManageLookUp(params) {
            return $http({
                'url': settings.API_URI.GET_QC_ML_DETAIL,
                'method': 'GET',
                'params': params
            });
        }

        function updateAttr(data, params) {
            return $http({
                'url': settings.API_URI.UPDATE_ITEM_ATTR,
                'method': 'PUT',
                'data': data,
                'params': params
            });
        }
    }
})();