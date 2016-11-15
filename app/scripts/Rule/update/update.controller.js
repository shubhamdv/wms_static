(function() {
  'use strict';
  /* jshint camelcase: false */
  angular.module('wmsApp')
    .controller('updateRuleCtrl', updateRuleCtrl);
  updateRuleCtrl.$inject = ['$scope', '$rootScope', '$translate', '$filter', 'settings', 'genericService', 'updateRuleService', 'Modal', '$window', '$routeParams', 'timelineSteps', 'ruleListService', 'localStorageService', 'createRuleService', '$location', 'passVarFact'];

  function updateRuleCtrl($scope, $rootScope, $translate, $filter, settings, genericService, updateRuleService, Modal, $window, $routeParams, timelineSteps, ruleListService, localStorageService, createRuleService, $location, passVarFact) {

    //initializing variables, arrays and objects
    var vm = this;
    vm.page = 'update';
    vm.modalNames = settings.RULE_CREATE.MODAL_NAMES;
    vm.fcSk = $rootScope.fcSk;
    vm.activityList = settings.ACTIVITY_LIST;
    vm.successMsg = false;
    vm.errorMsg = false;
    vm.currentStep = '1';
    vm.updateData = {};
    vm.ruleData = {};
    vm.ruleData.attributes = {};
    vm.updateData.activity = 'ACC';
    vm.ruleData.priority = 1;
    vm.ruleData.roadform = 'no';
    vm.attributesList = {};
    vm.reasons = {};
    vm.ruleData.reasons = {};
    vm.instructions = {};
    vm.ruleData.instructions = {};

    //functions
    vm.changeStep = changeStep;
    vm.getAttributesFromPCM = getAttributesFromPCM;
    vm.createRule = updateRule;
    vm.createRuleDataPreview = createRuleDataPreview;
    vm.fixStr = fixStr;
    vm.step_process = step_process;
    vm.move_to_step = move_to_step;
    activate();

    ///////////////////////////////////////////////

    //activate function
    function activate() {
      vm.ruleDataToUpdate = localStorageService.get('ruleData')[$routeParams.index];
      vm.currentStep = 3;
      timelineSteps.step_process(1, 3);
      getAttributesFromPCM();
      getReasonsAndInstructions('INS');
      getReasonsAndInstructions('RSN');
      vm.ruleData.priority = vm.ruleDataToUpdate.priority;
      vm.ruleData.expressions = vm.ruleDataToUpdate.expression;
      vm.ruleData.roadform = vm.ruleDataToUpdate.roadform || '';
      vm.ruleData.packBoxNumber = vm.ruleDataToUpdate.pack_box_number ? vm.ruleDataToUpdate.pack_box_number[0] : '';
      vm.createData = localStorageService.get('ruleFilters');
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
      _.each(vm.ruleDataToUpdate.mandatory_fields, function(value, i){
        _.each(vm.ruleData.attributes, function(list, j){
          if(list.id == value){
            vm.ruleData.attributes[j]['mandatory'] = true;
            vm.ruleData.attributes[j]['optional'] = true;
          }
        });
      });
      _.each(vm.ruleDataToUpdate.optional_fields, function(value, i){
        _.each(vm.ruleData.attributes, function(list, j){
          if(list.id == value){
            vm.ruleData.attributes[j]['optional'] = true;
          }
        });
      });

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
      var datatype = '';
      if (type == 'INS') {
        datatype = 'instructions';
        vm.instructions = response.guidelines;
        vm.ruleData.instructions = vm.instructions;
      } else if (type == 'RSN') {
        var datatype = 'reasons';
        vm.reasons = response.guidelines;
        vm.ruleData.reasons = vm.reasons;
      }
      _.each(vm.ruleDataToUpdate[datatype], function(value, i){
        _.each(vm.ruleData[datatype], function(list, j){
          if(list.code == value){
            vm.ruleData[datatype][j].selected = true;
          }
        });
      });

    }


    //function to update rule
    function updateRule(modal, e) {
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
        'rule_index': vm.ruleDataToUpdate.rule_index,
        'rule_code': vm.ruleDataToUpdate.rule_code,
        'rule_definition': {
          'updated_by': "",
          'description': "",
          'priority': vm.ruleData.priority || '1',
          'expression': vm.ruleData.expressions || '',
          'mandatory_fields': mandatory_fields,
          'instructions': instructions,
          'optional_fields': optional_fields,
          'reasons': reasons,
          'fetchroadform': vm.ruleData.roadform || 'no'
        }
      }
      updateRuleService.updateRule(dataToSave)
        .success(function(response) {
            updateRuleOnSuccess(response,modal,e);
        })
        .error(function(error){
          handleError(error,modal,e);
        });
    }

    //function to handle success on update rule
    function updateRuleOnSuccess(response,modal,e){
      vm.errorMsg = false;
      vm.successMsg = true;
      modal.dismiss(e);
      localStorageService.set('ruleUpdated',true);
      passVarFact.setData({
          successMsg: 'SUCC_MSG.RULE_UPDATE_SUCCESS',
      });
      $location.path('rules/');
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
        _.defer(function() {
          angular.element('#step3').click();
        });
        vm.currentStep = 3;
        timelineSteps.step_process(4, 3, 'desc');
      }
    }

    //function to open preview and confirm the rule date before save
    function createRuleDataPreview() {
      var modalData = {
        title: 'LABEL_TEXT.RULE.MODAL_TITLE.RULE_UPDATE_CONFIRM',
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

    function step_process(from, to, dir) {
      timelineSteps.step_process(from, to, dir);
    }

    function move_to_step(step, end, dir, step_speed) {
        timelineSteps.move_to_step(step, end, dir, step_speed);
    }
  }
})();
