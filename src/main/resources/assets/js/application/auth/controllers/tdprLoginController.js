define(['angular', 'application/auth/tdprAuthModule', 'application/auth/services/tdprAuthService'], function (angular, tdprAuthModule) {
    tdprAuthModule.controller("tdprLoginController", function ($scope, tdprAuthService, $state, Notification) {

        tdprAuthService.clearCredentials();

        $scope.login = function () {
            tdprAuthService.login($scope.username, $scope.password)
                .then(function (user) {
                   $state.go('tdpr.recruiter.home')
                }, function (response) {
                    Notification.error("Wrong email or password.");
                });
        };
    });
});
