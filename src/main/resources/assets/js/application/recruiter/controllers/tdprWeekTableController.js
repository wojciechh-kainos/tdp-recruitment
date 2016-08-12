define(['angular', 'application/recruiter/tdprRecruiterModule'
], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($scope, tdprPersonsService, tdprDateService, persons, slotsTimes, JobProfileEnum, tdprScheduleService, Notification, tdprRecruiterSlotsService) {

        $scope.JobProfileEnum = JobProfileEnum;
        $scope.currentJobProfile = JobProfileEnum.dev;

        $scope.days = tdprDateService.getCurrentWeek();
        $scope.slotsTimes = slotsTimes;
        $scope.persons = persons;

        $scope.changeSlotTypeCycle = function (slotNumber, day, personData) {
            tdprScheduleService.changeSlotTypeCycleThrough(slotNumber, day, personData);
        };

        $scope.changeSlotSubmitChanges = function (personData) {
            tdprRecruiterSlotsService.prepareAndUpdateSlots(personData.slotsList, personData.id, $scope.days[0], $scope.days[4]).then(
                function () {
                    personData.changesPending = false;
                    Notification.success({message: 'You have successfully submitted data!', delay: 2500});
                }
            ).catch(
                function (status) {
                    Notification.error({message: status.message, delay: 3500});
                }
            );
        }
    })
});
