define(['angular', 'ngDialog', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprCandidatesService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprCandidatesController", function ($scope, tdprCandidatesService, candidates, ngDialog, $timeout) {

        $scope.candidates = candidates;

        $scope.openDialog = function () {
            ngDialog.open({ template: '/html/partials/template.html'
            });
        };

        $scope.open = function() {
            var new_dialog = ngDialog.open({
                id: 'fromAService',
                template: 'firstDialogId',
                data: { foo: 'from a service' },
                scope: $scope
            });
            // example on checking whether created `new_dialog` is open
            $timeout(function() {
                console.log(ngDialog.isOpen(new_dialog.id));
            }, 2000)
        };


    });
});
