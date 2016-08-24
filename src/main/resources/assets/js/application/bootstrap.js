define([
    'angular'
    , 'lodash'
    , 'application/tdprModule'
    , 'application/tdprModuleConfig'
    , 'application/common/tdprCommonModuleConfig'
    , 'application/constants/tdprConstantsModuleConfig'
    , 'application/recruiter/tdprRecruiterModuleConfig'
    , 'application/report/tdprReportModuleConfig'
], function (angular) {
    'use strict';

    angular.element().ready(function () {
        angular.bootstrap(document, ['tdprModule']);
    });
});
