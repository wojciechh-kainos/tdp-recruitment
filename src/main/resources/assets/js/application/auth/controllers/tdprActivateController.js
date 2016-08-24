define(['angular', 'application/auth/tdprAuthModule', 'application/auth/services/tdprAuthService'], function (angular, tdprAuthModule) {
    tdprAuthModule.controller("tdprActivateController", function ($scope, $stateParams, tdprAuthService, $state, Notification) {

        $scope.smth = $stateParams.activationLink;


    });
});
