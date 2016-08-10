define(['application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprPopulateAvailability', 'application/recruiter/services/tdprScheduleService'], function (tdprRecruiterModule) {
    tdprRecruiterModule.directive("personDirective", ['tdprPopulateAvailability', 'tdprScheduleService', 'tdprDateService', function (tdprPopulateAvailability, tdprScheduleService, tdprDateService) {
        return {
            restrict: 'A',
            templateUrl: 'js/application/recruiter/views/tdpr-directive-person.html',
            link: function (scope, element, attributes) {
                function refresh() {
                    scope.availabilityArray = tdprPopulateAvailability.populateAvailability(scope.person, scope.timeElements);
                }
                
                scope.changeType = function (objectArray) {
                    tdprScheduleService.changeSlotTypeCycleThrough(objectArray, scope.person.slots, scope.person.person);
                    refresh();
                };

                scope.$watch("timeElements", function () {
                    refresh();
                });

                scope.$watch("person", function () {
                    refresh();
                });

                scope.$on("changedWeekDay", function () {
                    refresh();
                });
            }
        };
    }]);
});
