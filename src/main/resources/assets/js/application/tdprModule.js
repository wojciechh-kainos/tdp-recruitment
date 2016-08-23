define(['angular', 'uiRouter', 'notification'
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
    return angular.module("tdprModule", ['ui.router', 'tdprInterviewerModule', 'tdprRecruiterModule', 'tdprConstantsModule', 'tdprAuthModule', 'tdprCommonsModule', 'ui-notification', 'tdprReportModule', 'angularMoment']);
});
