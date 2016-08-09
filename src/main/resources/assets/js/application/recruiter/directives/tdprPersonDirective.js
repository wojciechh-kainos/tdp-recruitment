define(['application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprPopulateAvailability',  'application/recruiter/services/tdprScheduleService'], function (tdprRecruiterModule) {
    tdprRecruiterModule.directive("personDirective", function (tdprPopulateAvailability, tdprScheduleService) {
        return {
            restrict: 'A',
            templateUrl: 'js/application/recruiter/views/tdpr-directive-person.html',
            link: function (scope, element, attributes) {
                var changeType = function (objectArray) {
                    tdprScheduleService.changeSlotTypeCycleThrough(objectArray, scope.person.slots, scope.person.person);

                    _init();
                };

                function _init() {
                    scope.changeType = changeType;
                    scope.availabilityArray = tdprPopulateAvailability.populateAvailability(scope.person, scope.timeElements);
                }

                scope.$watch("timeElements", function () {
                    _init();
                });

                scope.$watch("person", function(){
                    _init();
                });

                scope.$parent.$parent.$watch("startWeekDay", function () {
                    _init();
                });
            }
        };
    });
});
