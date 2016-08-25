define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprPersonsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprCreateEventController", function ($scope, tdprScheduleService, tdprRecruiterSlotsService, tdprAuthService, $stateParams, $state, $q) {


        $scope.interview = $stateParams.data.interview;
        $scope.interview.message = "Hi, I scheduled an interview for you.";
        $scope.interview.organizer = angular.copy(tdprAuthService.getCurrentUser());
        delete $scope.interview.organizer.isRecruiter; //another jackson problem

        $scope.scheduleInterview = function () {

            var updateRequests = [];
            $stateParams.data.interview.interviewers.forEach(function (interviewer) {
                updateRequests.push(tdprRecruiterSlotsService.updateSlots(interviewer.slots));
                delete interviewer.slots; //empty to avoid jackson parsing problems
            });

            $q.all(updateRequests).then(function () {
                tdprScheduleService.sendInvitations($scope.interview)
            });

        };
        
        $scope.goHome = function () {
            $state.go('tdpr.recruiter.home'); //should be changed to ui-sref in view
        };
    });
});
