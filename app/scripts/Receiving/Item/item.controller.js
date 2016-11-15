(function() {
        'use strict';
        /* jshint camelcase: false */
        angular.module('wmsApp')
            .controller('itemReceivingCtrl', ItemReceivingCtrl);
        ItemReceivingCtrl.$inject = ['$rootScope', 'settings', 'itemReceiveService', 'batchDetailService', 'productDetailService', 'genericService'];

        function ItemReceivingCtrl($rootScope, settings, itemReceiveService, batchDetailService, productDetailService, genericService) {
            var vm = this;
            var today = new Date();
            var yesterday = new Date(today.setDate(today.getDate() - 1));
            var params = {};
            var postData = {};
            vm.parseInt = parseInt;

            /*Pagination Settings*/
            vm.startCount = settings.PAGINATION.startCount;
            vm.pageNo = settings.PAGINATION.pageNo;
            vm.lastCount = settings.PAGINATION.lastCount;
            vm.totalCount = settings.PAGINATION.totalCount;
            vm.resultPerPage = settings.PAGINATION.resultPerPage;

            vm.resultText = 'RESULTS_TEXT';
            vm.error = false;
            vm.isBatchError = false;
            vm.doneBtn = false;
            vm.isComboInfo = false;
            vm.batchNumber = '';
            vm.qty = [];
            vm.qtyChild = {};
            vm.price = [];
            vm.childProduct = [];
            vm.prodDetail = [];
            vm.rcvItemQty = 0;
            vm.minDate = yesterday.toString();

            vm.fetchBatchDetail = fetchBatchDetail;
            vm.fetchProductList = fetchProductList;
            vm.componentProdList = componentProdList;
            vm.receiveItem = receiveItem;
            vm.printBarCode = printBarCode;
            vm.rePrintItem = rePrintItem;
            vm.refreshPage = refreshPage;

            //////////////////////////////////////////////

            function fetchBatchDetail() {
                vm.qty = [];
                vm.qtyChild = {};
                vm.childProduct = [];
                vm.rcvItemQty = 0;
                vm.products = '';
                var _params = {
                    number: vm.batchNumber,
                    fulfillment_center_num: $rootScope.fcNum
                };
                itemReceiveService.getBatchDetail(_params)
                    .success(batchDetailOnSuccess)
                    .error(handleError);
            }

            function batchDetailOnSuccess(response) {
                var data = response.data;
                vm.success = false;
                if (!_.isEmpty(data) && (data.status === 'BRCV' || data.status === 'RCV')) {
                    vm.error = false;
                    vm.batchDetails = data;
                    fetchProductList();
                } else{
                    vm.error = true;
                    vm.status = data.status;
                    vm.isBatchError = true;
                }
            }

            function fetchProductList(pageNum, isSearch) {
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
                    batch_id: vm.batchDetails.id,
                    fulfillment_center_num: $rootScope.fcNum,
                    pagination: true,
                    paginate_by: vm.resultPerPage,
                    page: vm.pageNumber,
                    query: vm.prodSearch
                };
                params = genericService.cleanParams(params); /*If key's value is null then that key is removed.*/
                batchDetailService.getProductList(params)
                    .success(prodListOnSuccess)
                    .error(handleError);
            }

            function prodListOnSuccess(response) {
                var data = response.data;
                if (!_.isEmpty(data) && _.isArray(data.results)) {
                    vm.error = false;
                    vm.products = data.results;
                    oneByOneProdDetail(vm.products);

                    // Pagination
                    vm.totalCount = data.count;
                    vm.lastCount = vm.resultPerPage * (+vm.pageNumber - 1) + vm.products.length;
                    vm.startCount = vm.resultPerPage * (+vm.pageNumber - 1);
                    vm.resultText = vm.totalCount > 1 ? 'RESULTS_TEXT' : 'RESULT_TEXT';
                }
            }

            function oneByOneProdDetail(prodList){
                _.each(prodList, function(item, index){
                    getProductDetail(item.prod_sk, index)
                });
            }

            function getProductDetail(sk, index) {
                var params = {
                    prod_sk: sk,
                    fulfillment_center_num: $rootScope.fcNum
                };
                productDetailService.getProductDetail(params)
                    .success(function(response){
                        productOnSuccess(response, index)
                    })
                    .error(handleError);
            }

            function productOnSuccess(response, index) {
                vm.error = false;
                vm.isNoRecord = false;
                if (!_.isEmpty(response.data)) {
                    vm.products[index].prod_details = response.data;
                } else {
                    vm.isNoRecord = true;
                }
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

            function updateProduct(masterProd) {
                var params = {
                    fulfillment_center_num: $rootScope.fcNum,
                    station: $rootScope.station,
                    prod_sk: masterProd.prod_sk
                };
                var sendData = {
                    mrp: masterProd.prod_details.mrp || null,
                    exp_date: new Date(masterProd.date)
                };
                sendData = genericService.cleanParams(sendData); // If key value null delete key on postdata
                productDetailService.updateProduct(params, sendData)
                    .success(updateOnSuccess)
                    .error(handleError);
            }

            function updateOnSuccess(response) {
                if (response.success) {
                    vm.error = false;                    
                } else {
                    handleError(response);
                }
            }

            function receiveItem(product, index, isComponent, masterProd, masterIndex) {
                postData = {};
                var _params = {
                    fulfillment_center_num: $rootScope.fcNum,
                    station: $rootScope.station
                };
                
                if (isComponent) {
                    postData = {
                        total_received_qty: vm.qtyChild[masterIndex][index] || null,
                        po_id: vm.batchDetails.id || null,
                        total_expected_qty: product.product_qty || null,
                        prod_number: product.prod_number || null,
                        source: product.source || null,
                        master_prod_sk : masterProd.prod_sk,
                        new_flow: true
                    }
                } else {
                    postData = {
                        total_received_qty: vm.qty[index] || null,
                        po_id: vm.batchDetails.id || null,
                        total_expected_qty: product.product_qty || null,
                        prod_number: product.prod_number || null,
                        source: product.source || null,
                        exp_date: new Date(product.date),
                        mrp: product.prod_details.mrp || null,
                        new_flow: true
                    };
                }
                _params = genericService.cleanParams(_params); /*If key's value is null then that key is removed.*/
                postData = genericService.cleanParams(postData); /*If key's value is null then that key is removed.*/
                itemReceiveService.receiveItem(_params, postData)
                    .success(function(response) {
                        rcvItemOnSuccess(response, product, index, isComponent, masterProd, masterIndex);
                    })
                    .error(handleError);
            }

            function rcvItemOnSuccess(response, product, index, isComponent, masterProd, masterIndex) {
                if (response.success === true) {
                    itemSerialize(product, index, isComponent, masterProd, masterIndex);
                }
            }

            function itemSerialize(product, index, isComponent, masterProd, masterIndex) {
                var _params = {
                    fulfillment_center_num: $rootScope.fcNum,
                    station: $rootScope.station
                };
                var serPostData = angular.copy(postData);
                serPostData.username = $rootScope.profileData.user_profile.username;
                serPostData.batchNumber = vm.number;

                if(isComponent){
                    serPostData.ser_qty = vm.qtyChild[masterIndex][index];
                } else{
                    serPostData.ser_qty = vm.qty[index];
                }

                serPostData = genericService.cleanParams(serPostData); /*If key's value is null then that key is removed.*/
                _params = genericService.cleanParams(_params);
                itemReceiveService.itemSerialize(_params, serPostData)
                    .success(function(response) {
                        itemSerOnSuccess(response, product, index, isComponent, serPostData, masterProd, masterIndex);
                    })
                    .error(handleError);
            }

            function itemSerOnSuccess(response, product, index, isComponent, serPostData, masterProd, masterIndex) {
                if (response.success) {
                    var serializeData = response.data;
                    product.received_qty = response.ser_qty;
                    vm.rcvItemQty = vm.rcvItemQty + (+serPostData.ser_qty);  // for show total item received
                    if(isComponent){
                        updateProduct(masterProd);
                    }
                    printBarCode(product, index, serializeData, isComponent, masterIndex);
                }
            }

            function printBarCode(product, index, printData, isComponent, masterIndex) {
                product.removeDate = false;
                var sendBarCodeData = [];
                _.each(printData, function(items) {
                    var data = {
                        barcode_of: items.serial,
                        count: 1,
                        extra_info: [items.product_number]
                    };
                    sendBarCodeData.push(data);
                });
                itemReceiveService.printProductBarCode(sendBarCodeData)
                    .success(function(response){
                        printBarOnSuccess(response, product, index, isComponent, masterIndex);
                    })
                    .error(handleError);
            }

            function printBarOnSuccess(response, product, index, isComponent, masterIndex) {
                var downloadPdf = itemReceiveService.downLoadPdf(response);
                downloadPdf.click();
                vm.doneBtn = true;
                if(isComponent){
                    vm.qtyChild = null;
                } else{
                    vm.qty = null;
                    product.date = null;
                }
            }

            function rePrintItem(product, index, isComponent) {
                var _postData = {
                    prod_number: product.prod_number,
                    username: $rootScope.profileData.user_profile.username,
                    batchNumber: vm.number,
                    new_flow: true
                };
                _postData = genericService.cleanParams(_postData); /*If key's value is null then that key is removed.*/

                itemReceiveService.rePrintItem(_postData)
                    .success(function(response) {
                        rePrintOnSuccess(response, product, index, isComponent);
                    })
                    .error(handleError);
            }

            function rePrintOnSuccess(response, product, index, isComponent) {
                if (response.success) {
                    printBarCode(product, index, response.data, isComponent);
                }
            }

            function refreshPage(){
                vm.batchNum = vm.batchNumber;
                vm.batchNumber = '';
                vm.batchDetails = '';
                vm.products = '';
                vm.childProduct = [];
                vm.qty = null;
                vm.qtyChild = null; 
                vm.doneBtn = false;
                vm.success= true;    
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