(function() {
    'use strict';
    /* jshint camelcase: false */
    angular.module('wmsApp')
        .controller('manageAsnCtrl', ManageAsnCtrl);
    ManageAsnCtrl.$inject = ['$scope', '$rootScope', '$translate', '$filter', 'settings', 'manageAsnService', 'genericService', 'Modal'];

    function ManageAsnCtrl($scope, $rootScope, $translate, $filter, settings, manageAsnService, genericService, Modal) {
        var vm = this;
        var statusFullName = settings.AGN_STATUS;
        var finalFilter = '';
        var params = {};

        /*Pagination Variable*/
        vm.startCount = settings.PAGINATION.startCount;
        vm.pageNo = settings.PAGINATION.pageNo;
        vm.lastCount = settings.PAGINATION.lastCount;
        vm.totalCount = settings.PAGINATION.totalCount;
        vm.resultPerPage = settings.PAGINATION.resultPerPage;
        vm.removeDate = false;
        vm.error = false;
        vm.isClient = false;
        vm.isSupplier = false;
        vm.isBatchInfo = false;
        vm.statusList = [];
        vm.batchList = [];
        vm.filterList = {
            status: 'any',
            availability: 'both',
            date: {
                startDate: null,
                endDate: null
            }
        };
        vm.msgSuccess = null;

        vm.fetchDateRange = fetchDateRange;
        vm.removeDateRange = removeDateRange;
        vm.setValue = setValue;
        vm.removeTag = removeTag;
        vm.getAutocompleteData = getAutocompleteData;
        vm.asnSearchList = asnSearchList;
        vm.fetchAsnBatchList = fetchAsnBatchList;
        vm.csvDownload = csvDownload;
        activate();

        //////////////////////////////////////////////

        function activate() {
            console.log('ASN list controller');
            _.each(statusFullName, function(key) {
                var status = $translate('STATUS.' + key);
                status.then(function(value) {
                    vm.statusList.push({
                        status: value,
                        key: key
                    });
                });
            });
        }

        function fetchDateRange() {
            var date = vm.filterList.date;
            if (date && date.startDate) {
                vm.startDate = moment(date.startDate._d).format('YYYY-MM-DDTHH:m:s') + 'Z';
                vm.endDate = moment(date.endDate._d).format('YYYY-MM-DDTHH:m:s') + 'Z';
            }

        }

        function removeDateRange() {
            angular.element('#date').val('');
            vm.filterList.date = {
                startDate: null,
                endDate: null
            };
            vm.startDate = null;
            vm.endDate = null;
            vm.removeDate = false;
        }

        function setValue(tag, modalName) {
            switch (modalName) {
                case 'client':
                    vm.client = tag;
                    vm.filterList.client_sk = tag.sk;
                    angular.element('.clientAuto .tags input').addClass('hide');
                    break;
                case 'supplier':
                    vm.supplier = tag;
                    vm.filterList.supplier_store = tag.sk;
                    angular.element('.supplierAuto .tags input').addClass('hide');
                    break;
                default:
                    break;
            }
        }

        function removeTag(tag, modalName) {
            switch (modalName) {
                case 'client':
                    vm.client = null;
                    vm.filterList.client_sk = null;
                    angular.element('.clientAuto .tags input').removeClass('hide');
                    break;
                case 'supplier':
                    vm.supplier = null;
                    vm.filterList.supplier_store = null;
                    angular.element('.supplierAuto .tags input').removeClass('hide');
                    break;
                default:
                    break;
            }
        }

        function modalSelected(modalName, isSelected) {
            switch (modalName) {
                case 'client':
                    vm.isClient = isSelected ? true : false;
                    break;
                case 'supplier':
                    vm.isSupplier = isSelected ? true : false;
                    break;
                default:
                    break;
            }
        }

        function getAutocompleteData(typed, modalName) {
            var data = {
                noModeRequired: true,
                model_name: '',
                query: typed
            };
            switch (modalName) {
                case 'client':
                    data.model_name = 'CL';
                    if ($rootScope.fcDetail) {
                        data.fc_sk = $rootScope.fcDetail.sk;
                    }
                    break;
                case 'supplier':
                    data.model_name = 'WH';
                    if (vm.client) {
                        data.client_id = vm.client.id;
                    }
                    break;
                default:
                    break;
            }
            return genericService.getAutoCompleteData(data).then(function(res) {
                    var autoData = res.data;
                    if (!_.isEmpty(autoData) && _.isArray(autoData.data) && autoData.data.length) {
                        modalSelected(modalName, false);
                        var tagsData = genericService.tagInputData(autoData.data);
                        return tagsData;
                    } else {
                        modalSelected(modalName, true);
                        return [];
                    }
                })
                .catch(function() {
                    modalSelected(modalName, true);
                    return [];
                });
        }

        function asnSearchList(pageNum, isSearch) {
            if (isSearch) {
                vm.filterList.startDate = vm.startDate;
                vm.filterList.endDate = vm.endDate;
                finalFilter = angular.copy(vm.filterList);
                vm.pageNumber = pageNum;
            } else {
                vm.pageNumber = pageNum || 1; //sending page number from the filters
                if (vm.pageNumber < 2) {
                    vm.pageNumber = 1;
                }
            }
            vm.batchList = [];
            vm.pageNo = vm.pageNumber;
            params = {
                page: vm.pageNumber,
                paginate_by: vm.resultPerPage,
                fulfillment_center_num: $rootScope.fcNum || null,
                client_sk: finalFilter.client_sk || null,
                supplier_store_sk: finalFilter.supplier_store || null,
                date_from: finalFilter.startDate || null,
                date_to: finalFilter.endDate || null,
                status: finalFilter.status === 'any' ? statusFullName : finalFilter.status,
                expired: finalFilter.availability === 'both' ? null : finalFilter.availability,
                source_number: finalFilter.sourceNum ? finalFilter.sourceNum.split(',') : null,
                po_number: finalFilter.batchNum ? finalFilter.batchNum.split(',') : null
            };
            params = genericService.cleanParams(params); /*If key's value is null then that key is removed.*/
            manageAsnService.getAsnList(params)
                .success(searchOnSuccess)
                .error(handleError);
        }

        function fetchAsnBatchList(asnNum, asnId, index) {
            if (_.isEmpty(vm.batchList[index])) {
                var _params = {
                    agn_id: asnId,
                    fulfillment_center_num: $rootScope.fcNum,
                };
                _params = genericService.cleanParams(_params); /*If key's value is null then that key is removed.*/
                manageAsnService.getAsnBatchList(_params)
                    .success(function(response){
                        batchOnSuccess(response, asnNum, index)
                    })
                    .error(handleError);
            }
        }

        function csvDownload() {
            var modelContent = {
                onConfirm: sendCsvRequest,
                heading: 'LABEL_TEXT.MODAL_REPORT_DOWNLOAD_HEADER'
            };

            $translate('LABEL_TEXT.MODAL_REPORT_DOWNLOAD_BODY')
                .then(function(value) {
                    modelContent.body = value.replace('$$email', $rootScope.profileData.user_profile.email);
                });

            if( vm.totalCount > settings.MAX_DWNLD_LIMIT ) {
                Modal.confirm.primary(modelContent);
                return;
            }

            sendCsvRequest();
        }

        function sendCsvRequest() {
            var downloadParams = angular.copy(params);
            delete downloadParams.page;
            delete downloadParams.paginate_by;
            downloadParams = genericService.cleanParams(downloadParams); // If key value null delete key on params
            manageAsnService.downloadFile(downloadParams)
                .success(csvOnSuccess)
                .error(handleError);
        }

        function csvOnSuccess(response) {
            if(vm.totalCount > settings.MAX_DWNLD_LIMIT) {
                vm.msgSuccess = 'SUCC_MSG.LIST_EMAILED_SUCCESS';
                return;
            }
            $scope.error = false;
            var csv = manageAsnService.downLoadCsv(response);
            csv.click();
        }

        function searchOnSuccess(response) {
            var asnData = response.data;
            if (!_.isEmpty(asnData) && _.isArray(asnData.results)) {
                vm.asnList = asnData.results;
                vm.isBatchInfo = false;
                vm.error = false;
                // Pagination
                vm.totalCount = asnData.count;
                vm.lastCount = vm.resultPerPage * (+vm.pageNumber - 1) + vm.asnList.length;
                vm.startCount = vm.resultPerPage * (+vm.pageNumber - 1);
                vm.resultText = vm.totalCount > 1 ? 'RESULTS_TEXT' : 'RESULT_TEXT';
                angular.element('.js-panel-collapse.in').collapse('hide');
            }
        }

        function batchOnSuccess(response, asnNum, index) {
            var data = response.data;
            if (_.isArray(data.results) && data.results.length) {
                vm.batchList[index] = data.results;
                vm.error = false;
                vm.isBatchInfo = false;
            } else{
                vm.asnNum = asnNum;
                vm.isBatchInfo = true;
                vm.infoMsg = 'INFO_MSG.IMSG3';
            }
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