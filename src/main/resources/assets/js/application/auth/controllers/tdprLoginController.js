define(['angular', 'application/auth/tdprAuthModule', 'application/auth/services/tdprAuthService'], function (angular, tdprAuthModule) {
    tdprAuthModule.controller("tdprLoginController", function ($scope, tdprAuthService, $state, Notification) {
        $scope.login = function () {
            tdprAuthService.login($scope.username, $scope.password)
                .then(function (user) {
                   if (user.admin) {
                   console.log('r');
                        $state.go('tdpr.recruiter.home');
                   } else {
                   console.log('i');
                        $state.go('tdpr.interviewer.home', {id: user.id});
                   }
                }, function (response) {
                    Notification.error("Wrong email or password.");
                });
        };
    });
});
