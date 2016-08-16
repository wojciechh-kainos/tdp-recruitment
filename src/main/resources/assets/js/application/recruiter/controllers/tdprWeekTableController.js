define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprRecruiterSlotsService'
], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprWeekTableController", function ($scope, tdprPersonsService, tdprDateService, persons, slotsTimes, JobProfileEnum, Notification, tdprRecruiterSlotsService, AvailabilityEnum, dateFilter) {

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

        $scope.changeSlotType = function (slot, slotId, day, person, changeTo) {
            var date = dateFilter(day, "yyyy-MM-dd");
            if (slot !== undefined) {
                if (changeTo !== undefined) {
                    // There is still availability type to change
                    slot.type = changeTo;
                } else {
                    // There is no more availability types, so we need to clear slot
                    slot.type = "";
                    return;
                }
            } else {
                person.slotsList.push({
                    day: date,
                    person: person.id,
                    number: slotId,
                    type: changeTo
                });
            }
            person.changesPending = true;
        };

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
            var date = dateFilter(day, "yyyy-MM-dd");

            if (slot === undefined) {
                // Add available slot for future changes
                return $scope.changeSlotType(slot, slotId, date, person, AvailabilityEnum.full.name);
            } else {
                // Cycle through
                // Available/maybe - full - init - maybe

                var newType = undefined;

                switch(slot.type) {
                    case AvailabilityEnum.available.name:
                    case AvailabilityEnum.maybe.name:
                        newType = AvailabilityEnum.full.name;
                    break;

                    case AvailabilityEnum.full.name:
                        newType = AvailabilityEnum.init.name;
                    break;

                    case AvailabilityEnum.init.name:
                        newType = AvailabilityEnum.maybe.name;
                    break;
                }

                if (newType !== undefined) {
                    return $scope.changeSlotType(slot, slotId, date, person, newType);
                }

            }
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
    });
});
