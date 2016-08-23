define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprCandidatesService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprCandidatesController", function ($scope, tdprCandidatesService, candidates) {

            $scope.candidates = candidates;
            $scope.sortColumn = 'lastName';
            $scope.sortReverse = true;

            $scope.columnMap = {
                'lastName': {reverse: true, columnName: "Candidate"},
                'position': {reverse: true, columnName: "Position"},
                'note' : {reverse : true, columnName : "Note"},
                'recruiter.lastName' : {reverse : true, columnName: "Recruiter"}
            };

            $scope.sortBy = function(column){
                $scope.sortColumn = column;
                $scope.sortReverse = $scope.columnMap[column].reverse = !$scope.columnMap[column].reverse;
            }
    });
});
