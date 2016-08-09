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

                            if (slots[key].type === "available") {
                                slots[key].type = "full";
                            } else if (slots[key].type === "full") {
                                slots[key].type = "init";
                            } else if (slots[key].type === "init") {
                                // Reset slot
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
