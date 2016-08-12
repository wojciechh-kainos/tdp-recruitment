define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprScheduleService'
], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($scope, tdprPersonsService, tdprDateService, persons, slotsTimes, JobProfileEnum, tdprScheduleService, Notification, tdprRecruiterSlotsService) {

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
            tdprPersonsService.fetchPersonsWithSlotsForDates($scope.days[0], $scope.days[4]).then(function (data) {
                $scope.persons = data;
            });
            $scope.displayedStartDate = $scope.days[0];
            $scope.displayedEndDate = $scope.days[4];
        };

        $scope.showNextWeek = function () {
            offset += 1;
            showDataForWeek(offset);
        };

        $scope.showPreviousWeek = function () {
            offset -= 1;
            showDataForWeek(offset);
        };

        $scope.changeSlotTypeCycle = function (slot, slotId, day, personData) {
            tdprScheduleService.changeSlotTypeCycleThrough(slot, slotId, day, personData);
        };

        $scope.changeSlotSubmitChanges = function (personData) {
            var endDate = new Date($scope.days[4]);
            endDate.setDate(endDate.getDate() + 1);

            tdprRecruiterSlotsService.updateSlots(personData.slotsList, personData.id, $scope.days[0], endDate).then(
                function () {
                    personData.changesPending = false;
                    Notification.success({message: 'You have successfully submitted data!', delay: 2500});
                }
            ).catch(
                function (status) {
                    Notification.error({message: status.message, delay: 3500});
                }
            );
        };
    });
});
