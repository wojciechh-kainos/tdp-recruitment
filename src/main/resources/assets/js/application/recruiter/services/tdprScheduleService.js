define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprScheduleService', ['$http', 'dateFilter', 'AvailabilityEnum', function ($http, dateFilter, AvailabilityEnum) {
        var that = this;
        var scheduledSlots = [];

        this.changeSlotType = function (slot, slotId, day, person, changeTo, pairing) {
            var date = dateFilter(day, "yyyy-MM-dd");

            var modifiedSlot = {
                day: date,
                person: person.id,
                number: slotId,
                type: changeTo
            };

            if (!person.changesPending || angular.isUndefined(person.changesPending)) {
                person.oldSlotList = angular.copy(person.slotsList);
                person.changesPending = true;
            }

            if (slot !== undefined) {
                if (changeTo !== undefined) { // there is still availability type to change
                    slot.type = changeTo;
                } else { // there are no more availability types, so we need to clear slot
                    slot.type = "";
                }
            } else {
                person.slotsList.push(modifiedSlot);
            } if (pairing) {
                that.updatePairingSlots(modifiedSlot);
            }
        };

        this.updatePairingSlots = function(newSlot) {
            var found = _.some(scheduledSlots, function (slot) {
                return slot.number === newSlot.number;
            });
            if (!found) {
                scheduledSlots.push(newSlot);
            }
        };

        this.changeSlotDiscardChanges = function (personData) {
            personData.slotsList = angular.copy(personData.oldSlotList);
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
                        var newSlot = that.findSlotById(person.slotsList, slotId + i);
                        if (slotId + i <= maxSlot) {
                            that.changeSlotTypeCycleThrough(newSlot, slotId + i, day, person, true);
                        }
                    }
                    console.log(scheduledSlots);
                });
            };
        };

        this.createInterview = function (slotsTimes, selectedPersons, state) {
            var outlookObject = {};

            outlookObject.interviewers = _.map(selectedPersons(), function (obj) {
                return {
                    id: obj.id,
                    firstName: obj.firstName,
                    lastName: obj.lastName,
                    email: obj.email,
                    slots: obj.slotsList
                }
            });

            var startSlot = _.find(slotsTimes, {id: _.minBy(scheduledSlots, 'number').number});
            var endSlot = _.find(slotsTimes, {id: _.maxBy(scheduledSlots, 'number').number});
            var eventStartTime = startSlot.startTime;
            var eventEndTime = endSlot.endTime;

            outlookObject.interviewee = "";
            outlookObject.organizer = "";
            outlookObject.start = eventStartTime;
            outlookObject.end = eventEndTime;
            outlookObject.newSlots = scheduledSlots;

            scheduledSlots = [];

            state.go("tdpr.recruiter.createEvent", {data: outlookObject});


        };

        this.changeSlotTypeCycleThrough = function (slot, slotId, day, person, pairing) {
            var date = dateFilter(day, "yyyy-MM-dd");

            if (slot === undefined) {
                // Add available slot for future changes
                that.changeSlotType(slot, slotId, date, person, AvailabilityEnum.full.name, pairing);
            } else {
                // Cycle through
                // Available/maybe - full - init - maybe

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
                var newType = undefined;

                if (newType !== undefined) {
                    that.changeSlotType(slot, slotId, date, person, newType, pairing);
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
