define(['angular', 'application/report/tdprReportModule', 'application/report/services/tdprReportService', 'application/report/directives/tdprReportDirective'], function (angular, tdprReportModule) {
    tdprReportModule.controller("tdprReportDetailsController", function ($scope, $state, tdprReportService) {
        console.log($state.params);
        console.log(tdprReportService.getReports($state.params.dateStart, $state.params.dateEnd));
    })
});
