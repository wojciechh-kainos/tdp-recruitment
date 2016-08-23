define(['angular'
    , 'application/tdprModule'
    , 'application/commons/controllers/tdprNavbarController'
    , 'application/auth/services/tdprAuthService'
], function(angular, module) {
    module.config(function($stateProvider) {
        $stateProvider
            .state("tdpr", {
                abstract: true,
                resolve: {
                    isUserLoggedIn: _isUserLoggedIn
                },
                views: {
                    "navbar@": {
                       templateUrl: "/html/partials/tdpr-navbar.html",
                       controller: 'tdprNavbarController'
                    }
                }
            }).state("tdpr.404", {
                url: "/404",
                views: {
                    "@": {
                        templateUrl: "/html/partials/tdpr-404.html"
                    }
                }
        });
    });

    function _isUserLoggedIn(tdprAuthService) {
        if(tdprAuthService.getCurrentUser().token === undefined){
            tdprAuthService.checkCookies();
        }
    };

    return module;
});