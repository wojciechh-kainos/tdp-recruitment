define(['angular', 'ngDialog', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprCandidatesService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprCandidatesController", function ($scope, tdprCandidatesService, candidates, $window, recruiters, ngDialog, $timeout, Notification) {

        $scope.candidates = candidates;
        $scope.recruiters = recruiters;
        $scope.sortColumn = 'lastName';
        $scope.sortReverse = true;
        $scope.candidate = {};
        var popUp;

        $scope.create = function (candidate) {
            tdprCandidatesService.createCandidate(candidate);
            popUp.close();
            $window.location.reload();
        };

        $scope.candidate.isDeleted = false;

        $scope.columnMap = {
            'lastName': {reverse: true, columnName: "Candidate"},
            'position': {reverse: true, columnName: "Position"},
            'note': {reverse: true, columnName: "Note"},
            'recruiter.lastName': {reverse: true, columnName: "Recruiter"}
        };

        $scope.removeCandidate = function(candidate){
            tdprCandidatesService.deleteCandidate(candidate)
            .then(function(response){
                this.idOfCandidate = response.data;
                var parent = this;
                Notification.success({message : "Deleting candidate succeeded", delay : 2000});

                _.remove($scope.candidates, function(candidate){
                    return candidate.id === parent.idOfCandidate;
                });

            }, function(response){
                Notification.error({message : response.message, delay : 3500});
            });
        };

        $scope.open = function () {

            popUp = ngDialog.open({
                template: 'dialog',
                scope: $scope
            });
        };

        $scope.sortBy = function (column) {
            $scope.sortColumn = column;
            $scope.sortReverse = $scope.columnMap[column].reverse = !$scope.columnMap[column].reverse;
        };
    });
});
