define(['angular', 'application/recruiter/tdprRecruiterModule'
    , 'application/recruiter/services/tdprPersonsService'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.controller("tdprCreateEventController",
        function ($scope, tdprScheduleService, tdprRecruiterSlotsService, tdprAuthService, $stateParams,
                  tdprCandidatesService, $state, $q, $filter, Notification) {


        $scope.interview = $stateParams.data;
        $scope.interview.organizer = angular.copy(tdprAuthService.getCurrentUser());

        $scope.scheduleInterview = function () {

            var updateRequests = [];
            $stateParams.data.interviewers.forEach(function (interviewer) {
                updateRequests.push(tdprRecruiterSlotsService.updateSlots(interviewer.slots));
                delete interviewer.slots; //no need for sending slots second time
            });

            tdprScheduleService.sendInvitations($scope.interview).then(function(){
                var interviewee = $scope.interview.interviewee;
                interviewee.note = scheduleNote() + interviewee.note;
                return tdprCandidatesService.updateCandidate(interviewee);
            }).then(function () {
                return $q.all(updateRequests);
            }).then(function () {
                Notification.success('Interview scheduled');
                    $state.go('tdpr.recruiter.home');
            }).catch(function (error) {
                Notification.error(error.message);
            })


        };

            function scheduleNote() {
                var day = $filter('date')($scope.interview.start, 'yyyy-MM-dd');
                var startHour = $filter('date')($scope.interview.start, 'HH:mm');
                var endHour = $filter('date')($scope.interview.end, 'HH:mm');
                return 'Scheduled: ' + day + ' ' + startHour + ' - ' + endHour + '\n';
            }
    });
});
