define(['angular'
 , 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/personsService'

], function (angular, tdprRecruiterModule) {

    tdprRecruiterModule.config(function ($stateProvider) {
        $stateProvider
            .state("tdpr.recruiter", {
                abstract: true,
                views:{
                    "@" : {
                        templateUrl: "/js/application/recruiter/views/tdpr-recruiter-index.html"
                    }
                }
                }).state("tdpr.recruiter.home" ,{
                url: "/home",
                resolve:{
                    tdprPersonsService : "personsService",
                    personServiceFetchPersons: function (tdprPersonsService) {
                        tdprPersonsService.fetchPersons();
                    }
                },
                views: {
                    "main@recruiter": {
                        templateUrl: "/js/application/recruiter/views/tdpr-recruiter-home.html"
                    }
                }
            })
        });
        return tdprRecruiterModule;

});

