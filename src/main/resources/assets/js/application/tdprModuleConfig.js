define(['angular'
    , 'application/tdprModule'
    , 'application/common/controllers/tdprNavbarController'
    , 'application/auth/services/tdprAuthService'
], function(angular, module) {
    module.config(function($stateProvider, $urlRouterProvider, NotificationProvider) {
        $stateProvider
            .state("tdpr", {
                abstract: true,
                resolve: {
                    validateSession: function(tdprAuthService, Notification, $state) {
                        tdprAuthService.checkCookies();

                        if(tdprAuthService.isUserLoggedIn()) {
                            tdprAuthService.validateSession().catch(function() {
                                $state.go('tdpr.login');
                                Notification.error('Your session has expired. Please log in.');
                            });
                        }
                    },
                },
                views: {
                    "navbar@": {
                       templateUrl: "/html/partials/common/tdpr-navbar.html",
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

        $urlRouterProvider.otherwise("/login");

        NotificationProvider.setOptions({
          delay: 2000,
        });

    });

    return module;
});