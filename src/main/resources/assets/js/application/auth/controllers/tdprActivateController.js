define(['angular', 'application/auth/tdprAuthModule', 'application/auth/services/tdprActivateService'], function (angular, tdprAuthModule) {
    tdprAuthModule.controller("tdprActivateController", function ($scope, $stateParams, tdprActivateService, $state, Notification) {

        var person;

         tdprActivateService.checkIfPersonWithActivationLinkExists($stateParams.activationLink)
            .then(function(response) {
                person = response.data;
                if(response.status == 204) {
                    Notification.error("Something went wrong");
                    $state.go('tdpr.login');
                }
            }, function() {
                $state.go('tdpr.login');
            });

        $scope.activatePerson = function() {
            if ($scope.arePasswordsCorrect) {
                var personWithPassword = {
                    id: person.id,
                    password: $scope.password
                }
                tdprActivateService.activatePerson(personWithPassword)
                    .then(function () {
                        Notification.success("You have successfully activated your account");
                        $state.go('tdpr.login');
                    }, function () {
                        Notification.error("Something went wrong");
                    });
            } else Notification.error("Passwords are not the same or are incorrect");
        }
    });
});
