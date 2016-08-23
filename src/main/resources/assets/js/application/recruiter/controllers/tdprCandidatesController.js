define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprCandidatesService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprCandidatesController", function ($scope, tdprCandidatesService, candidates, Notification) {

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

            $scope.removeCandidate = function(candidate){
                this.candidate = candidate;
                var parent = this;
                _.remove($scope.candidates, function(candidate){
                    return candidate.id === parent.candidate.id;
                });
                tdprCandidatesService.deleteCandidate(candidate)
                .then(function(){
                    Notification.success({message : "Deleting candidate succeed", delay : 2000});
                }, function(response){
                    Notification.error({message : response.message, delay : 3500});
                });
            }
    });
});
