define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("availabilityDirective", function (AvailabilityEnum, tdprRecruiterGetSlotsTimesService) {
        return {
            restrict: 'A',
            templateUrl: 'js/application/recruiter/views/tdpr-directive-availability.html',
            replace: true,
            link: function (scope, element, attributes) {
                function refresh() {
                    var available = scope.availabilityObject.type ? scope.availabilityObject.type : "empty";
                    var type = AvailabilityEnum[available];

                    var elementsCount = tdprRecruiterGetSlotsTimesService.getSlotsTimesCount();

                    element[0].className = "";
                    element.addClass(type.className);

                    if (scope.availabilityObject.index % elementsCount === elementsCount - 1) {
                        element.addClass("cell-last-column");
                    }

                    scope.tooltipText = scope.availabilityObject.tooltipText;
                }

                scope.$watch("availabilityObject", function () {
                    refresh();
                });
            }
        };
    });
});
