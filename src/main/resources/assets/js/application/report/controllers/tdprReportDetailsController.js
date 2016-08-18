define(['angular', 'application/report/tdprReportModule'
    , 'application/report/services/tdprReportService'
    , 'application/report/directives/tdprReportDirective'
    , 'application/report/directives/tdprJobProfileDirective'
    , 'application/report/filters/tdprReportByPersonNameFilter'
    , 'application/report/filters/tdprReportByJobProfileFilter'
], function (angular, tdprReportModule) {
    tdprReportModule.controller("tdprReportDetailsController", function ($scope, $state, tdprReportService, moment) {

        $scope.sortBy = function(column) {
            $scope.sortColumn = column;
            $scope.sortReverse = !$scope.sortReverse;
        }

        function activate(){

            if($state.params.dateStart === '' || $state.params.dateEnd === ''){
                setLastWeekDate();
            }
            else{
                $scope.endDate = moment($state.params.dateEnd).toDate();
                $scope.startDate = moment($state.params.dateStart).toDate();
            }
            $scope.getReports();
        }

        $scope.getReports = function(){
            tdprReportService.getReports($scope.startDate, $scope.endDate).then(
                function (response) {
                    $scope.reportsElements = response;
                }
            )
        }

        $scope.getPreviousWeekReports = function(){
            setLastWeekDate();
            $scope.getReports();
        }

        $scope.getPreviousMonthReports = function(){
            setLastMonthDate();
            $scope.getReports();
        }

        activate();

        function setLastWeekDate(){
            $scope.startDate = moment().subtract(1,'week').startOf('week').add(1,'day').toDate();
            $scope.endDate = moment($scope.startDate).add(6,'day').toDate();
        }

        function setLastMonthDate(){
            $scope.startDate = moment().subtract(1,'month').startOf('month').toDate();
            $scope.endDate = moment($scope.startDate).endOf('month').toDate();
        }

    })
});
