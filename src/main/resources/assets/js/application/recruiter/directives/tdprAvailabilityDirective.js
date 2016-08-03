define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("availabilityDirective", function () {
        return {
            restrict: 'A',
            templateUrl: 'html/partials/tdpr-directive-availability.html',
            link: function (scope, element, attributes) {

                function _init() {
                    var available = scope.availabilityObject.type ? scope.availabilityObject.type : "unavailable";
                    var type = scope.$parent.AvailabilityEnum[available];

                    if (available !== "unavailable") {

                    }

                    element[0].className = "";

                    element.addClass(type.className);

                    if (scope.availabilityObject.slotId == scope.$parent.$parent.$parent.timeElementsCount) {
                        element.addClass("cell-last-column");
                    }

                    if (scope.activePerson !== null) {
                        if (scope.$parent.person.id == scope.$parent.$parent.activePerson.id) {
                            element.addClass("cell-selected");
                        }
                    }

                    scope.tooltipText = scope.availabilityObject.tooltipText;
                }


                scope.$watch("availabilityObject", function (newValue, oldValue) {
                    _init();
                });


                scope.$watch('activePerson', function () {
                    _init();
                });

            }
        };
    });
});
