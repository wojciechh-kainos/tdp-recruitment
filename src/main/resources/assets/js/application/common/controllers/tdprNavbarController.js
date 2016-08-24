define(['angular'
, 'application/common/tdprCommonModule'
, 'application/auth/services/tdprAuthService'
], function (angular, tdprCommonModule) {
    tdprCommonModule.controller("tdprNavbarController", function ($scope, $location, tdprAuthService, Notification) {
        $scope.logout = function() {
            tdprAuthService.logout();
            $location.path('/login');
            Notification.success('You have been successfully logged out.');
        }

        $scope.$watch(tdprAuthService.isUserLoggedIn, function(newVal) {
            $scope.user = tdprAuthService.getCurrentUser();
            $scope.userLoggedIn = newVal;
        });
    })
});
