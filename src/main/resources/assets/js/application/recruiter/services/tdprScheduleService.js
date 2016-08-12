define(['application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprRecruiterSlotsService', 'application/recruiter/services/tdprDateService'], function (tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprScheduleService', ['tdprRecruiterSlotsService', 'AvailabilityEnum', 'dateFilter', function (tdprRecruiterSlotsService, AvailabilityEnum, dateFilter) {

        this.changeSlotType = function (slot, slotId, day, person, changeTo) {
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

        this.changeSlotTypeCycleThrough = function (slot, slotId, day, person) {
            var date = dateFilter(day, "yyyy-MM-dd");

            if (slot === undefined) {
                // Add available slot for future changes
                return this.changeSlotType(slot, slotId, date, person, AvailabilityEnum.available.name);
            } else {
                var newTypeId = parseInt(AvailabilityEnum[slot.type].id) + 1;
                var newType = _.findKey(AvailabilityEnum, {'id': newTypeId.toString()});

                return this.changeSlotType(slot, slotId, date, person, newType);
            }
        };
    }]);
});
