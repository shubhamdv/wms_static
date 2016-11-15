'use strict';
/* jshint camelcase: false */
angular.module('wmsApp')
    .controller('batchHistoryCtrl', function($scope, $routeParams, batchHistoryService, settings, genericService) {

        /*To set Module and submodule name in breadcrumb*/
        $scope.error = false;
        $scope.data = '';
        $scope.isNoRecord = false;
        $scope.sendData = [];
        $scope.norecord = 'NO_RECORD';
        $scope.resultText = 'RESULTS_TEXT';
        $scope.printSendData = [];
        /*If no data */
        if ($routeParams.id) {
            $scope.asnId = $routeParams.id;
        }
        /*Pagination Settings*/
        $scope.startCount = settings.PAGINATION.startCount;
        $scope.pageNo = settings.PAGINATION.pageNo;
        $scope.lastCount = settings.PAGINATION.lastCount;
        $scope.totalCount = settings.PAGINATION.totalCount;
        $scope.resultPerPage = settings.PAGINATION.resultPerPage;

        //Show ASN Details
        $scope.asnBatchDetail = function(pageNo) {
            var params = {
                po_id: $scope.asnId,
                fulfillment_center_num: $scope.fcNum
            };
            if (!pageNo || pageNo < 2) {
                pageNo = 1;
            }
            $scope.pageNo = pageNo;
            batchHistoryService.getAsnBatch(params)
                .success(function(response) {
                    var data = response.data;
                    if (response.success) {
                        $scope.sourceNum = data.source_number;
                        $scope.data = data;
                        $scope.error = false;
                        var manage_look = $scope.data.mgmnt_lkp;
                        $scope.manageLook(manage_look);
                        $scope.batchHistory(pageNo);
                    } else {
                        $scope.isNoRecord = true;
                    }
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

        //Show batch history according ASN
        $scope.batchHistory = function(pageNo) {
            var params = {
                agn_id: $scope.asnId,
                fulfillment_center_num: ($scope.fcDetail ? $scope.fcDetail.fulfillment_center_num : $scope.fcNum),
                page: pageNo,
                paginate_by: $scope.resultPerPage
            };
            params = genericService.cleanParams(params); /*If key's value is null then that key is removed.*/
            batchHistoryService.getBatchHis(params)
                .success(function(response) {
                    var data = response.data;
                    if (data) {
                        // Pagination
                        $scope.totalCount = data.count;
                        $scope.lastCount = $scope.resultPerPage * (Number(pageNo) - 1) + data.results.length;
                        $scope.startCount = $scope.resultPerPage * (Number(pageNo) - 1);
                        $scope.batches = data.results;
                        $scope.resultText = $scope.totalCount > 1 ? 'RESULTS_TEXT' : 'RESULT_TEXT';
                        $scope.error = false;
                        $scope.isNoRecord = false;
                    } else {
                        $scope.norecord = 'NO_RECORD';
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

        // Default function called
        $scope.asnBatchDetail($scope.pageNo);

        $scope.cancelASN = function() {
            batchHistoryService.cancelAsn($scope.sendData)
                .success(function() {
                    $scope.error = false;
                    $scope.sendData = [];
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


        $scope.revertExpStatus = function() {
            batchHistoryService.revertExpectStatus($scope.sendData)
                .success(function() {
                    $scope.error = false;
                    $scope.sendData = [];

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
