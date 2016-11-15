(function() {
    'use strict';
    /*jshint camelcase: false */
    angular.module('wmsApp')
        .service('batchDetailService', BatchDetailService);
    BatchDetailService.$inject = ['$http', 'settings'];

    function BatchDetailService($http, settings) {
        this.getBatchDetail = getBatchDetail;
        this.getProductList = getProductList;
        this.completeBatch = completeBatch;
        this.downloadFile = downloadFile;
        this.downLoadCsv = downLoadCsv;

        ///////////////////////////////////////////////

        function getBatchDetail(params) {
            return $http({
                'url': settings.API_URI.GET_BATCH_DETAIL,
                'method': 'GET',
                'params': params,
            });
        }

        function getProductList(params) {
            return $http({
                'url': settings.API_URI.BATCH_PRODUCT_LIST,
                'method': 'GET',
                'params': params,
            });
        }

        function completeBatch(params, data){
            return $http({
                'url': settings.API_URI.BATCH_COMPLETE,
                'method': 'POST',
                'data': data,
                'params': params
            });
        };

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