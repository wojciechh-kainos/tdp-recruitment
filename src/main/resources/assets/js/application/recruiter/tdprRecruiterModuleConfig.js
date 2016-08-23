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
    , 'application/recruiter/filters/tdprRecruiterJobProfileFilter'
    , 'application/recruiter/controllers/tdprManageUsersController'
], function (angular, tdprRecruiterModule) {

    tdprRecruiterModule.config(function ($stateProvider) {
        $stateProvider
            .state("tdpr.recruiter", {
                abstract: true,
                views: {
                    "@": {
                        templateUrl: "/html/partials/recruiter/tdpr-recruiter-index.html"
                    }
                }
            }).state("tdpr.recruiter.home", {
            url: "/recruiter",
            resolve: {
                persons: function (tdprPersonsService, tdprDateService) {
                    var week = tdprDateService.getCurrentWeek();
                    return tdprPersonsService.fetchPersonsWithSlotsForDates(week[0], week[4]);
                },
                slotsTimes: function (tdprSlotsTimesService) {
                    return tdprSlotsTimesService.fetchSlotsTimes();
                }
            },
            views: {
                "main@recruiter": {
                    templateUrl: "/html/partials/recruiter/tdpr-recruiter-table.html",
                    controller: "tdprWeekTableController"
                }
            }
        }).state("tdpr.recruiter.addInterviewer", {
            url: "/add-interviewer",
            views: {
                "main@recruiter": {
                    templateUrl: "/html/partials/recruiter/tdpr-recruiter-add-interviewer.html",
                    controller: "tdprAddInterviewerController"
                }
            }
        }).state("tdpr.recruiter.manageUsers", {
            url: "/manage-users",
            views: {
                "main@recruiter": {
                    templateUrl: "html/partials/recruiter/tdpr-recruiter-manage-users.html",
                    controller: "tdprManageUsersController"
                }
            }
        })
    });
    return tdprRecruiterModule;

});
