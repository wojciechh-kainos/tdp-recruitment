define(['angular'
, 'application/common/tdprCommonModule'
, 'application/auth/services/tdprAuthService'
], function (angular, tdprCommonModule) {
    tdprCommonModule.controller("tdprNavbarController", function ($scope, $state, tdprAuthService) {
        $scope.logout = function() {
            tdprAuthService.logout();
        }

        $scope.$watch(tdprAuthService.isUserLoggedIn, function(newVal) {
            $scope.user = tdprAuthService.getCurrentUser();
            $scope.userLoggedIn = newVal;
        });
    })
});
