define([
    'angular'
    , 'application/tdprModule'
    , 'application/tdprModuleConfig'
    , 'application/recruiter/tdprRecruiterModuleConfig'
], function (angular) {
    'use strict';

    angular.element().ready(function () {
        angular.bootstrap(document, ['tdprModule']);
    });
});