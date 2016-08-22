define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprPersonsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprManageUsersController", function ($scope, tdprPersonsService, $state, Notification) {

        tdprPersonsService.fetchPersons().then( function (response) {
            $scope.persons = response.data;
        }, function (error) {
            return error.data;
        });

        $scope.deactivatePerson = function( person ){
            person.active = !person.active;
            tdprPersonsService.deactivatePerson(person).then( function (response) {
                console.log("deactivated");
            }, function (error) {
                console.log("error");
            });
        }
    });
});
