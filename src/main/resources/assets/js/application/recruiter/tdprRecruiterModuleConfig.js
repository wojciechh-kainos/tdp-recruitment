define(['angular'
    , 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/controllers/tdprWeekTableController'
    , 'application/recruiter/directives/tdprPersonDirective'
    , 'application/recruiter/directives/tdprSlotDirective'
    , 'application/recruiter/services/tdprSlotsTimesService'
    , 'application/recruiter/controllers/tdprCandidatesController'
    , 'application/recruiter/controllers/tdprAddPersonController'
    , 'application/recruiter/controllers/tdprCreateInterviewController'
    , 'application/recruiter/services/tdprPersonsService'
    , 'application/recruiter/services/tdprCandidatesService'
    , 'application/recruiter/services/tdprDateService'
    , 'application/recruiter/services/tdprRecruiterNoteService'
    , 'application/recruiter/filters/tdprSlotsByTimeFilter'
    , 'application/recruiter/filters/tdprCandidatesFilterByRecruiter'
    , 'application/recruiter/controllers/tdprManageUsersController'
    , 'application/common/filters/tdprJobProfileFilter'
    , 'application/common/filters/tdprCutFilter'
    , 'application/common/directives/tdprJobProfileCheckboxDirective'
    , 'application/common/directives/tdprJobProfileDirective'
    , 'application/common/directives/tdprNewPasswordDirective'
    , 'application/auth/services/tdprAuthService'
    , 'application/common/filters/tdprLocaleOrderByFilter'
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
                    isUserAuthenticated: function(tdprAuthService, Notification, $state) {
                        if (!tdprAuthService.isUserLoggedIn()) {
                            Notification.error('You need to sign in to view this page.');
                            $state.go('tdpr.login');
                        }
                    },
                    isUserAuthorized: function(tdprAuthService, Notification, $state) {
                        if(!tdprAuthService.isUserAuthorized("recruiter")) {
                            Notification.error('You do not have permissions to view this page.');
                            $state.go('tdpr.login');
                        }
                    }
                }
            }).state("tdpr.recruiter.home", {
                url: "/recruiter",
                params: {
                    candidateId: 0,
                    candidate: {},
                    offset: 0
                },
                resolve: {
                    persons: function (tdprPersonsService, tdprDateService, $stateParams) {
                        var week = tdprDateService.getWeekWithOffset($stateParams.offset);
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
            }).state("tdpr.recruiter.addPerson", {
                url: "/add-person",
                views: {
                    "main@recruiter": {
                        templateUrl: "/html/partials/recruiter/tdpr-recruiter-add-person.html",
                        controller: "tdprAddPersonController"
                    }
                }
            }).state("tdpr.recruiter.candidates", {
                url: "/candidates",
                resolve: {
                    candidates: function (tdprCandidatesService) {
                        return tdprCandidatesService.fetchCandidates();
                    },
                    recruiters: function (tdprCandidatesService) {
                        return tdprCandidatesService.fetchRecruiters();
                    },
                    recruiterNotes: function (tdprRecruiterNoteService, RecruiterNotesLimits) {
                        return tdprRecruiterNoteService.fetchRecruiterNotes(RecruiterNotesLimits[0]);
                    }
                },
                views: {
                    "main@recruiter": {
                        templateUrl: "html/partials/recruiter/tdpr-recruiter-candidates.html",
                        controller: "tdprCandidatesController"
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
            }).state("tdpr.recruiter.createInterview", {
            url: "/create-event",
            views: {
                "main@recruiter": {
                    templateUrl: "html/partials/recruiter/tdpr-recruiter-create-interview.html",
                    controller: "tdprCreateEventController"
                }
            },
            params: {
                data: null
            }
        });
    });

    return tdprRecruiterModule;
});
