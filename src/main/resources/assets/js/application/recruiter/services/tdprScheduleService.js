define(['application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprRecruiterSlotsService', 'application/recruiter/services/tdprDateService'], function (tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprScheduleService', ['tdprRecruiterSlotsService', 'AvailabilityEnum', 'dateFilter', function (tdprRecruiterSlotsService, AvailabilityEnum, dateFilter) {
        var service = {};

        service.changeSlotType = function (slotId, day, person, changeTo) {
            var date = dateFilter(day, "yyyy-MM-dd");
            var findResult = _.findIndex(person.slotsList, {'day': date, 'number': slotId});

            if (findResult !== -1) {
                if (changeTo !== undefined) {
                    // There is still availability type to change
                    person.slotsList[findResult].type = AvailabilityEnum[changeTo].name;
                } else {
                    // There is no more availability types, so we need to clear slot
                    person.slotsList[findResult] = {};
                }
            } else {
                person.slotsList.push({
                    day: date,
                    person: person.id,
                    number: slotId,
                    type: changeTo
                });
            }

            return tdprRecruiterSlotsService.prepareAndUpdateSlots(
                person.slotsList,
                person.id,
                day
            );
        };

        service.changeSlotTypeCycleThrough = function (changeSlot, slotId, day, person) {
            var date = dateFilter(day, "yyyy-MM-dd");

            if (changeSlot === undefined) {
                // Add available slot for future changes
                return service.changeSlotType(slotId, date, person, AvailabilityEnum.available.name);
            } else {
                var newTypeId = parseInt(AvailabilityEnum[changeSlot.type].id) + 1;
                var newType = _.findKey(AvailabilityEnum, {'id': newTypeId.toString()});

                return service.changeSlotType(slotId, day, person, newType);
            }
        };

        return service;
    }])
});
