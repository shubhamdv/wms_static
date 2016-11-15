'use strict';
/*jshint camelcase: false */
angular.module('wmsApp')
    .service('prodChannelMappingListService', function($http, settings) {
        this.editProduct = function(params, data) {
            return $http({
                'url': settings.API_URI.UPDATE_PROD_CHANNEL_MAPPING,
                'method': 'PUT',
                'params': params,
                'data': data
            });
        };

        this.downloadFile = function(params) {
            return $http({
                'url': settings.API_URI.GET_CHANNEL_DOWNLOAD_CSV,
                'method': 'GET',
                'params': params,
            });
        };

        this.downLoadCsv = function(response) {
            var d = new Date();
            var cd = d.getDate();
            var y = d.getFullYear();
            var mh = d.getMonth() + 1;
            var cM = (mh < 10 ? '0' : '') + mh;
            var h = d.getHours();
            var m = d.getMinutes();
            var fN = settings.CHANNEL_CSV_FILE_NAME + '_' + cd + '-' + cM + '-' + y + '_' + h + '-' + m + '.csv';
            var a = document.createElement('a');
            document.body.appendChild(a);
            a.fileName = fN;
            a.style.display = 'none';
            var file = new Blob([response], {
                type: 'text/csv;base64'
            });
            a.href = URL.createObjectURL(file);
            a.download = fN;
            return a;
        };
    });