define(['angular', 'uiRouter', 'notification'
    , 'application/interviewer/tdprInterviewerModule'
    , 'application/interviewer/tdprInterviewerModuleConfig'
    , 'application/recruiter/tdprRecruiterModule'
    , 'application/constants/tdprConstantsModule'
    , 'application/report/tdprReportModule'
    , 'moment'
    , 'angular-moment'
], function (angular) {
    return angular.module("tdprModule", ['ui.router', 'tdprInterviewerModule', 'tdprRecruiterModule', 'tdprConstantsModule', 'ui-notification', 'tdprReportModule', 'angularMoment']);
});
