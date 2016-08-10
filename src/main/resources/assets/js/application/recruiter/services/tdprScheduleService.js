define(['application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprRecruiterSlotsService', 'application/recruiter/services/tdprDateService'], function (tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprScheduleService', ['tdprRecruiterSlotsService', 'AvailabilityEnum', 'tdprDateService', 'dateFilter', function (tdprRecruiterSlotsService, AvailabilityEnum, tdprDateService, dateFilter) {
        var service = {};

        service.changeSlotType = function (objectArray, slots, person, changeTo) {
            var compareDate = dateFilter(objectArray.day, 'yyyy-MM-dd');
            var compareSlot = parseInt(objectArray.slotId);

            var findResult = _(slots).findIndex({'day': compareDate, 'slot': compareSlot});

            if (findResult !== -1) {
                if (changeTo !== undefined) {
                    // There is still availability type to change
                    slots[findResult].type = AvailabilityEnum[changeTo].name;
                } else {
                    // There is no more availability types, so we need to clear slot
                    slots[findResult] = {};
                }
            } else {
                slots.push({
                    day: compareDate,
                    person: person.id,
                    slot: compareSlot,
                    type: changeTo
                });
            }

            return tdprRecruiterSlotsService.prepareAndUpdateSlots(
                slots,
                person.id,
                objectArray.day
            );
        };

        service.changeSlotTypeCycleThrough = function (objectArray, slots, person) {
            if (objectArray.type === undefined) {
                // Add available slot for future changes
                return service.changeSlotType(objectArray, slots, person, AvailabilityEnum.available.name);
            } else {
                var newTypeId = parseInt(AvailabilityEnum[objectArray.type].id) + 1;
                var newType = _(AvailabilityEnum).findKey({'id': newTypeId.toString()});

                return service.changeSlotType(objectArray, slots, person, newType);
            }
        };

        return service;
    }])
});
