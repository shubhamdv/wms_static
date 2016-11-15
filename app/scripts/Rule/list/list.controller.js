(function() {
  'use strict';
  /* jshint camelcase: false */
  angular.module('wmsApp')
    .controller('ruleListCtrl', SearchRuleCtrl);
  SearchRuleCtrl.$inject = ['$scope', '$rootScope', '$location', '$translate', '$filter', 'settings', 'ruleListService', 'genericService', 'itemQCService', 'Modal', 'localStorageService', 'passVarFact'];

  function SearchRuleCtrl($scope, $rootScope, $location, $translate, $filter, settings, ruleListService, genericService, itemQCService, Modal, localStorageService, passVarFact) {
    var vm = this;
    var finalFilter = '';
    var json = {};
    vm.modalNames = settings.RULE_CREATE.MODAL_NAMES;
    vm.fcSk = $rootScope.fcSk;
    vm.activityList = settings.ACTIVITY_LIST;
    vm.successMsg =  false;
    vm.errorMsg =  false;
    vm.isProductCategory = false;
    vm.isProductType = false;
    vm.isProductName = false;
    vm.isMasterChannel = false;
    vm.isClientParty = false;
    vm.isClientStore = false;
    vm.isSupplierParty = false;
    vm.isSupplierStore = false;
    vm.filterList = {
      activity: 'ACC',
    };
    vm.savedData = passVarFact.getData();

    vm.ruleUpdated = localStorageService.get('ruleUpdated')?localStorageService.get('ruleUpdated'):false;
    vm.setValue = setValue;
    vm.removeTag = removeTag;
    vm.getAutocompleteData = getAutocompleteData;
    vm.getPCMSAutocompleteData = getPCMSAutocompleteData;
    vm.ruleSearchList = ruleSearchList;
    vm.viewRuleDetails = viewRuleDetails;
    vm.fixStr = fixStr;

    //////////////////////////////////////////////


    function setValue(tag, modalName) {
      vm[modalName] = tag;
      angular.element('.' + modalName + 'Auto .tags input').addClass('hide');
    }

    function removeTag(tag, modalName) {
      vm[modalName] = null;
      angular.element('.' + modalName + 'Auto .tags input').removeClass('hide');
    }

    function modalSelected(modalName, isSelected) {
      vm['is' + capitalize(modalName)] = isSelected ? true : false;
    }

    function getAutocompleteData(typed, modalName) {
      var data = {
        noModeRequired: true,
        model_name: '',
        query: typed
      };
      switch (modalName) {
        case 'masterChannel':
          data.model_name = 'MC';
          break;
        case 'clientParty':
          data.model_name = 'CL';
          break;
        case 'clientStore':
          data.model_name = 'RS';
          break;
        case 'supplierParty':
          data.model_name = 'SP'
          break;
        case 'supplierStore':
          data.model_name = 'WH';
          break;
        case 'fulfillmentCenter':
          data.model_name = 'FC';
          break;
        default:
          break;
      }
      return genericService.getAutoCompleteData(data).then(function(res) {
          var autoData = res.data;
          if (!_.isEmpty(autoData) && _.isArray(autoData.data) && autoData.data.length) {
            modalSelected(modalName, false);
            var tagsData = genericService.tagInputData(autoData.data);
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

    function getPCMSAutocompleteData(typed, modalName) {
      var data = {
        noModeRequired: true,
        model: '',
        query: typed
      };
      switch (modalName) {
        case 'productCategory':
          data.model = 'Category';
          break;
        case 'productType':
          data.model = 'ProductClass';
          break;
        case 'productName':
          data.model = 'Product';
          break;
        default:
          break;
      }
      return genericService.getPcmsAutoCompleteData(data).then(function(res) {
          var autoData = res.data;
          if (!_.isEmpty(autoData) && _.isArray(autoData.data) && autoData.data.length) {
            modalSelected(modalName, false);
            var tagsData = genericService.tagInputData(autoData.data);
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




    function ruleSearchList(isSearch) {
      vm.savedData = {}
      if (isSearch) {
        finalFilter = angular.copy(vm.filterList);
      }
      json = {
        input_parameters: {
          'activity': vm.filterList.activity,
          'fulfillment_center_sk': _.isArray(vm.filterList.fulfillmentCenter) ? vm.filterList.fulfillmentCenter[0].sk : vm.fcSk,
          'flow': vm.filterList.flow || '',
          'clientstore_sk': _.isArray(vm.filterList.clientStore) ? vm.filterList.clientStore[0].sk : '',
          'clientparty_sk': _.isArray(vm.filterList.clientParty) ? vm.filterList.clientParty[0].sk : '',
          'supplierstore_sk': _.isArray(vm.filterList.supplierStore) ? vm.filterList.supplierStore[0].sk : '',
          'supplierparty_sk': _.isArray(vm.filterList.supplierParty) ? vm.filterList.supplierParty[0].sk : '',
          'product': _.isArray(vm.filterList.productName) ? vm.filterList.productName[0].code : '',
          'product_type': _.isArray(vm.filterList.productType) ? vm.filterList.productType[0].slug : '',
          'category': _.isArray(vm.filterList.productCategory) ? vm.filterList.productCategory[0].slug : '',
          'master_channel': _.isArray(vm.filterList.masterChannel) ? vm.filterList.masterChannel[0].sk : ''
        }
      };
      json = genericService.cleanParams(json); /*If key's value is null then that key is removed.*/
      ruleListService.getRuleList(json)
        .success(searchOnSuccess)
        .error(handleError);
    }

    function searchOnSuccess(response) {
        if (response) {
            vm.ruleList = response;
            localStorageService.set('ruleData',response);
            localStorageService.set('ruleFilters',vm.filterList);
            vm.ruleUpdated = false;
            vm.errorMsg =  '';
            angular.element('.js-panel-collapse.in').collapse('hide');
        }
    }

    function handleError(error) {
      vm.successMsg =  '';
      if (_.isArray(error.errors) && error.errors.length) {
        vm.errorMsg = error.errors[0].error_message;
      } else if (error.detail) {
        vm.errorMsg = error.detail;
      } else {
        vm.errorMsg = error.message || 'ERR3';
      }
    }

    function viewRuleDetails(size, index) {
      var modalData = {
          title : 'LABEL_TEXT.RULE.MODAL_TITLE.RULE_DETAIL',
          modalUrl : settings.MODAL_URL.RULE_DETAIL,
          size : settings.MODAL_SIZE.LG,
          ruleIndex : index
      };
      Modal.viewRuleDetails.open(modalData,vm);
    };


    function fixStr(str) {
        var out = str.replace(/^\s*/, "");  // strip leading spaces
        out = out.replace(/^[a-z]|[^\s][A-Z]/g, function(str, offset) {
            if (offset == 0) {
                return(str.toUpperCase());
            } else {
                return(str.substr(0,1) + " " + str.substr(1).toUpperCase());
            }
        });
        return(out);
    }

    //function to capitalize first char of a string
    function capitalize(value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }


  }
})();
