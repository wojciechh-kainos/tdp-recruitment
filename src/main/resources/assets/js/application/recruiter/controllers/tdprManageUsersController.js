define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprPersonsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprManageUsersController", function ($scope, tdprPersonsService, $state, Notification) {

        tdprPersonsService.fetchPersons().then( function (response) {
            $scope.persons = response.data;
        }, function () {
            Notification.error("Something went wrong with getting users");
        });

        $scope.managePerson = function( person ) {
            person.active = !person.active;
            tdprPersonsService.managePerson(person).then( function () {
                if(!person.active) {
                    Notification.success(person.firstName + " " + person.lastName + " has been disabled.");
                }
                else {
                    Notification.success(person.firstName + " " + person.lastName  + " has been enabled.");
                }
            }, function () {
                Notification.error("Something went wrong with your request.");
                person.active = !person.active;
            });
        }

        $scope.sortUsers = function() {
            $scope.order = !$scope.order;
        }

        $scope.resendActivationLink = function( person ) {
            tdprPersonsService.resendActivationLink(person).then(function () {
                Notification.success("Activation link successfully sent to: " + person.firstName + " " + person.lastName);
            }, function () {
                Notification.error("Something went wrong with sending the activation link!");
            })
        }

    });
});
