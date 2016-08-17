define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprRecruiterSlotsService', 'application/recruiter/services/tdprScheduleService'
], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($scope, tdprPersonsService, tdprDateService, persons, slotsTimes,
                                                                        JobProfileEnum, Notification, tdprRecruiterSlotsService, AvailabilityEnum, dateFilter, $filter, tdprScheduleService) {

        $scope.JobProfileEnum = JobProfileEnum;
        $scope.currentJobProfile = JobProfileEnum.dev;

        $scope.days = tdprDateService.getCurrentWeek();
        $scope.slotsTimes = slotsTimes;
        $scope.selectSlotsTimes = slotsTimes;
        $scope.persons = persons;
        $scope.endTime = slotsTimes[slotsTimes.length - 1].endTime;
        $scope.startTime = slotsTimes[0].startTime;


        $scope.filterSlots = function () {
            $scope.slotsTimes = $filter('slotsByTime')(slotsTimes, $scope.startTime, $scope.endTime);
        };

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


        //     if (person.changesPending === false || angular.isUndefined(person.changesPending)) {
        //         person.oldSlotList = angular.copy(person.slotsList);
        //         person.changesPending = true;
        //     }
        //
        //     if (findResult !== -1) {
        //         if (changeTo !== undefined) {
        //             // There is still availability type to change
        //             person.slotsList[findResult].type = AvailabilityEnum[changeTo].name;
        //         } else {
        //
        //             // There is no more availability types, so we need to clear slot
        //             person.slotsList[findResult] = {};
        //             // Remove that slot from list
        //             person.slotsList = _.filter(person.slotsList,
        //                 function (value) {
        //                     return _.size(value) > 0;
        //                 });
        //         }
        //
        //     } else {
        //         person.slotsList.push({
        //             day: date,
        //             person: person.id,
        //             number: slotId,
        //             type: changeTo
        //         });
        //     }
        // };

        $scope.refreshPersonsData = function () {
            tdprPersonsService.fetchPersonsWithSlotsForDates($scope.days[0], $scope.days[4]).then(
                function (persons) {
                    $scope.persons = persons;
                }
            ).catch(function () {
                Notification.error({message: "Failed to refresh persons data", delay: 3000});
            });
        };


        $scope.changeSlotTypeCycleThrough = function (slot, slotId, day, person) {
            return tdprScheduleService.changeSlotTypeCycleThrough(slot, slotId, day, person);
        };

        $scope.changeSlotSubmitChanges = function (personData) {
            var endDate = new Date($scope.days[4]);
            endDate.setDate(endDate.getDate() + 1);

            tdprRecruiterSlotsService.updateSlots(personData.slotsList, personData.id, $scope.days[0], endDate).then(
                function () {
                    personData.changesPending = false;
                    Notification.success({message: 'Your changes were saved successfully!', delay: 3500});
                }
            ).catch(
                function (status) {
                    Notification.error({message: status.message, delay: 3500});
                }
            );
        };

        $scope.changeSlotDiscardChanges = function(personData) {
            personData.slotsList = angular.copy(personData.oldSlotList);
            personData.oldSlotList = [];
            personData.changesPending = false;
        }

    });
});

