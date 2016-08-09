define(['application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprRecruiterSlotsService', 'application/recruiter/services/tdprDateService'], function (tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprScheduleService', function (tdprRecruiterSlotsService, AvailabilityEnum, tdprDateService) {

        var changeSlotType = function (objectArray, slots, person, changeTo) {
            var changedFlag = false;

            for (var key in slots) {
                if (!slots.hasOwnProperty(key)) continue;

                if (objectArray.slotId == slots[key].slot) {
                    var dateObj = tdprDateService.resetDate(objectArray.day);
                    var compareDay = tdprDateService.resetDate(slots[key].day);

                    if (compareDay.getTime() === dateObj.getTime()) {
                        if (changeTo !== undefined) {
                            // There is still availability type to cycle through
                            slots[key].type = AvailabilityEnum[changeTo].name;
                        } else {
                            // There is no more availability types, so we need to clear slot
                            slots[key] = {};
                        }
                        changedFlag = true;
                        break;
                    }
                }
            }

            if (changedFlag === false) {
                slots.push({
                    day: objectArray.day,
                    person: person.id,
                    slot: objectArray.slotId,
                    type: changeTo
                });
            }

            return tdprRecruiterSlotsService.prepareAndUpdateSlots(
                slots,
                person.id,
                objectArray.day
            );
        };

        var changeSlotTypeCycleThrough = function (objectArray, slots, person) {
            if (objectArray.type === undefined) {
                // Add available slot for future changes
                return changeSlotType(objectArray, slots, person, AvailabilityEnum.available.name);
            } else {
                var currentType = objectArray.type;
                var currentTypeId = AvailabilityEnum[currentType].id;

                var newTypeId = currentTypeId + 1;
                var newType;

                // Cycle through possibly options for slots type
                for (var typeKey in AvailabilityEnum) {
                    if (!AvailabilityEnum.hasOwnProperty(typeKey)) continue;

                    if (AvailabilityEnum[typeKey].id === newTypeId) {
                        newType = typeKey;
                        break;
                    }
                }

                return changeSlotType(objectArray, slots, person, newType);
            }
        };

        this.changeSlotType = function (objectArray, slots, person, changeTo) {
            return changeSlotType(objectArray, slots, person, changeTo)
        };

        this.changeSlotTypeCycleThrough = function (objectArray, slots, person) {
            return changeSlotTypeCycleThrough(objectArray, slots, person)
        };
    })
});
