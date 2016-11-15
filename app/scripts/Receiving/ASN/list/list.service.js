(function() {
    'use strict';
    /*jshint camelcase: false */
    angular.module('wmsApp')
        .service('manageAsnService', ManageAsnService);
    ManageAsnService.$inject = ['$http', 'settings'];

    function ManageAsnService($http, settings) {
        this.getAsnList = getAsnList;
        this.downloadFile = downloadFile;
        this.downLoadCsv = downLoadCsv;
        this.getAsnBatchList = getAsnBatchList;

        /////////////////////////////////

        function getAsnList(params) {
            return $http({
                'url': settings.API_URI.MANAGE_ASN_DETAIL,
                'method': 'GET',
                'params': params,
            });
        }

        function downloadFile(params) {
            return $http({
                'url': settings.API_URI.ASN_CSV_DOWNLOAD,
                'method': 'GET',
                'params': params,
            });
        }

        function getAsnBatchList(params) {
            // return http promise object attempting authentication
            return $http({
                'url': settings.API_URI.ASN_BATCH_HISTORY,
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
            var fN = settings.ASN_CSV_FILE_NAME + '_' + cd + '-' + cM + '-' + y + '_' + h + '-' + m + '.csv';
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