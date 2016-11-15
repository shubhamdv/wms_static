(function() {
    'use strict';
    /*jshint camelcase: false */
    angular.module('wmsApp')
        .service('manageBatchService', ManageBatchService);

    ManageBatchService.$inject = ['$http', 'settings'];

    function ManageBatchService($http, settings) {
        this.getBatchList = getBatchList;
        this.downloadFile = downloadFile;
        this.downLoadCsv = downLoadCsv;

        ///////////////////////////////////////

        function getBatchList(params) {
            return $http({
                'url': settings.API_URI.MANAGE_BATCH_LIST,
                'method': 'GET',
                'params': params,
            });
        }

        function downloadFile(params) {
            return $http({
                'url': settings.API_URI.BATCH_CSV_DOWNLOAD,
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
            var fN = settings.BATCH_CSV_FILE_NAME + '_' + cd + '-' + cM + '-' + y + '_' + h + '-' + m + '.csv';
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