(function() {
    'use strict';
    /*jshint camelcase: false */
    angular.module('wmsApp')
        .service('shipmentReceivedService', ShipmentReceivedService);
    ShipmentReceivedService.$inject = ['$http', 'settings'];

    function ShipmentReceivedService($http, settings) {
        this.getBatchList = getBatchList;
        this.printBarCode = printBarCode;
        this.rePrintBarCode = rePrintBarCode;
        this.acceptShipment = acceptShipment;
        this.downLoadPdf = downLoadPdf;

        //////////////////////////////////////////

        function getBatchList(params) {
            return $http({
                'url': settings.API_URI.GET_SHIPMENT_DATA,
                'method': 'GET',
                'params': params
            });
        }

        function printBarCode(json) {
            return $http({
                'url': settings.API_URI.PRINT_ASN_BAR_CODE,
                'method': 'POST',
                'data': json
            });
        }

        function rePrintBarCode(json) {
            return $http({
                'url': settings.API_URI.REPRINT_ASN_BAR_CODE,
                'method': 'POST',
                'data': json
            });
        }

        function acceptShipment(params) {
            return $http({
                'url': settings.API_URI.ACCEPT_ASN_SHIPMENT,
                'method': 'PUT',
                'params': params
            });
        }
        
        function downLoadPdf(response) {
            var a = document.createElement('a');
            document.body.appendChild(a);
            a.fileName = settings.BATCH_PDF_FILE_NAME;
            a.style.display = 'none';
            var file = new Blob([response], {
                type: 'application/pdf;base64'
            });
            a.href = URL.createObjectURL(file);
            a.download = settings.BATCH_PDF_FILE_NAME;
            return a;
        };

        /*Checking if barcode list is printed already for a particular batch*/
        /* this.isBarcodeListGenerated = function(barCodeList, data) {
               return  _.each(data, function(key, value){
                    if(barCodeList[key.batch_no]){
                      key.noOfBox = barCodeList[key.batch_no];
                    }
                });
         };*/



    }
})();