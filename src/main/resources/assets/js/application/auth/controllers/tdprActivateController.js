define(['angular', 'application/auth/tdprAuthModule', 'application/auth/services/tdprActivateService'], function (angular, tdprAuthModule) {
    tdprAuthModule.controller("tdprActivateController", function ($scope, $stateParams, tdprActivateService) {

        tdprActivateService.checkIfPersonWithActivationLinkExists($stateParams.activationLink);

    });
});
