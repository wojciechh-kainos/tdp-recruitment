define(['angular', 'application/interviewer/tdprInterviewerModule'], function (angular, tdprInterviewerModule) {
    tdprInterviewerModule.controller("tdprInterviewerDetailsController", function ($scope, $stateParams, tdprPersonService, $filter, $state, Notification, BandLevelEnum, person) {

        $scope.BandLevelEnum = BandLevelEnum;
        $scope.arePasswordsDifferent = false;

        function init() {
                $scope.person = person;
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
            if($scope.arePasswordsDifferent && $scope.changePassword){
                return Notification.error("Changes not saved! Passwords are different!");
            }
            var person = angular.copy($scope.person);
            person.bandLevel = parseInt(angular.copy($scope.person.bandLevel));
            person.defaultStartHour = $filter('date')(person.defaultStartHour, "HH:mm:ss");
            person.defaultFinishHour = $filter('date')(person.defaultFinishHour, "HH:mm:ss");

            tdprPersonService.updatePersonDetails(person).then(function () {
                Notification.success({message: 'Details updated!', delay: 2000});

                $scope.goHome();
            });
        };

        $scope.goHome = function () {
            $state.go('tdpr.interviewer.home', {'id': $stateParams.id});
        };

        $scope.$watch('[newPassword, confirmPassword]', function(newValue, oldValue, scope){
            scope.arePasswordsDifferent = newValue[0]===newValue[1] ? false : true;
        });

        init();
    });
});
