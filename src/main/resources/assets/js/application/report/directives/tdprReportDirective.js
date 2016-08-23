define(['angular', 'application/report/tdprReportModule'], function (angular, tdprReportModule) {
    tdprReportModule.directive("report", function () {
        return {
            restrict: 'AE',
            templateUrl: '/html/partials/report/tdpr-directive-report.html',
            replace: false,
//            link: function(scope) {
//                scope.reportData.initHours = scope.reportData.initHours.toString().replace(".", ",");
//                scope.reportData.fullHours = scope.reportData.fullHours.toString().replace(".", ",");
//                scope.reportData.availableHours = scope.reportData.availableHours.toString().replace(".", ",");
//            },
            scope: {
                reportData: '=',
                personInfo: '='
            }
        }

    })
});
