(function() {
    'use strict';
    /*jshint camelcase: false */
    angular.module('wmsApp')
        .service('asnDetailService', AsnDetailService);
    AsnDetailService.$inject = ['$http', 'settings'];

    function AsnDetailService($http, settings) {
        this.getAsnDetails = getAsnDetails;
        this.getAsnProDList = getAsnProDList;
        this.cancelAsn = cancelAsn;
        this.revertExpectStatus = revertExpectStatus;
        this.downloadFile = downloadFile;
        this.downLoadCsv = downLoadCsv;
        this.printProduct = printProduct;

        ///////////////////////////////////////////////

        function getAsnDetails(params) {
            return $http({
                'url': settings.API_URI.ASN_DETAIL,
                'method': 'GET',
                'params': params,
            });
        }

        function getAsnProDList(params) {
            return $http({
                'url': settings.API_URI.ASN_PRODUCT_LIST,
                'method': 'GET',
                'params': params,
            });
        }

        function cancelAsn(params) {
            return $http({
                'url': settings.API_URI.CANCEL_ASN_DETAIL,
                'method': 'PUT',
                'params': params
            });
        }

        function revertExpectStatus(json) {
            return $http({
                'url': settings.API_URI.RES_ASN_DETAIL,
                'method': 'POST',
                'data': json
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

        function printProduct(json) {
            return $http({
                'url': settings.API_URI.PRINT_PRODUCT,
                'method': 'POST',
                'data': json
            });
        }
    }
})();