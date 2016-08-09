define(['application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprRecruiterSlotsService', 'application/recruiter/services/tdprDateService',], function (tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprScheduleService', function (tdprRecruiterSlotsService, AvailabilityEnum, tdprDateService) {
        this.changeSlotType = function (objectArray, slots, person) {
            if (objectArray.type === undefined) {
                return;
            }

            for (var i = 0; i < slots.length; i++) {
                if (objectArray.slotId == slots[i].slot) {
                    var dateObj = tdprDateService.resetDate(objectArray.day);
                    var compareDay = tdprDateService.resetDate(slots[i].day);

                    if (compareDay.getTime() === dateObj.getTime()) {
                        // Cycle through possibly options for slots type
                        if (slots[i].type === "available") {
                            slots[i].type = "full";
                        } else if (slots[i].type === "full") {
                            slots[i].type = "init";
                        } else {
                            slots[i].type = "available";
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
