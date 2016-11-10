'use strict';

angular.module('wmsApp')
    .config(function($translateProvider, langEN, langAR, langML, langTM) {
        $translateProvider.translations('en', langEN.en)
            .translations('ar', langAR.ar)
            .translations('tm', langTM.tm)
            .translations('ml', langML.ml);
        $translateProvider.preferredLanguage('en');
    });
