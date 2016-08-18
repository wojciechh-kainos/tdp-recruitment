define(['angular'
    , 'application/tdprModule'
], function(angular, module) {
    module.config(function($stateProvider) {
        $stateProvider
            .state("tdpr", {
                abstract: true
            }).state("tdpr.404", {
                url: "/404",
                views: {
                    "@": {
                        templateUrl: "/html/partials/tdpr-404.html"
                    }
                }
        });

    });

    return module;
});