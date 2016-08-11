define(['angular', 'application/recruiter/tdprRecruiterModule'
], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($scope, tdprPersonsService, tdprDateService, persons, slotsTimes, JobProfileEnum, tdprScheduleService, Notification) {

        $scope.JobProfileEnum = JobProfileEnum;
        $scope.currentJobProfile = JobProfileEnum.dev;

        $scope.days = tdprDateService.getCurrentWeek();
        $scope.slotsTimes = slotsTimes;
        $scope.persons = persons;

        $scope.changeSlotTypeCycle = function (slotNumber, day, personData) {
            var compareDate = new Date();

            if (compareDate.getTime() < day.getTime()) {
                tdprScheduleService.changeSlotTypeCycleThrough(slotNumber, day, personData);
            } else {
                Notification.error({message: 'Cannot change past days!', delay: 2500});
            }
        };
    })
});
