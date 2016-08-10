define(['angular', 'application/recruiter/tdprRecruiterModule', 'application/recruiter/filters/tdprRecruiterJobProfileFilter'], function (angular, tdprRecruiterModule) {
    tdprRecruiterModule.directive("jobProfile", function (JobProfileEnum) {
        return{
            templateUrl : 'js/application/recruiter/views/tdpr-directive-job-profile.html',
            link : function($scope, element, attrs){
                $scope.changeFilter = function(jobProfile){
                    $scope.jobProfile = JobProfileEnum[jobProfile];
                }
            }
        }
    });
});
