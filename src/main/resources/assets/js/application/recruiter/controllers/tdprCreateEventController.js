define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprPersonsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprCreateEventController", function ($scope, tdprScheduleService, tdprRecruiterSlotsService, $stateParams, $state) {

    console.log($stateParams);
        // var interviewData = $stateParams.data;
        $scope.interview = $stateParams.data.interview;


        $scope.scheduleInterview = function () {
            // interviewData.organizer = { //TODO change to recruiter data
            //     email: "noreply@kainos.com",
            //     firstName: "Janek",
            //     lastName: "Smyk"
            // };
            //
            // tdprScheduleService.sendInvitations(interviewData);

            tdprRecruiterSlotsService.updateSlots($stateParams.data.newSlots);
        };
        
        $scope.goHome = function () {
            $state.go('tdpr.recruiter.home'); //should be changed to ui-sref in view
        };
    });
});
