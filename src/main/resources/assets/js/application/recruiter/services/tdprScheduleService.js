define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprScheduleService', ['$http', 'dateFilter', 'AvailabilityEnum', 'DateFormat', function ($http, dateFilter, AvailabilityEnum, DateFormat) {
        var that = this;

        this.changeSlotType = function (slot, slotId, day, person, changeTo) {
            var date = dateFilter(day, DateFormat);

            if (!person.changesPending || angular.isUndefined(person.changesPending)) {
                person.oldSlotList = angular.copy(person.slotList);
                person.changesPending = true;
            }

            if (slot !== undefined) {
                slot.changed = true;
                if (changeTo !== undefined) { // there is still availability type to change
                    slot.type = changeTo;
                } else { // there are no more availability types, so we need to clear slot
                    slot.type = "";
                }
            } else {
                person.slotList.push({
                    day: date,
                    person: person.id,
                    number: slotId,
                    type: changeTo,
                    changed: true
                });
            }
        };

        this.changeSlotDiscardChanges = function (personData) {
            personData.slotList = angular.copy(personData.oldSlotList);
            personData.oldSlotList = [];
            personData.changesPending = false;
        };

        this.changeSlotTypeCycleThrough = function (slot, slotId, day, person) {
            var date = dateFilter(day, DateFormat);

            if (slot === undefined) {
                // Add available slot for future changes
                that.changeSlotType(slot, slotId, date, person, AvailabilityEnum.full.name);
            } else {
                // Cycle through
                // Available/maybe - full - init - maybe
                var newType = undefined;

                switch (slot.type) {
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
                    that.changeSlotType(slot, slotId, date, person, newType);
                }
            }
        };
        
        this.sendInvitations = function (interview) {
            return $http.put("api/schedule", interview).then(
                function (response) {
                    return response;
                },
                function (error) {
                    error.message = "Sending failed."
                }
            );
        }
    }]);
});
