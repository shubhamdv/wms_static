(function() {
    'use strict';
    /* jshint camelcase: false */

    angular.module('wmsApp')
        .controller('asnDetailCtrl', AsnDetailCtrl);

    AsnDetailCtrl.$inject = ['$scope', '$routeParams', '$rootScope', 'asnDetailService', 'settings', 'genericService'];

    function AsnDetailCtrl($scope, $routeParams, $rootScope, asnDetailService, settings, genericService) {
        var vm = this;
        var agnSendDetail = [];
        var params = {};

        /*Pagination Settings*/
        vm.startCount = settings.PAGINATION.startCount;
        vm.pageNo = settings.PAGINATION.pageNo;
        vm.lastCount = settings.PAGINATION.lastCount;
        vm.totalCount = settings.PAGINATION.totalCount;
        vm.resultPerPage = settings.PAGINATION.resultPerPage;

        vm.error = false;
        vm.success = false;
        vm.norecord = 'NO_RECORD';
        vm.resultText = 'RESULTS_TEXT';
        vm.childProduct = [];
        vm.prodNumberList = [];
        vm.isComboInfo = false;

        vm.fetchAsnDetails = fetchAsnDetails;
        vm.manageLookUp = manageLookUp;
        vm.asnProdList = asnProdList;
        vm.componentProdList = componentProdList;
        vm.csvDownload = csvDownload;
        activate();

        ////////////////////////////////////////

        function activate() {
            if ($routeParams.id) {
                vm.asnId = $routeParams.id;
            }
        }

        function fetchAsnDetails() {
            var _params = {
                agn_id: vm.asnId,
                fulfillment_center_num: $rootScope.fcNum
            };
            _params = genericService.cleanParams(_params); /*If key's value is null then that key is removed.*/
            asnDetailService.getAsnDetails(_params)
                .success(asnDetailOnSuccess)
                .error(handleError);
        }

        function manageLookUp(lookup_id) {
            var _params = {
                manage_lookup: lookup_id
            };
            genericService.getManageLookup(_params)
                .success(manageLookOnSuccess)
                .error(handleError);
        }

        function asnProdList(pageNum, isSearch) {
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
                agn_id: vm.asnId,
                fulfillment_center_num: $rootScope.fcNum,
                query: vm.prodSearch
            };
            params = genericService.cleanParams(params); /*If key's value is null then that key is removed.*/

            asnDetailService.getAsnProDList(params)
                .success(prodListOnSuccess)
                .error(handleError);
        }

        function componentProdList(prod_sk, index, prodNum, isCombo) {
            if(_.isEmpty(vm.childProduct[index]) && isCombo){
                var childParams = angular.copy(params);
                delete childParams.page;
                delete childParams.paginate_by;
                delete childParams.query;
                childParams.master_prod_sk = prod_sk;
                childParams.include_child = true;
                childParams = genericService.cleanParams(childParams); /*If key's value is null then that key is removed.*/

                asnDetailService.getAsnProDList(childParams)
                    .success(function(response) {
                        childProdOnSuccess(response, index, prodNum)
                    })
                    .error(handleError);
            }
        }

        function csvDownload() {
            var params = {
               fulfillment_center_num: $rootScope.fcNum,
               number : vm.prodNumberList
            }
            params = genericService.cleanParams(params); // If key value null delete key on params
            asnDetailService.downloadFile(params)
                .success(downloadOnSuccess)
                .error(handleError);
        }

        function downloadOnSuccess(response) {
            vm.error = false;
            var csv = asnDetailService.downLoadCsv(response);
            csv.click();
        }

        function asnDetailOnSuccess(response) {
            var data = response.data;
            if (!_.isEmpty(data) && response.success) {
                vm.asnDeatils = data;
                agnSendDetail.push(vm.asnDeatils); // Push Agn Detail for revert Exp Status
                manageLookUp(vm.asnDeatils.mgmnt_lkp);
                asnProdList();
            }
        }

        function manageLookOnSuccess(response) {
            var data = response.data;
            if (!_.isEmpty(data) && response.success) {
                vm.manage_lookup = data;
            }
        }

        function prodListOnSuccess(response) {
            var data = response.data;
            if (!_.isEmpty(data) && _.isArray(data.results)) {
                vm.prodNumberList = [];
                vm.error = false;
                vm.products = data.results;
                _.each(vm.products, function(product){
                    vm.prodNumberList.push(product.prod_number);
                });
                // Pagination
                vm.totalCount = data.count;
                vm.lastCount = vm.resultPerPage * (+vm.pageNumber - 1) + data.results.length;
                vm.startCount = vm.resultPerPage * (+vm.pageNumber - 1);
                vm.resultText = vm.totalCount > 1 ? 'RESULTS_TEXT' : 'RESULT_TEXT';
            }
        }

        function childProdOnSuccess(response, index, prodNum) {
            var data = response.data;
            if (!_.isEmpty(data) && _.isArray(data.results)) {
                vm.childProduct[index] = data.results;
                vm.error = false;
                vm.isComboInfo = false;
            }else{
                vm.prodNum = prodNum;
                vm.isComboInfo = true;
                vm.infoMsg = 'INFO_MSG.IMSG4';
            }
        }

        function handleError(error) {
            vm.error = true;
            if (_.isArray(error.errors) && error.errors.length){
                vm.errorMsg = error.errors[0].error_message;
            } else if (error.detail) {
                vm.errorMsg = error.detail;
            } else {
                vm.errorMsg = error.message || 'ERR3';
            }
        }
    }
})();