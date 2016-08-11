define(['angular'
    , 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/controllers/tdprWeekTableController'
    , 'application/recruiter/directives/tdprPersonDirective'
    , 'application/recruiter/directives/tdprSlotDirective'
    , 'application/recruiter/services/tdprSlotsTimesService'
    , 'application/recruiter/controllers/tdprAddInterviewerController'
    , 'application/recruiter/services/tdprPersonsService'
    , 'application/recruiter/services/tdprDateService'
    , 'application/recruiter/filters/tdprSlotsByTimeFilter'
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
            resolve: {
                persons: function (tdprPersonsService, tdprDateService) {
                    var week = tdprDateService.getCurrentWeek();
                    return tdprPersonsService.fetchPersonsWithSlotsForDates(week[0], week[4]).data;
                },
                slotsTimes: function (tdprSlotsTimesService) {
                    return tdprSlotsTimesService.fetchSlotsTimes().data;
                }
            },
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
