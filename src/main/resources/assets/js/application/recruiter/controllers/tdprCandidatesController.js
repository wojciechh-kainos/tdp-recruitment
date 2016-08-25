define(['angular', 'ngDialog', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprCandidatesService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprCandidatesController", function ($scope, tdprCandidatesService, candidates, recruiters, recruiterNotes, ngDialog, Notification, tdprAuthService) {
        $scope.candidates = candidates;
        $scope.recruiters = recruiters;
        $scope.recruiterNotes = recruiterNotes;
        $scope.sortColumn = 'recruiter.lastName';
        $scope.sortReverse = true;
        $scope.currentNote = recruiterNotes[0];
        $scope.candidate = {};
        $scope.candidate.isDeleted = false;
        var popUp;
        var popUpForDelete;
        var defaultLimitValue = 35;

        var currentUser = tdprAuthService.getCurrentUser();

        var openPopUp = function () {
            var dialog = ngDialog.open({
                template: '/html/partials/recruiter/templates/pop-up.html',
                scope: $scope
            });

            dialog.closePromise.then(function () {
                $scope.candidate = {};
            });

            return dialog;
        };

        var findRecruiter = function () {
            var returnRecruiter = {};
            if (!angular.isUndefined(currentUser)) {
                var findId = _.findIndex($scope.recruiters, {id: currentUser.id});
                if (findId !== -1) {
                    $scope.currentRecruiter = $scope.recruiters[findId];
                    returnRecruiter = $scope.currentRecruiter;
                }
            }
            return returnRecruiter;
        };

        var populateLimitsObject = function () {
            var keys = _.mapKeys(angular.copy($scope.candidates), function (candidate) {
                return candidate.id
            });

            _.forEach(keys, function (value, key) {
                keys[key] = defaultLimitValue;
            });

            return keys;
        };

        var populateRecruiterFilters = function (recruiters) {
            var recruiterList = angular.copy(recruiters);
            $scope.currentRecruiter = {id: 0, lastName: "All"};
            recruiterList.unshift($scope.currentRecruiter);
            findRecruiter();
            return recruiterList;
        };

        $scope.recruitersFilter = populateRecruiterFilters($scope.recruiters);

        $scope.candidateLimits = populateLimitsObject();
        $scope.swapLimitsForCandidate = function (candidate) {
            $scope.candidateLimits[candidate.id] = $scope.candidateLimits[candidate.id] === false ? defaultLimitValue : false;
        };

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
            'recruiter.lastName': {reverse: true, columnName: "Recruiter"},
            'lastName': {reverse: true, columnName: "Candidate"},
            'position': {reverse: true, columnName: "Position"},
            'note': {reverse: true, columnName: "Note"}
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
                    popUpForDelete.close();
                    $scope.refreshCandidates();
                    $scope.candidateForDelete = {};
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
            $scope.candidate.recruiter = recruiters[0];

            popUp = openPopUp();
        };

        $scope.showPopupForEdit = function (candidateForEdit) {
            $scope.forUpdate = true;
            $scope.candidate = angular.copy(candidateForEdit);

            popUp = openPopUp();
        };

        $scope.showPopUpForDelete = function (candidateForDelete) {
            $scope.candidateForDelete = candidateForDelete;

            popUpForDelete = ngDialog.open({
                template: '/html/partials/recruiter/templates/popUpForDelete.html',
                scope: $scope,
                width: 600
            });
        };

        $scope.closePopUpForDelete = function () {
            popUpForDelete.close();
            $scope.candidateForDelete = {};
        };

        $scope.sortBy = function (column) {
            $scope.sortColumn = column;
            $scope.sortReverse = $scope.columnMap[column].reverse = !$scope.columnMap[column].reverse;
        };

        $scope.createRecruiterNote = function () {
            console.log("recruiter");
            var currentRecruiter = findRecruiter();

            var note = {
                date: new Date(),
                content: $scope.currentNote.content,
                recruiter: currentRecruiter
            };

            console.log(note);

            tdprCandidatesService.createRecruiterNote(note).then(
                function (response) {
                    Notification.success("Notes updated successfully.");
                    $scope.refreshRecruiterNote();
                }, function (response) {
                    Notification.error(response);
                });
        };

        $scope.refreshRecruiterNote = function () {
            tdprCandidatesService.fetchRecruiterNotes(10).then(
                function (response) {
                    $scope.recruiterNotes = response;
                    $scope.currentNote = $scope.recruiterNotes[0];
                    Notification.success("Notes refreshed successfully.");

                }, function (response) {
                    Notification.error(response);
                });
        };
    });
});
