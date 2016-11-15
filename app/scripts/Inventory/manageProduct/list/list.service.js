(function() {
    'use strict';
    /*jshint camelcase: false */
    angular.module('wmsApp')
        .service('productListService', ProductListService);

    ProductListService.$inject = ['$http', 'settings'];

    function ProductListService($http, settings) {
        this.getProdList = getProdList;
        this.getProdInvList = getProdInvList;
        this.downloadFile = downloadFile;
        this.downLoadCsv = downLoadCsv;

        //////////////////////////////////////////

        function getProdList(params) {
            return $http({
                'url': settings.API_URI.GET_PROD_LIST,
                'method': 'GET',
                'params': params,
            });
        }

        function getProdInvList(params) {
            return $http({
                'url': settings.API_URI.GET_PROD_INV_LIST,
                'method': 'GET',
                'params': params,
            });
        }

        function downloadFile(params) {
            return $http({
                'url': settings.API_URI.GET_PROD_DOWNLOAD_CSV,
                'method': 'GET',
                'params': params,
            });
        }

        function downLoadCsv(response) {
            var d = new Date();
            var cd = d.getDate();
            var y = d.getFullYear();
            var mh = d.getMonth() + 1;
            var cM = (mh < 10 ? '0' : '') + mh;
            var h = d.getHours();
            var m = d.getMinutes();
            var fN = settings.PRODUCT_CSV_FILE_NAME + '_' + cd + '-' + cM + '-' + y + '_' + h + '-' + m + '.csv';
            var a = document.createElement('a');
            document.body.appendChild(a);
            a.fileName = fN;
            a.style.display = 'none';
            var file = new Blob([response], {
                type: 'text/csv;base64'
            });
            a.href = URL.createObjectURL(file);
            a.download = fN;
            return a;
        }
    }
})();