define(['angular', 'ngDialog', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprCandidatesService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprCandidatesController", function ($scope, tdprCandidatesService, candidates, ngDialog, $timeout, Notification) {

        $scope.candidates = candidates;
        $scope.sortColumn = 'lastName';
        $scope.sortReverse = true;
        $scope.candidate = {};

        $scope.openDialog = function () {
            ngDialog.open({
                template: '/html/partials/template.html'
            });
        };

        $scope.create = function (candidate) {
            console.log(candidate);
            tdprCandidatesService.createCandidate(candidate);
        };


        //
        // $scope.candidate.recruiter = {
        //     "id": 1,
        //     "email": "a@a.com",
        //     "firstName": "Marek",
        //     "lastName": "Dzik",
        //     "isDev": true,
        //     "isTest": false,
        //     "isOps": false,
        //     "bandLevel": 1,
        //     "defaultStartHour": "08:00:00",
        //     "defaultFinishHour": "16:00:00",
        //     "slotList": null,
        //     "noteList": null
        // };

        $scope.candidate.recruiter =


        {
            "id": 1,
            "email": "a@a.com",
            "firstName": "Marek",
            "lastName": "Dzik",
            "isDev": true,
            "isTest": false,
            "isOps": false,
            "bandLevel": 1,
            "defaultStartHour": "08:00:00",
            "defaultFinishHour": "16:00:00",
            "slotList": null,
            "noteList": null
        };

        $scope.candidate.isDeleted = false;

        $scope.columnMap = {
            'lastName': {reverse: true, columnName: "Candidate"},
            'position': {reverse: true, columnName: "Position"},
            'note': {reverse: true, columnName: "Note"},
            'recruiter.lastName': {reverse: true, columnName: "Recruiter"}
        };

        $scope.open = function () {
            var new_dialog = ngDialog.open({
                id: 'fromAService',
                template: 'firstDialogId',
                data: {foo: 'from a service'},
                scope: $scope
            });
            // example on checking whether created `new_dialog` is open
            $timeout(function () {
                console.log(ngDialog.isOpen(new_dialog.id));
            }, 2000)
        };

        $scope.sortBy = function (column) {
            $scope.sortColumn = column;
            $scope.sortReverse = $scope.columnMap[column].reverse = !$scope.columnMap[column].reverse;
        };

        $scope.removeCandidate = function (index) {
            tdprCandidatesService.deleteCandidate($scope.candidates[index])
                .then(function () {
                    //Notification.success({message : "Deleting candidate succeed", delay : 2000});
                }, function (response) {
                    // Notification.error({message : response.message, delay : 3500});
                });
        };


    });
});
