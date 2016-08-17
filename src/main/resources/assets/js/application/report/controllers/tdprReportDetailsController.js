define(['angular', 'application/report/tdprReportModule', 'application/report/services/tdprReportService', 'application/report/directives/tdprReportDirective'], function (angular, tdprReportModule) {
    tdprReportModule.controller("tdprReportDetailsController", function ($scope, $state, tdprReportService) {
        console.log($state.params);

        tdprReportService.getReports($state.params.dateStart, $state.params.dateEnd).then(
            function (response) {
                console.log(response);
                $scope.reportsElements = response;
            }
        )
    })
});
