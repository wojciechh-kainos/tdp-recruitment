define(['angular', 'application/report/tdprReportModule'
    , 'application/report/services/tdprReportService'
    , 'application/report/directives/tdprReportDirective'
    , 'application/report/directives/tdprJobProfileDirective'
    , 'application/report/filters/tdprReportByPersonNameFilter'
    , 'application/report/filters/tdprReportByJobProfileFilter'
    , 'application/recruiter/services/tdprDateService'
], function (angular, tdprReportModule) {
    tdprReportModule.controller("tdprReportDetailsController", function ($scope, $state, tdprReportService, tdprDateService) {

        $scope.sortBy = function (column) {
            $scope.sortColumn = column;
            $scope.sortReverse = !$scope.sortReverse;
        };

        function activate() {
            if ($state.params.dateStart === '' || $state.params.dateEnd === '') {
                var today = new Date();
                $scope.endDate = new Date();
                $scope.startDate = new Date(today.setDate(today.getDate() - 7));
            }
            else {
                $scope.endDate = new Date($state.params.dateEnd);
                $scope.startDate = new Date($state.params.dateStart);
            }
            $scope.getReports();
        }

        $scope.getReports = function () {
            tdprReportService.getReports($scope.startDate, $scope.endDate).then(
                function (response) {
                    $scope.reportsElements = response;
                }
            )
        };

        $scope.getPreviousWeekReports = function (offset) {
            var week = tdprDateService.getWeekWithOffset(offset);
            $scope.startDate = week[0];
            $scope.endDate = week[4];
            $scope.getReports();
        };

        $scope.getMonthReports = function (offset) {
            var endDate = new Date();
            endDate.setUTCMonth(endDate.getUTCMonth() + offset + 1);
            endDate.setUTCDate(0);

            var startDate = new Date(endDate);
            startDate.setUTCDate(1);

            $scope.startDate = startDate;
            $scope.endDate = endDate;
            $scope.getReports();
        };

        activate();

    })
});
