'use strict';
/* jshint camelcase: false */
angular.module('wmsApp')
    .controller('productChnlMapListCtrl', function($scope, $rootScope, settings, productListService, genericService, channelMappingProdService, $modal, prodChannelMappingListService) {

        /*Pagination Settings*/
        $scope.startCount = settings.PAGINATION.startCount;
        $scope.pageNo = settings.PAGINATION.pageNo;
        $scope.lastCount = settings.PAGINATION.lastCount;
        $scope.totalCount = settings.PAGINATION.totalCount;
        $scope.resultPerPage = settings.PAGINATION.resultPerPage;
        $scope.resultText = 'RESULTS_TEXT';
        $scope.allocBtn = false;

        /*To set Module and submodule name in breadcrumb*/
        $scope.error = false;
        $scope.norecordClient = false;
        $scope.norecordSupplier = false;
        $scope.norecordProd = false;
        $scope.filter = {};
        $scope.isNoRecord = false;
        $scope.filterData = {
            avail: 'both',
            prodNum: '',
            pickListId: '',
            sellerSku: '',
            listingId: '',
            channelSku: '',
            channelName: '',
        };
        $scope.radioSelect = {
            'value': {}
        };
        $scope.openAllocationModal = function() {
            var modalInstance = $modal.open({
                animation: true,
                dismissable: true,
                templateUrl: 'scripts/Inventory/channelMapping/list/productAllocation.modal.template.html',
                backdrop: 'static',
                scope: $scope
            });
            modalInstance.result.then(function(obj) {
                if (obj.allocation_operation && obj.allocation_number) {
                    if (obj.allocation_operation === 'Percentage (%)') {
                        obj.allocation_operation = '%';
                    } else {
                        obj.allocation_operation = 'pcs';
                    }

                    obj.active = $scope.active;
                    $scope.editProduct(obj, 'alloc');
                }
            });
        };

        // Radio button after change
        $scope.toJson = function(index) {
            $scope.parsedRow = JSON.parse($scope.radioSelect.value);
            $scope.product_sk = angular.copy($scope.parsedRow.product_sk);
            $scope.channel_sku = angular.copy($scope.parsedRow.client_store_product_number);
            $scope.client_store = angular.copy($scope.parsedRow.client_store_id);
            $scope.channel_name = angular.copy($scope.parsedRow.channel);
            $scope.prod_num = angular.copy($scope.parsedRow.product_number);
            $scope.list_id = angular.copy($scope.parsedRow.listing_id);
            $scope.seller_sku = angular.copy($scope.parsedRow.client_store_seller_sku);
            $scope.active = angular.copy($scope.parsedRow.active);
            $scope.index = index;
            $scope.allocBtn = true;
        };

        $scope.openAvailabilityModal = function() {
            var modalInstance = $modal.open({
                animation: true,
                dismissable: true,
                templateUrl: 'scripts/Inventory/channelMapping/list/productAvailability.modal.template.html',
                backdrop: 'static',
                scope: $scope
            });
            $scope.actInact = JSON.stringify($scope.active); 
            $scope.disable = angular.copy($scope.actInact);
            modalInstance.result.then(function(activeObj) {
                if (activeObj.active) {
                    $scope.editProduct(activeObj, 'avail');
                }
            });
        };

        $scope.setValue = function(tag) {
            $scope.client = tag;
            $('.createClient .tags input').addClass('hide');
            $scope.productChnlMapList();
        };

        $scope.removeTag = function() {
            $scope.client = null;
            $('.createClient .tags input').removeClass('hide');
            $scope.productChnlMapList();
        };

        var modalSelected = function(isSelected) {
            $scope.norecordClient = isSelected ? true : false;
        };

        $scope.getAutocompleteData = function(typed) {
            var data = {
                noModeRequired: true,
                model_name: 'CL',
                query: typed
            };
            if ($scope.fcDetail) {
                data.fc_sk = $scope.fcDetail.sk;
            }
            return genericService.getAutoCompleteData(data).then(function(res) {
                    if (res.data.data.length > 0) {
                        modalSelected(false);
                        var tagsData = genericService.tagInputData(res.data.data);
                        return tagsData;
                    } else {
                        modalSelected(true);
                        return [];
                    }
                })
                .catch(function() {
                    modalSelected(true);
                    return [];
                });
        };

        $scope.editProduct = function(data) {
            var params = {
                prod_sk: $scope.product_sk,
                fulfillment_center_num: $scope.fcNum,                
            };
            prodChannelMappingListService.editProduct(params, data)
                .then(function() {
                    $scope.productChnlMapList($scope.pageNo);
                }, function(error) {
                    $scope.error = true;
                    if (error.errors) {
                        $scope.errorMsg = error.errors[0].error_message;
                    } else if (error.detail) {
                        $scope.errorMsg = error.detail;
                    } else {
                        $scope.errorMsg = error.message || 'ERR3';
                    }
                });
        };

        //Show all Item
        $scope.productChnlMapList = function(pageNum) {
            var pageNo = (pageNum ? pageNum : 1); //sending page number from the filters
            var filterData = $scope.filterData;
            $scope.selectedRow = [];
            $scope.checkbox = [];
            if (pageNo < 2) {
                pageNo = 1;
            }
            $scope.norecordSupplier = false;
            $scope.norecordClient = false;
            $scope.pageNo = pageNo;

            var params = {
                page: pageNo,
                paginate_by: $scope.resultPerPage,
                client_sk: ($scope.client ? $scope.client.sk : null),
                client_store_seller_sku: (filterData.sellerSku ? filterData.sellerSku : null),
                channel: (filterData.channelName ? filterData.channelName : null),
                client_store_product_number: (filterData.channelSku ? filterData.channelSku : null),
                product_number: (filterData.prodNum ? filterData.prodNum.split(',') : null),
                listing_id: (filterData.listingId ? filterData.listingId : null),
                active: ((filterData.avail === 'both') ? null : filterData.avail)

            };
            params = genericService.cleanParams(params); /*If key's value is null then that key is removed.*/

            channelMappingProdService.getProductChannelMappingList(params)
                .success(function(response) {
                    var data = response.data;
                    if (data) {
                        $scope.list = data;
                        $scope.error = false;
                        $scope.isNoRecord = false;
                         $scope.parsedRow = false;
                        // Pagination
                        $scope.totalCount = data.count;
                        $scope.lastCount = $scope.resultPerPage * (Number(pageNo) - 1) + data.results.length;
                        $scope.startCount = $scope.resultPerPage * (Number(pageNo) - 1);
                        $scope.resultText = $scope.totalCount > 1 ? 'RESULTS_TEXT' : 'RESULT_TEXT';
                    } else {
                        $scope.isNoRecord = true;
                    }
                })
                .error(function(error) {
                    $scope.error = true;
                    $scope.isNoRecord = false;
                    if (error.errors) {
                        $scope.errorMsg = error.errors[0].error_message;
                    } else if (error.detail) {
                        $scope.errorMsg = error.detail;
                    } else {
                        $scope.errorMsg = error.message || 'ERR3';
                    }
                });
        };

        $scope.CSVDownload = function() {
            var params = {
                fulfillment_center_num: $scope.fcNum,
                client_store_product_number: $scope.channel_sku ? $scope.channel_sku : null,
                client_store_id: ($scope.client_store ? $scope.client_store : null),
                client_store_seller_sku: ($scope.seller_sku ? $scope.seller_sku : null),
                channel: ($scope.channel_name ? $scope.channel_name : null),
                product_number: ($scope.prod_num ? $scope.prod_num : null),
                listing_id: ($scope.list_id ? $scope.list_id : null),
            };

            params = genericService.cleanParams(params);
            prodChannelMappingListService.downloadFile(params)
                .success(function(response) {
                    $scope.error = false;
                    var csv = prodChannelMappingListService.downLoadCsv(response);
                    csv.click();
                })
                .error(function(error) {
                    $scope.error = true;
                    if (error.errors) {
                        $scope.errorMsg = error.errors[0].error_message;
                    } else if (error.detail) {
                        $scope.errorMsg = error.detail;
                    } else {
                        $scope.errorMsg = error.message || 'ERR3';
                    }
                });
        };

    });