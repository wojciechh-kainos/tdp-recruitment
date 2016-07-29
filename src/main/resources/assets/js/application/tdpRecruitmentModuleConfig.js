define(['angular'
    , 'application/tdpRecruitmentModule'
    , 'application/controllers/TestController'
], function(angular, tdpRecruitmentModule) {
    tdpRecruitmentModule.config(function($stateProvider) {
        $stateProvider
            .state("home", {
                url: "/home",
                views: {
                    "@": {
                        templateUrl: "html/partials/test-email.html",
                        controller: 'TestController'
                    }
                }
            })
    });
    return tdpRecruitmentModule;
});