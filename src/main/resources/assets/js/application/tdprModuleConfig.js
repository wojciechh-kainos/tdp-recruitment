define(['angular'
    , 'application/tdprModule'
    , 'application/common/controllers/tdprNavbarController'
    , 'application/auth/services/tdprAuthService'
], function(angular, module) {
    module.config(function($stateProvider, $urlRouterProvider, NotificationProvider, $httpProvider) {
        $stateProvider
            .state("tdpr", {
                abstract: true,
                resolve: {
                    validateSession: function(tdprAuthService, $location, $q, Notification) {
                        tdprAuthService.checkCookies();

                        if(tdprAuthService.isUserLoggedIn()) {
                            tdprAuthService.validateSession().then(function() {
                                if(tdprAuthService.getCurrentUser().isRecruiter) {
                                    $location.path('/candidates');
                                } else {
                                    $location.path('/interviewer/' + tdprAuthService.getCurrentUser().id + '/home');
                                }
                            }, function() {
                                $location.path('/login');
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