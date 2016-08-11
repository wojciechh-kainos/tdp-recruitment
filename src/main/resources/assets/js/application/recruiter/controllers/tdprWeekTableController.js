define(['angular', 'application/recruiter/tdprRecruiterModule'
    ], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($scope, tdprPersonsService, tdprDateService, persons, slotsTimes) {

        $scope.currentJobProfile = "isDev";

        $scope.days = tdprDateService.getCurrentWeek();
        $scope.slotsTimes = slotsTimes;
        $scope.persons = persons;
    });
});
