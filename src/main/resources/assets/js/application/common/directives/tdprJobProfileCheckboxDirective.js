define(['angular', 'application/common/tdprCommonModule'], function (angular, tdprCommonModule) {
    tdprCommonModule.directive("jobCheckBoxes", function (JobProfileEnum) {
        return {
            restrict: 'AE',
            templateUrl: '/html/partials/common/tdpr-directive-job-checkboxes.html',
            replace: false,
            scope: true,
            link: function (scope, element, attributes) {
                scope.JobProfileEnum = JobProfileEnum;
            }
        }
    })
});
