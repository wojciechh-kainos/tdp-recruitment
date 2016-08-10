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
                    return _.flatten(
                        _.times(daysLength, function (index) {
                            var day = new Date(weekStart.getTime() + (index * 60 * 60 * 24) * 1000);

                            var mapped = _.map(scope.slotsTimes, function (value, key) {
                                var startTime = value.startTime.split(":");
                                var endTime = value.endTime.split(":");

                                var dateStartObject = tdprDateService.setHourMin(tdprDateService.resetDate(day), startTime[0], startTime[1]);
                                var dateEndObject = tdprDateService.setHourMin(tdprDateService.resetDate(day), endTime[0], endTime[1]);

                                return {
                                    text: startTime[0] + ":" + startTime[1],
                                    tooltipText: startTime[0] + ":" + startTime[1] + " - " + endTime[0] + ":" + endTime[1],
                                    slotId: key,
                                    hour: startTime[0],
                                    minute: startTime[1],
                                    dateStart: dateStartObject,
                                    dateEnd: dateEndObject,
                                    day: day,
                                    dayIndex: index
                                };
                            });

                            timeElementsCount = _.size(mapped);

                            return mapped;
                        })
                    );
                }

                /* Function to create headers for week days with name of day and date */
                function _prepareDateHeader(weekStart) {
                    return _.times(daysLength, function (index) {
                        /* Advance one day */
                        var date = new Date(weekStart.getTime() + (index * 60 * 60 * 24) * 1000);

                        return {
                            day: date.getTime(),
                            dayName: dateFilter(date, "EEEE"), //EEEE is name of day
                            dayValue: date,
                            dayString: dateFilter(date, dateFormat)
                        }

                    });
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
