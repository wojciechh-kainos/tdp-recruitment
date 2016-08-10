define(['angular', 'application/recruiter/tdprRecruiterModule'
    ], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($scope, tdprSlotsTimesService, tdprPersonsService, tdprDateService) {

        $scope.days = tdprDateService.getCurrentWeek();

        tdprPersonsService.fetchPersonsWithSlotsForDates($scope.days[0], $scope.days[4]).then(function () {  //from monday to friday
            $scope.persons = tdprPersonsService.getPersons();
        });

        tdprSlotsTimesService.fetchSlotsTimes().then(function () {
            $scope.slotTimes = tdprSlotsTimesService.getSlotsTimes();
        });
    })
});
