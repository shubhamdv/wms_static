(function() {
    'use strict';
    /* jshint camelcase: false */
    angular.module('wmsApp')
        .controller('manageItemCtrl', ManageItemCtrl);

    ManageItemCtrl.$inject = ['$scope', '$rootScope', '$translate', '$filter', 'settings', 'productItemService', 'genericService', 'Modal'];

    function ManageItemCtrl($scope, $rootScope, $translate, $filter, settings, productItemService, genericService, Modal) {
        var vm = this;
        var finalFilter = '';
        var params = {
            fulfillment_center_num: $scope.fcNum,
        };

        /*Pagination Settings*/
        vm.startCount = settings.PAGINATION.startCount;
        vm.pageNo = settings.PAGINATION.pageNo;
        vm.lastCount = settings.PAGINATION.lastCount;
        vm.totalCount = settings.PAGINATION.totalCount;
        vm.resultPerPage = settings.PAGINATION.resultPerPage;
        vm.resultText = 'RESULTS_TEXT';
        /*To set Module and submodule name in breadcrumb*/
        vm.removeDate = false;
        vm.error = false;
        vm.norecordClient = false;
        vm.norecordSupplier = false;
        vm.norecordProdName = false;
        vm.isNoRecord = false;
        vm.statusList = [];
        vm.serialNumber = [];
        vm.filterList = {
            status: 'any',
            date: {
                startDate: null,
                endDate: null
            }
        };

        vm.setValue = setValue;
        vm.removeTag = removeTag;
        vm.getAutocompleteData = getAutocompleteData;
        vm.fetchDateRange = fetchDateRange;
        vm.removeDateRange = removeDateRange;
        vm.itemManageList = itemManageList;
        vm.csvDownload = csvDownload;
        activate();

        ////////////////////////////////////

        function activate() {
            _.each(settings.ITEM_STATUS, function(key) {
                var status = $translate('ITEM_STATUS.' + key);
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
                    vm.filterList.client_store = tag.sk;
                    angular.element('.clientAuto .tags input').addClass('hide');
                    break;
                case 'supplier':
                    vm.supplier = tag;
                    vm.filterList.supplier_store = tag.sk;
                    angular.element('.supplierAuto .tags input').addClass('hide');
                    break;
                case 'product':
                    vm.product = tag;
                    vm.filterList.name = tag.name;
                    angular.element('.productAuto .tags input').addClass('hide');
                    break;
            }
        }

        function removeTag(tag, modalName) {
            switch (modalName) {
                case 'client':
                    vm.client = null;
                    vm.filterList.client_store = null;
                    angular.element('.clientAuto .tags input').removeClass('hide');
                    break;
                case 'supplier':
                    vm.supplier = null;
                    vm.filterList.supplier_store = null;
                    angular.element('.supplierAuto .tags input').removeClass('hide');
                    break;
                case 'product':
                    vm.product = null;
                    vm.filterList.name = null;
                    angular.element('.productAuto .tags input').removeClass('hide');
                    break;
            }
        }


        function modalSelected(modalName, isSelected) {
            switch (modalName) {
                case 'client':
                    vm.norecordClient = isSelected ? true : false;
                    break;
                case 'supplier':
                    vm.norecordSupplier = isSelected ? true : false;
                    break;
                case 'product':
                    vm.norecordProdName = isSelected ? true : false;
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
                case 'product':
                    data.model_name = 'PROD';
                    if (vm.client) {
                        data.client_id = vm.client.owner__sk;
                    }
                    break;
            }
            return genericService.getAutoCompleteData(data).then(function(res) {
                    if (!_.isEmpty(res.data) && _.isArray(res.data.data) && res.data.data.length) {
                        modalSelected(modalName, false);
                        var tagsData = genericService.tagInputData(res.data.data);
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

        function itemManageList(pageNum, isSearch) {
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
            vm.pageNo = vm.pageNumber;

            params = {
                fulfillment_center_num: $rootScope.fcNum,
                paginate_by: vm.resultPerPage,
                page: vm.pageNumber,
                client_sk: finalFilter.client_store || null,
                supplier_store_sk: finalFilter.supplier_store || null,
                prod_name: vm.filterList.name || null,
                layout_location: finalFilter.locationValue || null,
                date_from: vm.filterList.startDate || null,
                date_to: vm.filterList.endDate || null,
                status: finalFilter.status === 'any' ? null : finalFilter.status,
                serial: finalFilter.serialNum ? finalFilter.serialNum.split(',') : null,
                prod_number: finalFilter.prodNum ? finalFilter.prodNum.split(',') : null,
                picklist_id: finalFilter.pickListId ? finalFilter.pickListId.split(',') : null,
                asn_number: finalFilter.asnNum || null,
                batch_number: finalFilter.poNum || null
            };
            params = genericService.cleanParams(params); // If key value null delete key on params
            productItemService.getItemList(params)
                .success(itemOnSuccess)
                .error(handleError);
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
            delete downloadParams.paginate_by;
            delete downloadParams.page;
            downloadParams = genericService.cleanParams(downloadParams); // If key value null delete key on params
            productItemService.downloadFile(downloadParams)
                .success(downloadOnSuccess)
                .error(handleError);
        }

        function itemOnSuccess(response) {
            var data = response.data;
            if (data) {
                vm.itemList = data.results;
                vm.error = false;
                vm.isNoRecord = false;
                // Pagination
                vm.totalCount = data.count;
                vm.lastCount = vm.resultPerPage * (Number(vm.pageNumber) - 1) + data.results.length;
                vm.startCount = vm.resultPerPage * (Number(vm.pageNumber) - 1);
                vm.resultText = vm.totalCount > 1 ? 'RESULTS_TEXT' : 'RESULT_TEXT';
            } else {
                $scope.isNoRecord = true;
            }
            angular.element('.js-panel-collapse.in').collapse('hide');
        }

        function downloadOnSuccess(response) {
            if(vm.totalCount > settings.MAX_DWNLD_LIMIT) {
                vm.msgSuccess = 'SUCC_MSG.LIST_EMAILED_SUCCESS';
                return;
            }

            vm.error = false;
            var csv = productItemService.downLoadCsv(response);
            csv.click();
        }

        function handleError(error) {
            vm.error = true;
            vm.isNoRecord = false;
            if (error.errors && error.errors.length) {
                vm.errorMsg = error.errors[0].error_message;
            } else if (error.detail) {
                vm.errorMsg = error.detail;
            } else {
                vm.errorMsg = error.message || 'ERR3';
            }
        }
    }
})();