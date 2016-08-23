define(['angular', 'application/report/tdprReportModule'], function (angular, tdprReportModule) {
    tdprReportModule.directive("report", function () {
        return {
            restrict: 'AE',
            templateUrl: '/html/partials/report/tdpr-directive-report.html',
            replace: false,
            scope: {
                reportData: '=',
                personInfo: '='
            }
        }

    })
});
