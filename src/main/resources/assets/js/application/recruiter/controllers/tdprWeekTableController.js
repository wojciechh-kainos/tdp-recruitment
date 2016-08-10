define(['angular', 'application/recruiter/tdprRecruiterModule'
    ], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($scope, tdprSlotsTimesService, tdprPersonsService, tdprDateService) {

        $scope.days = tdprDateService.getCurrentWeek();

        tdprPersonsService.fetchPersonsWithSlotsForDates($scope.days[0], $scope.days[4]).then(function () {
            $scope.persons = tdprPersonsService.getPersons();
            console.log($scope.persons);
        });

        tdprSlotsTimesService.fetchSlotsTimes().then(function () {
            $scope.slotTimes = tdprSlotsTimesService.getSlotTimes();
        });

        $scope.szybkiGuzik = function (i) {
            $scope.slotTimes = tdprSlotsTimesService.getSlotTimes().slice(0, i);
            
        }
        
    })
});
