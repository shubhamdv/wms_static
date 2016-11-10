'use strict';

angular.module('wmsApp')
    .factory('Modal', function($rootScope, $modal, $q) {
        /**
         * Opens a modal
         * @param  {Object} scope      - an object to be merged with modal's scope
         * @param  {String} modalClass - (optional) class(es) to be applied to the modal
         * @return {Object}            - the instance $modal.open() returns
         */
        function openModal(scope, modalClass) {

            var modalScope = $rootScope.$new();
            scope = scope || {};
            modalClass = modalClass || 'modal-default';
            angular.extend(modalScope, scope);

            return $modal.open({
                templateUrl: scope.modal.data.modalUrl,
                windowClass: modalClass,
                size : scope.modal.data.size,
                controller: scope.modal.data.controller,
                scope: modalScope
            });
        };



        // Public API here
        return {

            /* Confirmation modals */
            confirm: {

                /**
                 * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
                 * @param  {Function} del - callback, ran when delete is confirmed
                 * @return {Function}     - the function to open the modal (ex. myModalFn)
                 */
                delete: function(del) {
                    del = del || angular.noop;

                    /**
                     * Open a delete confirmation modal
                     * @param  {String} name   - name or info to show on modal
                     * @param  {All}           - any additional args are passed straight to del callback
                     */
                    return function() {
                        var args = Array.prototype.slice.call(arguments),
                            name = args.shift(),
                            deleteModal;

                        deleteModal = openModal({
                            modal: {
                                dismissable: true,
                                title: 'Confirm Delete',
                                html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
                                buttons: [{
                                    classes: 'btn-danger',
                                    text: 'Delete',
                                    click: function(e) {
                                        deleteModal.close(e);
                                    }
                                }, {
                                    classes: 'btn-default',
                                    text: 'Cancel',
                                    click: function(e) {
                                        deleteModal.dismiss(e);
                                    }
                                }]
                            }
                        }, 'modal-danger');

                        deleteModal.result.then(function(event) {
                            del.apply(event, args);
                        });
                    };
                }
            },
            primary: {

                /**
                 * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
                 * @param  {Function} del - callback, ran when delete is confirmed
                 * @return {Function}     - the function to open the modal (ex. myModalFn)
                 */
                open: function(data, scope) {
                    data = data || angular.noop;
                    var modal = openModal({
                        modal: {
                            dismissable: true,
                            data: data,
                            isQC: true,
                            buttons: [{
                                classes: 'btn btn-border',
                                text: 'BTN_CANCEL',
                                click: function(e) {
                                    modal.close(e);
                                }
                            }, {
                                classes: 'btn btn-primary',
                                text: data.btnConfirm,
                                disabled: true,
                                click: function(e) {
                                    var defer = $q.defer();
                                    scope.itemAction(defer, data.btnConfirm);
                                    modal.dismiss(e);
                                }
                            }]
                        }
                    }, '');

                }
            },

            putAwayModal: {

                /**
                 * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
                 * @param  {Function} del - callback, ran when delete is confirmed
                 * @return {Function}     - the function to open the modal (ex. myModalFn)
                 */
                open: function(data, scope) {
                    data = data || angular.noop;
                    var modal = openModal({
                        modal: {
                            dismissable: true,
                            data: data,
                            isQC: true,
                            buttons: [{
                                classes: 'btn btn-border',
                                text: 'NO',
                                click: function(e) {
                                    modal.close(e);
                                }
                            }, {
                                classes: 'btn btn-primary',
                                text: data.btnConfirm,
                                disabled: true,
                                click: function(e) {
                                    var defer = $q.defer();
                                    scope.itemAction(data.itemDetails.serial, data.itemDetails);
                                    modal.dismiss(e);
                                }
                            }]
                        }
                    }, '');

                }

            },

            viewRuleDetails: {

              /**
               * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
               * @param  {Function} del - callback, ran when delete is confirmed
               * @return {Function}     - the function to open the modal (ex. myModalFn)
               */
              open: function(data, scope) {
                  data = data || angular.noop;

                  var modal = openModal({
                      ruleList: scope.ruleList,
                      ruleIndex: data.ruleIndex,
                      fixStr: scope.fixStr,
                      modal: {
                        dismissable: true,
                        data: data,
                        filters: scope.filterList,
                        buttons: [
                        {
                            classes: 'btn btn-default btn-md pull-right',
                            text: 'BTN_CLOSE',
                            click: function(e) {
                               modal.close(e);
                            }
                        }]
                      }
                  }, '');
              }
            },

            createRuleDataPreview: {
              /**
               * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
               * @param  {Function} del - callback, ran when delete is confirmed
               * @return {Function}     - the function to open the modal (ex. myModalFn)
               */
              open: function(data, scope) {
                  data = data || angular.noop;

                  var modal = openModal({
                      fixStr: scope.fixStr,
                      modal: {
                        dismissable: true,
                        createData: scope.createData,
                        ruleData: scope.ruleData,
                        data: data,
                        buttons: [
                          {
                            classes: 'btn btn-secondary',
                            text: 'BTN_CANCEL',
                            click: function(e) {
                               modal.close(e);
                            }
                        },{
                            classes: 'btn btn-primary',
                            text: 'BTN_CONFIRM',
                            click: function(e) {
                                var defer = $q.defer();
                                scope.createRule(modal,e);
                            }
                        }]
                      }
                  }, '');
              }
            }

          };
    });
