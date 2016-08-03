define(['angular'
    , 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/controllers/tdprWeekTableController'
    , 'application/recruiter/services/personsService'
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
            url: "/home",
            resolve: {
                tdprPersonsService: "personsService",
                personServiceFetchPersons: function (tdprPersonsService) {
                    tdprPersonsService.fetchPersons();
                }
            },
            views: {
                "main@recruiter": {
                    templateUrl: "/js/application/recruiter/views/tdpr-recruiter-home.html"
                }
            }
        }).state("tdpr.recruiter.table", {
            url: "/recruiter",
            views: {
                "main@recruiter": {
                    templateUrl: "js/application/recruiter/views/tdpr-table.html",
                    controller: "tdprWeekTableController"
                }
            }
        })
    });
    return tdprRecruiterModule;

});
