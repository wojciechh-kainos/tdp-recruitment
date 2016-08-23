define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("slot", function () {
        return {
            restrict: 'AE',
            templateUrl: '/html/partials/recruiter/tdpr-directive-slot.html',
            replace: true,
            scope: {
                slotData: '=',
                slotTimeData: '='
            },
            link: function (scope, element, attributes) {
                scope.getClass = function () {
                    return scope.slotData ? 'cell-avail-' + scope.slotData.type + (scope.slotData.changed? " changed-cell" : "") : '';
                };

                scope.getSlotType = function () {
                    return scope.slotData ? scope.slotData.type : '';
                };
            }
        }

    })
});
