define(['angular', 'application/report/tdprReportModule'
    , 'application/report/services/tdprReportService'
    , 'application/report/services/tdprReportDateService'
    , 'application/report/directives/tdprReportDirective'
    , 'application/report/directives/tdprJobProfileDirective'
    , 'application/report/filters/tdprReportByPersonNameFilter'
    , 'application/report/filters/tdprReportByJobProfileFilter'
], function (angular, tdprReportModule) {
    tdprReportModule.controller("tdprReportDetailsController", function ($scope, $state, tdprReportService, tdprReportDateService, Notification) {

        $scope.columnMap = {
            'person.lastName': {reverse: true, columnName: "Person"},
            'initHours': {reverse: true, columnName: "Init hours"},
            'fullHours': {reverse: true, columnName: "Full hours"},
            'availableHours': {reverse: true, columnName: "Unused hours"}
        };

        $scope.sortBy = function (column) {
            $scope.sortColumn = column;
            $scope.columnMap[column].reverse = $scope.sortReverse = !$scope.columnMap[column].reverse;
        };

        $scope.activate = function () {
            if ($state.params.dateStart === '' || $state.params.dateEnd === '') {
                $scope.startDate = tdprReportDateService.getLastWeekStartDate();
                $scope.endDate = tdprReportDateService.getLastWeekEndDate();
            }
            else {
                $scope.endDate = new Date($state.params.dateEnd);
                $scope.startDate = new Date($state.params.dateStart);
            }
            $scope.getReports();
            $scope.sortBy('person.lastName');
        };

        $scope.getReports = function () {
            tdprReportService.getReports($scope.startDate, $scope.endDate).then(
                function (response) {
                    $scope.currentReportStart = $scope.startDate;
                    $scope.currentReportEnd = $scope.endDate;
                    $scope.reportsElements = response;
                    Notification.success({message: 'Report successfully downloaded.', delay: 2000});
                }
            )
            .catch(
                function (status) {
                    Notification.error({message: status, delay: 3500});
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

        $scope.activate();
    })
});
