define(['angular', 'application/interviewer/tdprInterviewerModule'], function (angular, tdprInterviewerModule) {
    tdprInterviewerModule.controller("tdprInterviewerDetailsController", function ($scope, $stateParams, tdprPersonService, $filter, $state, Notification) {

        function init() {
            tdprPersonService.getPersonDetails($stateParams.id).then(function (response) {
                $scope.person = response.data;
                $scope.person.bandLevel = response.data.bandLevel.toString();

                if (response.data.defaultStartHour) {
                    var startHour = response.data.defaultStartHour.split(':');
                    $scope.person.defaultStartHour = new Date(1970, 0, 1, startHour[0], startHour[1], startHour[2]);
                }
                if (response.data.defaultFinishHour) {
                    var finishHour = response.data.defaultFinishHour.split(':');
                    $scope.person.defaultFinishHour = new Date(1970, 0, 1, finishHour[0], finishHour[1], finishHour[2]);
                }
            });
        }

        $scope.updateDetails = function () {
            var person = angular.copy($scope.person);
            person.bandLevel = parseInt(angular.copy($scope.person.bandLevel));
            person.defaultStartHour = $filter('date')(person.defaultStartHour, "HH:mm:ss");
            person.defaultFinishHour = $filter('date')(person.defaultFinishHour, "HH:mm:ss");

            tdprPersonService.updatePersonDetails(person).then(function () {
                init();
                Notification.success({message: 'Details updated!', delay: 2000});
            });
        };

        $scope.goHome = function () {
            $state.go('tdpr.interviewer.home', {'id': $stateParams.id});
        };

        init();
    });
});
