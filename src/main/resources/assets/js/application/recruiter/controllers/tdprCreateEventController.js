define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprPersonsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprCreateEventController", function ($scope, tdprPersonsService, $stateParams) {

    console.log($stateParams);

        $scope.interviewers = $stateParams.data.interviewers;
        $scope.interviewee = $stateParams.data.interviewee;
        $scope.organizer = $stateParams.data.organizer;
        $scope.startTime = $stateParams.data.start;
        $scope.endTime = $stateParams.data.end;


    });
});
