define(['angular', 'application/report/tdprReportModule'], function (angular, tdprReportModule) {
    tdprReportModule.directive("jobProfile", function (JobProfileEnum, JobProfileEnumNames) {
        return {
            restrict: 'AE',
            templateUrl: 'js/application/report/views/tdpr-directive-job-profile.html',
            replace: false,
            scope: {
                selectedProfiles: '='
            },
            link: function (scope, element, attributes) {
                var mapped = _.mapKeys(JobProfileEnum, function (value, key) {
                    return value;
                });

                scope.JobProfileEnum = JobProfileEnum;
                scope.JobProfileEnumNames = JobProfileEnumNames;
                scope.selectedProfiles = _.forEach(mapped, function (value, key) {
                    mapped[key] = true;
                });
            }
        }

    })
});
