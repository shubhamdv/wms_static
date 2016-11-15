(function() {
    'use strict';
    /* jshint camelcase: false */
    angular.module('wmsApp')
        .controller('batchDetailCtrl', BatchDetailCtrl);
    BatchDetailCtrl.$inject = ['$scope', '$routeParams', '$rootScope', 'batchDetailService', 'settings', 'genericService'];

    function BatchDetailCtrl($scope, $routeParams, $rootScope, batchDetailService, settings, genericService) {
        var vm = this;
        var params = {};

        /*Pagination Settings*/
        vm.startCount = settings.PAGINATION.startCount;
        vm.pageNo = settings.PAGINATION.pageNo;
        vm.lastCount = settings.PAGINATION.lastCount;
        vm.totalCount = settings.PAGINATION.totalCount;
        vm.resultPerPage = settings.PAGINATION.resultPerPage;

        vm.error = false;
        vm.success = false;
        vm.resultText = 'RESULTS_TEXT';
        vm.childProduct = [];
        vm.prodNumberList = [];
        vm.isComboInfo = false;

        vm.fetchBatchDetails = fetchBatchDetails;
        vm.batchProductList = batchProductList;
        vm.componentProdList = componentProdList;
        vm.completeBatch = completeBatch;
        vm.csvDownload = csvDownload;
        activate();

        ////////////////////////////////////////////

        function activate() {
            if ($routeParams.number) {
                vm.batchNumber = $routeParams.number;
            }
        }

        function fetchBatchDetails() {
            var params = {
                number: vm.batchNumber,
                fulfillment_center_num: $rootScope.fcNum,
            };
            batchDetailService.getBatchDetail(params)
                .success(batchOnSuccess)
                .error(handleError);
        }

        function batchProductList(pageNum, isSearch) {
            vm.childProduct = [];
            if (isSearch) {
                vm.pageNumber = pageNum;
            } else {
                vm.pageNumber = pageNum || 1; //sending page number from the filters
                if (vm.pageNumber < 2) {
                    vm.pageNumber = 1;
                }
            }
            vm.pageNo = vm.pageNumber;
            params = {
                page: vm.pageNumber,
                paginate_by: vm.resultPerPage,
                fulfillment_center_num: $rootScope.fcNum,
                batch_id: vm.batchDetail.id,
                query: vm.prodSearch
            };
            params = genericService.cleanParams(params); /*If key's value is null then that key is removed.*/
            batchDetailService.getProductList(params)
                .success(prodListOnSuccess)
                .error(handleError);
        }

        function componentProdList(prod_sk, index, prodNum, isCombo) {
            if (_.isEmpty(vm.childProduct[index]) && isCombo) {
                var childParams = angular.copy(params);
                delete childParams.page;
                delete childParams.paginate_by;
                delete childParams.query;
                childParams.master_prod_sk = prod_sk;
                childParams.include_child = true;
                childParams = genericService.cleanParams(childParams); /*If key's value is null then that key is removed.*/
                batchDetailService.getProductList(childParams)
                    .success(function(response) {
                        childProdOnSuccess(response, index, prodNum)
                    })
                    .error(handleError);
            }
        }

        function csvDownload() {
            var params = {
                fulfillment_center_num: $rootScope.fcNum,
                number: vm.prodNumberList
            }
            params = genericService.cleanParams(params); // If key value null delete key on params
            batchDetailService.downloadFile(params)
                .success(downloadOnSuccess)
                .error(handleError);
        }

        function downloadOnSuccess(response) {
            vm.error = false;
            var csv = batchDetailService.downLoadCsv(response);
            csv.click();
        }

        function prodListOnSuccess(response) {
            var data = response.data;
            if (!_.isEmpty(data) && _.isArray(data.results)) {
                vm.prodNumberList = [];
                vm.error = false;
                vm.products = data.results;
                _.each(vm.products, function(product) {
                    vm.prodNumberList.push(product.prod_number);
                });
                // Pagination
                vm.totalCount = data.count;
                vm.lastCount = vm.resultPerPage * (+vm.pageNumber - 1) + data.results.length;
                vm.startCount = vm.resultPerPage * (+vm.pageNumber - 1);
                vm.resultText = vm.totalCount > 1 ? 'RESULTS_TEXT' : 'RESULT_TEXT';
            }
        }

        function batchOnSuccess(response) {
            var data = response.data;
            if (!_.isEmpty(data) && response.success) {
                vm.error = false;
                vm.batchDetail = data;
                batchProductList();
            }
        }

        function childProdOnSuccess(response, index, prodNum) {
            var data = response.data;
            if (!_.isEmpty(data) && _.isArray(data.results)) {
                vm.childProduct[index] = data.results;
                vm.error = false;
                vm.isComboInfo = false;
            } else {
                vm.prodNum = prodNum;
                vm.isComboInfo = true;
                vm.infoMsg = 'INFO_MSG.IMSG4';
            }
        }


        function completeBatch() {
            var params = {
                fulfillment_center_num: $rootScope.fcNum
            };
            var sendData = {
                po_id: vm.batchDetail.id
            };
            batchDetailService.completeBatch(params, sendData)
                .success(cmpBatchOnSuccess)
                .error(handleError);
        }

        function cmpBatchOnSuccess(response){
            vm.success = true;
            vm.finishMsg = 'SUCC_MSG.RCV_BATCH',
            vm.batchDetail.status = 'ITR';
            vm.error = false;
            batchProductList();
        }

        function handleError(error) {
            vm.error = true;
            if (_.isArray(error.errors) && error.errors.length) {
                vm.errorMsg = error.errors[0].error_message;
            } else if (error.detail) {
                vm.errorMsg = error.detail;
            } else {
                vm.errorMsg = error.message || 'ERR3';
            }
        }
    }
})();