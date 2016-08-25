define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprPersonsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprCreateEventController", function ($scope, tdprScheduleService, tdprRecruiterSlotsService, $stateParams, $state, $q) {

    console.log($stateParams);
        // var interviewData = $stateParams.data;
        $scope.interview = $stateParams.data.interview;
        $scope.interview.message = "Hi, I scheduled interview for you."

        $scope.scheduleInterview = function () {
            $stateParams.data.interview.organizer = { //TODO change to recruiter data
                email: "noreply@kainos.com",
                firstName: "Janek",
                lastName: "Smyk"
            };

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
