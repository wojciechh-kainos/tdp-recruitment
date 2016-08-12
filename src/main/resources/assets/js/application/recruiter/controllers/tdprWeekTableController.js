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
            var findResult = _.findIndex(person.slotsList, {'day': date, 'number': slotId});

            if (findResult !== -1) {
                if (changeTo !== undefined) {
                    // There is still availability type to change
                    person.slotsList[findResult].type = AvailabilityEnum[changeTo].name;
                } else {
                    // There is no more availability types, so we need to clear slot
                    person.slotsList[findResult] = {};

                    // Remove that slot from list
                    person.slotsList = _.filter(person.slotsList,
                        function (value) {
                            return _.size(value) > 0;
                        });
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

        $scope.cancelChanges = function () {

        };

        $scope.changeSlotTypeCycleThrough = function (slot, slotId, day, person) {
            var date = dateFilter(day, "yyyy-MM-dd");

            if (slot === undefined) {
                // Add available slot for future changes
                return $scope.changeSlotType(slot, slotId, date, person, AvailabilityEnum.available.name);
            } else {
                var newTypeId = parseInt(AvailabilityEnum[slot.type].id) + 1;
                var newType = _.findKey(AvailabilityEnum, {'id': newTypeId.toString()});

                return $scope.changeSlotType(slot, slotId, date, person, newType);
            }
        };

        $scope.changeSlotTypeCycle = function (slot, slotId, day, personData) {
            $scope.changeSlotTypeCycleThrough(slot, slotId, day, personData);
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
