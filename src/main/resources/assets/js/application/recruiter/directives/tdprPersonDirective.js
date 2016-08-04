define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprPopulateAvailability'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("personDirective", function (tdprPopulateAvailability, AvailabilityEnum) {
        return {
            restrict: 'A',
            templateUrl: 'js/application/recruiter/views/tdpr-directive-person.html',
            link: function (scope, element, attributes) {
                function _init() {
                    scope.availabilityArray = tdprPopulateAvailability.populateAvailability(scope.person, scope.timeElements, AvailabilityEnum);
                }

                scope.$watch("timeElements", function (newValue, oldValue) {
                    _init();
                });

                scope.$parent.$parent.$watch("startWeekDay", function (newValue, oldValue) {
                    _init();
                });
            }
        };
    });
});
