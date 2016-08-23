define(['angular'
    , 'application/auth/tdprAuthModule'
    , 'application/auth/controllers/tdprLoginController'
], function (angular, tdprAuthModule) {
    tdprAuthModule.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("tdpr.login", {
                url: "/login",
                views: {
                    "@": {
                        templateUrl: "/html/partials/tdpr-login.html",
                        controller: "tdprLoginController"
                    }
                }
            });
    });

    return tdprAuthModule;
});
