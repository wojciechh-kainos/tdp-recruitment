define(['angular', 'application/report/tdprReportModule'
    , 'application/report/services/tdprReportService'
    , 'application/report/directives/tdprReportDirective'
    , 'application/report/filters/tdprReportByPersonNameFilter'
], function (angular, tdprReportModule) {
    tdprReportModule.controller("tdprReportDetailsController", function ($scope, $state, tdprReportService, dateFilter) {

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

        activate();
    })
});
