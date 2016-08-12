define([
    'angular'
    , 'lodash'
    , 'application/tdprModule'
    , 'application/tdprModuleConfig'
    , 'application/recruiter/tdprRecruiterModuleConfig'
    , 'application/constants/tdprConstantsModuleConfig'
], function (angular) {
    'use strict';

    angular.element().ready(function () {
        angular.bootstrap(document, ['tdprModule']);
    });
});
