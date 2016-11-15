(function() {
    'use strict';

    angular.module('wmsApp')
        .factory('passVarFact', PassVarFact);

    PassVarFact.$inject = [];

    function PassVarFact() {
        var savedData = {};
        return {
            setData : setData,
            getData : getData,
            popData : popData,
            resetData: resetData,
        };
        
        /////////////////////

        function setData(data) {
            savedData = data;
        }

        function getData() {
            return savedData;
        }

        function popData() {
            var _data = getData();
            resetData();

            return _data;
        }

        function resetData() {
            savedData = {};
        }
    }
})();