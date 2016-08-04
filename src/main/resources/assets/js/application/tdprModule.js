define(['angular', 'uiRouter'
    , 'application/interviewer/tdprInterviewerModule'
    , 'application/interviewer/tdprInterviewerModuleConfig'
    , 'application/recruiter/tdprRecruiterModule'
], function(angular) {
    return angular.module("tdprModule", ['ui.router', 'tdprInterviewerModule', 'tdprRecruiterModule']);
});