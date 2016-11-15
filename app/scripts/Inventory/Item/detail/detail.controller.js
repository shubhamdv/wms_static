'use strict';
/* jshint camelcase: false */

angular.module('wmsApp')
    .controller('itemDetailCtrl', ItemDetailCtrl)
ItemDetailCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$filter', 'itemDetailService', 'settings', 'genericService']

function ItemDetailCtrl($scope, $rootScope, $routeParams, $filter, itemDetailService, settings, genericService) {
    var vm = this;
    var today = new Date();
    var yesterday =  new Date(today.setDate(today.getDate() - 1));
    vm.error = false;
    vm.data = '';
    vm.isNoRecord = false;
    vm.norecord = 'NO_RECORD';
    vm.resultText = 'RESULTS_TEXT';
    vm.isEdit = false;
    vm.removeDate = false;
    vm.success = false;
    vm.deafult_expire_at = '';
    vm.minDate = yesterday.toString();

    vm.itemDetails = itemDetails;
    vm.getManageLookUp = getManageLookUp;
    vm.itemProdDetails = itemProdDetails;
    vm.editButton = editButton;
    vm.update = update;
    activate();

    ///////////////////////////////////

    function activate() {
        if ($routeParams.serial) {
            vm.serialNum = $routeParams.serial; // Serial number get from params
        }
    }

    function itemDetails() {
        var params = {
            number: vm.serialNum,
            fulfillment_center_num: $rootScope.fcNum
        };
        itemDetailService.getItemDetail(params)
            .success(itemOnSuccess)
            .error(handleError);
    }

    function getManageLookUp(lookupid) {
        var params = {
            id: lookupid
        };
        itemDetailService.getManageLookUp(params)
            .success(mlpOnSuccess)
            .error(handleError);
    }

    function itemProdDetails(sk) {
        var params = {
            prod_sk: sk,
            fulfillment_center_num: $rootScope.fcNum
        };
        itemDetailService.getItemProDetail(params)
            .success(productOnSuccess)
            .error(handleError);
    }

    function editButton() {
        vm.isEdit = true;
        vm.expDate = $filter('date')(vm.itemDetail.expire_at, 'yyyy-MM-dd'); // date formate set for display
        vm.itemDetail.expire_at = vm.expDate;
    }

    function update() {
        var params = {
            number: vm.serialNum,
            fulfillment_center_num: $rootScope.fcNum
        };
        // Create date formate
        if (!vm.itemDetail.expire_at) {
            vm.date = null;
        } else {
            vm.date = new Date(vm.itemDetail.expire_at);
        }
        var postData = {
            weight: vm.itemDetail.weight || null,
            height: vm.itemDetail.height || null,
            length: vm.itemDetail.length || null,
            width: vm.itemDetail.width || null,
            mrp: vm.itemDetail.mrp || null,
            expire_at: vm.date,
            secondary_serial_one: vm.itemDetail.secondary_serial_one || null
        };
        postData = genericService.cleanParams(postData); // If Key value null remove key
        itemDetailService.updateAttr(postData, params)
            .success(updateOnSuccess)
            .error(handleError);
    }

    function itemOnSuccess(response) {
        if (!_.isEmpty(response.data)) {
            vm.itemDetail = response.data;
            vm.deafult_expire_at = vm.itemDetail.expire_at;
            vm.error = false;
            // Item Product Detail function called
            if (vm.itemDetail.prod_sk) {
                itemProdDetails(vm.itemDetail.prod_sk);
            }
            // Management Look up datail function called
            if (vm.itemDetail.mgmnt_lkp) {
                getManageLookUp(vm.itemDetail.mgmnt_lkp); 
            }
        } else {
            vm.isNoRecord = true;
        }
    }

    function mlpOnSuccess(response) {
        vm.error = false;
        vm.isNoRecord = false;
        if (!_.isEmpty(response.data)) {
            var data = response.data;
            data.supplier_sku = data.supplier_sk.slice(data.supplier_sk.lastIndexOf('_')).split('_')[1];
            vm.itemDetail.mlp_detail = data;
        } else {
            vm.isNoRecord = true;
        }
    }

    function productOnSuccess(response) {
        if (!_.isEmpty(response.data)) {
            vm.itemDetail.prod_detail = response.data;
            vm.error = false;
            vm.isNoRecord = false;
        } else {
            vm.norecord = 'NO_RECORD';
            vm.isNoRecord = true;
        }
    }

    function updateOnSuccess() {
        vm.isEdit = false;
        vm.removeDate = false;
        vm.success = true;
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