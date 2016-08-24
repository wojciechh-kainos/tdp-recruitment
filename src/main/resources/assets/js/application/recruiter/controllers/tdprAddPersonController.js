define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprPersonsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprAddPersonController", function ($scope, tdprPersonsService, $state, Notification, BandLevelEnum) {
        $scope.BandLevelEnum = BandLevelEnum;
        $scope.person.isDev = false;
        $scope.person.isTest = false;
        $scope.person.isOps = false;
        //TODO: $scope.person.isOther = false;

        $scope.create = function (person) {
            person.bandLevel = parseInt(angular.copy($scope.person.bandLevel));
            if(person.admin===true){
                person.isDev = false;
                person.isTest = false;
                person.isOps = false;
                //TODO: person.isOther = true;
            }
            $scope.createPersonPromise = tdprPersonsService.createPerson(person)
                .then(function () {
                    Notification.success('Interviewer added');
                    $scope.goHome();
                }, function (response) {
                    Notification.error(response.message);
                });
        };

        $scope.goHome = function () {
          $state.go('tdpr.recruiter.home');
        };

        $scope.showError = function () {
          Notification.error('Cannot submit invalid form, please change incorrect fields');
        };
    });
});
