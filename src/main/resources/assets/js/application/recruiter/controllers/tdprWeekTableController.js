define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/filters/tdprRecruiterJobProfileFilter'
    , 'application/recruiter/directives/tdprJobProfilesDirecrive'
    , 'application/recruiter/services/tdprRecruiterGetSlotsTimesService'
    , 'application/recruiter/services/tdprPersonsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($scope, tdprRecruiterGetSlotsTimesService, tdprPersonsService, JobProfileEnum, tdprDateService) {
        $scope.inputWeek = new Date();
        $scope.weekDay = new tdprPersonsService.changeCurrentWeek($scope.inputWeek);
        $scope.jobProfile = JobProfileEnum.dev;

        var refresh = function () {
            tdprPersonsService.fetchPersons().then(function () {
                $scope.personsData = tdprPersonsService.getPersons();
                $scope.$broadcast("changedPersonData", {persons: $scope.personsData, weekDay: $scope.weekDay});
            });

            tdprRecruiterGetSlotsTimesService.getSlotsTimes().then(function () {
                $scope.timeData = tdprRecruiterGetSlotsTimesService.getSlots();
                $scope.$broadcast("changedTimeData", {timeData: $scope.timeData, weekDay: $scope.weekDay});
            });
        };

        $scope.$watch('inputWeek', function (newValue) {
            $scope.weekDay = tdprPersonsService.changeCurrentWeek(newValue);
        });

        $scope.$watch('weekDay', function (newValue, oldValue) {
            if (tdprDateService.compareTime(newValue, oldValue) === false) {
                refresh();
                $scope.$broadcast("changedWeekDay", {weekDay: newValue});
            }
        });

        refresh();

    });
});
