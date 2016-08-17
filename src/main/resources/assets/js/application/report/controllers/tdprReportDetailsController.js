define(['angular', 'application/report/tdprReportModule'
    , 'application/report/services/tdprReportService'
    , 'application/report/directives/tdprReportDirective'
    , 'application/report/filters/tdprReportByPersonNameFilter'
], function (angular, tdprReportModule) {
    tdprReportModule.controller("tdprReportDetailsController", function ($scope, $state, tdprReportService) {
        console.log($state.params);

        $scope.sortBy = function(column) {
            $scope.sortColumn = column;
            $scope.sortReverse = !$scope.sortReverse;
        }

        tdprReportService.getReports($state.params.dateStart, $state.params.dateEnd).then(
            function (response) {
                console.log(response);
                $scope.reportsElements = response;
            }
        )
    })
});
