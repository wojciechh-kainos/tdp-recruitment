define(['angular', 'application/recruiter/tdprRecruiterModule'
    ], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($scope, tdprPersonsService, tdprDateService, persons, slotsTimes, JobProfileEnum) {
        $scope.JobProfileEnum = JobProfileEnum;
        $scope.currentJobProfile = JobProfileEnum.dev;

        $scope.days = tdprDateService.getCurrentWeek();
        $scope.slotsTimes = slotsTimes;
        $scope.persons = persons;

        $scope.displayedStartDate = $scope.days[0];
        $scope.displayedEndDate = $scope.days[4];

        var offset = 0;

        var showDataForWeek = function (offset) {
          $scope.days = tdprDateService.getWeekWithOffset(offset);
          tdprPersonsService.fetchPersonsWithSlotsForDates($scope.days[0], $scope.days[4]).then(function(data) {
            $scope.persons = data;
          });
          $scope.displayedStartDate = $scope.days[0];
          $scope.displayedEndDate = $scope.days[4];
        };

        $scope.showNextWeek = function() {
          offset += 1;
          showDataForWeek(offset);
        };

        $scope.showPreviousWeek = function() {
          offset -= 1;
          showDataForWeek(offset);
        };
    });
});
