define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprPopulateAvailability', 'application/recruiter/services/tdprRecruiterSlotsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("personDirective", function (tdprPopulateAvailability, dateFilter, tdprRecruiterSlotsService, AvailabilityEnum) {
        return {
            restrict: 'A',
            templateUrl: 'js/application/recruiter/views/tdpr-directive-person.html',
            link: function (scope, element, attributes) {
                var dateFormat = 'yyyy-MM-dd';

                function reformatDate(dateToFormat) {
                    return new Date(new Date(new Date( new Date(dateToFormat).setHours(2)).setMinutes(0)).setSeconds(0)).setMilliseconds(0)
                }

                function reformatSlots(slots, day) {
                    var array = [];
                    var dateObj = reformatDate(day);


                    for (var i = 0; i < slots.length; i++) {
                        var compareDay = reformatDate(slots[i].day);

                        if (compareDay == dateObj) {
                            array.push({
                                slotsDate: new Date(compareDay),
                                person: null,
                                slot: {id: slots[i].slot},
                                type: {id: AvailabilityEnum[slots[i].type ? slots[i].type : "unavailable"].priority}
                            });
                        }
                    }
                    return array;
                }

                var changeType = function (objectArray) {
                    if (objectArray.type === undefined) {
                        return;
                    }

                    for (var i = 0; i < scope.person.slots.length; i++) {
                        if (objectArray.slotId == scope.person.slots[i].slot) {
                            var dateObj = reformatDate(objectArray.day);
                            var compareDay = reformatDate(scope.person.slots[i].day);

                            if (compareDay == dateObj) {
                                if (scope.person.slots[i].type === "available") {
                                    scope.person.slots[i].type = "full";
                                } else if (scope.person.slots[i].type === "full") {
                                    scope.person.slots[i].type = "init";
                                } else {
                                    scope.person.slots[i].type = "available";
                                }
                            }
                        }
                    }

                    tdprRecruiterSlotsService.updateSlots(
                        reformatSlots(scope.person.slots, objectArray.day),
                        scope.person.person.id,
                        dateFilter(objectArray.day, "dd-MM-yyyy"),
                        dateFilter(objectArray.day, "dd-MM-yyyy")
                    );

                    _init();
                };

                function _init() {
                    scope.changeType = changeType;
                    scope.availabilityArray = tdprPopulateAvailability.populateAvailability(scope.person, scope.timeElements);
                }

                scope.$watch("timeElements", function () {
                    _init();
                });

                scope.$parent.$parent.$watch("startWeekDay", function () {
                    _init();
                });
            }
        };
    });
});
