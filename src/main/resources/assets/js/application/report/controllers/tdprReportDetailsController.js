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

        function activate(){
            console.log($state.params.dateStart);
            console.log($state.params.dateEnd);
            if($state.params.dateStart === '' || $state.params.dateEnd === ''){
                var today = new Date();
                $scope.endDate = new Date();
                $scope.startDate = new Date(today.setDate(today.getDate() - 7));
            }
            else{
                $scope.endDate = new Date($state.params.dateEnd);
                $scope.startDate = new Date($state.params.dateStart);
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
            var today = new Date();
            $scope.startDate = new Date(today.setDate(today.getDate() - 7));
            while($scope.startDate.getUTCDay() !== 1){
                $scope.startDate = new Date(today.setDate(today.getDate() - 1));
            }
            $scope.endDate = new Date($scope.endDate.setDate($scope.startDate.getDate() + 6));
            $scope.getReports();
        }

        activate();

    })
});
