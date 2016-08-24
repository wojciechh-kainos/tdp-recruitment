define(['angular', 'application/auth/tdprAuthModule', 'application/auth/services/tdprActivateService'], function (angular, tdprAuthModule) {
    tdprAuthModule.controller("tdprActivateController", function ($scope, $stateParams, tdprActivateService, $state) {

        var person;
         tdprActivateService.checkIfPersonWithActivationLinkExists($stateParams.activationLink)
            .then(function(response) {
                person = response.data;
            }, function() {
               console.log("fail"); // $state.go('tdpr.login')
            });

        $scope.activatePerson = function() {
            var personWithPassword = {
                id: person.id,
                password: $scope.password
            }
            tdprActivateService.activatePerson(personWithPassword)
                .then(function() {
                    console.log("activation successful");
                }, function() {
                    console.log("fail");
                });
        }
    });
});
