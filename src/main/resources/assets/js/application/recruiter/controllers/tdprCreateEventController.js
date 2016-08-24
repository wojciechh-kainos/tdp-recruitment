define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprPersonsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprCreateEventController", function ($scope, tdprScheduleService, tdprRecruiterSlotsService, $stateParams, $state) {

    console.log($stateParams);
        // var interviewData = $stateParams.data;
        $scope.interview = $stateParams.data.interview;


        $scope.scheduleInterview = function () {
            $stateParams.data.interview.organizer = { //TODO change to recruiter data
                email: "noreply@kainos.com",
                firstName: "Janek",
                lastName: "Smyk"
            };
            
            tdprRecruiterSlotsService.updateSlots($stateParams.data.newSlots).then(function () {
                tdprScheduleService.sendInvitations($stateParams.data.interview)
            });
        };
        
        $scope.goHome = function () {
            $state.go('tdpr.recruiter.home'); //should be changed to ui-sref in view
        };
    });
});
