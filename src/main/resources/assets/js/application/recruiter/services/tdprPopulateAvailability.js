define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprDateService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprPopulateAvailability', ['AvailabilityEnum', 'tdprDateService', function (AvailabilityEnum, tdprDateService) {
        this.populateAvailability = function (person, timeElements) {
            var array = [];
            var slotDayLists = {};

            var day;
            var slotId;

            var nameText = person.person.firstName + " " + person.person.lastName;

            for (var slotKey in person.slots) {
                if (!person.slots.hasOwnProperty(slotKey)) continue;
                day = tdprDateService.resetDate(person.slots[slotKey].day);

                slotId = person.slots[slotKey].slot;

                // Add entry if there isn't day yet
                if (!slotDayLists.hasOwnProperty(day)) {
                    slotDayLists[day] = {};
                }

                var available = person.slots[slotKey].type ? person.slots[slotKey].type : "unavailable";
                var type = AvailabilityEnum[available];

                slotDayLists[day][slotId] = {
                    typeName: available.priority,
                    type: person.slots[slotKey].type,
                    tooltipText: nameText + ", " + type.tooltipText
                };
            }

            var index = 0;

            // Loop through elements in time array
            for (var timeKey in timeElements) {
                if (!timeElements.hasOwnProperty(timeKey)) continue;

                // Get day that is connected to element
                day = timeElements[timeKey].day;

                // Check if person has any slot in that day
                if (slotDayLists.hasOwnProperty(day)) {

                    // Check if person declared slot in that specific id
                    if (slotDayLists[day].hasOwnProperty(timeElements[timeKey].slotId)) {
                        slotId = timeElements[timeKey].slotId;

                        // Add entry to array with slot id, day and type of availability defined by person
                        array.push({
                            slotId: timeElements[timeKey].slotId,
                            day: day,
                            typeName: available.priority,
                            type: slotDayLists[day][slotId].type,
                            tooltipText: slotDayLists[day][slotId].tooltipText,
                            index: index++
                        });

                        continue;
                    }
                }

                // Add empty record to array with slot id and date
                array.push({
                    slotId: timeElements[timeKey].slotId,
                    day: day,
                    index: index++,
                    tooltipText: nameText
                });
            }

            return array;
        };
    }]);
});
