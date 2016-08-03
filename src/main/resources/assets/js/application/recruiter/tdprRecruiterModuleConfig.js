define(['angular'
 , 'application/recruiter/tdprRecruiterModule'
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
                views: {
                    "main@recruiter": {
                        templateUrl: "/js/application/recruiter/views/tdpr-recruiter-home.html"
                    }
                }
            })
        });
        return tdprRecruiterModule;

});

