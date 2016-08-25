define(['angular'
    , 'application/auth/tdprAuthModule'
    , 'application/auth/controllers/tdprLoginController'
    , 'application/auth/controllers/tdprActivateController'
], function (angular, tdprAuthModule) {
    tdprAuthModule.config(function ($stateProvider) {
        $stateProvider
            .state("tdpr.login", {
                url: "/login",
                views: {
                    "@": {
                        templateUrl: "/html/partials/tdpr-login.html",
                        controller: "tdprLoginController"
                    }
                }
            })
            .state("tdpr.activate", {
                url:"/activate/{activationLink}",
                views: {
                    "@": {
                        templateUrl: "/html/partials/tdpr-activate.html",
                        controller: "tdprActivateController"
                    }
                }

            });
    });

    return tdprAuthModule;
});
