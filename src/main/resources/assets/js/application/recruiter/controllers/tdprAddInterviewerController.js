define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprPersonsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprAddInterviewerController", function ($scope, tdprPersonsService, $state) {

        $scope.create = function (person) {
            $scope.createInterviewerPromise = tdprPersonsService.createPerson(person)
                .then(function () {
                    $state.go('tdpr.recruiter.home');
                }, function (response) {
                    $scope.error = response.message;
                });
        }

    })
});
