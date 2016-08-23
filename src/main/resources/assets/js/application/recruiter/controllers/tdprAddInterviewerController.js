define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprPersonsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprAddInterviewerController", function ($scope, tdprPersonsService, $state, Notification, BandLevelEnum, NotificationDelay) {
        $scope.BandLevelEnum = BandLevelEnum;

        $scope.create = function (person) {
            person.bandLevel = parseInt(angular.copy($scope.person.bandLevel));
            $scope.createInterviewerPromise = tdprPersonsService.createPerson(person)
                .then(function () {
                    Notification.success({message: 'Interviewer added', delay: NotificationDelay});
                    $scope.goHome();
                }, function (response) {
                    Notification.error({message: response.message, delay: NotificationDelay});
                });
        };

        $scope.goHome = function () {
          $state.go('tdpr.recruiter.home');
        };

        $scope.showError = function () {
          Notification.error({message: 'Cannot submit invalid form, please change incorrect fields', delay: NotificationDelay});
        };
    });
});
