'use strict';

angular.module('wmsApp')
    .service('genericService', function($http, settings) {

        this.getAutoCompleteData = function(params) {
            // return http promise object attempting get Autocomplete data
            return $http({
                'url': settings.API_URI.GET_AUTOCOMPLETE_DATA,
                'method': 'GET',
                'params': params,
                'ignoreLoadingBar': true
            });
        };

        this.getPcmsAutoCompleteData = function(params) {
            // return http promise object attempting get Autocomplete data
            return $http({
                'url': settings.API_URI.GET_PCMSAUTOCOMPLETE_DATA,
                'method': 'GET',
                'params': params,
                'ignoreLoadingBar': true
            });
        };

        this.tagInputData = function(data) {
            var tagsData = [];
            _.each(data, function(name) {
                name = name.fields;
                var keys = Object.keys(name);
                var fields = {};
                _.each(keys, function(key) {
                    fields[key] = name[key] ? name[key][0] : null;
                });
                tagsData.push(fields);
            });
            return tagsData;
        };

        this.getManageLookup = function(data) {
            return $http({
                'url': settings.API_URI.GET_MANAGEMENT_LOOKUP,
                'method': 'GET',
                'params': data,
            });
        };

        this.getFcAllDeatil = function(data) {
            return $http({
                'url': settings.API_URI.GET_FC_DETAIL,
                'method': 'GET',
                'params': data,
            });
        };

        this.supStoreDetail = function(data) {
            return $http({
                'url': settings.API_URI.GET_SS_DETAIL,
                'method': 'GET',
                'params': data,
            });
        };

        this.cleanParams = function(data) {
            _.each(data, function(item, key) {
                if (!data[key]) {
                    delete data[key];
                }
            });
            return data;
        };

        this.chunksIterator = function(array, chunkSize) {
            var offset = 0;
            
            return {
               next: function(){
                    return array.length > offset * chunkSize ? {
                            value: function() {
                                return array.slice( offset * chunkSize, (chunkSize * offset++) + chunkSize );
                            },
                            done: false
                        } : {
                            done: true
                        };
               }
            }
        }

    });
