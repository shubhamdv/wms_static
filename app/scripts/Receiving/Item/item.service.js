(function() {
    'use strict';
    /*jshint camelcase: false */
    angular.module('wmsApp')
        .service('itemReceiveService', ItemReceiveService);
    ItemReceiveService.$inject = ['$http', 'settings'];

    function ItemReceiveService($http, settings) {
        this.getBatchDetail = getBatchDetail;
        this.receiveItem = receiveItem;
        this.rePrintItem = rePrintItem;
        this.itemSerialize = itemSerialize;
        this.printProductBarCode = printProductBarCode;
        this.downLoadPdf = downLoadPdf;

        /////////////////////////////////////////
        
        function getBatchDetail(params) {
            return $http({
                'url': settings.API_URI.GET_BATCH_DETAIL,
                'method': 'GET',
                'params': params,
            });
        }

        function receiveItem(params, json) {
            return $http({
                'url': settings.API_URI.BATCH_ITEM_RECEIVE,
                'method': 'POST',
                'data': json,
                'params': params
            });
        }

        function rePrintItem(json) {
            return $http({
                'url': settings.API_URI.REPRINT_RECEIVED_ITEM,
                'method': 'POST',
                'data': json
            });
        }

        function itemSerialize(params, json) {
            return $http({
                'url': settings.API_URI.BATCH_ITEM_SERIALIZE,
                'method': 'POST',
                'data': json,
                'params': params
            });
        }

        function printProductBarCode(json) {
            return $http({
                'url': settings.API_URI.PRINT_PRODUCT_BARCODE,
                'method': 'POST',
                'data': json
            });
        }

        function downLoadPdf(response) {
            var a = document.createElement('a');
            document.body.appendChild(a);
            a.fileName = settings.SERIAL_PDF_FILE_NAME;
            a.style.display = 'none';
            var file = new Blob([response], {
                type: 'application/pdf;base64'
            });
            a.href = URL.createObjectURL(file);
            a.download = settings.SERIAL_PDF_FILE_NAME;
            return a;
        }
    }
})();