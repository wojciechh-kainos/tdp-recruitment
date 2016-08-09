define(['application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprRecruiterSlotsService', 'application/recruiter/services/tdprDateService'], function (tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprScheduleService', function (tdprRecruiterSlotsService, AvailabilityEnum, tdprDateService) {
        this.changeSlotType = function (objectArray, slots, person) {
            if (objectArray.type === undefined) {
                // Add slot for future changes
                slots.push({
                    day: objectArray.day,
                    person: person.id,
                    slot: objectArray.slotId,
                    type: AvailabilityEnum.available.name
                });
            } else {
                for (var key in slots) {
                    if (!slots.hasOwnProperty(key)) continue;

                    if (objectArray.slotId == slots[key].slot) {
                        var dateObj = tdprDateService.resetDate(objectArray.day);
                        var compareDay = tdprDateService.resetDate(slots[key].day);

                        if (compareDay.getTime() === dateObj.getTime()) {
                            // Cycle through possibly options for slots type

                            var currentType = slots[key].type;
                            var currentTypeId = AvailabilityEnum[currentType].id;

                            var newTypeId = currentTypeId + 1;
                            var newTypeKey;

                            for(var typeKey in AvailabilityEnum) {
                                if (!AvailabilityEnum.hasOwnProperty(typeKey)) continue;

                                if (AvailabilityEnum[typeKey].id === newTypeId) {
                                    newTypeKey = typeKey;
                                    break;
                                }
                            }

                            if (newTypeKey !== undefined) {
                                // There is still availability type to cycle through
                                slots[key].type = AvailabilityEnum[newTypeKey].name;
                            } else {
                                // There is no more availability types, so we need to clear slot
                                slots[key] = {};
                            }
                        }
                    }
                }
            }

            tdprRecruiterSlotsService.prepareAndUpdateSlots(
                slots,
                person.id,
                objectArray.day
            );
        };
    })
});
