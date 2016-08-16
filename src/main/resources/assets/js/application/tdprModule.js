define(['angular', 'uiRouter', 'notification'
    , 'application/interviewer/tdprInterviewerModule'
    , 'application/interviewer/tdprInterviewerModuleConfig'
    , 'application/recruiter/tdprRecruiterModule'
    , 'application/constants/tdprConstantsModule'
    , 'application/reports/tdprReportsModule'
], function(angular) {
    return angular.module("tdprModule", ['ui.router', 'tdprInterviewerModule', 'tdprRecruiterModule', 'tdprConstantsModule', 'ui-notification', 'tdprReportsModule']);
});
