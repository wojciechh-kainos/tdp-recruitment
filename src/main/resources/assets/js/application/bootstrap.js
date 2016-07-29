define([
    'angular',
    'application/tdpRecruitmentModule',
    'application/tdpRecruitmentModuleConfig'
], function (angular) {
    'use strict';

    angular.element().ready(function () {
        angular.bootstrap(document, ['tdpRecruitmentModule']);
    });
});