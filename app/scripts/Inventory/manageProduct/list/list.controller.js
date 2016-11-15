(function() {
    'use strict';
    /* jshint camelcase: false */
    angular.module('wmsApp')
        .controller('productListCtrl', ProductListCtrl);

    ProductListCtrl.$inject = ['$scope', '$rootScope', 'settings', 'productListService', 'productDetailService', 'genericService', 'Modal', '$translate'];

    function ProductListCtrl($scope, $rootScope, settings, productListService, productDetailService, genericService, Modal, $translate) {
        var vm = this;
        var finalFilter = '';
        var params = {
            fulfillment_center_num: $scope.fcNum
        };

        /*Pagination decleration*/
        vm.startCount = settings.PAGINATION.startCount;
        vm.pageNo = settings.PAGINATION.pageNo;
        vm.lastCount = settings.PAGINATION.lastCount;
        vm.totalCount = settings.PAGINATION.totalCount;
        vm.resultPerPage = settings.PAGINATION.resultPerPage;
        vm.resultText = 'RESULTS_TEXT';

        vm.error = false;
        vm.norecordClient = false;
        vm.norecordSupplier = false;
        vm.norecordProd = false;
        vm.isNoRecord = false;
        vm.isComboInfo = false;
        vm.prodSkList = [];
        vm.childProduct = [];
        vm.childProdSkList = [];
        vm.parseInt = parseInt;
        vm.filter = {
            avail: 'all'
        };

        vm.setValue = setValue;
        vm.removeTag = removeTag;
        vm.getAutocompleteData = getAutocompleteData;
        vm.productSearchList = productSearchList;
        vm.componentProdList = componentProdList;
        vm.prodInvList = prodInvList;
        vm.csvDownload = csvDownload;

        ///////////////////////////////////////

        function setValue(tag, modalName) {
            switch (modalName) {
                case 'client':
                    vm.client = tag;
                    vm.filter.client_store = tag.sk;
                    angular.element('.clientAuto .tags input').addClass('hide');
                    break;
                case 'supplier':
                    vm.supplier = tag;
                    vm.filter.supplier_store = tag.sk;
                    angular.element('.supplierAuto .tags input').addClass('hide');
                    break;
                case 'prod':
                    vm.product = tag;
                    vm.filter.name = tag.name;
                    angular.element('.productAuto .tags input').addClass('hide');
                    break;
            }
        }

        function removeTag(tag, modalName) {
            switch (modalName) {
                case 'client':
                    vm.client = null;
                    vm.filter.client_store = null;
                    angular.element('.clientAuto .tags input').removeClass('hide');
                    break;
                case 'supplier':
                    vm.supplier = null;
                    vm.filter.supplier_store = null;
                    angular.element('.supplierAuto .tags input').removeClass('hide');
                    break;
                case 'prod':
                    vm.product = null;
                    vm.filter.name = null;
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
                case 'prod':
                    vm.norecordProd = isSelected ? true : false;
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
                case 'prod':
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

        function productSearchList(pageNum, isSearch) {
            if (isSearch) {
                finalFilter = angular.copy(vm.filter);
                vm.pageNumber = pageNum;
            } else {
                vm.pageNumber = pageNum || 1; //sending page number from the filters
                if (vm.pageNumber < 2) {
                    vm.pageNumber = 1;
                }
            }
            vm.pageNo = vm.pageNumber;

            // Clear json if function called

            vm.prodSkList = [];
            vm.childProduct = [];
            vm.childProdSkList = [];
            vm.norecordSupplier = false;
            vm.norecordClient = false;

            params.page = vm.pageNumber;
            params.paginate_by = vm.resultPerPage;
            params.active = finalFilter.avail === 'all' ? null : finalFilter.avail;
            params.client_sk = finalFilter.client_store || null;
            params.supplier_store_sk = finalFilter.supplier_store || null;
            params.name = finalFilter.name || null;
            params.number = finalFilter.prodNum ? finalFilter.prodNum.split(',') : null;
            params = genericService.cleanParams(params); // If key value null delete key on params

            productListService.getProdList(params)
                .success(listOnSuccess)
                .error(handleError);
        }

        function componentProdList(prod_sk, index, prodNum, isCombo) {
                if (_.isEmpty(vm.childProduct[index]) && isCombo) {
                    var _params = {
                        prod_sk: prod_sk,
                        fulfillment_center_num: $rootScope.fcNum,
                    };
                    _params = genericService.cleanParams(_params); /*If key's value is null then that key is removed.*/

                    productDetailService.getProductDetail(_params)
                        .success(function(response) {
                            childProdOnSuccess(response, index, prodNum, isCombo)
                        })
                        .error(handleError);
                }
            }

            function childProdOnSuccess(response, index, prodNum, isCombo) {
                var data = response.data;
                if (!_.isEmpty(data) && _.isArray(data.child_products) && data.child_products.length) {
                    vm.childProduct[index] = data.child_products;
                    vm.error = false;
                    vm.isComboInfo = false;
                    _.each(vm.childProduct[index], function(item) {
                        vm.childProdSkList.push(item.sk); // Push master product prod_sk in new json
                    });
                    vm.childProdSkList = _.uniq(vm.childProdSkList); // Remove duplicate array of objects
                    prodInvList(vm.childProdSkList, index, isCombo);
                } else {
                    vm.prodNum = prodNum;
                    vm.isComboInfo = true;
                    vm.infoMsg = 'INFO_MSG.IMSG4';
                }
            }

        function prodInvList(skList, index, isCombo) {
            var params = {
                fulfillment_center_num: $rootScope.fcNum,
                prod_sk: skList
            };
            productListService.getProdInvList(params)
                .success(function(response){
                    invListOnSuccess(response, index, isCombo);
                })
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
            delete downloadParams.page;
            delete downloadParams.paginate_by;
            downloadParams = genericService.cleanParams(downloadParams); // If key value null delete key on params
            productListService.downloadFile(downloadParams)
                .success(downloadOnSuccess)
                .error(handleError);
        }

        function downloadOnSuccess(response) {
            if(vm.totalCount > settings.MAX_DWNLD_LIMIT) {
                vm.msgSuccess = 'SUCC_MSG.LIST_EMAILED_SUCCESS';
                return;
            }

            vm.error = false;
            var csv = productListService.downLoadCsv(response);
            csv.click();
        }

        function listOnSuccess(response) {
            vm.data = response.data;
            if (!_.isEmpty(vm.data)) {
                vm.finalList = vm.data.results;
                _.each(vm.finalList, function(item) {
                    vm.prodSkList.push(item.sk); // Push master product prod_sk in new json
                });
                vm.prodSkList = _.uniq(vm.prodSkList); // Remove duplicate array of objects
                prodInvList(vm.prodSkList); // Inventory list function called
                vm.error = false;
                vm.isNoRecord = false;
                // Pagination
                vm.totalCount = vm.data.count;
                vm.lastCount = vm.resultPerPage * (Number(vm.pageNumber) - 1) + vm.data.results.length;
                vm.startCount = vm.resultPerPage * (Number(vm.pageNumber) - 1);
                vm.resultText = vm.totalCount > 1 ? 'RESULTS_TEXT' : 'RESULT_TEXT';
            } else {
                vm.isNoRecord = true;
            }
            angular.element('.js-panel-collapse.in').collapse('hide');
        }

        function invListOnSuccess(response, index, isCombo) {
            if (isCombo) {
                var childInv = response.data;
                if (!_.isEmpty(vm.childProduct[index])) {
                    _.each(vm.childProduct[index], function(childProd) {
                        childProd.inventory = childInv[childProd.sk];
                    });
                }
            } else {
                var inv = response.data;
                _.each(vm.finalList, function(item) {
                    item.inventory = inv[item.sk];
                });
            }
        }

        function handleError(error) {
            vm.success = false;
            vm.error = true;
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