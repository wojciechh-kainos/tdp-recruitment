define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprPersonsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprAddInterviewerController", function ($scope, tdprPersonsService, $state, Notification, BandLevelEnum) {
        $scope.BandLevelEnum = BandLevelEnum;

        $scope.create = function (person) {
            person.bandLevel = parseInt(angular.copy($scope.person.bandLevel));
            $scope.createInterviewerPromise = tdprPersonsService.createPerson(person)
                .then(function () {
                    Notification.success({message: 'Interviewer added', delay: 2000});
                    $state.go('tdpr.recruiter.home');
                }, function (response) {
                    Notification.error({message: response.message, delay: 2000});
                });
        };

        $scope.goHome = function () {
          $state.go('tdpr.recruiter.home');
        };

    });
});
