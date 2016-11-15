'use strict';
/* jshint camelcase: false */

var CaseFilterFunction = ['upper', 'lower', 'snake', 'squish', 'camel', 'constant', 'title', 'capital', 'sentence', 'of', 'flip'];

var app = angular.module('wmsApp');

angular.forEach(CaseFilterFunction, function(f){
  app.filter(f + 'Case', function(){
    return function(input) {
      var str = input.replace(/_/g, ' ');
      str = str.charAt(0).toUpperCase() + str.slice(1);
      return str;
    };
  });
});
