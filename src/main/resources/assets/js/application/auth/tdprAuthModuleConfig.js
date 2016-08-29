define(['angular'
    , 'application/auth/tdprAuthModule'
    , 'application/auth/controllers/tdprLoginController'
    , 'application/auth/controllers/tdprActivateController'
], function (angular, tdprAuthModule) {
    tdprAuthModule.config(function ($stateProvider, $httpProvider) {
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
                   isUserLoggedIn: function(tdprAuthService, $state, $location, Notification) {
                        if(tdprAuthService.isUserLoggedIn()) {
                            tdprAuthService.validateSession().then(function() {
                                if(tdprAuthService.getCurrentUser().isRecruiter) {
                                    $location.path('/candidates');
                                } else {
                                    $location.path('/interviewer/' + tdprAuthService.getCurrentUser().id + '/home');
                                }
                            }, function() {
                                Notification.error('Your session has expired. Please log in.');
                            });
                        }
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
        $httpProvider.interceptors.push(function($q,$injector, $location){
              return {
                  'responseError': function(response) {
                      if (response.status === 401) {
                          $location.path('/login');
                          return $q.reject(response);
                      } else {
                          return $q.reject(response);
                      }
                  }
              };
          });

    });


    return tdprAuthModule;
});
