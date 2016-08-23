define(['angular'
, 'application/commons/tdprCommonsModule'
, 'application/auth/services/tdprAuthService'
], function (angular, tdprCommonsModule) {
    tdprCommonsModule.controller("tdprNavbarController", function ($scope, $state, tdprAuthService) {
        $scope.logout = function() {
            tdprAuthService.clearCredentials();
            $state.go('tdpr.login');
        }

        $scope.$watch(tdprAuthService.isUserLoggedIn, function(newVal) {
            $scope.user = tdprAuthService.getCurrentUser();
            $scope.userLoggedIn = newVal;
        });
    })
});
