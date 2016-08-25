define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprScheduleService', ['$http', 'dateFilter', 'AvailabilityEnum', 'DateFormat', function ($http, dateFilter, AvailabilityEnum, DateFormat) {
        var that = this;
        var scheduledSlots = [];

        this.changeSlotType = function (slot, slotId, day, person, changeTo, pairing) {
            var date = dateFilter(day, DateFormat);

            var modifiedSlot = {
                day: date,
                person: person.id,
                number: slotId,
                type: changeTo,
                changed: true
            };

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
                person.slotList.push(modifiedSlot);
            }
            if (pairing) {
                that.updatePairingSlots(modifiedSlot);
            }
        };

        this.updatePairingSlots = function (newSlot) {
            var found = _.some(scheduledSlots, function (slot) {
                return slot.number === newSlot.number;
            });
            if (!found) {
                scheduledSlots.push(newSlot);
            }
        };

        this.changeSlotDiscardChanges = function (personData) {
            personData.slotList = angular.copy(personData.oldSlotList);
            personData.oldSlotList = [];
            personData.changesPending = false;
        };

        this.findSlotById = function (slotList, id, day) {
            return _.find(slotList, function (slot) {
                return slot.number === id && slot.day === day;
            })
        };

        this.tripleSlotChange = function (maxSlot, selectedPersons) {
            return function (slot, slotId, day, person) {

                _.each(selectedPersons(), function (person) {

                    for (var i = 0; i < 3; i++) {
                        var newSlot = that.findSlotById(person.slotList, slotId + i);
                        if (slotId + i <= maxSlot) {
                            that.changeSlotTypeCycleThrough(newSlot, slotId + i, day, person, true);
                        }
                    }
                    console.log(scheduledSlots);
                });
            };
        };

        this.createInterview = function (slotsTimes, selectedPersons) {
            var outlookObject = {
                interview: {},
                newSlots: []
            };

            outlookObject.interview.interviewers = _.map(selectedPersons(), function (obj) {
                return {
                    id: obj.id,
                    firstName: obj.firstName,
                    lastName: obj.lastName,
                    email: obj.email,
                    slots: obj.slotList
                }
            });
            var startSlot = _.find(slotsTimes, {id: _.minBy(scheduledSlots, 'number').number});
            var endSlot = _.find(slotsTimes, {id: _.maxBy(scheduledSlots, 'number').number});
            var day = scheduledSlots[0].day;

            outlookObject.interview.interviewee = "";
            outlookObject.interview.organizer = "";
            outlookObject.interview.start = getDateTime(day, startSlot.startTime);
            outlookObject.interview.end = getDateTime(day, endSlot.endTime);
            outlookObject.newSlots = scheduledSlots;

            scheduledSlots = [];

            return outlookObject;

        };

        function getDateTime(day, hour) {
            var date = new Date(day);
            var parts = hour.split(":");
            date.setHours(parts[0]);
            date.setMinutes(parts[1]);
            date.setSeconds(parts[2]);
            return date;
        }

        this.changeSlotTypeCycleThrough = function (slot, slotId, day, person, pairing) {
            var date = dateFilter(day, DateFormat);

            if (slot === undefined) {
                // Add available slot for future changes
                that.changeSlotType(slot, slotId, date, person, AvailabilityEnum.full.name, pairing);
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
                    default:
                        return;
                }

                that.changeSlotType(slot, slotId, date, person, newType, pairing);
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
