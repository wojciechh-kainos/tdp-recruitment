define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprPersonsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprManageUsersController", function ($scope, tdprPersonsService, $state, Notification) {

        tdprPersonsService.fetchPersons().then( function (response) {
            $scope.persons = response.data;
        }, function () {
            Notification.error({message: "Something went wrong with getting users" , delay: 3500});
        });

        $scope.deactivatePerson = function( person ){
            person.active = !person.active;
            tdprPersonsService.deactivatePerson(person).then( function () {
                if(!person.active) Notification.success({message: person.firstName + " " + person.lastName  + " has been disabled." , delay: 3500});
                else Notification.success({message: person.firstName + " " + person.lastName  + " has been enabled." , delay: 3500});
            }, function () {
                Notification.error({message: "Something went wrong with your request." , delay: 3500});
            });
        }
    });
});
