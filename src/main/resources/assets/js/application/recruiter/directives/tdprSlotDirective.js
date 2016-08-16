define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("slot", function () {
        return {
            restrict: 'AE',
            templateUrl: 'js/application/recruiter/views/tdpr-directive-slot.html',
            replace: true,
            scope: {
                slotData: '=',
                slotTimeData: '='
            },
            link: function (scope, element, attributes) {
                scope.getClass = function () {
                    return scope.slotData ? 'cell-avail-' + scope.slotData.type : '';
                };

                scope.getTooltipString = function () {
                    return scope.slotTimeData.startTime.slice(0,5) + '-' + scope.slotTimeData.endTime.slice(0,5);
                }
            }
        }

    })
});
