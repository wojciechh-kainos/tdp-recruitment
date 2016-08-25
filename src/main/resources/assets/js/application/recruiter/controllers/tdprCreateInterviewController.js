define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprPersonsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprCreateEventController", function ($scope, tdprScheduleService, tdprRecruiterSlotsService, tdprAuthService, $stateParams, $state, $q) {


        $scope.interview = $stateParams.data.interview;
        $scope.interview.message = "Hi, I scheduled an interview for you.";
        $scope.interview.organizer = angular.copy(tdprAuthService.getCurrentUser());

        $scope.scheduleInterview = function () {

            var updateRequests = [];
            $stateParams.data.interview.interviewers.forEach(function (interviewer) {
                updateRequests.push(tdprRecruiterSlotsService.updateSlots(interviewer.slots));
                delete interviewer.slots; //no need for sending slots second time
            });

            $q.all(updateRequests).then(function () {
                tdprScheduleService.sendInvitations($scope.interview)
            });

        };
        
    });
});
