define([
    'angular'
    , 'application/tdprModule'
    , 'application/tdprModuleConfig'
], function (angular) {
    'use strict';

    angular.element().ready(function () {
        angular.bootstrap(document, ['tdprModule']);
    });
});