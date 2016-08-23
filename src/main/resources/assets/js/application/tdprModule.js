define(['angular', 'uiRouter', 'notification'
    , 'application/common/tdprCommonModule'
    , 'application/constants/tdprConstantsModule'
    , 'application/interviewer/tdprInterviewerModule'
    , 'application/interviewer/tdprInterviewerModuleConfig'
    , 'application/recruiter/tdprRecruiterModule'
    , 'application/constants/tdprConstantsModule'
    , 'application/auth/tdprAuthModule'
    , 'application/auth/tdprAuthModuleConfig'
    , 'application/report/tdprReportModule'
    , 'moment'
    , 'angular-moment'
], function (angular) {
    return angular.module("tdprModule", ['ui.router', 'ui-notification',  'angularMoment', 'tdprConstantsModule', 'tdprCommonModule', 'tdprInterviewerModule', 'tdprRecruiterModule', 'tdprReportModule', 'tdprAuthModule']);
});
