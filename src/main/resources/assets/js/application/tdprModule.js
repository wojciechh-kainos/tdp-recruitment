define(['angular', 'uiRouter', 'notification'
    , 'application/interviewer/tdprInterviewerModule'
    , 'application/interviewer/tdprInterviewerModuleConfig'
    , 'application/recruiter/tdprRecruiterModule'
    , 'application/constants/tdprConstantsModule'
], function(angular) {
    return angular.module("tdprModule", ['ui.router', 'tdprInterviewerModule', 'tdprRecruiterModule', 'tdprConstantsModule', 'ui-notification']);
});
