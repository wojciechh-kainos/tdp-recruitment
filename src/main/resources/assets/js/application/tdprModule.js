define(['angular', 'uiRouter'
    , 'application/interviewer/tdprInterviewerModule'
    , 'application/recruiter/tdprRecruiterModule'
    , 'application/constants/tdprConstantsModule'
], function(angular) {
    return angular.module("tdprModule", ['ui.router', 'tdprInterviewerModule', 'tdprRecruiterModule', 'tdprConstantsModule']);
});
