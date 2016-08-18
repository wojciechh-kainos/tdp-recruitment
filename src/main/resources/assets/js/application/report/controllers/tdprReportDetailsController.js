define(['angular', 'application/report/tdprReportModule'
    , 'application/report/services/tdprReportService'
    , 'application/report/directives/tdprReportDirective'
    , 'application/report/directives/tdprJobProfileDirective'
    , 'application/report/filters/tdprReportByPersonNameFilter'
    , 'application/report/filters/tdprReportByJobProfileFilter'
    , 'application/recruiter/services/tdprDateService'
], function (angular, tdprReportModule) {
    tdprReportModule.controller("tdprReportDetailsController", function ($scope, $state, tdprReportService, moment, tdprDateService) {

        $scope.sortBy = function (column) {
            $scope.sortColumn = column;
            $scope.sortReverse = !$scope.sortReverse;
        };

        function activate() {

            if ($state.params.dateStart === '' || $state.params.dateEnd === '') {
                setLastWeekDate();
            }
            else {
                $scope.endDate = moment($state.params.dateEnd).toDate();
                $scope.startDate = moment($state.params.dateStart).toDate();
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

        $scope.getPreviousWeekReportsLegacy = function (offset) {
            var week = tdprDateService.getWeekWithOffset(offset);
            $scope.startDate = week[0];
            $scope.endDate = week[4];
            $scope.getReports();
        };

        $scope.getPreviousWeekReports = function () {
            setLastWeekDate();
            $scope.getReports();
        };

        $scope.getPreviousMonthReports = function () {
            setLastMonthDate();
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

        function setLastWeekDate() {
            $scope.startDate = moment().subtract(1, 'week').startOf('week').add(1, 'day').toDate();
            $scope.endDate = moment($scope.startDate).add(6, 'day').toDate();
        }

        function setLastMonthDate() {
            $scope.startDate = moment().subtract(1, 'month').startOf('month').toDate();
            $scope.endDate = moment($scope.startDate).endOf('month').toDate();
        }

    })
});
