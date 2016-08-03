define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("myTimetable", function () {
        return {
            restrict: 'A',
            templateUrl: 'html/partials/tdpr-directive-table.html',
            scope: {
                modelInput: '=',
                slotsTimes: '=',
                startWeekDay: '=',
                every: '=',
                selectedDay: '='
            },
            link: function (scope, element, attributes) {
                var _days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                var daysLength = 7;
                var zoomedInEvery = 10;

                var timeElementsCount;
                var previousStartWeekDay;
                var previousEvery;

                /* Create and output array of time labels for table header */
                function _createHeaderArray(weekStart) {
                    var array = [];

                    for (var i = 0; i < daysLength; i++) {
                        var day = new Date(weekStart.getTime() + (i * 60 * 60 * 24) * 1000);

                        timeElementsCount = 0;

                        for (var key in scope.slotsTimes) {
                            if (!scope.slotsTimes.hasOwnProperty(key)) continue;

                            var startTime = scope.slotsTimes[key].start.split(":");
                            var endTime = scope.slotsTimes[key].end.split(":");

                            var dateStartObject = new Date(new Date(day).setHours(startTime[0])).setMinutes(startTime[1]);
                            var dateEndObject = new Date(new Date(day).setHours(endTime[0])).setMinutes(endTime[1]);

                            array.push({
                                text: startTime[0] + ":" + startTime[1],
                                tooltipText: startTime[0] + ":" + startTime[1] + " - " + endTime[0] + ":" + endTime[1],
                                slotId: key,
                                hour: startTime[0],
                                minute: startTime[1],
                                dateStart: dateStartObject,
                                dateEnd: dateEndObject,
                                day: day
                            });
                            timeElementsCount++;
                        }
                    }

                    return array;
                }

                /* Function to create headers for week days with name of day and date */
                function _prepareDateHeader(weekStart) {
                    var array = [];

                    for (var i = 0; i < daysLength; i++) {
                        /* Advance one day */
                        var time = weekStart.getTime() + (i * 60 * 60 * 24) * 1000;

                        array.push({day: time, dayName: _days[i], dayValue: new Date(time)});
                    }

                    return array;
                }

                function _selectActive(day) {
                    if (scope.selectedDay === null || scope.selectedDay === undefined) {
                        scope.selectedDay = day;
                        return;
                    }

                    if (scope.selectedDay.day === day.day) {
                        scope.selectedDay = null;
                    } else {
                        scope.selectedDay = day;
                    }
                }


                function _init() {
                    scope.timeElements = _createHeaderArray(scope.startWeekDay);
                    scope.dayNames = _prepareDateHeader(scope.startWeekDay);

                    scope.timeElementsCount = timeElementsCount;
                    scope.selectActive = _selectActive;
                }

                scope.$watch("startWeekDay", function (newValue, oldValue) {
                    _init();
                });

                scope.$watch("selectedDay", function (newValue, oldValue) {
                    if (newValue !== undefined) {
                        if (newValue === null) {
                            scope.startWeekDay = previousStartWeekDay;
                            scope.every = previousEvery;
                            daysLength = 7;
                            _init();
                        } else {
                            daysLength = 1;
                            previousStartWeekDay = scope.startWeekDay;
                            previousEvery = scope.every;
                            scope.every = zoomedInEvery;
                            scope.startWeekDay = newValue.dayValue;
                        }
                    }
                });
            }
        };
    });
});
