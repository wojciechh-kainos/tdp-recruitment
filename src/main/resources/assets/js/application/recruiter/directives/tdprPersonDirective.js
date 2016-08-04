define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/services/tdprPopulateAvailability'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("personDirective", function (tdprPopulateAvailability) {
        return {
            restrict: 'A',
            templateUrl: 'js/application/recruiter/views/tdpr-directive-person.html',
            link: function (scope, element, attributes) {
                function _init() {
                    scope.availabilityArray = tdprPopulateAvailability.populateAvailability(scope.person, scope.timeElements);
                }

                scope.$watch("timeElements", function () {
                    _init();
                });

                scope.$parent.$parent.$watch("startWeekDay", function () {
                    _init();
                });
            }
        };
    });
});
