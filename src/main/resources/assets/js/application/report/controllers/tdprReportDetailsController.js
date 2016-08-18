define(['angular', 'application/report/tdprReportModule'
    , 'application/report/services/tdprReportService'
    , 'application/report/services/tdprReportDateService'
    , 'application/report/directives/tdprReportDirective'
    , 'application/report/directives/tdprJobProfileDirective'
    , 'application/report/filters/tdprReportByPersonNameFilter'
    , 'application/report/filters/tdprReportByJobProfileFilter'
], function (angular, tdprReportModule) {
    tdprReportModule.controller("tdprReportDetailsController", function ($scope, $state, tdprReportService, tdprReportDateService) {

        $scope.columnMap = {
            'person.lastName': {reverse: true, columnName: "Person"},
            'numberOfInitMinutes':  {reverse: true, columnName: "Init hours"},
            'numberOfFullMinutes':  {reverse: true, columnName: "Full hours"},
            'numberOfAvailableMinutes':  {reverse: true, columnName: "Unused hours"}
        };

        $scope.sortBy = function(column) {
            $scope.sortColumn = column;
            $scope.columnMap[column].reverse = $scope.sortReverse = !$scope.columnMap[column].reverse;
        };

        function activate() {

            if ($state.params.dateStart === '' || $state.params.dateEnd === '') {
                $scope.startDate = tdprReportDateService.getLastWeekStartDate();
                $scope.endDate = tdprReportDateService.getLastWeekEndDate();
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
                    $scope.currentReportStart = $scope.startDate;
                    $scope.currentReportEnd = $scope.endDate;
                    $scope.reportsElements = response;
                    $scope.sortBy('person.lastName');
                }
            )
        };

        $scope.getPreviousWeekReports = function () {
            $scope.startDate = tdprReportDateService.getLastWeekStartDate();
            $scope.endDate = tdprReportDateService.getLastWeekEndDate();
            $scope.getReports();
        };

        $scope.getPreviousMonthReports = function () {
            $scope.startDate = tdprReportDateService.getLastMonthStartDate();
            $scope.endDate = tdprReportDateService.getLastMonthEndDate();
            $scope.getReports();
        };

        activate();

//        $scope.getPreviousWeekReportsLegacy = function (offset) {
//            var week = tdprReportDateService.getWeekWithOffset(offset);
//            $scope.startDate = week[0];
//            $scope.endDate = week[4];
//            $scope.getReports();
//        };
//        $scope.getMonthReports = function (offset) {
//            var endDate = new Date();
//            endDate.setUTCMonth(endDate.getUTCMonth() + offset + 1);
//            endDate.setUTCDate(0);
//
//            var startDate = new Date(endDate);
//            startDate.setUTCDate(1);
//
//            $scope.startDate = startDate;
//            $scope.endDate = endDate;
//            $scope.getReports();
//        };
//        function setLastWeekDate() {
//            $scope.startDate = moment().subtract(1, 'week').isoWeekday('Monday').toDate();
//            $scope.endDate = moment($scope.startDate).isoWeekday('Sunday').toDate();
//        }
//
//        function setLastMonthDate() {
//            $scope.startDate = moment().subtract(1, 'month').startOf('month').toDate();
//            $scope.endDate = moment($scope.startDate).endOf('month').toDate();
//        }

    })
});
