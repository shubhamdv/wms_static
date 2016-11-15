(function() {
  'use strict';
  /* jshint camelcase: false */
  angular.module('wmsApp')
    .controller('createRuleCtrl', createRuleCtrl);
  createRuleCtrl.$inject = ['$scope', '$rootScope', '$translate', '$filter', 'settings', 'genericService', 'createRuleService', 'Modal', '$window', 'timelineSteps'];

  function createRuleCtrl($scope, $rootScope, $translate, $filter, settings, genericService, createRuleService, Modal, $window, timelineSteps) {

    //initializing variables, arrays and objects
    var vm = this;
    vm.modalNames = settings.RULE_CREATE.MODAL_NAMES;
    vm.fcSk = $rootScope.fcSk;
    vm.activityList = settings.ACTIVITY_LIST;
    vm.successMsg = false;
    vm.errorMsg = false;
    vm.currentStep = '1';
    vm.createData = {};
    vm.ruleData = {};
    vm.ruleData.attributes = {};
    vm.createData.activity = 'ACC';
    vm.ruleData.priority = 1;
    vm.ruleData.roadform = 'no';
    vm.attributesList = {};
    vm.reasons = {};
    vm.ruleData.reasons = {};
    vm.instructions = {};
    vm.ruleData.instructions = {};

    //functions
    vm.changeStep = changeStep;
    vm.setValue = setValue;
    vm.removeTag = removeTag;
    vm.getAutocompleteData = getAutocompleteData;
    vm.getPCMSAutocompleteData = getPCMSAutocompleteData;
    vm.getAttributesFromPCM = getAttributesFromPCM;
    vm.createRule = createRule;
    vm.createRuleDataPreview = createRuleDataPreview;
    vm.refreshPage = refreshPage;
    vm.fixStr = fixStr;
    vm.step_process = step_process;
    vm.move_to_step = move_to_step;
    activate();

    /////////////////////////////////////////////////

    function activate(){
      getAttributesFromPCM();
      getReasonsAndInstructions('INS');
      getReasonsAndInstructions('RSN');
    }

    //function to get attributes from PCMS API
    function getAttributesFromPCM() {
      createRuleService.getAttributesFromPCM()
        .success(attributesFromPCMDOnSuccess)
        .error(handleError);
    }

    //function to handle success when getting attributes from PCMS API
    function attributesFromPCMDOnSuccess(response) {
      _.sortBy(_.each(response.attribute_list, function(obj, index) {
        vm.attributesList[index] = {
          "id": obj.code,
          "name": obj.name,
          "optional": false,
          "mandatory": false
        }
      }), 'name');
      vm.ruleData.attributes = vm.attributesList;
    }

    //function to get reasons and instructions
    function getReasonsAndInstructions(type) {
      createRuleService.getReasonsAndInstructions(type)
        .success(function(response) {
          rsnAndInstOnSuccess(response,type);
        })
        .error(handleError);
    }

    //function to handle success on getting reasons and instructions
    function rsnAndInstOnSuccess(response,type){
      if (type == 'INS') {
        vm.instructions = response.guidelines;
        vm.ruleData.instructions = vm.instructions;
      } else if (type == 'RSN') {
        vm.reasons = response.guidelines;
        vm.ruleData.reasons = vm.reasons;
      }
    }



    //function to create rule
    function createRule(modal, e) {
      var mandatory_fields = _.pluck(_.filter(vm.ruleData.attributes, function(value) {
        return value.mandatory == true
      }), 'id');
      var optional_fields = _.pluck(_.filter(vm.ruleData.attributes, function(value) {
        return (value.optional == true && value.mandatory == false)
      }), 'id');
      var instructions = _.pluck(_.filter(vm.ruleData.instructions, function(value) {
        return value.selected == true
      }), 'code');
      var reasons = _.pluck(_.filter(vm.ruleData.reasons, function(value) {
        return value.selected == true
      }), 'code');
      var dataToSave = {
        'input_parameters': {
          'activity': vm.createData.activity || '',
          'fulfillment_center_sk': _.isArray(vm.createData.fulfillmentCenter) ? vm.createData.fulfillmentCenter[0].sk : '',
          'flow': '',
          'clientstore_sk': _.isArray(vm.createData.clientStore) ? vm.createData.clientStore[0].sk : '',
          'clientparty_sk': _.isArray(vm.createData.clientParty) ? vm.createData.clientParty[0].sk : '',
          'supplierstore_sk': _.isArray(vm.createData.supplierStore) ? vm.createData.supplierStore[0].sk : '',
          'supplierparty_sk': _.isArray(vm.createData.supplierParty) ? vm.createData.supplierParty[0].sk : '',
          'product': _.isArray(vm.createData.productName) ? vm.createData.productName[0].code : '',
          'product_type': _.isArray(vm.createData.productType) ? vm.createData.productType[0].slug : '',
          'category': _.isArray(vm.createData.productCategory) ? vm.createData.productCategory[0].slug : '',
          'master_channel': _.isArray(vm.createData.masterChannel) ? vm.createData.masterChannel[0].sk : '',
        },
        'rule_definition': {
          'created_by': "",
          'description': "",
          'priority': vm.ruleData.priority || '1',
          'expression': vm.ruleData.expressions || '',
          'mandatory_fields': mandatory_fields,
          'instructions': instructions,
          'optional_fields': optional_fields,
          'reasons': reasons,
          'roadform': vm.ruleData.roadform || 'no'
        }
      }
      createRuleService.createRule(dataToSave)
        .success(function(response) {
            createRuleOnSuccess(response,modal,e);
        })
        .error(function(error){
          handleError(error,modal,e);
        });
    }

    //function to handle success on create rule
    function createRuleOnSuccess(response,modal,e){
      vm.errorMsg = false;
      vm.successMsg = true;
      vm.refreshPage();
      modal.dismiss(e);
      _.defer(function() {
        angular.element('#step1').click();
      });
    }

    //function to add tag from textbox
    function setValue(tag, modalName) {
      vm[modalName] = tag;
      angular.element('.' + modalName + 'Auto .tags input').addClass('hide');
    }

    //function to remove tag from textbox
    function removeTag(tag, modalName) {
      vm[modalName] = null;
      angular.element('.' + modalName + 'Auto .tags input').removeClass('hide');
    }

    //function to select the modal
    function modalSelected(modalName, isSelected) {
      vm['is' + capitalize(modalName)] = isSelected ? true : false;
    }

    //function to get data from godam for autocomplete
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

    //function to get data from PCMS for autocomplete
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


    //function to handle errors
    function handleError(error,modal,e) {
      $window.scrollTo(0, 0);
      vm.successMsg = '';
      if (_.isArray(error.errors) && error.errors.length) {
        vm.errorMsg = error.errors[0].error_message;
      } else if (error.detail) {
        vm.errorMsg = error.detail;
      } else {
        vm.errorMsg = error.message || 'ERR3';
      }
      if(modal){
        modal.dismiss(e);
      }
    }

    //function to open preview and confirm the rule date before save
    function createRuleDataPreview() {
      var modalData = {
        title: 'LABEL_TEXT.RULE.MODAL_TITLE.RULE_CREATE_CONFIRM',
        modalUrl: settings.MODAL_URL.RULE_CREATE_CONFIRM,
        size: settings.MODAL_SIZE.LG,
      };
      Modal.createRuleDataPreview.open(modalData, vm);
    };

    //function to chnage the page step
    function changeStep(step) {
      if (vm.currentStep > step) {
        vm.currentStep = step;
      }
    }

    //function to snake case string to user readable form
    function fixStr(str) {
      var out = str.replace(/^\s*/, ""); // strip leading spaces
      out = out.replace(/^[a-z]|[^\s][A-Z]/g, function(str, offset) {
        if (offset == 0) {
          return (str.toUpperCase());
        } else {
          return (str.substr(0, 1) + " " + str.substr(1).toUpperCase());
        }
      });
      return (out);
    }

    //function to capitalize first char of a string
    function capitalize(value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }

    //function to reset the form and goto step 1
    function refreshPage() {
      vm.activityList = settings.ACTIVITY_LIST;
      vm.currentStep = '1';
      vm.createData = {};
      vm.ruleData = {};
      vm.createData.activity = 'ACC';
      vm.ruleData.priority = 1;
      vm.getAttributesFromPCM();
      getReasonsAndInstructions('INS');
      getReasonsAndInstructions('RSN');
      _.each(vm.modalNames, function(obj, index) {
        vm.removeTag('', vm.modalNames[index])
      });
    };

    function step_process(from, to, dir) {
      timelineSteps.step_process(from, to, dir);
    }

    function move_to_step(step, end, dir, step_speed) {
        timelineSteps.move_to_step(step, end, dir, step_speed);
    }
    timelineSteps.timeline_onload();
  }
})();
