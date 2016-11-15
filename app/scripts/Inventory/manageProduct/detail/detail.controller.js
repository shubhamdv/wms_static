(function() {
    'use strict';
    /* jshint camelcase: false */
    angular.module('wmsApp')
        .controller('productDetailCtrl', ProductDetailCtrl);

    ProductDetailCtrl.$inject = ['$scope', '$rootScope', '$window', '$routeParams', 'productDetailService', 'genericService'];

    function ProductDetailCtrl($scope, $rootScope, $window, $routeParams, productDetailService, genericService) {
        var vm = this;
        var defaultFieldValue = '';
        var changesFieldValue = '';
        vm.error = false;
        vm.isNoRecord = false;
        vm.errorMsg = 'ERR3';
        vm.isEdit = false;

        vm.getProductDetail = getProductDetail;
        vm.editButton = editButton;
        vm.fieldValueChange = fieldValueChange;
        vm.updateProduct = updateProduct;
        activate();

        ///////////////////////////////////////////

        function activate() {
            if ($routeParams.master_prod_sk && !$routeParams.child_prod_sk) {
                vm.prod_detail_sk = $routeParams.master_prod_sk;
            } else if($routeParams.master_prod_sk && $routeParams.child_prod_sk){
                vm.main_sk = $routeParams.master_prod_sk;
                vm.prod_detail_sk = $routeParams.child_prod_sk;
            }
        }

        function getProductDetail() {
            var params = {
                prod_sk: vm.prod_detail_sk,
                fulfillment_center_num: $rootScope.fcNum,
            };
            productDetailService.getProductDetail(params)
                .success(productOnSuccess)
                .error(handleErrorCase);
        }

        function getPCMSDetail(pcms) {
            var params = {
                pcms_id: pcms
            };
            productDetailService.getPCMSDetail(params)
                .success(pcmsOnSuccess)
                .error(handleErrorCase);
        }

        function editButton(){
            vm.isEdit = true; 
            vm.success = false;
            defaultFieldValue = {
                width: vm.prodDetail.width || null,
                height: vm.prodDetail.height || null,
                length: vm.prodDetail.length || null,
                weight: vm.prodDetail.weight || null,
                mrp_chk: vm.prodDetail.mrp_chk
            };
        }

        function fieldValueChange(){
            changesFieldValue = {
                width: vm.prodDetail.width || null,
                height: vm.prodDetail.height || null,
                length: vm.prodDetail.length || null,
                weight: vm.prodDetail.weight || null,
                mrp_chk: vm.prodDetail.mrp_chk
            };
            vm.oldFieldValue = JSON.stringify(defaultFieldValue);
            vm.newFieldValue = JSON.stringify(changesFieldValue);     
        }

        function updateProduct() {
            var params = {
                fulfillment_center_num: $rootScope.fcNum,
                station: $scope.station,
                prod_sk: vm.prod_detail_sk
            };
            var post = {
                width: vm.prodDetail.width || null,
                height: vm.prodDetail.height || null,
                length: vm.prodDetail.length || null,
                weight: vm.prodDetail.weight || null,
                dimension_unit: vm.prodDetail.dimension_unit || 'cm',
                currency: vm.prodDetail.currency || null,
                flags : {
                    mrp_chk: vm.prodDetail.mrp_chk,
                }
            };

            post = genericService.cleanParams(post); // If key value null delete key on postdata
            productDetailService.updateProduct(params, post)
                .success(updateOnSuccess)
                .error(handleErrorCase);
        }

        function productOnSuccess(response) {
            vm.error = false;
            vm.isNoRecord = false;
            if (!_.isEmpty(response.data)) {
                vm.prodDetail = response.data;
                if (vm.prodDetail.pcms_id) {
                    getPCMSDetail(vm.prodDetail.pcms_id);
                }
            } else {
                vm.isNoRecord = true;
            }
        }

        function pcmsOnSuccess(response) {
            vm.error = false;
            vm.isNoRecord = false;
            if (!_.isEmpty(response.product_details)) {
                vm.pcmsDetail = response.product_details;
            } else {
                vm.pcmsAuthMsg = response;
                vm.isNoRecord = true;
            }
        }

        function updateOnSuccess(response) {
            if (response.success) {
                vm.error = false;
                vm.success = true;
                vm.isEdit = false;
            } else {
                handleErrorCase(response);
            }
        }

        function handleErrorCase(error) {
            vm.success = false;
            vm.isNoRecord = false;
            vm.error = true;
            if (error.errors && error.errors.length) {
                vm.errorMsg = error.errors[0].error_message || error.errors[0];
            } else if (error.detail) {
                vm.errorMsg = error.detail;
            } else {
                vm.errorMsg = error.message || 'ERR3';
            }
        }
    }
})();