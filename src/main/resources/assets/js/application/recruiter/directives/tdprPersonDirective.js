define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("personDirective", function () {
        return {
            restrict: 'A',
            templateUrl: 'js/application/recruiter/views/tdpr-directive-person.html',
            link: function (scope, element, attributes) {

                function _populateAvailability(person) {
                    var array = [];
                    var slotDayLists = {};

                    var compareTo = scope.activePerson;
                    if (compareTo !== null) {

                    }

                    var day;
                    var slotId;

                    for (var slotKey in person.slots) {
                        if (!person.slots.hasOwnProperty(slotKey)) continue;
                        day = new Date(person.slots[slotKey].day);

                         slotId = person.slots[slotKey].slot;

                        // Add entry if there isn't day yet
                        if (!slotDayLists.hasOwnProperty(day)) {
                            slotDayLists[day] = {};
                        }

                        var available = person.slots[slotKey].type ? person.slots[slotKey].type : "unavailable";
                        var type = scope.$parent.AvailabilityEnum[available];

                        slotDayLists[day][slotId] = {type: person.slots[slotKey].type, tooltipText: type.tooltipText};
                    }

                    var index = 0;

                    // Loop through elements in time array
                    for (var timeKey in scope.timeElements) {
                        if (!scope.timeElements.hasOwnProperty(timeKey)) continue;

                        // Get day that is connected to element
                        day = scope.timeElements[timeKey].day;

                        // Check if person has any slot in that day
                        if (slotDayLists.hasOwnProperty(day)) {

                            // Check if person declared slot in that specific id
                            if (slotDayLists[day].hasOwnProperty(scope.timeElements[timeKey].slotId)) {
                                slotId = scope.timeElements[timeKey].slotId;

                                // Add entry to array with slot id, day and type of availability defined by person
                                array.push({
                                    slotId: scope.timeElements[timeKey].slotId,
                                    day: day,
                                    type: slotDayLists[day][slotId].type,
                                    tooltipText: slotDayLists[day][slotId].tooltipText,
                                    index: index++
                                });

                                continue;
                            }
                        }

                        // Add empty record to array with slot id and date
                        array.push({slotId: scope.timeElements[timeKey].slotId, day: day, index: index++});
                    }

                    return array;
                }

                function _init() {
                    scope.availabilityArray = _populateAvailability(scope.person);
                }

                scope.$watch("timeElements", function (newValue, oldValue) {
                    _init();

                });

                scope.$parent.$parent.$watch("startWeekDay", function (newValue, oldValue) {
                    _init();
                });
            }
        };
    });
});
