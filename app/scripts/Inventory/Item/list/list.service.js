(function() {
    'use strict';
    /*jshint camelcase: false */
    angular.module('wmsApp')
        .service('productItemService', ProductItemService);

    ProductItemService.$inject = ['$http', 'settings'];

    function ProductItemService($http, settings) {
        this.getItemList = getItemList;
        this.changeStatus = changeStatus;
        this.downloadFile = downloadFile;
        this.downLoadCsv = downLoadCsv;

        ///////////////////////////////////////

        function getItemList(params) {
            return $http({
                'url': settings.API_URI.MANAGE_ITEM_LIST,
                'method': 'GET',
                'params': params,
            });
        }

        function changeStatus(params) {
            return $http({
                'url': settings.API_URI.CANCEL_ASN_DETAIL,
                'method': 'PUT',
                'params': params
            });
        }

        function downloadFile(params) {
            return $http({
                'url': settings.API_URI.MANAGE_ITEM_CSV_DOWNLOAD,
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