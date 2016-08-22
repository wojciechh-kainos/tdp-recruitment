define(['angular', 'application/report/tdprReportModule'], function (angular, tdprReportModule) {
    tdprReportModule.directive("jobProfile", function (JobProfileEnumNames) {
        return {
            restrict: 'AE',
            templateUrl: 'js/application/report/views/tdpr-directive-job-profile.html',
            replace: false,
            scope: {
                selectedProfiles: '='
            },
            link: function (scope, element, attributes) {
                scope.JobProfiles = JobProfileEnumNames;

                var mapped = _.mapKeys(scope.JobProfiles, function (value, key) {
                    return value.column;
                });

                scope.selectedProfiles = _.forEach(mapped, function (value, key) {
                    mapped[key] = true;
                });
            }
        }

    })
});
