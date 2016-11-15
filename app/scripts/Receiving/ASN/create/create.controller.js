'use strict';
/* jshint camelcase: false */

angular.module('wmsApp')
    .controller('CreateAsnCtrl', function($scope, createAsnService, genericService) {
        $scope.createASNData = {};
        $scope.refresh = true; // for submenu click
        $scope.data = {};
        $scope.page = 'create';
        $scope.info = false;
        $scope.sendData = [];
        $scope.products = [];
        $scope.isQuantity = true;
        /*Autocomplete product field intiliazation*/
        $scope.product = {
            value: null,
            qt: null
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

        $scope.addClientDetail = function(){
             $scope.page = 'create';
             $('.createClient .tags input').addClass('hide');
             $('.createSupplier .tags input').addClass('hide');
        };

        $scope.refreshPage = function() {
            $scope.sendData = [];
            $scope.error = false;
            $scope.info = false;
            $scope.page = 'create';
            $scope.data = {};
            $scope.createASNData = {};
            $scope.products = [];
            $('.createClient .tags input').removeClass('hide');
            $('.createSupplier .tags input').removeClass('hide');
        };

        $scope.addProducts = function() {
            $scope.page = 'addProduct';
            $scope.error = false;
            $scope.sendData = [];
            $scope.info = false;
        };

        $scope.noClientrecord = false;
        $scope.noSupplierrecord = false;
        $scope.norecord = false;
        /*Set Model name for autocomplete to hit the api*/
        $scope.error = false;
        $scope.success = false;
        $scope.errMsg = 'ERR3';
        $scope.productText = 'PROD_TEXT';

        $scope.setValue = function(tag, modalName) {
            if(modalName === 'product'){
                $scope.norecord = false;
                $('.addProduct .tags input').addClass('hide');
            }else if(modalName === 'client'){
                $scope.data.client = tag;
                $('.createClient .tags input').addClass('hide');
            }else{
                $scope.data.supplier = tag;
                $('.createSupplier .tags input').addClass('hide');
            }
        };
        $scope.removeTag = function(tag, modalName){
            /*TODO end*/
            if(modalName === 'product'){
                $('.addProduct .tags input').removeClass('hide');
            }else if(modalName === 'client'){
                $scope.data.client = null;
                $('.createClient .tags input').removeClass('hide');
            }else{
                $('.createSupplier .tags input').removeClass('hide');
                $scope.data.supplier = null;
            }

        };

        var modalSelected = function(modalName, isSelected){
            if(modalName === 'product'){
                $scope.norecord = isSelected ? true: false;
            }else if(modalName === 'client'){
                $scope.noClientrecord = isSelected ? true: false;
            }else{
                $scope.noSupplierrecord = isSelected ? true: false;
            }
        };

        // For Auto Complete of Products
        $scope.getAutocompleteData = function(typed, modalName) {
            var data = {
                noModeRequired: true,
                model_name: '',
                query: typed
            };
            var filterData = $scope.data;
            if(modalName === 'product'){
                data.model_name = 'PROD';
                if(filterData.client){
                    data.client_id = filterData.client.owner__sk;
                }
            }else if(modalName === 'client'){
               data.model_name = 'RS';
               if($scope.fcDetail){
                  data.fc_sk = $scope.fcDetail.sk;
               }
            }else{
                data.model_name = 'WH';
                if(filterData.client){
                    data.client_store_id = filterData.client.id;
                }
            }

            return genericService.getAutoCompleteData(data).then(function(res) {
                if (res.data.data.length > 0) {
                    modalSelected(modalName,false);
                    var tagsData = genericService.tagInputData(res.data.data);
                    return tagsData;
                } else {
                     modalSelected(modalName,true);
                    return [];
                }
            })
            .catch(function(){
                modalSelected(modalName,true);
                return [];
            });
        };

        $scope.createProductList = function() {
            var fields = $scope.product.value[0];
            if($scope.product.qt !== 0){
                $scope.error = false;
                var product = {
                    quantity: parseInt($scope.product.qt),
                    prod_number: fields.number,
                    name: fields.name,
                    prod_sk : fields.sk
                };
                var alreadyadded = _.filter($scope.products, function(o){return o.prod_sk === fields.sk;});
                if(alreadyadded.length !== 0){
                    alreadyadded[0].quantity = alreadyadded[0].quantity ? alreadyadded[0].quantity :0;
                    alreadyadded[0].quantity = parseInt(alreadyadded[0].quantity) + parseInt($scope.product.qt);
                }
                else{
                 $scope.products.unshift(product);
                }
                $('.addProduct .tags input').removeClass('hide');
                $scope.productText = $scope.products.length > 1 ? 'PRODS_TEXT' : 'PROD_TEXT';
                $scope.product.value = null;
                $scope.product.qt = null;
            } else {
               $scope.errMsg = 'ERR6';
               $scope.error = true;
               $scope.product.qt = null;
            }
            $scope.onQuanChange();
        };

        $scope.summary = function() {
            $scope.page = 'summary';
            $scope.info = true;
            var data = [];
            _.each($scope.products, function(item) {
                data = {
                    prod_sk : item.prod_sk,
                    product_qty : item.quantity,
                    prod_number : item.prod_number,
                };
                $scope.sendData.push(data);
            });
             // send data for create batch
        };

        $scope.removeProduct = function(product, index) {
            _.each($scope.products, function(prod) {
                if (prod.qt === product.qt) {
                    $scope.products.splice(index, 1);
                    $scope.sendData.splice(index, 1);
                    return false;
                }
            });
            $scope.onQuanChange();
            $scope.productText = $scope.products.length > 1 ? 'PRODS_TEXT' : 'PROD_TEXT';
        };

        $scope.createASN = function() {
            var params = {
                fulfillment_center_num: $scope.fcNum,
                channel_id: $scope.data.client.sk
            };

            $scope.source = $scope.createASNData.shipNum;

            var data = {
                source_number: $scope.createASNData.shipNum,
                auxilliary_vendor: $scope.createASNData.vendor,
                supplier_store: $scope.data.supplier.sk,
                products: $scope.products
            };
            createAsnService.createASN(params, data)
                .success(function(response) {
                    $scope.error = false;
                    var data = response.data;
                    if (response.success) {
                        $scope.success = true;
                        $scope.refreshPage();
                        $scope.source = data.source_number;
                        $scope.asnId = data.asn_id;
                    } else {
                        $scope.error = true;
                        if (typeof response.errors !== 'undefined') {
                            $scope.errMsg = response.errors[0].error_message;
                        }else{
                          $scope.errMsg = response.error || 'ERR3';
                        }
                        $scope.success = false;
                    }
                })
                // Bad credentials sent, ok let's inform to try again
                .error(function(data) {
                    $scope.error = true;
                    if (typeof data.errors !== 'undefined') {
                        $scope.errMsg = data.errors[0].error_message;
                    } else if (data.detail) {
                        $scope.errMsg = data.detail;
                    } else {
                        $scope.errMsg = data.detail || 'ERR3';
                    }
                });
        };
    });
