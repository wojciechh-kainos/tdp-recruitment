define(['angular', 'uiRouter'
    , 'application/interviewer/tdprInterviewerModule'
    , 'application/recruiter/tdprRecruiterModule'
], function(angular) {
    return angular.module("tdprModule", ['ui.router', 'tdprInterviewerModule', 'tdprRecruiterModule']);
});