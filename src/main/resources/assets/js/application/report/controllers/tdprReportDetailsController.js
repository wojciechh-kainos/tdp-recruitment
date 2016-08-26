define(['angular', 'application/report/tdprReportModule'
    , 'application/report/services/tdprReportService'
    , 'application/report/services/tdprReportDateService'
    , 'application/report/services/tdprReportCsvDataService'
], function (angular, tdprReportModule) {
    tdprReportModule.controller("tdprReportDetailsController", function ($scope, $state, $filter, tdprReportService, tdprReportDateService, tdprReportCsvDataService, DateFormat, Notification, $window, FileSaver, Blob) {

        $scope.DateFormat = DateFormat;

        $scope.columnMap = {
            'person.lastName': {reverse: true, columnName: "Person"},
            'initHours': {reverse: true, columnName: "Init hours"},
            'fullHours': {reverse: true, columnName: "Full hours"},
            'sumOfHours': {reverse: true, columnName: "Sum of hours"}
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
                }
            )
            .catch(
                function (status) {
                    Notification.error(status);
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

        $scope.generateCSV = function(startDate, endDate) {
            var reportsForCSV = getReportsInActualOrder();
            var data = tdprReportCsvDataService.generateCsvData(startDate, endDate, reportsForCSV, $scope.columnMap);
            tdprReportCsvDataService.getFile(startDate, endDate, data);
        };

        var getReportsInActualOrder = function(){
            var reportsForCSV = $filter('jobProfileFilter')($scope.reportsElements, $scope.checkedProfiles);
            reportsForCSV = $filter('personNameFilter')(reportsForCSV, $scope.personNameFilterValue);

            if($scope.sortReverse){
                reportsForCSV = _.sortBy(reportsForCSV,$scope.sortColumn).reverse();
            }else{
                reportsForCSV = _.sortBy(reportsForCSV,$scope.sortColumn);
            }

            return reportsForCSV;
        }

        $scope.isTableEmpty = function () {
          var reportsElements = $filter('jobProfileFilter')($scope.reportsElements, $scope.checkedProfiles);
          reportsElements = $filter('personNameFilter')(reportsElements, $scope.personNameFilterValue);

          return reportsElements.length === 0;
        };
    });
});
