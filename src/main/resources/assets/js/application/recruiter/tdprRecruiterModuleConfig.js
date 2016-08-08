define(['angular'
    , 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/controllers/tdprWeekTableController'
    , 'application/recruiter/controllers/tdprAddInterviewerController'
    , 'application/recruiter/services/tdprPersonsService'
], function (angular, tdprRecruiterModule) {

    tdprRecruiterModule.config(function ($stateProvider) {
        $stateProvider
            .state("tdpr.recruiter", {
                abstract: true,
                views: {
                    "@": {
                        templateUrl: "/js/application/recruiter/views/tdpr-recruiter-index.html"
                    }
                }
            }).state("tdpr.recruiter.home", {
            url: "/recruiter",
            views: {
                "main@recruiter": {
                    templateUrl: "js/application/recruiter/views/tdpr-recruiter-table.html",
                    controller: "tdprWeekTableController"
                }
            }
        }).state("tdpr.recruiter.addInterviewer", {
            url: "/add-interviewer",
            views: {
                "main@recruiter": {
                    templateUrl: "js/application/recruiter/views/tdpr-recruiter-add-interviewer.html",
                    controller: "tdprAddInterviewerController"
                }
            }
        })
    });
    return tdprRecruiterModule;

});
