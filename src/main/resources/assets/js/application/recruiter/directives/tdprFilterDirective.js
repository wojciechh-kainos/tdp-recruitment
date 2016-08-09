define(['angular', 'application/recruiter/tdprRecruiterModule'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("filterDirective", function () {
        return {
            restrict: 'AE',
            templateUrl: 'js/application/recruiter/views/tdpr-directive-filter.html',
            link: function (scope, element, attributes) {
                scope.jobProfiles = ["web", "dev", "test"];
                scope.jobProfile = "";

                scope.changeJobProfile = function (index) {
                    scope.jobProfile = scope.jobProfiles[index];
                };
            }
        };
    });
});
