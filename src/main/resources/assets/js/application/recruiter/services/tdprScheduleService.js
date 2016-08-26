define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprScheduleService', ['$http', 'dateFilter', 'AvailabilityEnum', 'DateFormat', function ($http, dateFilter, AvailabilityEnum, DateFormat) {
        var that = this;
        var scheduledSlots = [];
        this.changeSlotType = function (slot, slotId, day, person, changeTo, mode) {
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
            if (mode) {
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
            personData.selected = false;
            personData.changesPending = false;
        };

        this.findSlotById = function (slotList, id, day) {
            var date = dateFilter(day, DateFormat);
            return _.find(slotList, function (slot) {
                return slot.number == id && slot.day == date;
            })
        };

        this.tripleSlotChange = function (maxSlot, selectedPersons) {
            return function (slot, slotId, day, person) {
                var newSlot, valid = true;
                _.each(selectedPersons(), function (person) {
                    if (!person.changesPending) {
                        person.rootSlotList = angular.copy(person.slotList);
                    }
                    scheduledSlots = [];

                    if (person.changesPending) {
                        person.slotList = angular.copy(person.rootSlotList);
                    }

                    if (selectedPersons().length === 1) {
                        newSlot = that.findSlotById(person.slotList, slotId, day);
                        if (!angular.isUndefined(newSlot) && (newSlot.type === AvailabilityEnum.full.name || newSlot.type === AvailabilityEnum.init.name)) {
                            valid = false;
                        }
                        if (slotId <= maxSlot && valid) {
                            that.changeSlotTypeCycleThrough(newSlot, slotId, day, person, "init");
                        }
                    } else {

                        for (var i = 0; i < 3; i++) {
                            newSlot = that.findSlotById(person.slotList, slotId + i, day);
                            if (!angular.isUndefined(newSlot) && (newSlot.type === AvailabilityEnum.full.name || newSlot.type === AvailabilityEnum.init.name)) {
                                valid = false;
                            }
                            if (slotId + i <= maxSlot && valid) {
                                that.changeSlotTypeCycleThrough(newSlot, slotId + i, day, person, "full");
                            }
                        }
                    }

                });
                if (!valid) {
                    _.each(selectedPersons(), function (person) {
                        person.slotList = angular.copy(person.rootSlotList);
                        scheduledSlots = [];
                    })
                }
            };
        };

        this.createInterview = function (slotsTimes, selectedPersons, candidate) {

            if (scheduledSlots.length <= 3) {
                var outlookObject = {};
                outlookObject.interviewers = _.map(selectedPersons(), function (obj) {
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

                outlookObject.interviewee = candidate;
                outlookObject.organizer = "";
                outlookObject.start = getDateTime(day, startSlot.startTime);
                outlookObject.end = getDateTime(day, endSlot.endTime);

                outlookObject.newSlots = scheduledSlots;

                scheduledSlots = [];

                return outlookObject;
            } else {
                return false;
            }

        };

        function getDateTime(day, hour) {
            var date = new Date(day);
            var parts = hour.split(":");
            date.setHours(parts[0]);
            date.setMinutes(parts[1]);
            date.setSeconds(parts[2]);
            return date;
        }

        this.changeSlotTypeCycleThrough = function (slot, slotId, day, person, mode) {
            var date = dateFilter(day, DateFormat);
            if (mode === "init") {
                that.changeSlotType(slot, slotId, date, person, AvailabilityEnum.init.name, mode);

            } else if (slot === undefined || mode === "full") {
                // Add available slot for future changes
                that.changeSlotType(slot, slotId, date, person, AvailabilityEnum.full.name, mode);
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

                that.changeSlotType(slot, slotId, date, person, newType, mode);
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
