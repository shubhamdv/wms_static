'use strict';
/* jshint camelcase: false */

angular.module('wmsApp')
    .controller('CreateUnExpctedBatchCtrl', function($scope, settings, $filter, CreateUnExpctedBatchServices, manageAsnService, genericService) {
        $scope.refresh = true; // for submenu click
        $scope.page = 'create';
        $scope.info = false;
        $scope.asnNumber = '';
        $scope.searchResult = false;
        /*Pagination Settings*/
        $scope.startCount = settings.PAGINATION.startCount;
        $scope.pageNo = settings.PAGINATION.pageNo;
        $scope.lastCount = settings.PAGINATION.lastCount;
        $scope.totalCount = settings.PAGINATION.totalCount;
        $scope.resultPerPage = settings.PAGINATION.resultPerPage;
        $scope.products = [];
        $scope.norecord = false;
        $scope.sendData = [];
        $scope.asnDetail = '';
        $scope.isQuantity = true;

        /*Autocomplete product field intiliazation*/
        $scope.product = {
            value: null,
            qt: null
        };

        /*Get ASN List row value  Details*/
        $scope.radioValue = {
            asndetail : $scope.asnDetail
        };

        $scope.onQuanChange = function(prod){
            if(prod){
                if(prod.quantity && prod.quantity > 0){
                    $scope.isQuantity = true;
                    $scope.error = false;
                }else{
                    $scope.isQuantity = false;
                    $scope.error = true;
                    $scope.errRow = prod.name;
                    $scope.errMsg = 'ERR_MSG.MSG11';
                    return false;
                }
            }else{
                $scope.error = false;
            }
            _.each($scope.products, function(prod){
                if(prod.quantity && prod.quantity > 0){
                    $scope.isQuantity = true;
                    $scope.error = false;
                }else{
                    $scope.isQuantity = false;
                    $scope.error = true;
                    $scope.errRow = prod.name;
                    $scope.errMsg = 'ERR_MSG.MSG11';
                    return false;
                }
            });
        };


        $scope.refreshPage = function() {
            $scope.error = false;
            $scope.searchResult = false;
            $scope.getDetail = '';
            $scope.asnDetail = '';
            $scope.radioValue.asndetail = '';
            $scope.data = {};
            $scope.page = 'create';
            $scope.asnId = '';
            $scope.products = [];
            $scope.asnSearchList = null;
            $scope.info = false;
            $scope.sendData = [];
        };

        $scope.addAsnNum = function() {
            $scope.page = 'create';
            $scope.error = false;

        };

        $scope.addProducts = function() {
            $scope.page = 'addProduct';
            $scope.getDetail = JSON.parse($scope.radioValue.asndetail);
            var mgmnt_lookup_id = $scope.getDetail.mgmnt_lkp;
            $scope.manageLook(mgmnt_lookup_id);
            $scope.error = false;
            $scope.success = false;
            $scope.info = false;
        };

        $scope.back = function() {
            $scope.page = 'addProduct';
            $scope.sendData = [];
            $scope.success = false;
            $scope.info = false;
        };

        /*Set Model name for autocomplete to hit the api*/
        $scope.error = false;
        $scope.success = false;
        $scope.succMsg = 'ASN_PAGE.CREATE.SUCC_MSG';
        $scope.errMsg = 'ERR3';
        $scope.productText = 'PROD_TEXT';

        $scope.setValue = function() {
            $('.addProduct .tags input').addClass('hide');
        };
        $scope.removeTag = function(){
            /*TODO end*/
            $('.addProduct .tags input').removeClass('hide');
        };

        $scope.getAutocompleteData = function(typed) {
            var data = {
                query: typed,
                model_name: 'PROD',
                noModeRequired: true
            };
            if($scope.management_lookup){
                data.client_id = $scope.management_lookup.client_sk;
            }
            return genericService.getAutoCompleteData(data).then(function(res) {
                if (res.data.data.length > 0) {
                    $scope.norecord = false;
                    var tagsData = genericService.tagInputData(res.data.data);
                    return tagsData;
                } else {
                    $scope.norecord = true;
                    return [];
                }
            })
            .catch(function(){
                $scope.norecord = true;
                return [];
            });
        };

        $scope.asnList = function(pageNo) {
            var asnNum = $scope.asnNumber;
            $scope.radioValue.asndetail = '';
            $scope.success = false;
            $scope.error = false;
            $scope.radio = [];
            if (pageNo < 2) {
                pageNo = 1;
            }
            $scope.pageNo = pageNo;
            var params = {
                page: pageNo,
                paginate_by: $scope.resultPerPage,
                fulfillment_center_num: ($scope.fcDetail ? $scope.fcDetail.fulfillment_center_num : $scope.fcNum),
                source_number: asnNum
            };
            manageAsnService.getAsnList(params)
                .success(function(response) {
                    var data = response.data;
                    if (data.results.length > 0) {
                        $scope.asnSearchList = data;
                        $scope.error = false;
                        $scope.isNoRecord = false;
                        // Pagination
                        $scope.totalCount = data.count;
                        $scope.lastCount = $scope.resultPerPage * (Number(pageNo) - 1) + data.results.length;
                        $scope.startCount = $scope.resultPerPage * (Number(pageNo) - 1);
                        $scope.asnNumber = '';
                        $scope.searchResult = true;

                    } else {
                        $scope.error = true;
                        $scope.searchResult = false;
                        $scope.errMsg = $filter('translate')('ERR_MSG.MSG8') + $scope.asnNumber;
                        $scope.asnNumber = '';
                    }
                })
                .error(function(error) {
                    $scope.asnNumber = '';
                    $scope.error = true;
                    $scope.isNoRecord = false;
                    $scope.searchResult = false;
                    if (error.errors) {
                        $scope.errMsg = error.errors[0].error_message;
                    } else if (error.detail) {
                        $scope.errMsg = error.detail;
                    } else {
                        $scope.errMsg = error.message || 'ERR3';
                    }
                });
        };

        $scope.manageLook = function(lookup_id){
            var params = {
                manage_lookup : lookup_id
            };
            genericService.getManageLookup(params)
                .success(function(response) {
                    var data = response.data;
                    if (data) {
                        $scope.management_lookup = data;
                        $scope.error = false;
                    } else {
                        $scope.isNoRecord = true;
                        $scope.error = true;
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


        // Selected row json create

        $scope.createProductList = function() {
            var fields = $scope.product.value[0];
            if($scope.product.qt !== 0){
                $scope.error = false;
                var product = {
                    quantity: parseInt($scope.product.qt),
                    prod_number: fields.number,
                    name: fields.name,
                    prod_sk : fields.sk,
                    new_flow: true
                };
                var alreadyadded = _.filter($scope.products, function(o){
                    return o.prod_sk === fields.sk;
                });
                if(alreadyadded.length !== 0){
                    alreadyadded[0].quantity = alreadyadded[0].quantity ? alreadyadded[0].quantity : 0;
                    alreadyadded[0].quantity = parseInt(alreadyadded[0].quantity) + parseInt($scope.product.qt);
                }
                else{
                 $scope.products.unshift(product);
                }
                $('.addProduct .tags input').removeClass('hide');
                $scope.productText = $scope.products.length < 2 ? 'PROD_TEXT' : 'PRODS_TEXT';
                $scope.product.value = null;
                $scope.product.qt = null;
            } else {
                $scope.errorMsg = 'ERR6';
                $scope.error = true;
                $scope.product.qt = null;
            }
            $scope.onQuanChange();
        };

        $scope.removeProduct = function(product, index) {
            _.each($scope.products, function(prod) {
                if (prod.qt === product.qt) {
                    $scope.products.splice(index, 1);
                    $scope.sendData.splice(index, 1);
                    return false;
                }
            });

            $scope.productText = $scope.products.length > 1 ? 'PRODS_TEXT' : 'PROD_TEXT';
            $scope.onQuanChange();
        };

        $scope.summary = function() {
            $scope.page = 'summary';
            $scope.info = true;
            var data = {};
            _.each($scope.products, function(item) {
                data = {
                    prod_sk : item.prod_sk,
                    product_qty : item.quantity
                };
                $scope.sendData.unshift(data); // send data for create batch
            });

        };


        $scope.createBatch = function() {
            var params = {
                fulfillment_center_num : $scope.fcNum
            };
            var data = {
                agn_id: $scope.getDetail.id,
                client_store_sk : $scope.management_lookup.client_store_sk,
                supplier_store_sk: $scope.management_lookup.supplier_store_sk,
                products : $scope.sendData,
                source_number : $scope.getDetail.source_number
            };
            CreateUnExpctedBatchServices.createBatch(params, data)
                .success(function(response) {
                    if (response.success) {
                        $scope.success = true;
                        $scope.batchNumber =  response.data.po_number;
                        $scope.refreshPage();
                    } else {
                        $scope.error = true;
                        if (typeof data.errors !== 'undefined') {
                            $scope.errMsg = data.errors[0].error_message;
                        } else if (data.message) {
                            $scope.errMsg = data.message;
                        } else if (data.detail) {
                            $scope.errMsg = data.detail;
                        } else {
                            $scope.errMsg = data.detail || 'ERR3';
                        }
                    }
                })
                // Bad credentials sent, ok let's inform to try again
                .error(function(data) {
                    $scope.error = true;
                    if (typeof data.errors !== 'undefined') {
                        $scope.errMsg = data.errors[0].error_message;
                    } else if (data.message) {
                        $scope.errMsg = data.message;
                    } else if (data.detail) {
                        $scope.errMsg = data.detail;
                    } else {
                        $scope.errMsg = data.detail || 'ERR3';
                    }
                });
        };
    });
