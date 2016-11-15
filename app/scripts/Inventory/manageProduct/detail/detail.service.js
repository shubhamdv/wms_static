(function() {
    'use strict';
    /*jshint camelcase: false */
    angular.module('wmsApp')
        .service('productDetailService', ProductDetailService);
        
    ProductDetailService.$inject = ['$http', 'settings'];

    function ProductDetailService($http, settings) {
        this.getProductDetail = getProductDetail;
        this.getPCMSDetail = getPCMSDetail;
        this.updateProduct = updateProduct;

        /////////////////////////////////////

        function getProductDetail(params) {
            return $http({
                'url': settings.API_URI.GET_QC_PROD_DETAIL,
                'method': 'GET',
                'params': params,
            });
        }

        function getPCMSDetail(params) {
            return $http({
                'url': settings.API_URI.GET_QC_PCMS_DETAIL,
                'method': 'GET',
                'params': params,
            });
        }

        function updateProduct(params, data) {
            return $http({
                'url': settings.API_URI.EDIT_PROD_DETAIL,
                'method': 'PUT',
                'params': params,
                'data': data
            });
        }
    }
})();