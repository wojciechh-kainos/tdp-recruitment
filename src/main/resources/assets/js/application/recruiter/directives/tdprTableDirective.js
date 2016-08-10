define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprDateService', 'application/recruiter/services/tdprTableHeaderService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("timetable", ['tdprTableHeaderService', function (tdprTableHeaderService) {
        return {
            restrict: 'A',
            templateUrl: 'js/application/recruiter/views/tdpr-directive-table.html',
            scope: {
                persons: '=',
                slotsTimes: '=',
                weekDay: '='
            },
            link: function (scope, element, attributes) {
                var currentDay;
                var slotsTimes;

                function refresh() {
                    scope.timeElements = tdprTableHeaderService.createHeaderArray(currentDay, slotsTimes);
                    scope.dayNames = tdprTableHeaderService.prepareDateHeader(currentDay);
                    scope.timeElementsCount = tdprTableHeaderService.getTimeElementsCount();
                }

                scope.$on("changedWeekDay", function (event, args) {
                    currentDay = args.weekDay;
                });

                scope.$on("changedTimeData", function (event, args) {
                    currentDay = args.weekDay;
                    slotsTimes = args.timeData;
                    refresh();
                });
            }
        };
    }]);
});
