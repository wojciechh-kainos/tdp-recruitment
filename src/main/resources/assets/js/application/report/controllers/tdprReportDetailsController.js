define(['angular', 'application/report/tdprReportModule'
    , 'application/report/services/tdprReportService'
    , 'application/report/directives/tdprReportDirective'
    , 'application/report/directives/tdprJobProfileDirective'
    , 'application/report/filters/tdprReportByPersonNameFilter'
    , 'application/report/filters/tdprReportByJobProfileFilter'
], function (angular, tdprReportModule) {
    tdprReportModule.controller("tdprReportDetailsController", function ($scope, $state, tdprReportService) {

        $scope.sortBy = function(column) {
            $scope.sortColumn = column;
            $scope.sortReverse = !$scope.sortReverse;
        }

        tdprReportService.getReports($state.params.dateStart, $state.params.dateEnd).then(
            function (response) {
                $scope.reportsElements = response;
            }
        )
    })
});
