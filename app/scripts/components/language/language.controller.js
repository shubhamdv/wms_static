'use strict';

angular.module('wmsApp')
    .controller('LanguageCtrl', function($scope, settings, $translate, $rootScope) {
        $scope.LANGUAGES = settings.LANGUAGES;
        $scope.languageName = settings.DEFAULT_LANGUAGE.name;
        $rootScope.locale = settings.DEFAULT_LANGUAGE.locale;
        $scope.flagURL = settings.DEFAULT_LANGUAGE.flagURL;

        $scope.changeLanguage = function(langKey, langName, flagURL) {
            $scope.languageName = langName;
            $scope.flagURL = flagURL;
            $rootScope.locale = langKey;
            $translate.use(langKey);
        };
    });
