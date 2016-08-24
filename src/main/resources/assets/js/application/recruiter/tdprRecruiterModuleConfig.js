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
    , 'application/recruiter/controllers/tdprManageUsersController'
    , 'application/common/filters/tdprJobProfileFilter'
    , 'application/common/directives/tdprJobProfileCheckboxDirective'
    , 'application/common/directives/tdprJobProfileDirective'
    , 'application/auth/services/tdprAuthService'
], function (angular, tdprRecruiterModule) {

    tdprRecruiterModule.config(function ($stateProvider) {
        $stateProvider
            .state("tdpr.recruiter", {
                abstract: true,
                views: {
                    "@": {
                        templateUrl: "/html/partials/recruiter/tdpr-recruiter-index.html"
                    }
                },
                resolve: {
                    isUserAuthenticated: function(tdprAuthService) {
                        return tdprAuthService.isUserAuthenticated();
                    },
                    isUserAuthorized: function(tdprAuthService, Notification, $q, $state, $location) {
                        var deferred = $q.defer();

                        if(tdprAuthService.isUserAuthorized("recruiter")) {
                            deferred.resolve();
                        } else {
                            Notification.error('You do not have permissions to view this page.');
                            deferred.reject();
                        }

                        return deferred.promise;
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
            });
    });
    return tdprRecruiterModule;

});
