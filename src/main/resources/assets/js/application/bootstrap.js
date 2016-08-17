define([
    'angular'
    , 'lodash'
    , 'application/tdprModule'
    , 'application/tdprModuleConfig'
    , 'application/recruiter/tdprRecruiterModuleConfig'
    , 'application/constants/tdprConstantsModuleConfig'
    , 'application/report/tdprReportModuleConfig'
], function (angular) {
    'use strict';

    angular.element().ready(function () {
        angular.bootstrap(document, ['tdprModule']);
    });
});
