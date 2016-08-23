define(['angular', 'application/auth/tdprAuthModule', 'application/auth/services/tdprAuthService'], function (angular, tdprAuthModule) {
    tdprAuthModule.controller("tdprLoginController", function ($scope, tdprAuthService, $state, Notification) {

        tdprAuthService.clearCredentials();

        $scope.login = function () {
            tdprAuthService.login($scope.username, $scope.password)
                .then(function (user) {
                    console.log(user);
                   // $window.location.href = "/";
                   $state.go('tdpr.recruiter.home')
                }, function (response) {
                    Notification.error({message: "Wrong email or password.", delay: 3500});
                });
        };
    });
});
