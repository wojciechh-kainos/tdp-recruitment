define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprDateService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.service('tdprPopulateAvailability', ['AvailabilityEnum', 'tdprDateService', function (AvailabilityEnum, tdprDateService) {
        this.populateAvailability = function (person, timeElements) {
            var slotDayLists = {};

            _.forEach(person.slots, function (value) {
                var day = tdprDateService.resetDate(value.day);
                var slotId = value.slot;

                // Add entry if there isn't day yet
                if (!slotDayLists.hasOwnProperty(day)) {
                    slotDayLists[day] = {};
                }

                var available = value.type ? value.type : "empty";

                var type = AvailabilityEnum[available];

                slotDayLists[day][slotId] = {
                    typeId: type.id,
                    type: value.type,
                    tooltipText: type.tooltipText
                };

            });

            return _.map(timeElements, function (value, index) {
                var day = value.day;
                // Check if person has any slot in that day
                if (slotDayLists.hasOwnProperty(day)) {

                    // Check if person declared slot in that specific id
                    if (slotDayLists[day].hasOwnProperty(value.slotId)) {
                        var slotId = value.slotId;

                        return {
                            slotId: value.slotId,
                            day: day,
                            type: slotDayLists[day][slotId].type,
                            tooltipText: slotDayLists[day][slotId].tooltipText,
                            index: index
                        }
                    }
                }
                return {
                    slotId: value.slotId,
                    day: day,
                    index: index
                };
            });
        };
    }
    ]);
});
