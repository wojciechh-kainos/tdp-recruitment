define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprScheduleService', ['dateFilter', 'AvailabilityEnum', function (dateFilter, AvailabilityEnum) {

        this.changeSlotType = function (slot, slotId, day, person, changeTo) {
            var date = dateFilter(day, "yyyy-MM-dd");

            if (!person.changesPending || angular.isUndefined(person.changesPending)) {
                        person.oldSlotList = angular.copy(person.slotsList);
                        person.changesPending = true;
                    }
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
                person.slotList.push({
                    day: date,
                    person: person.id,
                    number: slotId,
                    type: changeTo
                });
            }
        };

        this.changeSlotDiscardChanges = function(personData) {
            personData.slotsList = angular.copy(personData.oldSlotList);
            personData.oldSlotList = [];
            personData.changesPending = false;
        }

        this.changeSlotTypeCycleThrough = function (slot, slotId, day, person) {
            var date = dateFilter(day, "yyyy-MM-dd");

            if (slot === undefined) {
                // Add available slot for future changes
                return this.changeSlotType(slot, slotId, date, person, AvailabilityEnum.full.name);
            } else {
                // Cycle through
                // Available/maybe - full - init - maybe

                var newType = undefined;

                switch(slot.type) {
                    case AvailabilityEnum.available.name:
                    case AvailabilityEnum.maybe.name:
                    case AvailabilityEnum.init.name:
                        newType = AvailabilityEnum.full.name;
                        break;

                    case AvailabilityEnum.full.name:
                        newType = AvailabilityEnum.init.name;
                        break;
                }

                if (newType !== undefined) {
                    return this.changeSlotType(slot, slotId, date, person, newType);
                }
            }
        };
    }]);
});
