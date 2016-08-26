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
                },
                resolve: {
                   isUserLoggedIn: function(tdprAuthService, $q, $state, $timeout) {
                        var deferred = $q.defer();
                        $timeout(function() {
                            if(tdprAuthService.isUserLoggedIn()) {
                                if(tdprAuthService.getCurrentUser().isRecruiter) {
                                    $state.go('tdpr.recruiter.candidates');
                                    deferred.reject();
                                } else {
                                    $state.go('tdpr.interviewer.home', {id: tdprAuthService.getCurrentUser().id});
                                    deferred.reject();
                                }
                            } else {
                                deferred.resolve();
                            }
                        });

                        return deferred.promise;
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
