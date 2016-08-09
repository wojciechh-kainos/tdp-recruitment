define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprDateService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("myTimetable", function (dateFilter, tdprDateService) {
        return {
            restrict: 'A',
            templateUrl: 'js/application/recruiter/views/tdpr-directive-table.html',
            scope: {
                modelInput: '=',
                slotsTimes: '=',
                startWeekDay: '='
            },
            link: function (scope, element, attributes) {
                var _days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
                var daysLength = _days.length;
                var dateFormat = 'EEEE yyyy-MM-dd';
                var timeElementsCount;

                /* Create and output array of time labels for table header */
                function _createHeaderArray(weekStart) {
                    var array = [];

                    for (var i = 0; i < daysLength; i++) {
                        var day = new Date(weekStart.getTime() + (i * 60 * 60 * 24) * 1000);

                        timeElementsCount = 0;
                        
                        for (var key in scope.slotsTimes) {
                            if (!scope.slotsTimes.hasOwnProperty(key)) continue;

                            var startTime = scope.slotsTimes[key].startTime.split(":");
                            var endTime = scope.slotsTimes[key].endTime.split(":");

                            var dateStartObject = tdprDateService.setHourMin(tdprDateService.resetDate(day), startTime[0], startTime[1]);
                            var dateEndObject = tdprDateService.setHourMin(tdprDateService.resetDate(day), endTime[0], endTime[1]);

                            array.push({
                                text: startTime[0] + ":" + startTime[1],
                                tooltipText: startTime[0] + ":" + startTime[1] + " - " + endTime[0] + ":" + endTime[1],
                                slotId: key,
                                hour: startTime[0],
                                minute: startTime[1],
                                dateStart: dateStartObject,
                                dateEnd: dateEndObject,
                                day: day,
                                dayIndex: i
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
                        var date = new Date(weekStart.getTime() + (i * 60 * 60 * 24) * 1000);

                        array.push({
                            day: date.getTime(),
                            dayName: dateFilter(date, "EEEE"),
                            dayValue: date,
                            dayString: dateFilter(date, dateFormat)
                        });
                    }

                    return array;
                }

                function _init() {
                    scope.timeElements = _createHeaderArray(scope.startWeekDay);
                    scope.dayNames = _prepareDateHeader(scope.startWeekDay);
                    scope.timeElementsCount = timeElementsCount;
                }

                scope.$watch("startWeekDay", function (newValue, oldValue) {
                    _init();
                });

                scope.$watch("slotsTimes", function (newValue, oldValue) {
                    _init();
                });
            }
        };
    });
});
