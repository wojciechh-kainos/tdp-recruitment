define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("availabilityDirective", function (AvailabilityEnum, tdprRecruiterGetSlotsTimesService) {
        return {
            restrict: 'A',
            templateUrl: 'js/application/recruiter/views/tdpr-directive-availability.html',
            link: function (scope, element, attributes) {

                function _init() {
                    var available = scope.availabilityObject.type ? scope.availabilityObject.type : "unavailable";
                    var type = AvailabilityEnum[available];

                    var elementsCount = tdprRecruiterGetSlotsTimesService.getSlotsTimesCount();

                    element[0].className = "";
                    element.addClass(type.className);

                    if (scope.availabilityObject.index % elementsCount == elementsCount-1) {
                        element.addClass("cell-last-column");
                    }

                    if (scope.activePerson !== null) {
                        if (scope.$parent.person.person.id == scope.$parent.$parent.activePerson.person.id) {
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
