define(['angular', 'application/interviewer/tdprInterviewerModule'], function (angular, tdprInterviewerModule) {
    tdprInterviewerModule.controller("tdprInterviewerDetailsController", function ($scope, $stateParams, tdprPersonService, tdprAuthService, $filter, $state, Notification, BandLevelEnum, person) {
        $scope.BandLevelEnum = BandLevelEnum;
        $scope.changePasswordChecked = false;
        $scope.personName = $stateParams.personName;
        $scope.viewingMyDetails = tdprAuthService.getCurrentUser().id == $stateParams.id;
        $scope.isRecruiter = tdprAuthService.isUserAuthorized('recruiter');
        function init() {
                $scope.person = person;
                $scope.person.token = undefined;
                $scope.person.bandLevel = $scope.person.bandLevel.toString();

                if ($scope.person.defaultStartHour) {
                    var startHour = $scope.person.defaultStartHour.split(':');
                    $scope.person.defaultStartHour = new Date(1970, 0, 1, startHour[0], startHour[1], startHour[2]);
                }
                if ($scope.person.defaultFinishHour) {
                    var finishHour = $scope.person.defaultFinishHour.split(':');
                    $scope.person.defaultFinishHour = new Date(1970, 0, 1, finishHour[0], finishHour[1], finishHour[2]);
                }
        }

        $scope.updateDetails = function () {
            if($scope.changePasswordChecked && (!$scope.arePasswordsCorrect)){
                return Notification.error("Changes not saved! Password field incorrect!");
            }
            var person = angular.copy($scope.person);
            person.password = ($scope.changePasswordChecked && $scope.arePasswordsCorrect) ? $scope.password : null;
            person.bandLevel = parseInt(angular.copy($scope.person.bandLevel));
            person.defaultStartHour = $filter('date')(person.defaultStartHour, "HH:mm:ss");
            person.defaultFinishHour = $filter('date')(person.defaultFinishHour, "HH:mm:ss");

            tdprPersonService.updatePersonDetails(person).then(function () {
                Notification.success('Details updated!');

                $scope.goHome();
            }, function (){
                Notification.error('Details were not updated!');
            });
        };

        $scope.goHome = function () {
            $state.go('tdpr.interviewer.home', {'id': $stateParams.id});
        };

        init();
    });
});
