define(['angular', 'application/auth/tdprAuthModule', 'application/auth/services/tdprAuthService'], function (angular, tdprAuthModule) {
    tdprAuthModule.controller("tdprLoginController", function ($scope, tdprAuthService, $state, Notification) {
        $scope.login = function () {
            tdprAuthService.login($scope.email, $scope.password)
                .then(function (user) {
                   if (user.admin) {
                        $state.go('tdpr.recruiter.candidates');
                   } else {
                        $state.go('tdpr.interviewer.home', {id: user.id});
                   }
                }, function (response) {
                    if(response.status === 401) {
                        Notification.error("Wrong email or password.");
                    } else if (response.status === 403) {
                        Notification.error("Your account has been disabled.");
                    }
                });
        };
    });
});