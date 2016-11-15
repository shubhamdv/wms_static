(function() {
    'use strict';
    /* jshint camelcase: false */
    angular.module('wmsApp')
        .controller('shipmentReceivedCtrl', ShipmentReceivedCtrl);
    ShipmentReceivedCtrl.$inject = ['$scope', '$rootScope', 'settings', 'shipmentReceivedService', 'genericService'];

    function ShipmentReceivedCtrl($scope, $rootScope, settings, shipmentReceivedService, genericService) {
        var vm = this;
        var shipmentRcvStatus = ['PIK', 'CRT'];

        /*Pagination Settings*/
        vm.startCount = settings.PAGINATION.startCount;
        vm.pageNo = settings.PAGINATION.pageNo;
        vm.lastCount = settings.PAGINATION.lastCount;
        vm.totalCount = settings.PAGINATION.totalCount;
        vm.resultPerPage = settings.PAGINATION.resultPerPage;
        vm.resultText = 'RESULTS_TEXT';
        vm.batchStatus = settings.BATCH_STATUS;
        vm.isSearch = true;
        vm.error = false;
        vm.success = false;
        vm.errorMsg = 'ERR3';
        vm.noOfBox = [];
        vm.printBatch = [];
        vm.isHideAll = [];
        vm.docNum = []

        /*Get ASN Verification Data*/

        vm.fetchBatchList = fetchBatchList;
        vm.printBarCode = printBarCode;
        vm.rePrintBarCode = rePrintBarCode;
        vm.acceptShipment = acceptShipment;
        vm.showHideRow = showHideRow;

        function fetchBatchList(pageNum, isSearch) {
            if (isSearch) {
                vm.pageNumber = pageNum;
            } else {
                vm.pageNumber = pageNum || 1; //sending page number from the filters
                if (vm.pageNumber < 2) {
                    vm.pageNumber = 1;
                }
            }
            vm.noOfBox = [];
            vm.printBatch = [];
            vm.pageNo = vm.pageNumber;
            var params = {
                fulfillment_center_num: $rootScope.fcNum,
                exclude_rpo: true,
                exclude_expired: true,
                status: shipmentRcvStatus,
                source_number : vm.asnNum || null
            };
            params = genericService.cleanParams(params);
            shipmentReceivedService.getBatchList(params)
                .success(batchOnSuccess)
                .error(handelError);
        }

        function batchOnSuccess(response) {
            var data = response.data;
            if (!_.isEmpty(data) && _.isArray(data.results)) {
                vm.error = false;
                vm.success = false;
                vm.isNav = true;
                vm.batchList = data.results;

                // Pagination setting
                vm.totalCount = data.count;
                vm.lastCount = vm.resultPerPage * (+vm.pageNumber - 1) + vm.batchList.length;
                vm.startCount = vm.resultPerPage * (+vm.pageNumber - 1);
                vm.resultText = vm.totalCount > 1 ? 'RESULTS_TEXT' : 'RESULT_TEXT';
            }
        }

        function showHideRow(index, isCancel){
            _.each(vm.batchList, function(item, batchListIndex){
                if(isCancel){
                    vm.isHideAll[batchListIndex] = false;
                    vm.isNav = true;
                } else if(batchListIndex === index){
                    vm.isHideAll[batchListIndex] = false;
                    vm.isNav = false;
                } else {
                    vm.isHideAll[batchListIndex] = true;
                    vm.isNav = false;
                }
            })

        }

        function printBarCode(batchData, index, rePrint) {
            if (rePrint && !_.isEmpty(rePrint)) {
                var barCodeData = angular.copy(rePrint);
            } else {
                var barCodeData = {
                    barcode_of: batchData.number || null,
                    count: +vm.noOfBox[index] || null,
                    username: $rootScope.profileData.user_profile.username || null,
                    extra_info: []
                };
            }
            barCodeData = genericService.cleanParams(barCodeData);
            shipmentReceivedService.printBarCode(barCodeData)
                .success(function(response){
                    printOnSuccess(response, rePrint, index)
                })
                .error(handelError);
        }

        function printOnSuccess(response, rePrint, index) {
            if(!rePrint){
                vm.printBatch[index] = (vm.printBatch[index] ? vm.printBatch[index] : 0) + (+vm.noOfBox[index]);
                vm.noOfBox[index] = ''; 
            }
            var pdf = shipmentReceivedService.downLoadPdf(response);
            pdf.click();
        }

        function rePrintBarCode(batchData, index) {
            var rePrintData = {
                barcode_of: batchData.number || null,
                username: $rootScope.profileData.user_profile.username || null,
            };
            rePrintData = genericService.cleanParams(rePrintData); /*If key's value is null then that key is removed.*/
            shipmentReceivedService.rePrintBarCode(rePrintData)
                .success(function(response) {
                    rePrintOnSuccess(response, batchData, index);
                })
                .error(handelError);
        }

        function rePrintOnSuccess(response, batchData, index) {
            if (response && !_.isEmpty(response)) {
                printBarCode(batchData, index, response);
            }
        }

        function acceptShipment(batchData, index) {
            var params = {
                station: $rootScope.station,
                fulfillment_center_num: $rootScope.fcNum,
                po_id: batchData.id,
                invoice_num : vm.docNum[index]
            };
            shipmentReceivedService.acceptShipment(params)
                .success(function(response) {
                    acceptShipOnSuccess(response, batchData);
                })
                .error(handelError);
        }

        function acceptShipOnSuccess(response, batchData) {
            vm.error = false;
            if (response.success) {
                vm.asnNum = null;
                vm.batchList = null;
                vm.success = true;
                vm.batchAccepted = batchData.number;
                vm.source_number = batchData.source_number;
                vm.agn_id = batchData.agn;
            } else{
                handelError(response)   
            }
        }

        function handelError(error) {
            vm.error = true;
            if (_.isArray(error.errors) && error.errors.length) {
                vm.errorMsg = error.errors[0].error_message;
            } else if (error.detail) {
                vm.errorMsg = error.detail;
            } else {
                vm.errorMsg = 'ERR3';
            }
        }

    }
})();