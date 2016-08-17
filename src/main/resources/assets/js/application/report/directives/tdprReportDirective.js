define(['angular', 'application/report/tdprReportModule'], function (angular, tdprReportModule) {
    tdprReportModule.directive("report", function () {
        return {
            restrict: 'AE',
            templateUrl: 'js/application/report/views/tdpr-directive-report.html',
            replace: false,
            scope: {
                reportData: '=',
                personInfo: '='
            },
            link: function (scope, element, attributes) {

            }
        }

    })
});
