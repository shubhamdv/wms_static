(function() {
    'use strict';
    angular.module('wmsApp')
        .controller('GoogleAuthCtrl', GoogleAuthCtrl);

    function GoogleAuthCtrl() {
        this.isStationPage = true;
    }
})();