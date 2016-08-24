define(['angular', 'ngDialog', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprCandidatesService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprCandidatesController", function ($scope, tdprCandidatesService, candidates, recruiters, ngDialog, Notification) {

        $scope.candidates = candidates;
        $scope.recruiters = recruiters;
        $scope.sortColumn = 'lastName';
        $scope.sortReverse = true;
        $scope.candidate = {};
        $scope.candidate.isDeleted = false;
        var popUp;

        $scope.create = function (candidate) {
            tdprCandidatesService.createCandidate(candidate).then(function () {
                $scope.candidates.push(candidate);
                Notification.success("Candidate successfully created.");
                $scope.refreshCandidates();
            }, function (response) {
                Notification.error(response);
            });
            popUp.close();
        };

        $scope.update = function (candidate) {
            tdprCandidatesService.updateCandidate(candidate).then(function () {
                Notification.success("Candidate successfully updated.");
                $scope.refreshCandidates();
            }, function (response) {
                Notification.error(response);
            });
            popUp.close();
        };

        $scope.columnMap = {
            'lastName': {reverse: true, columnName: "Candidate"},
            'position': {reverse: true, columnName: "Position"},
            'note': {reverse: true, columnName: "Note"},
            'recruiter.lastName': {reverse: true, columnName: "Recruiter"}
        };

        $scope.deleteCandidate = function (candidate) {
            tdprCandidatesService.deleteCandidate(candidate)
                .then(function (response) {
                    Notification.success("Candidate deleting succeeded.");
                    this.idOfCandidate = response.data;
                    var parent = this;

                    _.remove($scope.candidates, function (candidate) {
                        return candidate.id === parent.idOfCandidate;
                    });

                    $scope.refreshCandidates();
                }, function (response) {
                    Notification.error(response);
                });
        };

        $scope.refreshCandidates = function () {
            tdprCandidatesService.fetchCandidates().then(function (response) {
                $scope.candidates = response;
            });
        };

        $scope.showPopupForAdd = function () {
            $scope.forUpdate = false;
            $scope.candidate = {};
            $scope.candidate.isDeleted = false;

            popUp = ngDialog.open({
                template: 'html/partials/recruiter/templates/popUp.html',
                scope: $scope
            });
        };

        $scope.showPopupForEdit = function (candidateForEdit) {
            $scope.forUpdate = true;
            $scope.candidate = candidateForEdit;

            popUp = ngDialog.open({
                template: 'html/partials/recruiter/templates/popUp.html',
                scope: $scope
            });
        };


        $scope.sortBy = function (column) {
            $scope.sortColumn = column;
            $scope.sortReverse = $scope.columnMap[column].reverse = !$scope.columnMap[column].reverse;
        };
    });
});
